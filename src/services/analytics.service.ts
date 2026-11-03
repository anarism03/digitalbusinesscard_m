import type { AnalyticsQueryParams, ScanLogParams } from "../types";
import { ANALYTICS_TIMEOUT_MS } from "../constants/analytics";
import { apiClient } from "./axios/axiosInstance";

export const analyticsService = {
  getScansCount: (params?: AnalyticsQueryParams, signal?: AbortSignal) =>
    apiClient.get("/Analytics/scans/count", { params, signal }),

  getScansChart: (params?: AnalyticsQueryParams, signal?: AbortSignal) =>
    apiClient.get("/Analytics/scans/chart", {
      params,
      signal,
      timeout: ANALYTICS_TIMEOUT_MS,
    }),

  getEmployeesRanking: (params?: AnalyticsQueryParams, signal?: AbortSignal) =>
    apiClient.get("/Analytics/employees/ranking", {
      params,
      signal,
      timeout: ANALYTICS_TIMEOUT_MS,
    }),

  getScanLogs: (params?: ScanLogParams, signal?: AbortSignal) =>
    apiClient.get("/Analytics/scans/logs", {
      params,
      signal,
      timeout: ANALYTICS_TIMEOUT_MS,
    }),
};
