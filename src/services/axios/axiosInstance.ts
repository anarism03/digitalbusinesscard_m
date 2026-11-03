import axios, { type AxiosResponse } from "axios";
import { API_BASE_URL } from "../../constants/apiUrl.js";
import { isOldPasswordError } from "../../utils/apiError.js";
import { decodeJwt } from "../../utils/jwt.js";
import { isTrustedAssetUrl } from "../../utils/url.js";
import { getStore } from "./storeAccessor.js";

export { API_BASE_URL };

export function unwrapResponseData(response: AxiosResponse) {
  return response.data as unknown as AxiosResponse;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
});

apiClient.interceptors.request.use((config) => {
  if (config.url?.toLowerCase() === "/auth/login") return config;
  const store = getStore();
  const token = store?.getState().auth.token;
  if (token && !decodeJwt(token)) {
    store?.dispatch({ type: "auth/logout" });
    throw new axios.CanceledError("Giriş müddəti bitib");
  }
  if (token && isTrustedAssetUrl(apiClient.getUri(config))) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(unwrapResponseData, (error) => {
  const store = getStore();
  const token = store?.getState().auth.token;
  const passwordError =
    error.config?.url?.toLowerCase() === "/auth/change-password" &&
    isOldPasswordError(error);
  if (
    store &&
    token &&
    !passwordError &&
    error.response?.status === 401 &&
    error.config?.headers?.Authorization === `Bearer ${token}`
  ) {
    store.dispatch({ type: "auth/logout" });
  }
  return Promise.reject(error);
});
