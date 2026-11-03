import { App as AntApp, ConfigProvider } from "antd";
import azAZ from "antd/locale/az_AZ";
import {
  useLayoutEffect,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { createAppTheme } from "../constants/theme";
import { useAppSelector } from "../store/hooks";
import type { AppearanceProviderProps } from "../types/appearance";
import {
  applyAppearance,
  buildAppearance,
  getAppearancePreferences,
  getCompanyBrand,
  setThemeMode,
  subscribeAppearance,
  setCompanyBrand,
} from "../utils/appearance";
import { apiClient } from "../services/axios/axiosInstance";
import { AppearanceContext } from "./AppearanceContext";

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const getSystemDark = () => systemTheme.matches;
function subscribeSystem(listener: () => void) {
  systemTheme.addEventListener("change", listener);
  return () => systemTheme.removeEventListener("change", listener);
}

export default function AppearanceProvider({
  children,
}: AppearanceProviderProps) {
  const preferences = useSyncExternalStore(
    subscribeAppearance,
    getAppearancePreferences,
  );
  const systemDark = useSyncExternalStore(subscribeSystem, getSystemDark);
  const companyId = useAppSelector((state) => state.auth.user?.companyId);
  const [publicCompanyId, setPublicCompanyId] = useState<string | null>(null);
  const resolvedMode =
    preferences.mode === "system"
      ? systemDark
        ? "dark"
        : "light"
      : preferences.mode;
  const brandColor = getCompanyBrand(publicCompanyId ?? companyId ?? undefined);
  const activeCompany = publicCompanyId ?? companyId;
  useEffect(() => {
    if (!activeCompany) return;
    let cancelled = false;
    const refresh = () => {
      if (document.visibilityState === "hidden") return;
      void apiClient
        .get<{ color: string }>(
          `/appearance/${encodeURIComponent(activeCompany)}`,
        )
        .then(({ color }) => {
          if (!cancelled) setCompanyBrand(activeCompany, color);
        })
        .catch(() => {
          /* Keep the last confirmed company color while offline. */
        });
    };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [activeCompany]);
  const tokens = useMemo(
    () => buildAppearance(brandColor, resolvedMode),
    [brandColor, resolvedMode],
  );
  const theme = useMemo(
    () => createAppTheme(tokens, resolvedMode),
    [tokens, resolvedMode],
  );
  useLayoutEffect(
    () => applyAppearance(brandColor, resolvedMode),
    [brandColor, resolvedMode],
  );
  const value = useMemo(
    () => ({
      mode: preferences.mode,
      resolvedMode,
      brandColor,
      tokens,
      persisted: preferences.persisted,
      setMode: setThemeMode,
      setPublicCompanyId,
    }),
    [preferences.mode, preferences.persisted, resolvedMode, brandColor, tokens],
  );
  return (
    <AppearanceContext.Provider value={value}>
      <ConfigProvider locale={azAZ} theme={theme}>
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </AppearanceContext.Provider>
  );
}
