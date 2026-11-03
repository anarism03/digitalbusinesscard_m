import { createContext, useContext } from "react";
import type { AppearanceContextValue } from "../types/appearance";

export const AppearanceContext = createContext<AppearanceContextValue | null>(
  null,
);
export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error("useAppearance requires AppearanceProvider");
  return context;
}

export type { AppearanceContextValue } from "../types/appearance";
