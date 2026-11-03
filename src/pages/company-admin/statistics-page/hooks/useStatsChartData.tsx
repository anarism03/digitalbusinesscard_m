import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HOURLY_MAX_PAGES,
  HOURLY_PAGE_SIZE,
} from "../../../../constants/analytics";
import { analyticsService } from "../../../../services/analytics.service";
import type { PeriodPreset, ScanChartPoint } from "../../../../types";
import type { UseStatsChartDataArgs } from "../../../../types/pages/companyAdmin";
import { formatDateShort } from "../../../../utils/date";
import { mapScanLogs } from "../../../../utils/mappers";
import {
  aggregateByMonth,
  getHeaderRangeLabel,
} from "../../../../utils/statistics";

function useHourlyScanPoints(
  preset: PeriodPreset,
  companyId: string,
  startDate: string,
  endDate: string,
  employeeId: string | undefined,
) {
  const [points, setPoints] = useState<ScanChartPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const refetch = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    if (preset !== "day" || !companyId) {
      setPoints(null);
      setError(null);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    setIsLoading(true);
    setPoints(null);
    setError(null);

    const buckets = Array.from({ length: 24 }, (_, hour) => ({
      date: `${String(hour).padStart(2, "0")}:00`,
      count: 0,
    }));

    const fetchAllPages = async () => {
      let page = 1;
      let total = Infinity;
      let fetched = 0;
      while (fetched < total && page <= HOURLY_MAX_PAGES) {
        const { items, totalCount: pageTotal } = await analyticsService
          .getScanLogs(
            {
              companyId: companyId || undefined,
              startDate,
              endDate,
              employeeId,
              page,
              pageSize: HOURLY_PAGE_SIZE,
            },
            controller.signal,
          )
          .then(mapScanLogs);
        if (cancelled) return;
        total = pageTotal;
        fetched += items.length;
        items.forEach((log) => {
          const hour = dayjs(log.scannedAt).hour();
          if (buckets[hour]) buckets[hour].count += 1;
        });
        if (items.length === 0) break;
        page += 1;
      }
      if (cancelled) return;
      if (fetched < total) {
        setError(
          page > HOURLY_MAX_PAGES
            ? "Bu gün üçün skan sayı qrafikin məlumat həddini aşır"
            : "Skan qrafiki tam yüklənmədi",
        );
        setPoints([]);
      } else {
        setPoints(buckets);
      }
    };

    fetchAllPages()
      .catch(() => {
        if (!cancelled) {
          setError("Skan qrafiki yüklənmədi");
          setPoints([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [preset, companyId, startDate, endDate, employeeId, revision]);

  return { points, isLoading, error, refetch };
}

export function useStatsChartData({
  preset,
  companyId,
  startDate,
  endDate,
  employeeId,
  chartData,
  chartLoading,
  chartError,
  chartRefetch,
}: UseStatsChartDataArgs) {
  const hourly = useHourlyScanPoints(
    preset,
    companyId,
    startDate,
    endDate,
    employeeId,
  );

  const yearlyPoints = useMemo<ScanChartPoint[] | null>(() => {
    if (preset !== "year" || !chartData) return null;
    return aggregateByMonth(chartData);
  }, [preset, chartData]);

  const displayChartData =
    (preset === "day"
      ? hourly.points
      : preset === "year"
        ? yearlyPoints
        : chartData) ?? [];

  const displayChartLoading =
    preset === "day" ? hourly.isLoading : chartLoading;
  const displayChartError =
    preset === "day"
      ? hourly.error
      : chartError
        ? "Skan qrafiki yüklənmədi"
        : null;

  const tickFormatter = (date: string) => {
    if (preset === "day") return date;
    if (preset === "year") return dayjs(`${date}-01`).format("MMM YY");
    return formatDateShort(date);
  };

  const headerLabel = getHeaderRangeLabel(preset, startDate, endDate);

  return {
    displayChartData,
    displayChartLoading,
    displayChartError,
    retryChart: preset === "day" ? hourly.refetch : chartRefetch,
    tickFormatter,
    headerLabel,
  };
}

export { getPresetRange, readPeriodPreset } from "../../../../utils/statistics";
