import type { SheetVisibility } from "../types/layout";

export function areClosedSheetsEqual(
  previous: SheetVisibility,
  next: SheetVisibility,
): boolean {
  return !previous.open && !next.open;
}
