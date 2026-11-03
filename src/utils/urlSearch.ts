import type { SearchParamValue } from "../types/navigation";

export function updateSearchParams(
  current: URLSearchParams,
  updates: Record<string, SearchParamValue>,
): URLSearchParams {
  const next = new URLSearchParams(current);

  Object.entries(updates).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === false
    ) {
      next.delete(key);
      return;
    }

    next.set(key, String(value));
  });

  return next;
}
