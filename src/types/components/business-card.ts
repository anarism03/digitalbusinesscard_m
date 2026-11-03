import type { ComponentType, CSSProperties, ReactNode } from "react";
import type {
  ContactCardVcfOverrides,
  Employee,
  PublicLinkProps,
  ViewLinkGroup,
} from "..";

export interface VCardDownloadButtonProps {
  employee: Employee;
  label: string;
  overrides?: ContactCardVcfOverrides;
}

export interface GroupedLinkModalProps {
  group: ViewLinkGroup | null;
  onClose: () => void;
}

export interface LinkTriggerProps extends PublicLinkProps {
  style: CSSProperties;
  labelled?: boolean;
  children: ReactNode;
}

export interface BusinessCardPublicViewProps {
  employee: Employee;
  onEdit?: () => void;
  onBack?: () => void;
  onChangePassword?: () => void;
}

export interface LinkSection {
  title: string;
  groups: ViewLinkGroup[];
  layout: CSSProperties;
  Tile: ComponentType<PublicLinkProps>;
}

import type { ViewLinkRow } from "../link";
export interface GroupIconProps {
  row: ViewLinkRow;
}

export interface LinkIconProps {
  row: ViewLinkRow;
}
