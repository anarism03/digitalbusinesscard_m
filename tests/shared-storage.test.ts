import assert from "node:assert/strict";
import { test } from "node:test";
import { createApplication } from "../server/application";
import { MemoryStore } from "./memory-store";
import { companyId, employeeId } from "../src/mock/seed";

const base = "https://cards.example";
const request = (
  path: string,
  method = "GET",
  data?: unknown,
  token?: string,
) =>
  new Request(base + "/api" + path, {
    method,
    headers: {
      ...(data !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
const credentials = {
  email: "admin@nova.example.com",
  password: "Demo123!",
  companyVoen: "1300000001",
};

test("separate server instances share text, image, nickname, and concurrent edits", async () => {
  const store = new MemoryStore();
  const phone = createApplication(store);
  const pc = createApplication(store);
  const [first, second] = await Promise.all([
    phone(request("/auth/login", "POST", credentials)),
    pc(request("/auth/login", "POST", credentials)),
  ]);
  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  const token = (await first.json()).accessToken;
  const pcToken = (await second.json()).accessToken;
  const id = employeeId(0);
  const image =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aT9sAAAAASUVORK5CYII=";
  const saved = await phone(
    request(
      `/CompanyAdmin/users/${id}`,
      "PUT",
      { jobTitle: "Telefon dəyişiklikləri", photoUrl: image },
      token,
    ),
  );
  assert.equal(saved.status, 200, await saved.clone().text());
  const profile = await (
    await pc(request(`/User/${id}`, "GET", undefined, pcToken))
  ).json();
  assert.equal(profile.jobTitle, "Telefon dəyişiklikləri");
  assert.match(profile.photoUrl, /^\/api\/media\?key=/);
  assert.equal(profile.password, undefined);
  assert.equal(profile.sessionSecret, undefined);
  assert.ok(
    !profile.photoUrl.includes("%"),
    "media URLs must survive the application's asset URL resolver without double encoding",
  );
  const publicCard = await (await pc(request("/cards/aysel-mammadova"))).json();
  assert.equal(publicCard.jobTitle, profile.jobTitle);
  const media = await pc(new Request(base + profile.photoUrl));
  assert.equal(media.status, 200);
  assert.equal(media.headers.get("content-type"), "image/png");
  assert.deepEqual(
    Buffer.from(await media.arrayBuffer()),
    Buffer.from(image.split(",")[1], "base64"),
  );
  const results = await Promise.all([
    phone(
      request(
        `/CompanyAdmin/users/${id}`,
        "PUT",
        { jobTitle: "Son vəzifə" },
        token,
      ),
    ),
    pc(
      request(
        `/CompanyAdmin/users/${id}`,
        "PUT",
        { address: "PC-dən ünvan" },
        pcToken,
      ),
    ),
  ]);
  assert.ok(results.every((result) => result.status === 200));
  assert.ok(store.conflicts > 0, "CAS conflict must exercise a retry");
  const latest = await (
    await phone(request(`/User/${id}`, "GET", undefined, token))
  ).json();
  assert.equal(latest.jobTitle, "Son vəzifə");
  assert.equal(latest.address, "PC-dən ünvan");
  const renamed = await phone(
    request(
      `/User/${id}/nickname`,
      "PUT",
      { nickname: "ortaq-vizitkart" },
      token,
    ),
  );
  assert.equal(renamed.status, 200);
  assert.equal((await pc(request("/cards/ortaq-vizitkart"))).status, 200);
  assert.equal((await pc(request("/cards/aysel-mammadova"))).status, 404);
  const state = JSON.parse(
    new TextDecoder().decode(store.files.get("state/database-v1.json")!.bytes),
  );
  assert.ok(
    state.employees.every((user: { password: string }) =>
      user.password.startsWith("scrypt:"),
    ),
  );
});

test("cloud API rejects forged sessions and access to another company", async () => {
  const app = createApplication(new MemoryStore());
  const token = (
    await (await app(request("/auth/login", "POST", credentials))).json()
  ).accessToken;
  assert.equal(
    (await app(request(`/User/${employeeId(8)}`, "GET", undefined, token)))
      .status,
    403,
  );
  assert.equal(
    (
      await app(
        request(
          "/auth/account-info",
          "GET",
          undefined,
          token.slice(0, -5) + "xxxxx",
        ),
      )
    ).status,
    401,
  );
  assert.equal((await app(request("/auth/account-info"))).status, 401);
  const catalog = await (await app(request("/demo/accounts"))).json();
  assert.ok(!JSON.stringify(catalog).includes("scrypt:"));
  assert.ok(!JSON.stringify(catalog).includes("sessionSecret"));
  assert.equal(
    (await app(new Request(base + "/api/media?key=state/database-v1.json")))
      .status,
    404,
  );
  const crossOrigin = new Request(base + "/api/auth/login", {
    method: "POST",
    headers: { origin: "https://other.example" },
    body: JSON.stringify(credentials),
  });
  assert.equal((await app(crossOrigin)).status, 403);
  const changed = await app(
    request(
      "/auth/change-password",
      "POST",
      { oldPassword: "Demo123!", newPassword: "Changed123!" },
      token,
    ),
  );
  assert.equal(changed.status, 200);
  assert.equal(
    (await app(request("/auth/account-info", "GET", undefined, token))).status,
    401,
  );
  assert.equal(
    (await app(request("/auth/login", "POST", credentials))).status,
    401,
  );
  assert.equal(
    (
      await app(
        request("/auth/login", "POST", {
          ...credentials,
          password: "Changed123!",
        }),
      )
    ).status,
    200,
  );
});

test("company settings, XLSX export/import, and Vercel rewrite use the same shared database", async () => {
  const app = createApplication(new MemoryStore());
  const token = (
    await (await app(request("/auth/login", "POST", credentials))).json()
  ).accessToken;
  assert.equal(
    (
      await app(
        request(
          "/CompanyAdmin/company",
          "PUT",
          { name: "Ortaq şirkət" },
          token,
        ),
      )
    ).status,
    200,
  );
  const profile = await (
    await app(request(`/User/${employeeId(0)}`, "GET", undefined, token))
  ).json();
  assert.equal(profile.companyName, "Ortaq şirkət");
  const brand = await app(
    request(`/appearance/${companyId(0)}`, "PUT", { color: "#2563eb" }, token),
  );
  assert.equal(brand.status, 200);
  assert.equal(
    (await (await app(request(`/appearance/${companyId(0)}`))).json()).color,
    "#2563eb",
  );
  const template = await app(
    request("/ExportImport/template", "GET", undefined, token),
  );
  assert.equal(template.status, 200, await template.clone().text());
  const bytes = new Uint8Array(await template.arrayBuffer());
  assert.deepEqual([...bytes.slice(0, 2)], [0x50, 0x4b]);
  const form = new FormData();
  form.append(
    "file",
    new File([bytes], "template.xlsx", {
      type: template.headers.get("content-type")!,
    }),
  );
  const imported = await app(
    new Request(base + `/api/ExportImport/import/company/${companyId(0)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    }),
  );
  assert.equal(imported.status, 200, await imported.clone().text());
  assert.equal((await imported.json()).created, 1);
  const rewritten = await app(
    new Request(base + "/api/index?route=cards/aysel-mammadova"),
  );
  assert.equal(rewritten.status, 200);
});

test("storage outages fail explicitly without a local seed fallback", async () => {
  const app = createApplication({
    read: async () => {
      throw new Error("test storage unavailable");
    },
    write: async () => {},
  });
  const response = await app(request("/auth/login", "POST", credentials));
  assert.equal(response.status, 503);
  assert.match((await response.json()).message, /Blob/);
});
