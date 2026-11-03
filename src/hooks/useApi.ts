import { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../store/hooks";
import type {
  MutateCallbacks,
  MutationOptions,
  QueryOptions,
  QueryState,
} from "../types/api";

import {
  fetchQuery,
  getQueryData,
  getFreshQueryData,
  getQueryVersion,
  invalidateQuery,
  registerQuery,
} from "../utils/queryCache";
import { createQueryState, updateQueryState } from "../utils/queryState";

export const invalidate = invalidateQuery;

export function useApiQuery<T>(
  key: string,
  fetcher: (signal?: AbortSignal) => Promise<T>,
  options?: QueryOptions,
) {
  const enabled = options?.enabled ?? true;
  const staleTime = options?.staleTime ?? 0;
  const token = useAppSelector((state) => state.auth.token);
  const scope = JSON.stringify([token, key, options?.deps ?? []]);
  const [state, setState] = useState<QueryState<T>>(() => {
    return createQueryState(scope, getQueryData<T>(scope), enabled);
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const scopeRef = useRef(scope);
  scopeRef.current = scope;
  const requestId = useRef(0);

  const load = useCallback(
    async (force = true) => {
      if (!enabled) return;
      const id = ++requestId.current;
      const version = getQueryVersion(key);
      const isCurrent = () =>
        id === requestId.current && scope === scopeRef.current;
      const freshData = force
        ? undefined
        : getFreshQueryData<T>(scope, staleTime);
      if (freshData !== undefined) {
        setState((previous) =>
          updateQueryState(previous, {
            scope,
            data: freshData,
            status: "success",
          }),
        );
        return;
      }
      setState((previous) => {
        const data =
          previous.scope === scope ? previous.data : getQueryData<T>(scope);
        return updateQueryState(previous, createQueryState(scope, data));
      });
      try {
        const result = await fetchQuery(key, scope, fetcherRef.current);
        if (version !== getQueryVersion(key)) return;
        if (isCurrent()) {
          setState((previous) =>
            updateQueryState(previous, {
              scope,
              data: result,
              status: "success",
            }),
          );
        }
      } catch (e) {
        if (version !== getQueryVersion(key)) return;
        if (isCurrent()) {
          setState((previous) => ({
            ...previous,
            status: "error",
            error: e,
          }));
        }
      }
    },
    [enabled, key, scope, staleTime],
  );

  useEffect(() => {
    const requests = requestId;
    const unregister = enabled ? registerQuery(key, load, scope) : undefined;
    void load(false);
    return () => {
      ++requests.current;
      unregister?.();
    };
  }, [enabled, key, load, scope]);

  const refetch = useCallback(() => load(), [load]);
  const cachedData = enabled ? getQueryData<T>(scope) : undefined;
  const visible: QueryState<T> =
    enabled && state.scope === scope
      ? state
      : createQueryState(scope, cachedData, enabled);
  return {
    data: visible.data,
    isLoading: visible.status === "loading",
    isError: visible.status === "error",
    error: visible.error ?? null,
    refetch,
  };
}

export function useApiMutation<TVars, TData = unknown>(
  fn: (vars: TVars) => Promise<TData>,
  options?: MutationOptions<TData>,
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const pendingCount = useRef(0);

  const fnRef = useRef(fn);
  fnRef.current = fn;
  const optsRef = useRef(options);
  optsRef.current = options;

  const mutateAsync = useCallback(async (vars: TVars): Promise<TData> => {
    ++pendingCount.current;
    setIsPending(true);
    setError(null);
    try {
      const result = await fnRef.current(vars);
      optsRef.current?.invalidates?.forEach(invalidate);
      optsRef.current?.onSuccess?.(result);
      return result;
    } catch (e) {
      setError(e);
      optsRef.current?.onError?.(e);
      throw e;
    } finally {
      setIsPending(--pendingCount.current > 0);
    }
  }, []);

  const mutate = useCallback(
    (vars: TVars, callbacks?: MutateCallbacks) => {
      mutateAsync(vars)
        .then(() => callbacks?.onSuccess?.())
        .catch(() => callbacks?.onError?.())
        .finally(() => callbacks?.onSettled?.());
    },
    [mutateAsync],
  );

  return { mutate, mutateAsync, isPending, error };
}
