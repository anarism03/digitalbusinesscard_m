import type { UploadFile } from "antd";
import type { ReactNode } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import type {
  Company,
  EmployeeOption,
  ImportResult,
  PeriodPreset,
  ScanChartPoint,
} from "..";
import type { EmployeeFormValues } from "../../validators/employee";

export interface QRPreviewProps {
  value: string;
  size: number;
}

export type CompanyShareSheetQrFormat = "png" | "svg";

export interface CompanyShareSheetProps {
  open: boolean;
  onClose: () => void;
  company: Company;
}

export interface UseStatsChartDataArgs {
  preset: PeriodPreset;
  companyId: string;
  startDate: string;
  endDate: string;
  employeeId?: string;
  chartData?: ScanChartPoint[];
  chartLoading: boolean;
  chartError: boolean;
  chartRefetch: () => Promise<void>;
}

export interface StatsOverviewSectionProps {
  onSelectEmployee: (id: string) => void;
}

export interface StatsScanLogsSectionProps {
  onSelectEmployee: (id: string) => void;
}

type TextFieldName =
  "firstName" | "lastName" | "middleName" | "jobTitle" | "email";

interface EmployeeFormPartsControlProps {
  control: Control<EmployeeFormValues>;
  errors: FieldErrors<EmployeeFormValues>;
}

export interface EmployeeFormPartsTextFieldProps extends EmployeeFormPartsControlProps {
  name: TextFieldName;
  label: ReactNode;
  placeholder: string;
  required?: boolean;
  maxLength: number;
  type?: string;
}

export interface EmployeeFormPartsPasswordFieldProps extends EmployeeFormPartsControlProps {
  onRegenerate: () => void;
  onCopy: () => void;
}

export interface EmployeeFormProps {
  onSubmit: (values: EmployeeFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export interface ExcelImportCardProps {
  companyLimit?: number;
  fileList: UploadFile[];
  importLoading: boolean;
  importResult: ImportResult | null;
  limitReached: boolean;
  canImport: boolean;
  templateLoading: boolean;
  setFileList: (files: UploadFile[]) => void;
  setImportResult: (result: ImportResult | null) => void;
  onImport: () => void;
  onTemplateDownload: () => void;
}

export interface ExportCardProps {
  format: "excel" | "html";
  employeeOptions: EmployeeOption[];
  employeesLoading: boolean;
  employeesError: boolean;
  loading: boolean;
  selectedIds: string[];
  selectedLoading: boolean;
  onSelectionChange: (ids: string[]) => void;
  onAllDownload: () => void;
  onSelectedDownload: () => void;
}

export interface EmployeeLimitProgressProps {
  used: number;
  total: number;
}

export interface CompanySettingsCardProps {
  usedCount: number | null;
}
