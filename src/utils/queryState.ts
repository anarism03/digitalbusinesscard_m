import type { QueryState } from "../types/api";

export function createQueryState<T>(
  scope: string,
  data: T | undefined,
  enabled = true,
): QueryState<T> {
  return {
    scope,
    data,
    status: enabled && data === undefined ? "loading" : "success",
  };
}

export function updateQueryState<T>(
  previous: QueryState<T>,
  next: QueryState<T>,
): QueryState<T> {
  return previous.scope === next.scope &&
    previous.status === next.status &&
    Object.is(previous.data, next.data) &&
    Object.is(previous.error, next.error)
    ? previous
    : next;
}
