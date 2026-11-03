import type { CSSProperties } from "react";
import type { buildAppearance } from "../utils/appearance";

export type ThemeMode = "light" | "dark" | "system";

export type ResolvedTheme = Exclude<ThemeMode, "system">;

export type AppearanceTokens = ReturnType<typeof buildAppearance>;

export type AppearanceStyle = CSSProperties & AppearanceTokens;

export interface AppearancePreferences {
  mode: ThemeMode;
  brands: Record<string, string>;
  persisted: boolean;
}

export interface AppearanceContextValue {
  mode: ThemeMode;
  resolvedMode: ResolvedTheme;
  brandColor: string;
  tokens: AppearanceTokens;
  persisted: boolean;
  setMode: (mode: ThemeMode) => void;
  setPublicCompanyId: (companyId: string | null) => void;
}

import type { ReactNode } from "react";
export interface AppearanceProviderProps {
  children: ReactNode;
}
