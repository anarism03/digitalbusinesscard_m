import type { Employee, UpdateUserProfileDto } from "../types";
import type { ProfileEditValues } from "../types/forms";
import type { ProfileEditorExtras } from "../types/pages/cardEditor";
import {
  buildContactCardEntries,
  getContactCardFields,
  hasContactCardFields,
  isContactCardEnabled,
  isContactCardField,
} from "./contactCardFields";
import { normalizePhone } from "./url";

export function parseFullNameInput(value: string) {
  const [firstName = "", lastName = "", ...middleNameParts] = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return { firstName, lastName, middleName: middleNameParts.join(" ") };
}

export function getProfileDefaults(employee: Employee): ProfileEditValues {
  return {
    firstName: employee.firstName ?? "",
    lastName: employee.lastName ?? "",
    middleName: employee.middleName ?? "",
    jobTitle: employee.jobTitle ?? "",
    phone1: normalizePhone(employee.phone1 ?? ""),
    phone2: normalizePhone(employee.phone2 ?? ""),
    whatsappPhone: normalizePhone(employee.whatsappPhone ?? ""),
    additionalInfo: employee.additionalInfo ?? "",
    linkedinUrl: employee.linkedinUrl ?? "",
    facebookUrl: employee.facebookUrl ?? "",
    instagramUrl: employee.instagramUrl ?? "",
    googleMapsUrl: employee.googleMapsUrl ?? "",
  };
}

export function buildProfileUpdate(
  values: ProfileEditValues,
  extras: ProfileEditorExtras,
): UpdateUserProfileDto {
  const {
    contactInfos,
    socialAccounts,
    address,
    birthday,
    photoUrl,
    cardBackgroundUrl,
  } = extras;
  const fields = getContactCardFields(contactInfos);
  const name = [values.firstName, values.lastName, values.middleName]
    .filter(Boolean)
    .join(" ");
  const synced = hasContactCardFields(fields)
    ? [
        ...contactInfos.filter((info) => !isContactCardField(info)),
        ...buildContactCardEntries(
          { ...fields, name },
          isContactCardEnabled(contactInfos),
        ),
      ]
    : contactInfos;
  return {
    ...values,
    phone2: values.phone2 || undefined,
    whatsappPhone: values.whatsappPhone || undefined,
    linkedinUrl: values.linkedinUrl || undefined,
    facebookUrl: values.facebookUrl || undefined,
    instagramUrl: values.instagramUrl || undefined,
    googleMapsUrl: values.googleMapsUrl || undefined,
    address: address.trim() || undefined,
    birthday: birthday || undefined,
    photoUrl: photoUrl || "",
    cardBackgroundUrl: cardBackgroundUrl || "",
    contactInfos: synced.map((info, displayOrder) => ({
      ...info,
      displayOrder,
    })),
    socialAccounts,
  };
}
