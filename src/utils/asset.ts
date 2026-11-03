import { apiClient } from "../services/axios/axiosInstance.js";
import { isTrustedAssetUrl } from "./url.js";

export async function fetchAssetBlob(path: string): Promise<Blob | undefined> {
  const url = new URL(path, window.location.origin).href;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (response.ok) return await response.blob();
  } catch {
  } finally {
    clearTimeout(timeout);
  }

  if (!isTrustedAssetUrl(url)) return undefined;
  try {
    return await apiClient.get<Blob>(url, { responseType: "blob" });
  } catch {
    return undefined;
  }
}
