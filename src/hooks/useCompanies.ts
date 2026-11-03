import { strings } from "../constants/strings";
import { companiesService } from "../services/companies.service";
import type { CreateCompanyDto, UpdateCompanyDto } from "../types";
import { showApiError } from "../utils/apiError";
import { message } from "../utils/feedback";
import {
  mapCompany,
  mapCompanyPage,
  mapCreatedCompany,
  mapSuperAdminDashboard,
} from "../utils/mappers";
import { fetchAllPages } from "../utils/pagination";
import { useApiMutation, useApiQuery } from "./useApi";
import { EMPLOYEES_QUERY_KEY } from "./useEmployees";

import {
  COMPANIES_QUERY_KEY,
  MY_COMPANY_QUERY_KEY,
  SUPER_ADMIN_DASHBOARD_KEY,
} from "../constants/api";

export function useSuperAdminDashboard() {
  return useApiQuery(SUPER_ADMIN_DASHBOARD_KEY, () =>
    companiesService.getDashboard().then(mapSuperAdminDashboard),
  );
}

export function useCompanies(enabled = true) {
  return useApiQuery(
    COMPANIES_QUERY_KEY,
    () =>
      fetchAllPages((page, pageSize) =>
        companiesService.getAll(page, pageSize).then(mapCompanyPage),
      ),
    { enabled },
  );
}

export function useCompany(id?: string) {
  return useApiQuery(
    COMPANIES_QUERY_KEY,
    () => companiesService.getById(id || "").then(mapCompany),
    { enabled: !!id, deps: ["detail", id] },
  );
}

export function useCreateCompany() {
  return useApiMutation(
    (data: CreateCompanyDto) =>
      companiesService.create(data).then(mapCreatedCompany),
    {
      invalidates: [COMPANIES_QUERY_KEY, SUPER_ADMIN_DASHBOARD_KEY],
      onSuccess: () => message.success(strings.companies.createSuccess),
      onError: showApiError,
    },
  );
}

export function useUpdateCompany() {
  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateCompanyDto }) =>
      companiesService.update(id, data).then(mapCompany),
    {
      invalidates: [
        COMPANIES_QUERY_KEY,
        MY_COMPANY_QUERY_KEY,
        SUPER_ADMIN_DASHBOARD_KEY,
        EMPLOYEES_QUERY_KEY,
      ],
      onSuccess: () => message.success(strings.companies.updateSuccess),
      onError: showApiError,
    },
  );
}

export function useSetCompanyActive() {
  return useApiMutation(
    ({ id, isActive }: { id: string; isActive: boolean }) =>
      companiesService.setActive(id, isActive),
    {
      invalidates: [COMPANIES_QUERY_KEY, SUPER_ADMIN_DASHBOARD_KEY],
      onSuccess: () => message.success(strings.companies.statusUpdateSuccess),
      onError: showApiError,
    },
  );
}

export function useSetCompanyLimit() {
  return useApiMutation(
    ({ id, limit }: { id: string; limit: number }) =>
      companiesService.setLimit(id, limit),
    {
      invalidates: [COMPANIES_QUERY_KEY, SUPER_ADMIN_DASHBOARD_KEY],
      onSuccess: () => message.success(strings.companies.updateSuccess),
      onError: showApiError,
    },
  );
}

export function useMyCompany(enabled = true) {
  return useApiQuery(
    MY_COMPANY_QUERY_KEY,
    () => companiesService.getMyCompany().then(mapCompany),
    { enabled },
  );
}

export function useUpdateMyCompany() {
  return useApiMutation(
    (data: UpdateCompanyDto) => companiesService.updateMyCompany(data),
    {
      invalidates: [
        MY_COMPANY_QUERY_KEY,
        COMPANIES_QUERY_KEY,
        SUPER_ADMIN_DASHBOARD_KEY,
        EMPLOYEES_QUERY_KEY,
      ],
      onSuccess: () => message.success("Şirkət məlumatları yeniləndi"),
      onError: showApiError,
    },
  );
}
