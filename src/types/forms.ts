import type { z } from "zod";
import type {
  changePasswordSchema,
  createLoginSchema,
  firstLoginPasswordSchema,
} from "../validators/auth";
import type {
  companySchema,
  companySettingsSchema,
} from "../validators/company";
import type {
  createEmployeeSchema,
  profileEditSchema,
} from "../validators/employee";

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export type FirstLoginPasswordValues = z.infer<typeof firstLoginPasswordSchema>;

export type CompanyFormValues = z.infer<typeof companySchema>;

export type CompanySettingsValues = z.infer<typeof companySettingsSchema>;

export type EmployeeFormValues = z.infer<typeof createEmployeeSchema>;

export type ProfileEditValues = z.infer<typeof profileEditSchema>;
