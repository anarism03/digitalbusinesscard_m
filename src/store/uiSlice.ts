import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UiState } from "../types/store";
import { logout, setCredentials } from "./authSlice";

const initialState: UiState = {
  sidebarCollapsed: false,
  mobileDrawerOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMobileDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileDrawerOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setCredentials, (state) => {
        state.mobileDrawerOpen = false;
      })
      .addCase(logout, (state) => {
        state.mobileDrawerOpen = false;
      });
  },
});

export const { setMobileDrawerOpen, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
