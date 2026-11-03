import { loadEnv, type Plugin } from "vite";

export function sharedApi(): Plugin {
  return {
    name: "shared-blob-api",
    apply: "serve",
    async configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      for (const [key, value] of Object.entries(env)) {
        if (key.startsWith("BLOB_") || key === "VERCEL_OIDC_TOKEN")
          process.env[key] ??= value;
      }
      let storePromise: Promise<unknown> | undefined;
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();
        try {
          // Load server code through Vite only for API requests, not client builds.
          const { createApplication } = await server.ssrLoadModule(
            "/server/application.ts",
          );
          storePromise ??= (async () => {
            if (process.env.BLOB_TEST_MODE === "1") {
              const { MemoryStore } = await server.ssrLoadModule(
                "/tests/memory-store.ts",
              );
              return new MemoryStore();
            } else {
              const { createBlobStore } =
                await server.ssrLoadModule("/server/storage.ts");
              return createBlobStore();
            }
          })();
          const handle: (request: Request) => Promise<Response> =
            createApplication(await storePromise);
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 4_000_000) {
              res.statusCode = 413;
              res.end();
              return;
            }
            chunks.push(Buffer.from(chunk));
          }
          const method = req.method || "GET";
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value)
              headers.set(key, Array.isArray(value) ? value.join(", ") : value);
          }
          const response = await handle(
            new Request(`http://${req.headers.host}${req.url}`, {
              method,
              headers,
              ...(method !== "GET" && method !== "HEAD"
                ? { body: Buffer.concat(chunks) }
                : {}),
            }),
          );
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          next(error);
        }
      });
    },
  };
}
