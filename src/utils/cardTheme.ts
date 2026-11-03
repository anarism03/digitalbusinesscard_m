import type { AppearanceStyle, ResolvedTheme } from "./appearance";
import { buildAppearance, getCompanyBrand } from "./appearance";

export function getCardThemeStyle(
  companyId?: string,
  mode: ResolvedTheme = "light",
): AppearanceStyle {
  return buildAppearance(getCompanyBrand(companyId), mode);
}
