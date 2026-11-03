export interface UpdateNicknameInput {
  id: string;
  nickname: string;
  isOwnCard: boolean;
}

export interface NicknameResult {
  id: string;
  nickname: string | null;
}
