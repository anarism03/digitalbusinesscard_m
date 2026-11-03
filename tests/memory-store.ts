import {
  StorageConflict,
  type ObjectStore,
  type StoredFile,
  type WriteOptions,
} from "../server/storage";

export class MemoryStore implements ObjectStore {
  files = new Map<string, StoredFile>();
  revision = 0;
  conflicts = 0;
  async read(key: string) {
    const file = this.files.get(key);
    return file ? structuredClone(file) : null;
  }
  async write(key: string, bytes: Uint8Array, options: WriteOptions) {
    const existing = this.files.get(key);
    if (
      (options.createOnly && existing) ||
      (options.expected && existing?.etag !== options.expected)
    ) {
      this.conflicts++;
      throw new StorageConflict();
    }
    this.files.set(key, {
      bytes: new Uint8Array(bytes),
      etag: String(++this.revision),
      contentType: options.contentType,
    });
  }
}
