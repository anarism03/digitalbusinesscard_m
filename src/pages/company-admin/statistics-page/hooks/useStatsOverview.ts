import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { COLORS } from "../../../../constants/ui";
import {
  useEmployeesRanking,
  useScansChart,
  useScansCount,
} from "../../../../hooks/useAnalytics";
import { useEmployees } from "../../../../hooks/useEmployees";
import { useAppSelector } from "../../../../store/hooks";
import type { AnalyticsQueryParams, PeriodPreset } from "../../../../types";
import { getDateRange } from "../../../../utils/date";
import {
  getPreviousRange,
  getScanChangeLabel,
} from "../../../../utils/statistics";
import { updateSearchParams } from "../../../../utils/urlSearch";
import {
  getPresetRange,
  readPeriodPreset,
  useStatsChartData,
} from "../hooks/useStatsChartData";

export function useStatsOverview() {
  const user = useAppSelector((s) => s.auth.user);
  const [searchParams, setSearchParams] = useSearchParams();

  const preset = readPeriodPreset(searchParams.get("period"));
  const employeeId = searchParams.get("statsEmployeeId") || undefined;
  const [onlyActive, setOnlyActive] = useState(false);
  const customFrom = searchParams.get("from");
  const customTo = searchParams.get("to");

  const companyId = user?.companyId ?? "";
  const { data: employees = [] } = useEmployees(companyId);

  const setDashboardParams = (
    updates: Record<string, string | number | boolean | null | undefined>,
  ) => setSearchParams((current) => updateSearchParams(current, updates));

  const customRange = useMemo(
    () => getDateRange(customFrom, customTo),
    [customFrom, customTo],
  );
  const { startDate, endDate } = useMemo(
    () => customRange ?? getPresetRange(preset),
    [preset, customRange],
  );

  const calendarFrom = dayjs(startDate).format("YYYY-MM-DD");
  const calendarTo = dayjs(endDate).format("YYYY-MM-DD");
  const isCustomRangeActive = Boolean(customRange);
  const effectivePreset: PeriodPreset = isCustomRangeActive ? "custom" : preset;
  const previousRange = useMemo(
    () => getPreviousRange(startDate, endDate, effectivePreset),
    [startDate, endDate, effectivePreset],
  );

  const params: AnalyticsQueryParams = {
    companyId: companyId || undefined,
    startDate,
    endDate,
    employeeId,
  };
  const previousParams: AnalyticsQueryParams = {
    companyId: companyId || undefined,
    ...previousRange,
    employeeId,
  };
  const rankingParams: AnalyticsQueryParams = {
    companyId: companyId || undefined,
    startDate,
    endDate,
  };

  const {
    data: totalScans,
    isLoading: countLoading,
    isError: countError,
    refetch,
  } = useScansCount(params, !!companyId);
  const {
    data: previousScans,
    isLoading: previousLoading,
    isError: previousError,
    refetch: retryComparison,
  } = useScansCount(previousParams, !!companyId);
  const {
    data: chartData,
    isLoading: chartLoading,
    isError: chartError,
    refetch: chartRefetch,
  } = useScansChart(params, !!companyId && effectivePreset !== "day");
  const {
    data: ranking,
    isLoading: rankingLoading,
    isError: rankingError,
    refetch: retryRanking,
  } = useEmployeesRanking(rankingParams, !!companyId);

  const activeEmployeeCount = useMemo(
    () => employees.filter((e) => e.isActive).length,
    [employees],
  );
  const averageDivisor = employeeId ? 1 : employees.length;
  const averageScanCount =
    averageDivisor > 0 ? Math.round((totalScans ?? 0) / averageDivisor) : 0;
  const scanDifference = (totalScans ?? 0) - (previousScans ?? 0);
  const changeColor =
    scanDifference > 0
      ? COLORS.primary
      : scanDifference < 0
        ? COLORS.danger
        : COLORS.text;
  const changeLabel = getScanChangeLabel(totalScans, previousScans);

  const {
    displayChartData,
    displayChartLoading,
    displayChartError,
    retryChart,
    tickFormatter: chartTickFormatter,
    headerLabel: headerRangeLabel,
  } = useStatsChartData({
    preset: effectivePreset,
    companyId,
    startDate,
    endDate,
    employeeId,
    chartData,
    chartLoading,
    chartError,
    chartRefetch,
  });

  const filteredRanking = useMemo(() => {
    const employeeMap = new Map(employees.map((e) => [e.id, e]));
    const list = (ranking ?? []).map((r) => {
      const emp = employeeMap.get(r.employeeId);
      return {
        ...r,
        photoUrl: r.photoUrl || emp?.photoUrl,
        jobTitle: r.jobTitle || emp?.jobTitle,
        fullName: r.fullName || emp?.fullName || "",
      };
    });
    if (!onlyActive) return list;
    const activeIds = new Set(
      employees.filter((e) => e.isActive).map((e) => e.id),
    );
    return list.filter((r) => activeIds.has(r.employeeId));
  }, [ranking, onlyActive, employees]);
  const maxScanCount = Math.max(...filteredRanking.map((r) => r.scanCount), 1);

  return {
    preset,
    employeeId,
    onlyActive,
    setOnlyActive,
    employees,
    setDashboardParams,
    calendarFrom,
    calendarTo,
    totalScans,
    countLoading,
    countError,
    refetch,
    previousScans,
    previousLoading,
    previousError,
    retryComparison,
    rankingLoading,
    rankingError,
    retryRanking,
    activeEmployeeCount,
    averageScanCount,
    scanDifference,
    changeColor,
    changeLabel,
    displayChartData,
    displayChartLoading,
    displayChartError,
    retryChart,
    chartTickFormatter,
    headerRangeLabel,
    filteredRanking,
    maxScanCount,
  };
}
