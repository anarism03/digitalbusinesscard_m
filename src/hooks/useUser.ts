import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import { fetchAccountInfo } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks";
import type { ChangePasswordDto, UpdateUserProfileDto } from "../types";
import { showApiError } from "../utils/apiError";
import { message } from "../utils/feedback";
import { useApiMutation } from "./useApi";
import { EMPLOYEES_QUERY_KEY } from "./useEmployees";

export function useUpdateProfile() {
  const dispatch = useAppDispatch();

  return useApiMutation(
    (data: UpdateUserProfileDto) => userService.updateProfile(data),
    {
      invalidates: [EMPLOYEES_QUERY_KEY],
      onSuccess: () => {
        message.success("Profil yeniləndi");
        dispatch(fetchAccountInfo());
      },
      onError: showApiError,
    },
  );
}

export function useChangePassword() {
  const dispatch = useAppDispatch();
  return useApiMutation(
    (data: ChangePasswordDto) => authService.changePassword(data),
    {
      onSuccess: () => {
        message.success("Şifrə uğurla dəyişdirildi");
        dispatch(fetchAccountInfo());
      },
    },
  );
}
