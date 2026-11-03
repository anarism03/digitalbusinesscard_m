import type { User } from "../types/index.js";
import { pickFirstLogin, toBoolean, toRole } from "./normalize.js";

const SOAP_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims";
const MICROSOFT_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims";

const CLAIM_KEYS = {
  id: [`${SOAP_CLAIM}/nameidentifier`, "sub", "nameid"],
  email: [`${SOAP_CLAIM}/emailaddress`, "email", "unique_name"],
  name: [`${SOAP_CLAIM}/name`, "name"],
  firstName: [`${SOAP_CLAIM}/givenname`],
  lastName: [`${SOAP_CLAIM}/surname`],
  role: [`${MICROSOFT_CLAIM}/role`, "role"],
  companyId: ["CompanyId", "companyId"],
  canEdit: ["CanEdit", "canEdit", "IsEdit", "isEdit"],
} as const;

function readJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[1]) return null;
    const bytes = Uint8Array.from(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
      (character) => character.charCodeAt(0),
    );
    const payload: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return payload && typeof payload === "object" && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function getTokenExpiration(token: string): number | null {
  const expiry = readJwtPayload(token)?.exp;
  return typeof expiry === "number" && Number.isFinite(expiry)
    ? expiry * 1000
    : null;
}

export function decodeJwt(token: string): User | null {
  try {
    const payload = readJwtPayload(token);
    if (!payload) return null;
    const now = Date.now() / 1000;
    if (
      (payload.exp !== undefined &&
        (typeof payload.exp !== "number" ||
          !Number.isFinite(payload.exp) ||
          payload.exp <= now)) ||
      (payload.nbf !== undefined &&
        (typeof payload.nbf !== "number" ||
          !Number.isFinite(payload.nbf) ||
          payload.nbf > now))
    )
      return null;

    const claim = <T>(key: keyof typeof CLAIM_KEYS) =>
      CLAIM_KEYS[key]
        .map((name) => payload[name])
        .find((value) => value != null) as T | undefined;

    const id = claim<string>("id") ?? "";
    if (!id) return null;

    const email = claim<string>("email") ?? "";
    const name = claim<string>("name") ?? "";
    const nameParts = name.split(" ");
    const firstName = claim<string>("firstName") ?? nameParts[0] ?? "";
    const lastName = claim<string>("lastName") ?? nameParts.slice(1).join(" ");
    const canEdit = claim("canEdit");

    return {
      id,
      email,
      firstName,
      lastName,
      fullName:
        name || [firstName, lastName].filter(Boolean).join(" ") || email,
      role: toRole(claim("role")),
      companyId: claim<string>("companyId") || null,
      canEdit: canEdit !== undefined ? toBoolean(canEdit, false) : undefined,
      isFirstLogin: pickFirstLogin(payload),
    };
  } catch {
    return null;
  }
}
