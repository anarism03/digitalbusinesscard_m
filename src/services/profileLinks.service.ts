import type { NicknameResult, UpdateNicknameInput } from "../types/profileLink";
import { asRecord, unwrapResponse } from "../utils/normalize";
import { nicknameSchema } from "../validators/nickname";
import { apiClient } from "./axios/axiosInstance";

export const profileLinksService = {
  async updateNickname({
    id,
    nickname,
    isOwnCard,
  }: UpdateNicknameInput): Promise<NicknameResult> {
    if (!id) throw new Error("NICKNAME_NOT_SAVED");
    const normalized = nicknameSchema.parse(nickname) || null;
    const path = isOwnCard
      ? "/User/profile/nickname"
      : `/CompanyAdmin/users/${encodeURIComponent(id)}/nickname`;
    const raw = await apiClient.put(path, { nickname: normalized });
    const result = asRecord(unwrapResponse(raw));
    if (result.id !== id || result.nickname !== normalized)
      throw new Error("NICKNAME_NOT_SAVED");
    return { id, nickname: normalized };
  },
};
