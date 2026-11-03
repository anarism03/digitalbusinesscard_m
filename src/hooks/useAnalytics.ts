import { analyticsService } from "../services/analytics.service";
import type { AnalyticsQueryParams } from "../types";
import { mapChart, mapRanking } from "../utils/mappers";
import { toNumber } from "../utils/normalize";
import { useApiQuery } from "./useApi";
import {
  ANALYTICS_COUNT_QUERY_KEY,
  ANALYTICS_CHART_QUERY_KEY,
  ANALYTICS_RANKING_QUERY_KEY,
  QUERY_FRESH_TIME,
} from "../constants/api";

export function useScansCount(params?: AnalyticsQueryParams, enabled = true) {
  return useApiQuery(
    ANALYTICS_COUNT_QUERY_KEY,
    (signal) => analyticsService.getScansCount(params, signal).then(toNumber),
    { deps: [params], enabled, staleTime: QUERY_FRESH_TIME },
  );
}

export function useScansChart(params?: AnalyticsQueryParams, enabled = true) {
  return useApiQuery(
    ANALYTICS_CHART_QUERY_KEY,
    (signal) => analyticsService.getScansChart(params, signal).then(mapChart),
    { deps: [params], enabled, staleTime: QUERY_FRESH_TIME },
  );
}

export function useEmployeesRanking(
  params?: AnalyticsQueryParams,
  enabled = true,
) {
  return useApiQuery(
    ANALYTICS_RANKING_QUERY_KEY,
    (signal) =>
      analyticsService.getEmployeesRanking(params, signal).then(mapRanking),
    { deps: [params], enabled, staleTime: QUERY_FRESH_TIME },
  );
}
