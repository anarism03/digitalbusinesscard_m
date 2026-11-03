import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import type { DemoAccount, DemoDatabase } from "../src/mock/seed.js";

export function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString("hex");
  return `scrypt:${salt}:${scryptSync(plain, salt, 32).toString("hex")}`;
}

export function verifyPassword(plain: unknown, encoded: string): boolean {
  if (typeof plain !== "string" || plain.length > 256) return false;
  const [scheme, salt, digest] = encoded.split(":");
  if (scheme !== "scrypt" || !salt || !digest) return false;
  const expected = Buffer.from(digest, "hex");
  const actual = scryptSync(plain, salt, 32);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function protectPasswords(db: DemoDatabase) {
  for (const user of db.employees) {
    if (!user.password.startsWith("scrypt:"))
      user.password = hashPassword(user.password);
  }
}

export function createAuth(db: DemoDatabase, secret: string) {
  const mac = (value: string) =>
    createHmac("sha256", secret).update(value).digest("base64url");
  return {
    tokenFor(user: DemoAccount) {
      const header = Buffer.from(
        JSON.stringify({ alg: "HS256", typ: "JWT" }),
      ).toString("base64url");
      const payload = Buffer.from(
        JSON.stringify({
          sub: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          companyId: user.companyId,
          canEdit: user.canEdit,
          credential: mac(user.password),
          exp: Math.floor(Date.now() / 1000) + 86400,
        }),
      ).toString("base64url");
      const value = `${header}.${payload}`;
      return `${value}.${mac(value)}`;
    },
    identify(token: string): { id: string } | null {
      try {
        const [header, payload, signature, extra] = token.split(".");
        if (extra || !header || !payload || !signature) return null;
        const actual = Buffer.from(signature);
        const expected = Buffer.from(mac(`${header}.${payload}`));
        if (
          actual.length !== expected.length ||
          !timingSafeEqual(actual, expected)
        )
          return null;
        const claims = JSON.parse(
          Buffer.from(payload, "base64url").toString("utf8"),
        );
        const user = db.employees.find((user) => user.id === claims.sub);
        if (
          !user ||
          typeof claims.exp !== "number" ||
          claims.exp <= Date.now() / 1000 ||
          claims.credential !== mac(user.password)
        )
          return null;
        return { id: user.id };
      } catch {
        return null;
      }
    },
  };
}
