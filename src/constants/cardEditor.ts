import type { LinkFieldKind } from "../types";
import type { ContactCardFormFieldConfig } from "../types/pages/cardEditor";

export const PROFILE_FIELD_OPTIONS = {
  shouldDirty: true,
  shouldValidate: true,
};
export const DEFAULT_WEBSITE_HEADLINE = "Sayt linki";
const CONTACT_CARD_INFO_MAX = 150;
export const CONTACT_CARD_FIELD_MAX = 100;
export const QUICK_LINK_FIELD_LABELS: Record<LinkFieldKind, string> = {
  phone: "Nömrə",
  email: "E-poçt",
  username: "İstifadəçi adı",
  url: "URL",
};
export const CONTACT_CARD_FIELD_CONFIG: ContactCardFormFieldConfig[] = [
  {
    key: "jobTitle",
    placeholder: "Vəzifə",
    hint: "Kontakt kartı üçün vəzifəni daxil edin",
    maxLength: CONTACT_CARD_FIELD_MAX,
  },
  {
    key: "website",
    placeholder: "Vebsayt",
    hint: "Kontakt kartı üçün vebsaytı daxil edin",
    maxLength: CONTACT_CARD_FIELD_MAX,
  },
  {
    key: "birthday",
    placeholder: "Doğum günü",
    hint: "Kontaktda doğum günü bölməsində görünəcək",
    maxLength: 10,
    kind: "date",
  },
  {
    key: "additionalInfo",
    placeholder: "Əlavə məlumat",
    hint: "Profildə və kontaktda görünəcək",
    maxLength: CONTACT_CARD_INFO_MAX,
    kind: "textarea",
  },
];
