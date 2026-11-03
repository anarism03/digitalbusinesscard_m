import type { User } from "./";

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface UiState {
  sidebarCollapsed: boolean;
  mobileDrawerOpen: boolean;
}
