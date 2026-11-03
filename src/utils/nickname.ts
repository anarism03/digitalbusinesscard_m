import type { Employee, User } from "../types";
import type { ApiErrorShape } from "../types/api";
import { getApiErrorMessage } from "./apiError";
import { asRecord } from "./normalize";

export function canManageProfileLink(
  user: Pick<User, "id" | "role" | "companyId"> | null,
  employee: Pick<Employee, "id" | "companyId">,
): boolean {
  if (!user?.id || !employee.id) return false;
  return (
    user.id === employee.id ||
    Boolean(
      user.role === "COMPANY_ADMIN" &&
      user.companyId &&
      user.companyId === employee.companyId,
    )
  );
}

export function getNicknameErrorMessage(error: unknown): string {
  const err = error as ApiErrorShape;
  const code = asRecord(err?.response?.data).code;
  if (err?.response?.status === 409 || code === "NICKNAME_TAKEN")
    return "Bu istifadəçi adı artıq istifadə olunur.";
  if (code === "INVALID_NICKNAME")
    return "İstifadəçi adının formatı düzgün deyil.";
  if ([404, 405, 501].includes(err?.response?.status ?? 0))
    return "Vizitkart linkinin dəyişdirilməsi hazırda əlçatan deyil.";
  if (err?.message === "NICKNAME_NOT_SAVED")
    return "Linkin saxlanması təsdiqlənmədi. Yenidən cəhd edin.";
  return getApiErrorMessage(error);
}
