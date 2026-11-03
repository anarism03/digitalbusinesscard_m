import type {
  AppearancePreferences,
  ResolvedTheme,
  ThemeMode,
} from "../types/appearance";

const APPEARANCE_STORAGE_KEY = "dbc-appearance-v1";
export const DEFAULT_BRAND_COLOR = "#1b4a75";
export const BRAND_PRESETS = [
  { name: "Tünd göy", color: DEFAULT_BRAND_COLOR },
  { name: "Mavi", color: "#2563eb" },
  { name: "Yaşıl", color: "#15803d" },
  { name: "Sarı", color: "#facc15" },
  { name: "Qırmızı", color: "#dc2626" },
  { name: "Bənövşəyi", color: "#7c3aed" },
  { name: "Firuzəyi", color: "#0d9488" },
] as const;

export function normalizeHex(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const hex = value.trim().replace(/^#/, "");
  if (/^[\da-f]{3}$/i.test(hex))
    return `#${hex
      .split("")
      .map((digit) => digit + digit)
      .join("")}`.toLowerCase();
  return /^[\da-f]{6}$/i.test(hex) ? `#${hex.toLowerCase()}` : null;
}

function rgb(hex: string): number[] {
  return [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
}

function mixColor(first: string, second: string, amount: number): string {
  const target = rgb(second);
  return `#${rgb(first)
    .map((channel, index) =>
      Math.round(channel + (target[index] - channel) * amount)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function luminance(hex: string): number {
  return rgb(hex).reduce((total, channel, index) => {
    const value = channel / 255;
    const linear =
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    return total + linear * [0.2126, 0.7152, 0.0722][index];
  }, 0);
}

function contrastRatio(first: string, second: string): number {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function readableColor(
  color: string,
  backgrounds: string[],
  minimum: number,
): string {
  if (
    backgrounds.every(
      (background) => contrastRatio(color, background) >= minimum,
    )
  )
    return color;
  const target = luminance(backgrounds[0]) > 0.35 ? "#000000" : "#ffffff";
  for (let step = 1; step <= 100; step++) {
    const candidate = mixColor(color, target, step / 100);
    if (
      backgrounds.every(
        (background) => contrastRatio(candidate, background) >= minimum,
      )
    )
      return candidate;
  }
  return target;
}

export function buildAppearance(brand: string, mode: ResolvedTheme) {
  const raw = normalizeHex(brand) ?? DEFAULT_BRAND_COLOR;
  const dark = mode === "dark";
  const surface = dark ? "#171e2b" : "#ffffff";
  const canvas = dark ? "#0c111b" : "#f3f5f8";
  const elevated = dark ? "#202938" : "#ffffff";
  const muted = dark ? "#1c2533" : "#f7f8fa";
  const soft = mixColor(surface, raw, dark ? 0.18 : 0.075);
  const primary = readableColor(
    raw,
    [surface, soft, muted, elevated, canvas],
    dark ? 7 : 4.5,
  );
  const action = readableColor(
    mixColor(dark ? readableColor(raw, [surface], 3) : raw, "#ffffff", 0.06),
    ["#ffffff"],
    4.5,
  );
  const actionHover = mixColor(action, "#000000", 0.04);
  const actionActive = mixColor(action, "#000000", 0.08);
  const dangerAction = dark ? "#dc2626" : "#b91c1c";
  const successAction = "#187a3f";
  return {
    "--color-brand": raw,
    "--color-primary": primary,
    "--color-primary-dark": primary,
    "--color-primary-hover": primary,
    "--color-primary-soft": soft,
    "--color-primary-tint": soft,
    "--color-action": action,
    "--color-action-hover": actionHover,
    "--color-action-active": actionActive,
    "--color-on-primary": "#ffffff",
    "--color-contact-action": action,
    "--color-contact-action-hover": actionHover,
    "--color-contact-action-active": actionActive,
    "--color-focus": readableColor(raw, [surface, canvas, elevated], 3),
    "--color-surface": surface,
    "--color-surface-elevated": elevated,
    "--color-surface-muted": muted,
    "--color-surface-subtle": muted,
    "--color-surface-neutral": dark ? "#273142" : "#f1f3f7",
    "--color-avatar-muted": dark ? "#2a3547" : "#eef1f6",
    "--color-canvas": canvas,
    "--color-text": dark ? "#f1f5f9" : "#0f172a",
    "--color-text-secondary": dark ? "#bcc6d5" : "#586477",
    "--color-text-muted": dark ? "#9aa9bf" : "#647185",
    "--color-label": dark ? "#d4dce8" : "#3c4a63",
    "--color-border": dark ? "#303c50" : "#e2e6ed",
    "--color-border-strong": dark ? "#53647d" : "#bbc5d3",
    "--color-danger": dark ? "#ff9999" : "#b91c1c",
    "--color-danger-action": dangerAction,
    "--color-danger-action-hover": mixColor(dangerAction, "#000000", 0.08),
    "--color-danger-action-active": mixColor(dangerAction, "#000000", 0.14),
    "--color-on-danger": "#ffffff",
    "--color-danger-soft": dark ? "#38232d" : "#fff1f0",
    "--color-danger-border": dark ? "#935060" : "#f1b9b9",
    "--color-success": dark ? "#7ee2ab" : "#187a3f",
    "--color-success-action": successAction,
    "--color-success-action-hover": mixColor(successAction, "#000000", 0.08),
    "--color-success-action-active": mixColor(successAction, "#000000", 0.14),
    "--color-on-success": "#ffffff",
    "--color-success-soft": dark ? "#18372e" : "#e7f7ec",
    "--color-warning": dark ? "#f6d47a" : "#8a5900",
    "--color-warning-soft": dark ? "#362e1d" : "#fff6dc",
    "--color-info": dark ? "#91c5ff" : "#245db4",
    "--color-info-soft": dark ? "#1d304b" : "#edf4ff",
    "--color-overlay": dark ? "rgba(0,0,0,0.65)" : "rgba(15,23,42,0.48)",
    "--shadow-sm": dark
      ? "0 2px 8px rgba(0,0,0,0.2)"
      : "0 1px 2px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.03)",
    "--shadow-md": dark
      ? "0 6px 24px rgba(0,0,0,0.25)"
      : "0 2px 6px rgba(15,23,42,0.05), 0 14px 32px rgba(15,23,42,0.07)",
    "--shadow-lg": dark
      ? "0 18px 60px rgba(0,0,0,0.4)"
      : "0 8px 20px rgba(15,23,42,0.08), 0 30px 70px rgba(15,23,42,0.13)",
    "--card-accent": raw,
    "--card-accent-deep": mixColor(raw, "#000000", 0.3),
    "--card-accent-light": mixColor(raw, "#ffffff", 0.24),
    "--card-accent-soft": soft,
    "--card-accent-glow": `color-mix(in srgb, ${raw} 20%, transparent)`,
  };
}

function readPreferences(): AppearancePreferences {
  let stored: string | null;
  try {
    stored = localStorage.getItem(APPEARANCE_STORAGE_KEY);
  } catch {
    return { mode: "system", brands: {}, persisted: false };
  }
  try {
    const data = JSON.parse(stored ?? "{}");
    const brands: Record<string, string> = {};
    if (data?.brands && typeof data.brands === "object") {
      for (const [companyId, value] of Object.entries(data.brands)) {
        const color = normalizeHex(value);
        if (color)
          Object.defineProperty(brands, companyId, {
            value: color,
            enumerable: true,
            configurable: true,
            writable: true,
          });
      }
    }
    return {
      mode: ["light", "dark", "system"].includes(data?.mode)
        ? data.mode
        : "system",
      brands,
      persisted: true,
    };
  } catch {
    return { mode: "system", brands: {}, persisted: true };
  }
}

let preferences = readPreferences();
const listeners = new Set<() => void>();
export const getAppearancePreferences = () => preferences;
export function subscribeAppearance(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function savePreferences(next: AppearancePreferences) {
  try {
    localStorage.setItem(
      APPEARANCE_STORAGE_KEY,
      JSON.stringify({ mode: next.mode, brands: next.brands }),
    );
    preferences = { ...next, persisted: true };
  } catch {
    preferences = { ...next, persisted: false };
  }
  listeners.forEach((listener) => listener());
}

export function setThemeMode(mode: ThemeMode) {
  if (preferences.mode === mode) return;
  savePreferences({ ...preferences, mode });
}

export function setCompanyBrand(companyId: string, value: string) {
  const color = normalizeHex(value);
  if (!companyId || !color || preferences.brands[companyId] === color) return;
  savePreferences({
    ...preferences,
    brands: { ...preferences.brands, [companyId]: color },
  });
}

export function resetCompanyBrand(companyId: string) {
  if (!Object.prototype.hasOwnProperty.call(preferences.brands, companyId))
    return;
  const brands = { ...preferences.brands };
  delete brands[companyId];
  savePreferences({ ...preferences, brands });
}

export function getCompanyBrand(companyId?: string) {
  return (
    (companyId &&
    Object.prototype.hasOwnProperty.call(preferences.brands, companyId)
      ? preferences.brands[companyId]
      : undefined) ?? DEFAULT_BRAND_COLOR
  );
}

window.addEventListener("storage", (event) => {
  if (
    event.storageArea === localStorage &&
    (event.key === APPEARANCE_STORAGE_KEY || event.key === null)
  ) {
    preferences = readPreferences();
    listeners.forEach((listener) => listener());
  }
});

export function applyAppearance(brand: string, mode: ResolvedTheme) {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
  for (const [key, value] of Object.entries(buildAppearance(brand, mode)))
    root.style.setProperty(key, value);
}

export function initializeAppearance() {
  const mode =
    preferences.mode === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preferences.mode;
  let companyId: string | undefined;
  try {
    companyId = JSON.parse(localStorage.getItem("dbc-auth") ?? "{}").user
      ?.companyId;
  } catch {}
  applyAppearance(getCompanyBrand(companyId), mode);
}

export type {
  AppearanceStyle,
  AppearanceTokens,
  ResolvedTheme,
  ThemeMode,
} from "../types/appearance";
