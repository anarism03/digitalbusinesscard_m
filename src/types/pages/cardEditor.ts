import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type {
  ContactCardFields,
  ContactCardFormValues,
  ContactInfo,
  CoreLinkKey,
  EditingRow,
  Employee,
  LinkFieldKind,
  LinkType,
  QuickLinkResult,
  SocialAccount,
  WebsiteLinkResult,
} from "..";
import type { ProfileEditValues } from "../../validators/employee";

export type QuickLinkType = Exclude<
  LinkType,
  "contact-card" | "googlemaps" | "website"
>;

export interface ProfileEditorExtras {
  address: string;
  birthday: string;
  photoUrl?: string;
  cardBackgroundUrl?: string;
  contactInfos: ContactInfo[];
  socialAccounts: SocialAccount[];
}

export interface CardHeroProps {
  name: string;
  avatarSrc?: string;
  backgroundSrc?: string;
  isCompanyLogoCover?: boolean;
  onEditAvatar?: () => void;
  onEditBackground?: () => void;
  onRemoveAvatar?: () => void;
  onRemoveBackground?: () => void;
}

export interface CardLinkRowProps {
  icon: ReactNode;
  iconSrc?: string;
  label: string;
  value?: string;
  tint: string;
  enabled: boolean;
  onClick?: () => void;
  onEnabledChange: (enabled: boolean) => void;
}

export interface CardEditLinkListProps {
  employee: Employee;
  contactInfos: ContactInfo[];
  setContactInfos: Dispatch<SetStateAction<ContactInfo[]>>;
  socialAccounts: SocialAccount[];
  contactCardFields: ContactCardFields;
  contactCardEnabled: boolean;
  fullName: string;
  additionalInfo: string;
  address: string;
  control: Control<ProfileEditValues>;
  onOpenContactCard: () => void;
  onEditCore: (key: CoreLinkKey) => void;
  onEditRow: (row: EditingRow) => void;
}

export interface SheetActionsProps {
  cancelText: string;
  onCancel: () => void;
  onDelete?: () => void;
  deleteResetKey: string;
  onSave: () => void;
  saveDisabled?: boolean;
  saveLoading?: boolean;
  divided?: boolean;
}

type ContactCardFormFieldKind = "text" | "textarea" | "date";

export type ContactCardFormFieldErrors = Partial<
  Record<keyof ContactCardFormValues, string>
>;

export type ContactCardFormNameParts = {
  firstName: string;
  lastName: string;
  middleName: string;
};

export interface ContactCardFormFieldConfig {
  key: "jobTitle" | "website" | "birthday" | "additionalInfo";
  placeholder: string;
  hint: string;
  maxLength: number;
  kind?: ContactCardFormFieldKind;
}

export interface ContactCardFormProps {
  open: boolean;
  initial: ContactCardFormValues;
  firstName: string;
  lastName: string;
  middleName: string;
  onClose: () => void;
  onSave: (
    fields: ContactCardFormValues,
    nameParts: ContactCardFormNameParts,
  ) => void;
  onDelete?: () => void;
}

export interface LinkTypePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: LinkType) => void;
}

export interface LinkFormHeaderProps {
  title: string;
  iconSrc?: string;
  iconAlt?: string;
  fallbackIcon: ReactNode;
}

export interface QuickLinkFormProps {
  open: boolean;
  title: string;
  icon: ReactNode;
  iconSrc?: string;
  placeholder: string;
  fieldKind: LinkFieldKind;
  urlPrefix?: string;
  allowMultiple?: boolean;
  initial?: QuickLinkResult;
  onBack: () => void;
  onClose: () => void;
  onSave: (results: QuickLinkResult[]) => void;
  onDelete?: () => void;
}

export interface QuickLinkFormRowErrors {
  label?: string;
  value?: string;
}

export interface WebsiteLinkFormProps {
  open: boolean;
  initial?: WebsiteLinkResult;
  onBack: () => void;
  onClose: () => void;
  onSave: (result: WebsiteLinkResult) => void;
  onDelete?: () => void;
}

export interface WebsiteLinkFormFieldErrors {
  headline?: string;
  url?: string;
}

export type CoreFieldKind = Exclude<LinkFieldKind, "email">;

export interface CoreFieldSheetProps {
  open: boolean;
  title: string;
  placeholder: string;
  fieldKind: CoreFieldKind;
  urlPrefix?: string;
  initialValue: string;
  showHeadline: boolean;
  initialHeadline: string;
  onClose: () => void;
  onSave: (value: string, headline?: string) => void;
  onDelete?: () => void;
}

export interface CardEditLinkEditorsProps {
  editingRow: EditingRow | null;
  onEditingRowChange: (row: EditingRow | null) => void;
  contactInfos: ContactInfo[];
  setContactInfos: Dispatch<SetStateAction<ContactInfo[]>>;
  socialAccounts: SocialAccount[];
  setSocialAccounts: Dispatch<SetStateAction<SocialAccount[]>>;
  editingCore: CoreLinkKey | null;
  onEditingCoreChange: (key: CoreLinkKey | null) => void;
  address: string;
  onAddressChange: (value: string) => void;
  watch: UseFormWatch<ProfileEditValues>;
  setValue: UseFormSetValue<ProfileEditValues>;
}

export interface CardEditPanelProps {
  employee: Employee;
  isOwnCard: boolean;
  onCancel: () => void;
  onSaved: () => void;
}

export interface CardPanelProps {
  employeeId: string;
  isOwnCard: boolean;
  editMode: boolean;
  onEditModeChange: (editing: boolean) => void;
  onBack?: () => void;
  hideOwnPasswordButton: boolean;
}

export interface ProfileLinkEditorProps {
  employee: Employee;
}

export interface EmployeeListCardProps {
  employee: Employee;
  isCurrentUser: boolean;
  onView: (row: Employee) => void;
  onEdit: (row: Employee) => void;
  onPreviewAvatar: (row: Employee) => void;
  onToggleActive: (row: Employee) => void;
  onResetPassword: (row: Employee) => void;
  onChangeOwnPassword: () => void;
  onShare: (row: Employee) => void;
  onShowIdentifiers: (row: Employee) => void;
  onDownloadVcf: (row: Employee) => void;
}

export interface EmployeeIdentifiersModalProps {
  employee: Employee | null;
  onClose: () => void;
}

export interface ResetPasswordModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onReset: (newPassword: string) => void;
}

export interface ResetPasswordSuccessModalProps {
  password: string | null;
  onClose: () => void;
}

export interface TeamListSectionProps {
  onSelectEmployee: (id: string, edit: boolean) => void;
}

export interface IdentifierRowProps {
  label: string;
  value: string;
}

export interface FieldWithHintProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  hint: string;
  maxLength: number;
  kind?: ContactCardFormFieldKind;
  error?: string;
}

export interface SheetActionProps {
  icon: ReactNode;
  label: ReactNode;
  onClick: () => void;
}
