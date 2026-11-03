import type { AvatarProps } from "antd";
import type { Dayjs } from "dayjs";
import type { CSSProperties, MutableRefObject, ReactNode } from "react";
import type { Employee } from "..";

export interface SetClappLogoProps {
  height?: number;
  variant?: "color" | "white";
}

export interface BrandIconProps {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}

export interface SwipeDownHandleDragVisual {
  panel: HTMLElement;
  translate: string;
  transition: string;
  willChange: string;
}

export interface SwipeDownHandleProps {
  children?: ReactNode;
  onClose: () => void;
  titleStyle?: CSSProperties;
  enabled?: boolean;
  open?: boolean;
}

export type ShareProfileSheetQrFormat = "png" | "svg";

export interface ShareProfileSheetProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
  employeeName?: string;
  rootClassName?: string;
}

export interface ConfirmActionModalProps {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  danger?: boolean;
  cancelButtonClassName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface AssetAvatarProps extends Omit<
  AvatarProps,
  "src" | "icon" | "children"
> {
  src?: string | null;
  name?: string;
  icon?: ReactNode;
  children?: ReactNode;
  imageStyle?: CSSProperties;
}

export interface CompanyLogoProps {
  src?: string | null;
  name?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  variant?: "tile" | "plain";
}

export interface PageHeaderProps {
  title: string;
  extra?: ReactNode;
  back?: boolean;
}

export interface EmptyStateProps {
  description?: string;
}

export interface ErrorStateProps {
  onRetry: () => void;
}

export interface InfiniteScrollTriggerProps {
  sentinelRef: MutableRefObject<HTMLDivElement | null>;
  isLoadingMore: boolean;
  hasMore: boolean;
}

export interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  status?: "" | "error";
}

export interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  resetKey: string;
  style?: CSSProperties;
}

export interface ImagePreviewModalProps {
  open: boolean;
  src?: string | null;
  title?: string;
  onClose: () => void;
}

export type RangeCalendarPickerDraftRange = [Dayjs | null, Dayjs | null] | null;

export interface RangeCalendarPickerProps {
  from: string | null;
  to: string | null;
  onChange: (from: string | null, to: string | null) => void;
  className: string;
  style: CSSProperties;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export interface BurgerIconProps {
  open: boolean;
  color?: string;
}

export interface CountUpProps {
  value: number;
}
