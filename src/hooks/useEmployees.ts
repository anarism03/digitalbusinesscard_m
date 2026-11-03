import { strings } from "../constants/strings";
import { employeesService } from "../services/employees.service";
import type {
  CreateUserDto,
  ResetPasswordDto,
  UpdateUserProfileDto,
} from "../types";
import { showApiError } from "../utils/apiError";
import { message } from "../utils/feedback";
import { mapEmployee, mapEmployeePage } from "../utils/mappers";
import { fetchAllPages } from "../utils/pagination";
import { useApiMutation, useApiQuery } from "./useApi";

import { EMPLOYEES_QUERY_KEY, QUERY_FRESH_TIME } from "../constants/api";
export { EMPLOYEES_QUERY_KEY } from "../constants/api";

export function useEmployees(companyId: string) {
  return useApiQuery(
    EMPLOYEES_QUERY_KEY,
    () =>
      fetchAllPages((page, pageSize) =>
        employeesService
          .getByCompany(companyId, page, pageSize)
          .then(mapEmployeePage),
      ),
    { enabled: !!companyId, deps: [companyId], staleTime: QUERY_FRESH_TIME },
  );
}

export function useEmployeesPage(
  companyId: string,
  page: number,
  pageSize: number,
) {
  return useApiQuery(
    EMPLOYEES_QUERY_KEY,
    () =>
      employeesService
        .getByCompany(companyId, page, pageSize)
        .then(mapEmployeePage),
    {
      enabled: !!companyId,
      deps: [companyId, page, pageSize],
      staleTime: QUERY_FRESH_TIME,
    },
  );
}

export function useEmployee(id: string, enabled = true) {
  return useApiQuery(
    EMPLOYEES_QUERY_KEY,
    () => employeesService.getById(id).then(mapEmployee),
    {
      enabled: enabled && !!id,
      deps: ["detail", id],
      staleTime: QUERY_FRESH_TIME,
    },
  );
}

export function useCreateEmployee() {
  return useApiMutation(
    (data: CreateUserDto) => employeesService.create(data),
    {
      invalidates: [EMPLOYEES_QUERY_KEY],
      onSuccess: () => message.success(strings.employees.createSuccess),
      onError: showApiError,
    },
  );
}

export function useUpdateEmployee() {
  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateUserProfileDto }) =>
      employeesService.update(id, data),
    {
      invalidates: [EMPLOYEES_QUERY_KEY],
      onSuccess: () => message.success(strings.employees.updateSuccess),
      onError: showApiError,
    },
  );
}

export function useSetEmployeeActive() {
  return useApiMutation(
    ({ id, isActive }: { id: string; isActive: boolean }) =>
      employeesService.setActive(id, isActive),
    {
      invalidates: [EMPLOYEES_QUERY_KEY],
      onSuccess: () => message.success(strings.employees.statusUpdateSuccess),
      onError: showApiError,
    },
  );
}

export function useSetEmployeeCanEdit() {
  return useApiMutation(
    ({ id, canEdit }: { id: string; canEdit: boolean }) =>
      employeesService.setCanEdit(id, canEdit),
    {
      invalidates: [EMPLOYEES_QUERY_KEY],
      onSuccess: () => message.success(strings.employees.updateSuccess),
      onError: showApiError,
    },
  );
}

export function useResetEmployeePassword() {
  return useApiMutation(
    ({ id, data }: { id: string; data: ResetPasswordDto }) =>
      employeesService.resetPassword(id, data),
    {
      onSuccess: () => message.success("Şifrə uğurla sıfırlandı"),
      onError: showApiError,
    },
  );
}
