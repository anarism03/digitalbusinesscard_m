import dayjs from "dayjs";

export function getDateRange(from?: string | null, to?: string | null) {
  const isValidDate = (value?: string | null): value is string =>
    Boolean(
      value &&
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      dayjs(value).isValid() &&
      dayjs(value).format("YYYY-MM-DD") === value,
    );
  if (!isValidDate(from) || !isValidDate(to) || from > to) return null;
  return {
    startDate: dayjs(from).startOf("day").toISOString(),
    endDate: dayjs(to).endOf("day").toISOString(),
  };
}

function formatIso(iso: string, template: string): string {
  const date = dayjs(iso);
  return date.isValid() ? date.format(template) : iso;
}

export function formatDateTime(iso: string): string {
  return formatIso(iso, "DD.MM.YYYY HH:mm");
}

export function formatDateShort(iso: string): string {
  return formatIso(iso, "DD MMM");
}
