import type { UpdateUserProfileDto } from "../types";
import { apiClient } from "./axios/axiosInstance";

export const userService = {
  updateProfile: (data: UpdateUserProfileDto) =>
    apiClient.put("/User/profile", data),
};
