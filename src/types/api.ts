export type ApiRecord = Record<string, unknown>;

export interface QueryOptions {
  enabled?: boolean;
  deps?: unknown[];
  staleTime?: number;
}

export interface QueryState<T> {
  scope: string;
  data?: T;
  status: "loading" | "success" | "error";
  error?: unknown;
}

export interface QueryRequest {
  key: string;
  promise: Promise<unknown>;
  controller: AbortController;
}

export interface QueryCacheEntry {
  key: string;
  data: unknown;
  invalidated?: boolean;
  updatedAt: number;
}

export type QueryLoader = () => Promise<void>;

export interface MutationOptions<TData> {
  invalidates?: string[];
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
}

export interface MutateCallbacks {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
}

export interface ApiErrorShape {
  message?: string;
  config?: {
    url?: string;
  };
  response?: {
    status?: number;
    data?: unknown;
  };
}
