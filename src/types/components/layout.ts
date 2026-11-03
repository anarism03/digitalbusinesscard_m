import type { SidebarNavItem } from "..";

export type SetTopbarTitle = (title: string | undefined) => void;

export interface CompanyAdminSidebarProps {
  isCompanyAdmin: boolean;
  companyLogoUrl?: string;
  companyName: string;
  companyUsedCount?: number;
  companyUserLimit?: number;
  adminPhotoUrl?: string;
  adminName: string;
  roleLabel: string;
  navItems: SidebarNavItem[];
  navDisabled: boolean;
  onOpenOwnCard: () => void;
  onSelectCompanyContext: () => void;
  onClose: () => void;
  onLogoutClick: () => void;
}

import type { ReactNode } from "react";
export interface CompanyAdminLayoutProps {
  children: ReactNode;
}

import type { RefObject } from "react";
export interface CompanyAdminLayoutContentProps {
  children: ReactNode;
  frameRef: RefObject<HTMLDivElement>;
}

export interface NavMenuProps {
  collapsed: boolean;
}

export interface SuperAdminLayoutProps {
  children: ReactNode;
}
