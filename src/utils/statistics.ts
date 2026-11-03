import dayjs from "dayjs";
import { PERIOD_OFFSETS, PERIOD_PRESETS } from "../constants/analytics";
import { QUERY_FRESH_TIME } from "../constants/api";
import type { PeriodPreset, ScanChartPoint } from "../types";
import type { CachedPresetRange, PresetRange } from "../types/analytics";

const presetRanges = new Map<PeriodPreset, CachedPresetRange>();

const changeFormatter = new Intl.NumberFormat("az-AZ", {
  maximumFractionDigits: 1,
});

export function readPeriodPreset(value: string | null): PeriodPreset {
  return PERIOD_PRESETS.includes(value as PeriodPreset)
    ? (value as PeriodPreset)
    : "month";
}

export function getPresetRange(preset: PeriodPreset): PresetRange {
  const createdAt = Date.now();
  const cached = presetRanges.get(preset);
  const end = dayjs();
  if (
    cached &&
    createdAt >= cached.createdAt &&
    createdAt - cached.createdAt < QUERY_FRESH_TIME &&
    dayjs(cached.range.endDate).isSame(end, "day")
  )
    return cached.range;
  const start =
    preset === "day"
      ? end.startOf("day")
      : end.subtract(
          PERIOD_OFFSETS[preset].amount,
          PERIOD_OFFSETS[preset].unit,
        );
  const range = {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
  presetRanges.set(preset, { createdAt, range });
  return range;
}

export function getPreviousRange(
  startDate: string,
  endDate: string,
  preset: PeriodPreset,
) {
  if (preset === "day")
    return {
      startDate: dayjs(startDate).subtract(1, "day").toISOString(),
      endDate: dayjs(endDate).subtract(1, "day").toISOString(),
    };
  const duration = dayjs(endDate).valueOf() - dayjs(startDate).valueOf();
  const previousEnd = dayjs(startDate).subtract(1, "millisecond");
  return {
    startDate: previousEnd.subtract(duration, "millisecond").toISOString(),
    endDate: previousEnd.toISOString(),
  };
}

export function getHeaderRangeLabel(
  preset: PeriodPreset,
  startDate: string,
  endDate: string,
): string {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  if (preset === "day") return end.format("D MMM");
  if (preset === "year")
    return `${start.format("MMM YYYY")} – ${end.format("MMM YYYY")}`;
  if (start.isSame(end, "day")) return end.format("D MMM");
  const format = start.isSame(end, "year") ? "D MMM" : "D MMM YYYY";
  return `${start.format(format)} – ${end.format(format)}`;
}

export function aggregateByMonth(points: ScanChartPoint[]): ScanChartPoint[] {
  const months = new Map<string, number>();
  for (const point of points) {
    const month = dayjs(point.date).format("YYYY-MM");
    months.set(month, (months.get(month) ?? 0) + point.count);
  }
  return [...months]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([date, count]) => ({ date, count }));
}

export function getScanChangeLabel(total?: number, previous?: number): string {
  if (total === undefined || previous === undefined) return "—";
  if (previous === 0) return total === 0 ? "0%" : `+${total} skan`;
  const difference = total - previous;
  return `${difference > 0 ? "+" : ""}${changeFormatter.format((difference / previous) * 100)}%`;
}
