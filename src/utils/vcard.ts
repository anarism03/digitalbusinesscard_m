import { LABELED_PHONE_PLATFORMS } from "../constants/vcard.js";
import { fetchAssetBlob } from "./asset.js";
import type {
  Company,
  ContactCardFields,
  ContactCardVcfOverrides,
  Employee,
} from "../types/index.js";
import { buildViewLinkRows } from "./cardLinkRows.js";
import { hasContactCardFields } from "./contactCardFields.js";
import { rasterizeDataUrlToJpeg, readAsDataUrl } from "./file.js";
import { getDisabledLinkKeys } from "./linkVisibility.js";
import { digitsOnly } from "./text.js";
import { isImageDataUrl, resolveAssetUrlCandidates } from "./url.js";

function escapeVcf(value?: string): string {
  return (value ?? "")
    .trim()
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function cleanUri(value: string): string {
  return value.trim().replace(/[\r\n]/g, "");
}

function foldVcfLine(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let part = "";
  let bytes = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) {
      parts.push(part);
      part = " ";
      bytes = 1;
    }
    part += character;
    bytes += size;
  }
  parts.push(part);
  return parts.join("\r\n");
}

function photoLineFor(photoDataUrl?: string): string {
  if (!isImageDataUrl(photoDataUrl)) return "";
  if (!/^data:image\/(jpeg|png)/i.test(photoDataUrl)) return "";

  const [header, payload = ""] = photoDataUrl.split(",");
  const type = header.includes("png") ? "PNG" : "JPEG";
  return payload ? `PHOTO;ENCODING=b;TYPE=${type}:${payload}` : "";
}

export async function resolveVcfPhotoDataUrl(
  rawPhotoUrl?: string,
): Promise<string | undefined> {
  if (isImageDataUrl(rawPhotoUrl)) return rasterizeDataUrlToJpeg(rawPhotoUrl);

  const candidates = resolveAssetUrlCandidates(rawPhotoUrl).flatMap((url) => {
    const variant = url.match(/^https?:\/\/[^/]+(\/.+)$/i)?.[1];
    return variant ? [variant, url] : [url];
  });

  for (const url of candidates) {
    const blob = await fetchAssetBlob(url);
    if (!blob) continue;
    const photo = await rasterizeDataUrlToJpeg(await readAsDataUrl(blob));
    if (photo) return photo;
  }
  return undefined;
}

export function overridesFromContactCard(
  fields: ContactCardFields,
  enabled: boolean,
): ContactCardVcfOverrides | undefined {
  if (!hasContactCardFields(fields) || !enabled) return undefined;
  return {
    name: fields.name,
    website: fields.website,
  };
}

export function buildVcfText(
  employee: Employee,
  overrides?: ContactCardVcfOverrides,
  photoDataUrl?: string,
): string {
  const fullName = overrides?.name?.trim() || employee.fullName;
  const email = employee.email;
  const website = overrides?.website?.trim();
  const address = employee.address?.trim();
  const birthday = employee.birthday?.trim().slice(0, 10);
  const workPhone = employee.phone1;
  const mobilePhone = employee.phone2;
  const notes = employee.additionalInfo;

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    overrides?.name
      ? `N:${escapeVcf(overrides.name)};;;;`
      : `N:${escapeVcf(employee.lastName)};${escapeVcf(employee.firstName)};;;`,
    `FN:${escapeVcf(fullName)}`,
  ];
  if (employee.companyName)
    lines.push(`ORG:${escapeVcf(employee.companyName)}`);
  if (employee.jobTitle) {
    lines.push(`TITLE:${escapeVcf(employee.jobTitle)}`);
    lines.push(`ROLE:${escapeVcf(employee.jobTitle)}`);
  }
  if (birthday && /^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
    lines.push(`BDAY:${birthday}`);
  }

  let itemIndex = 0;
  const seen = new Set<string>();
  const pushField = (property: string, key: string, label?: string) => {
    if (seen.has(key)) return;
    seen.add(key);
    if (!label) lines.push(property);
    else {
      itemIndex += 1;
      lines.push(
        `item${itemIndex}.${property}`,
        `item${itemIndex}.X-ABLabel:${escapeVcf(label)}`,
      );
    }
  };

  const pushTel = (value: string, types: string, label?: string) => {
    const digits = digitsOnly(value).slice(-9);
    if (digits)
      pushField(
        `TEL;TYPE=${types}:${escapeVcf(value)}`,
        `tel:${label ?? ""}:${digits}`,
        label,
      );
  };

  const pushEmail = (value: string, label?: string) => {
    const key = value.trim().toLowerCase();
    if (key)
      pushField(
        `EMAIL;TYPE=INTERNET:${escapeVcf(value)}`,
        `email:${key}`,
        label,
      );
  };

  const pushUrl = (href: string, label?: string) => {
    const value = cleanUri(href);
    const key = value.toLowerCase().replace(/\/+$/, "");
    if (key) pushField(`URL:${value}`, `url:${key}`, label);
  };

  const rows = buildViewLinkRows(employee);
  const disabledKeys = getDisabledLinkKeys(employee.contactInfos);

  if (workPhone && !disabledKeys.has("core:phone1"))
    pushTel(workPhone, "WORK,VOICE");
  if (mobilePhone && !disabledKeys.has("core:phone2"))
    pushTel(mobilePhone, "CELL,VOICE");
  if (email && !disabledKeys.has("core:email")) pushEmail(email);
  if (address) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVcf(address)};;;;`);
    lines.push(`LABEL;TYPE=WORK:${escapeVcf(address)}`);
  }
  if (website) pushUrl(website, "Vebsayt");

  for (const row of rows) {
    if (
      row.id === "core:phone1" ||
      row.id === "core:phone2" ||
      row.id === "core:email"
    )
      continue;
    const platform = row.platform ?? "";
    if (platform === "contact-card" || platform === "googlemaps") continue;

    if (platform === "phone") {
      pushTel(row.value, "VOICE", row.label);
      continue;
    }
    if (LABELED_PHONE_PLATFORMS.has(platform)) {
      pushTel(row.value, "CELL,VOICE", row.label);
      continue;
    }
    if (platform === "email") {
      pushEmail(row.value, row.label);
      continue;
    }

    if (!/^https?:\/\//i.test(row.href)) continue;
    pushUrl(row.href, row.label);
  }

  if (notes) lines.push(`NOTE:${escapeVcf(notes)}`);
  const photoLine = photoLineFor(photoDataUrl);
  if (photoLine) lines.push(photoLine);
  lines.push("END:VCARD");
  return lines.map(foldVcfLine).join("\r\n");
}

export function buildCompanyVcfText(
  company: Pick<Company, "name" | "address" | "email" | "phone" | "voen">,
): string {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:;;;;",
    `FN:${escapeVcf(company.name)}`,
    `ORG:${escapeVcf(company.name)}`,
    company.phone && `TEL;TYPE=WORK,VOICE:${escapeVcf(company.phone)}`,
    company.email && `EMAIL;TYPE=INTERNET:${escapeVcf(company.email)}`,
    company.address && `ADR;TYPE=WORK:;;${escapeVcf(company.address)};;;;`,
    company.address && `LABEL;TYPE=WORK:${escapeVcf(company.address)}`,
    company.voen && `NOTE:VÖEN: ${escapeVcf(company.voen)}`,
    "END:VCARD",
  ]
    .filter((line): line is string => Boolean(line))
    .map(foldVcfLine)
    .join("\r\n");
}
