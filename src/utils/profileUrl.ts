import { nicknameSchema } from "../validators/nickname";

export function buildProfileUrl(id: string, nickname?: string | null): string {
  if (!id) return "";
  const parsed = nicknameSchema.safeParse(nickname ?? "");
  const identifier = parsed.success && parsed.data ? parsed.data : id;
  return `${window.location.origin}/v/${encodeURIComponent(identifier)}`;
}
