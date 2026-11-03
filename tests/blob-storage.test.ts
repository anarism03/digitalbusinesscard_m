import assert from "node:assert/strict";
import { test } from "node:test";
import type { get, head, put } from "@vercel/blob";
import { createBlobStore } from "../server/storage.js";

test("Blob reads retry mismatched versions and use the original canonical HEAD ETag for CAS", async () => {
  let heads = 0;
  let gets = 0;
  let precondition: string | undefined;
  const store = createBlobStore({
    head: (async () => ({
      etag: ++heads === 1 ? '"old"' : '"new"',
    })) as unknown as typeof head,
    get: (async (_key: string, options: Parameters<typeof get>[1]) => {
      gets++;
      assert.equal(options.useCache, false);
      assert.deepEqual(options.headers, { "Accept-Encoding": "identity" });
      return {
        stream: new Response("fresh data").body,
        blob: { etag: 'W/"new"', contentType: "application/json" },
      };
    }) as unknown as typeof get,
    put: (async (_key, _bytes, options) => {
      precondition = options.ifMatch;
      return {};
    }) as typeof put,
  });
  const file = await store.read("state/database-v1.json");
  assert.equal(gets, 2);
  assert.equal(file?.etag, '"new"');
  assert.equal(new TextDecoder().decode(file!.bytes), "fresh data");
  await store.write("state/database-v1.json", file!.bytes, {
    contentType: "application/json",
    expected: file!.etag,
  });
  assert.equal(precondition, '"new"');
});

test("Blob reads reject empty version tags instead of enabling an unconditional write", async () => {
  const store = createBlobStore({
    head: (async () => ({ etag: "" })) as unknown as typeof head,
    get: (async () => ({
      stream: new Response("data").body,
      blob: { etag: "" },
    })) as unknown as typeof get,
    put: (async () => {
      throw new Error("must not write");
    }) as typeof put,
  });
  await assert.rejects(
    store.read("state/database-v1.json"),
    /empty version tag/,
  );
});
