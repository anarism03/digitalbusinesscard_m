import { get, put, BlobPreconditionFailedError } from "@vercel/blob";

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

export function createBlobStore(): ObjectStore {
  // Supports both standard Vercel names and the prefix shown in the user's store.
  const token =
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN;
  const storeId =
    process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN_STORE_ID;
  const credentials = token ? { token } : storeId ? { storeId } : {};
  return {
    async read(key) {
      const result = await get(key, {
        access: "private",
        useCache: false,
        ...credentials,
      });
      if (!result) return null;
      if (!result.stream) throw new Error("Blob returned an empty stream");
      return {
        bytes: new Uint8Array(await new Response(result.stream).arrayBuffer()),
        etag: result.blob.etag,
        contentType: result.blob.contentType || "application/octet-stream",
      };
    },
    async write(key, bytes, options) {
      try {
        await put(key, Buffer.from(bytes), {
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
