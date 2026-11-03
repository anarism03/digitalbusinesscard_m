import type { ReactNode } from "react";
import type { LinkFieldKind } from "./";

export interface CoreLinkMeta {
  label: string;
  icon: ReactNode;
  iconSrc?: string;
  fieldKind: Exclude<LinkFieldKind, "email">;
  placeholder: string;
  urlPrefix?: string;
  buildHref: (value: string) => string;
}
