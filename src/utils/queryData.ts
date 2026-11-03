export function shareQueryData<T>(previous: unknown, next: T): T {
  if (Object.is(previous, next)) return next;
  if (
    !previous ||
    !next ||
    typeof previous !== "object" ||
    typeof next !== "object"
  )
    return next;
  const isArray = Array.isArray(next);
  if (isArray !== Array.isArray(previous)) return next;
  if (
    !isArray &&
    (Object.getPrototypeOf(previous) !== Object.prototype ||
      Object.getPrototypeOf(next) !== Object.prototype)
  )
    return next;
  const before = previous as Record<string, unknown>;
  const after = next as Record<string, unknown>;
  const keys = Object.keys(after);
  let unchanged = Object.keys(before).length === keys.length;
  if (isArray)
    unchanged =
      unchanged &&
      (previous as unknown[]).length === (next as unknown[]).length;
  const result = isArray ? new Array<unknown>((next as unknown[]).length) : {};
  for (const key of keys) {
    const value = shareQueryData(before[key], after[key]);
    Object.defineProperty(result, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
    unchanged =
      unchanged &&
      Object.prototype.hasOwnProperty.call(before, key) &&
      Object.is(value, before[key]);
  }
  return (unchanged ? previous : result) as T;
}
