import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { authService } from "../services/auth.service";
import type { User } from "../types";
import type { AuthState } from "../types/store";
import { decodeJwt } from "../utils/jwt";
import { hasPhotoField, pickPhotoUrl } from "../utils/mappers";
import {
  asRecord,
  buildFullName,
  pickFirstLogin,
  pickPasswordExpiryDays,
  toBoolean,
  toRole,
} from "../utils/normalize";

export const AUTH_STORAGE_KEY = "setclapp-cloud-auth-v1";

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

export function readStoredAuth(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const p = asRecord(JSON.parse(raw));
      const token = optionalString(p.token);
      const decoded = token ? decodeJwt(token) : null;
      if (decoded && asRecord(p.user).id === decoded.id && token) {
        return { user: p.user as User, token };
      }
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {}
  return { user: null, token: null };
}

export const fetchAccountInfo = createAsyncThunk(
  "auth/fetchAccountInfo",
  async (_, { getState }) => {
    const { auth } = getState() as { auth: AuthState };
    if (!auth.token || !auth.user) return null;
    return { account: await authService.getAccountInfo(), token: auth.token };
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: readStoredAuth(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccountInfo.fulfilled, (state, action) => {
      if (
        !action.payload ||
        !state.user ||
        action.payload.token !== state.token
      )
        return;
      const root = asRecord(action.payload.account);
      const raw = asRecord(root.data ?? root.user ?? root.account ?? root);
      const fullName = buildFullName(
        optionalString(raw.firstName),
        optionalString(raw.lastName),
        optionalString(raw.middleName),
        optionalString(raw.fullName) ?? "",
      );
      const rawCanEdit = raw.canEdit ?? raw.canEditProfile ?? raw.isEdit;
      state.user = {
        ...state.user,
        role: raw.role != null ? toRole(raw.role) : state.user.role,
        firstName: optionalString(raw.firstName) ?? state.user.firstName,
        lastName: optionalString(raw.lastName) ?? state.user.lastName,
        fullName: fullName || state.user.fullName,
        companyId: optionalString(raw.companyId) ?? state.user.companyId,
        photoUrl: hasPhotoField(raw) ? pickPhotoUrl(raw) : state.user.photoUrl,
        canEdit:
          rawCanEdit != null
            ? toBoolean(rawCanEdit, false)
            : state.user.canEdit,
        isFirstLogin: pickFirstLogin(raw) ?? state.user.isFirstLogin,
        daysUntilPasswordExpiry:
          pickPasswordExpiryDays(raw) ?? state.user.daysUntilPasswordExpiry,
      };
    });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
