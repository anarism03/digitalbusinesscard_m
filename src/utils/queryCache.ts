import { MAX_CACHED_QUERIES } from "../constants/api";
import type { QueryCacheEntry, QueryLoader, QueryRequest } from "../types/api";
import { shareQueryData } from "./queryData";

const loaders = new Map<string, Set<QueryLoader>>();
const scopeSubscribers = new Map<string, Set<QueryLoader>>();
const requests = new Map<string, QueryRequest>();
const cache = new Map<string, QueryCacheEntry>();
const versions = new Map<string, number>();

export function getQueryVersion(key: string): number {
  return versions.get(key) ?? 0;
}

export function getQueryData<T>(scope: string): T | undefined {
  const entry = cache.get(scope);
  return entry?.invalidated ? undefined : (entry?.data as T | undefined);
}

export function getFreshQueryData<T>(
  scope: string,
  staleTime: number,
): T | undefined {
  const entry = cache.get(scope);
  if (
    !entry ||
    entry.invalidated ||
    requests.has(scope) ||
    staleTime <= 0 ||
    Date.now() < entry.updatedAt ||
    Date.now() - entry.updatedAt >= staleTime
  )
    return undefined;
  return entry.data as T;
}

export function registerQuery(
  key: string,
  load: QueryLoader,
  scope: string,
): () => void {
  let subscribers = loaders.get(key);
  if (!subscribers) {
    subscribers = new Set();
    loaders.set(key, subscribers);
  }
  subscribers.add(load);
  let scoped = scopeSubscribers.get(scope);
  if (!scoped) {
    scoped = new Set();
    scopeSubscribers.set(scope, scoped);
  }
  scoped.add(load);
  return () => {
    subscribers.delete(load);
    if (subscribers.size === 0) loaders.delete(key);
    scoped.delete(load);
    if (scoped.size === 0) {
      scopeSubscribers.delete(scope);
      queueMicrotask(() => {
        if (scopeSubscribers.has(scope)) return;
        const request = requests.get(scope);
        if (request) {
          requests.delete(scope);
          request.controller.abort();
        }
      });
    }
  };
}

export function invalidateQuery(key: string): void {
  versions.set(key, getQueryVersion(key) + 1);
  for (const [scope, entry] of requests) {
    if (entry.key === key) {
      requests.delete(scope);
      entry.controller.abort();
    }
  }
  for (const entry of cache.values()) {
    if (entry.key === key) entry.invalidated = true;
  }
  loaders.get(key)?.forEach((load) => void load());
}

export function fetchQuery<T>(
  key: string,
  scope: string,
  fetcher: (signal?: AbortSignal) => Promise<T>,
): Promise<T> {
  const existing = requests.get(scope);
  if (existing) return existing.promise as Promise<T>;
  const version = getQueryVersion(key);
  const controller = new AbortController();
  const promise = Promise.resolve()
    .then(() => fetcher(controller.signal))
    .then((result) => {
      const data = shareQueryData(cache.get(scope)?.data, result);
      if (!controller.signal.aborted && version === getQueryVersion(key)) {
        cache.set(scope, { key, data, updatedAt: Date.now() });
        if (cache.size > MAX_CACHED_QUERIES) {
          const oldest = cache.keys().next().value;
          if (oldest) cache.delete(oldest);
        }
      }
      return data;
    })
    .finally(() => {
      if (requests.get(scope)?.promise === promise) requests.delete(scope);
    });
  requests.set(scope, { key, promise, controller });
  return promise;
}
