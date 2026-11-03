import type { ContactCardFields } from "../types/index.js";
export const CONTACT_CARD_PREFIX = "contact-card:";

export const CONTACT_CARD_LABEL_PREFIX = "__setclapp_contact_card__:";

export const DEFAULT_CONTACT_CARD_BUTTON_LABEL = "Kontaktı Yüklə";

export const CONTACT_CARD_FIELD_KEYS: (keyof ContactCardFields)[] = [
  "buttonLabel",
  "name",
  "website",
];
