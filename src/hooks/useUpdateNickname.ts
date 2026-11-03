import { EMPLOYEES_QUERY_KEY } from "../constants/api";
import { profileLinksService } from "../services/profileLinks.service";
import { message } from "../utils/feedback";
import { useApiMutation } from "./useApi";

export function useUpdateNickname() {
  return useApiMutation(profileLinksService.updateNickname, {
    invalidates: [EMPLOYEES_QUERY_KEY],
    onSuccess: () => message.success("Vizitkart linki yeniləndi"),
  });
}
