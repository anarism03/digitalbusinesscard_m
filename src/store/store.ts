import { configureStore } from "@reduxjs/toolkit";
import { injectStore } from "../services/axios/storeAccessor";
import authReducer, {
  AUTH_STORAGE_KEY,
  logout,
  readStoredAuth,
  setCredentials,
} from "./authSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

injectStore(store);

let previousAuth = store.getState().auth;
store.subscribe(() => {
  const auth = store.getState().auth;
  if (auth === previousAuth) return;
  const previousToken = previousAuth.token;
  const tokenChanged = auth.token !== previousAuth.token;
  previousAuth = auth;
  try {
    const storedToken = JSON.parse(
      localStorage.getItem(AUTH_STORAGE_KEY) || "null",
    )?.token;
    if (
      (auth.token && !tokenChanged && storedToken !== auth.token) ||
      (!auth.token && storedToken && storedToken !== previousToken)
    ) {
      syncStoredAuth();
      return;
    }
    if (auth.token)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {}
});

function syncStoredAuth() {
  const { user, token } = readStoredAuth();
  if (user && token) store.dispatch(setCredentials({ user, token }));
  else store.dispatch(logout());
}

window.addEventListener("storage", (event) => {
  if (
    event.storageArea !== localStorage ||
    (event.key !== AUTH_STORAGE_KEY && event.key !== null)
  )
    return;
  syncStoredAuth();
});
