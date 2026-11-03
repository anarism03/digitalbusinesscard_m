import type { ChangeEvent } from "react";
import type {
  AuditChange,
  AuditLogEntry,
  Company,
  CompanyAdminCredentials,
} from "..";
import type { CompanyFormValues } from "../../validators/company";

export interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onToggleActive: (company: Company) => void;
  onChangeLimit: (company: Company) => void;
  toggleActiveLoading?: boolean;
}

export interface CompanyLimitModalProps {
  open: boolean;
  company: Company | null;
  value: number;
  loading?: boolean;
  onChange: (value: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface CompanyLogoFieldProps {
  label: string;
  hint: string;
  logoPreview?: string;
  onRemove: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface CompanyFormProps {
  defaultValues?: Company;
  onSubmit: (values: CompanyFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  existingVoens?: Array<string | undefined>;
  submitText?: string;
}

export interface CompanyAdminCreatedModalProps {
  credentials: CompanyAdminCredentials | null;
  onClose: () => void;
}

export interface CopyableRowProps {
  label: string;
  value: string;
}

export interface ChangeListProps {
  items: AuditChange[];
  expanded?: boolean;
  onOpen?: () => void;
}

export interface AuditLogDetailsModalProps {
  log: AuditLogEntry | null;
  onClose: () => void;
}

export interface ActionTagProps {
  value?: string;
}

export interface MedalIconProps {
  rank: number;
}

export interface MetaItemProps {
  label: string;
  value?: string;
}
