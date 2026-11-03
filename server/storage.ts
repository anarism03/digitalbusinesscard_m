import {
  get,
  head,
  put,
  BlobNotFoundError,
  BlobPreconditionFailedError,
} from "@vercel/blob";

export interface StoredFile {
  bytes: Uint8Array;
  etag: string;
  contentType: string;
}
export interface WriteOptions {
  contentType: string;
  expected?: string;
  createOnly?: boolean;
}
export interface ObjectStore {
  read(key: string): Promise<StoredFile | null>;
  write(key: string, bytes: Uint8Array, options: WriteOptions): Promise<void>;
}
export class StorageConflict extends Error {}

type BlobClient = Pick<typeof import("@vercel/blob"), "get" | "head" | "put">;
export function createBlobStore(
  client: BlobClient = { get, head, put },
): ObjectStore {
  // Supports both standard Vercel names and the prefix shown in the user's store.
  const token =
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN;
  const storeId =
    process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN_STORE_ID;
  const credentials = token ? { token } : storeId ? { storeId } : {};
  return {
    async read(key) {
      for (let attempt = 0; attempt < 4; attempt++) {
        let metadata;
        try {
          metadata = await client.head(key, credentials);
        } catch (error) {
          if (error instanceof BlobNotFoundError) return null;
          throw error;
        }
        const result = await client.get(key, {
          access: "private",
          useCache: false,
          headers: { "Accept-Encoding": "identity" },
          ...credentials,
        });
        if (!result?.stream) {
          if (!result) continue;
          throw new Error("Blob returned an empty stream");
        }
        const bytes = new Uint8Array(
          await new Response(result.stream).arrayBuffer(),
        );
        // Download/CDN tags may be weak. Only control-plane metadata is used
        // as a write precondition; ensure that it describes these exact bytes.
        const normalize = (tag: string) => tag.replace(/^W\//, "");
        if (!metadata.etag || !result.blob.etag)
          throw new Error("Blob returned an empty version tag");
        if (normalize(metadata.etag) !== normalize(result.blob.etag)) continue;
        return {
          bytes,
          etag: metadata.etag,
          contentType: result.blob.contentType || "application/octet-stream",
        };
      }
      throw new Error("Blob metadata changed while reading; retry the request");
    },
    async write(key, bytes, options) {
      try {
        await client.put(key, Buffer.from(bytes), {
          access: "private",
          addRandomSuffix: false,
          allowOverwrite: !options.createOnly,
          ...(options.expected ? { ifMatch: options.expected } : {}),
          contentType: options.contentType,
          ...credentials,
        });
      } catch (error) {
        if (error instanceof BlobPreconditionFailedError)
          throw new StorageConflict();
        throw error;
      }
    },
  };
}
