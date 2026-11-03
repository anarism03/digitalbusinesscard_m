import type { PeriodPreset } from "../types";
export const PERIOD_PRESETS: PeriodPreset[] = [
  "day",
  "week",
  "month",
  "year",
  "custom",
];

export const HOURLY_PAGE_SIZE = 500;

export const HOURLY_MAX_PAGES = 50;
export const ANALYTICS_TIMEOUT_MS = 45_000;

export const PERIOD_OFFSETS = {
  week: { amount: 7, unit: "day" },
  month: { amount: 30, unit: "day" },
  custom: { amount: 30, unit: "day" },
  year: { amount: 1, unit: "year" },
} as const;

export const PERIOD_OPTIONS = [
  { value: "day", label: "Gün" },
  { value: "week", label: "Həftə" },
  { value: "month", label: "Ay" },
  { value: "year", label: "İl" },
];
