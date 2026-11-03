import { fetchAssetBlob } from "./asset";
import { compressImageToDataUrl } from "./file";
import { isImageDataUrl, resolveAssetUrlCandidates } from "./url";

export const COMPANY_LOGO_UPLOAD_OPTIONS = {
  maxSizePx: 640,
  quality: 0.9,
  preserveTransparency: true,
};

export async function resolveCompanyLogoDataUrl(
  rawUrl: string,
): Promise<string | undefined> {
  if (isImageDataUrl(rawUrl)) return rawUrl;

  const candidates = resolveAssetUrlCandidates(rawUrl).flatMap((url) => {
    const relativeUrl = url.match(/^https?:\/\/[^/]+(\/.+)$/i)?.[1];
    return relativeUrl ? [relativeUrl, url] : [url];
  });

  for (const url of candidates) {
    const blob = await fetchAssetBlob(url);
    if (!blob) continue;
    try {
      return await compressImageToDataUrl(
        new File([blob], "company-logo", { type: blob.type }),
        COMPANY_LOGO_UPLOAD_OPTIONS.maxSizePx,
        COMPANY_LOGO_UPLOAD_OPTIONS.quality,
        true,
      );
    } catch {}
  }
  return undefined;
}
