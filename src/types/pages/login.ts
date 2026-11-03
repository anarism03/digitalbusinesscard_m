import type { CSSProperties, ReactNode } from "react";
export interface FieldInputProps {
  label: string;
  icon: ReactNode;
  error?: string;
  children: (inputStyle: CSSProperties) => ReactNode;
}
