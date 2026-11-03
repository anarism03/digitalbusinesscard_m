import { createHash, randomBytes } from "node:crypto";
import { AxiosError, AxiosHeaders } from "axios";
import { createSeed, type DemoDatabase } from "../src/mock/seed.js";
import { createDataAdapter } from "./engine.js";
import {
  createAuth,
  hashPassword,
  protectPasswords,
  verifyPassword,
} from "./auth.js";
import { StorageConflict, type ObjectStore } from "./storage.js";

const DATABASE_PATH = "state/database-v1.json";
const MAX_REQUEST_BYTES = 4_000_000;
type CloudDatabase = DemoDatabase & { sessionSecret: string };
const encode = (value: unknown) =>
  new TextEncoder().encode(JSON.stringify(value));
const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

function readState(bytes: Uint8Array): CloudDatabase {
  const state = JSON.parse(new TextDecoder().decode(bytes));
  if (
    state.version !== 1 ||
    !Array.isArray(state.companies) ||
    !Array.isArray(state.employees) ||
    !Array.isArray(state.scans) ||
    !Array.isArray(state.audit) ||
    typeof state.sessionSecret !== "string"
  )
    throw new Error("Stored database is invalid; refusing to overwrite it");
  return state;
}

export function createApplication(store: ObjectStore) {
  return async (request: Request): Promise<Response> => {
    try {
      const url = new URL(request.url);
      const path =
        "/" +
        (
          url.searchParams.get("route") || url.pathname.replace(/^\/api\/?/, "")
        ).replace(/^\/+/, "");
      url.searchParams.delete("route");
      const method = request.method.toUpperCase();
      if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method))
        return json({ message: "Method not allowed" }, 405);
      const origin = request.headers.get("origin");
      if (method !== "GET" && origin && origin !== url.origin)
        return json({ message: "Origin is not allowed" }, 403);
      const bytes =
        method === "GET"
          ? new Uint8Array()
          : new Uint8Array(await request.arrayBuffer());
      if (bytes.length > MAX_REQUEST_BYTES)
        return json(
          {
            message: "Fayl və ya məlumat çox böyükdür. Daha kiçik şəkil seçin.",
          },
          413,
        );
      let data: unknown;
      if (bytes.length) {
        data = request.headers
          .get("content-type")
          ?.includes("multipart/form-data")
          ? await new Request(request.url, {
              method: "POST",
              headers: { "content-type": request.headers.get("content-type")! },
              body: bytes,
            }).formData()
          : JSON.parse(new TextDecoder().decode(bytes));
      }

      for (let attempt = 0; attempt < 6; attempt++) {
        let snapshot = await store.read(DATABASE_PATH);
        if (!snapshot) {
          const initial: CloudDatabase = {
            ...createSeed(),
            sessionSecret: randomBytes(32).toString("hex"),
          };
          protectPasswords(initial);
          try {
            await store.write(DATABASE_PATH, encode(initial), {
              contentType: "application/json",
              createOnly: true,
            });
          } catch (error) {
            // A simultaneous first request may already have initialized the store.
            if (!(await store.read(DATABASE_PATH))) throw error;
          }
          snapshot = await store.read(DATABASE_PATH);
          if (!snapshot) throw new Error("Unable to initialize Blob database");
        }
        const db = readState(snapshot.bytes);
        const auth = createAuth(db, db.sessionSecret);
        if (path.startsWith("/appearance/") && method === "GET") {
          const company = db.companies.find(
            (c) => c.id === path.split("/")[2] && c.isActive,
          );
          return company
            ? json({ color: company.brandColor || "#1b4a75" })
            : json({ message: "Şirkət tapılmadı." }, 404);
        }
        if (path === "/health" && method === "GET")
          return json({ storage: "vercel-blob", shared: true });
        if (path === "/demo/accounts" && method === "GET")
          return json({
            companies: db.companies.map(({ id, name, voen, isActive }) => ({
              id,
              name,
              voen,
              isActive,
            })),
            employees: db.employees
              .filter((e) => e.role !== 0)
              .map(({ companyId, email, role, isActive }) => ({
                companyId,
                email,
                role,
                isActive,
              })),
          });
        if (path === "/media" && method === "GET") {
          const key = url.searchParams.get("key") || "";
          if (!/^media\/[a-f0-9]{64}\.(png|jpg|gif|webp|svg)$/.test(key))
            return json({ message: "Şəkil tapılmadı" }, 404);
          const relative = `/api/media?key=${key}`;
          const identity = auth.identify(
            (request.headers.get("authorization") || "").replace(
              /^Bearer /,
              "",
            ),
          );
          const actor = db.employees.find(
            (e) => e.id === identity?.id && e.isActive,
          );
          const allowed =
            db.companies.some(
              (c) =>
                c.logoUrl === relative && (c.isActive || actor?.role === 0),
            ) ||
            db.employees.some(
              (e) =>
                [e.photoUrl, e.cardBackgroundUrl].includes(relative) &&
                ((e.isActive &&
                  db.companies.some(
                    (c) => c.id === e.companyId && c.isActive,
                  )) ||
                  actor?.role === 0 ||
                  actor?.companyId === e.companyId),
            );
          if (!allowed) return json({ message: "Şəkil tapılmadı" }, 404);
          const file = await store.read(key);
          if (!file) return json({ message: "Şəkil tapılmadı" }, 404);
          return new Response(Buffer.from(file.bytes), {
            headers: {
              "Content-Type": file.contentType,
              "Cache-Control": "no-store",
              "X-Content-Type-Options": "nosniff",
              "Content-Security-Policy": "default-src 'none'; sandbox",
            },
          });
        }
        let dirty = false;
        const adapter = createDataAdapter({
          db,
          origin: url.origin,
          save: () => {
            dirty = true;
          },
          ...auth,
          hashPassword,
          verifyPassword,
          async storeImage(value) {
            if (!value.startsWith("data:")) {
              if (
                value &&
                !value.startsWith("/demo/") &&
                !/^\/api\/media\?key=media\/[a-f0-9]{64}\.(png|jpg|gif|webp|svg)$/.test(
                  value,
                )
              )
                throw new AxiosError(
                  "Şəkil ünvanı düzgün deyil",
                  "400",
                  undefined,
                  undefined,
                  {
                    status: 400,
                    data: { message: "Şəkil ünvanı düzgün deyil" },
                    statusText: "Bad Request",
                    headers: {},
                    config: { headers: new AxiosHeaders() },
                  },
                );
              return value;
            }
            const match =
              /^data:(image\/(?:png|jpeg|gif|webp|svg\+xml));base64,([A-Za-z0-9+/=\r\n]+)$/.exec(
                value,
              );
            if (!match) throw new Error("Unsupported image encoding");
            const image = Buffer.from(match[2], "base64");
            if (image.length > 3_000_000) throw new Error("Image exceeds 3 MB");
            const extension =
              (
                { "image/jpeg": "jpg", "image/svg+xml": "svg" } as Record<
                  string,
                  string
                >
              )[match[1]] || match[1].slice(6);
            const key = `media/${createHash("sha256").update(image).digest("hex")}.${extension}`;
            // Content addressed images are immutable and retries use the same object.
            await store.write(key, image, { contentType: match[1] });
            return `/api/media?key=${key}`;
          },
          async assetData(path) {
            if (!path) return "";
            let file: { bytes: Uint8Array; contentType: string } | null = null;
            if (path.startsWith("/api/media?key=")) {
              const key =
                new URL(path, url.origin).searchParams.get("key") || "";
              if (/^media\/[a-f0-9]{64}\.(png|jpg|gif|webp|svg)$/.test(key))
                file = await store.read(key);
            } else if (
              /^\/demo\/[a-zA-Z0-9/_-]+\.(svg|jpg|png|webp)$/.test(path)
            ) {
              const response = await fetch(new URL(path, url.origin));
              if (response.ok)
                file = {
                  bytes: new Uint8Array(await response.arrayBuffer()),
                  contentType:
                    response.headers.get("content-type")?.split(";")[0] ||
                    "image/jpeg",
                };
            }
            return file
              ? `data:${file.contentType};base64,${Buffer.from(file.bytes).toString("base64")}`
              : "";
          },
        });
        const result = await adapter({
          url: path,
          method,
          params: Object.fromEntries(url.searchParams),
          data,
          headers: new AxiosHeaders({
            Authorization: request.headers.get("authorization") || "",
          }),
        });
        if (dirty) {
          protectPasswords(db);
          try {
            await store.write(DATABASE_PATH, encode(db), {
              contentType: "application/json",
              expected: snapshot.etag,
            });
          } catch (error) {
            if (error instanceof StorageConflict) continue;
            throw error;
          }
        }
        if (result.data instanceof Blob)
          return new Response(result.data, {
            headers: {
              "Content-Type": result.data.type,
              "Cache-Control": "no-store",
            },
          });
        return json(result.data, result.status);
      }
      return json(
        { message: "Başqa cihaz məlumatı yenilədi. Yenidən cəhd edin." },
        409,
      );
    } catch (error) {
      if (error instanceof AxiosError)
        return json(
          error.response?.data || { message: error.message },
          error.response?.status || 400,
        );
      if (error instanceof SyntaxError)
        return json({ message: "Məlumat formatı düzgün deyil." }, 400);
      console.error(
        "Shared storage request failed:",
        error instanceof Error ? error.message : "unknown error",
      );
      return json(
        {
          message:
            "Ortaq yaddaşa qoşulmaq alınmadı. Vercel-də private Blob deposunun bu layihənin Production mühitinə qoşulduğunu yoxlayın.",
        },
        503,
      );
    }
  };
}
