import { strings } from "../../constants/strings";
import { logout } from "../../store/authSlice";
import { useAppDispatch } from "../../store/hooks";
import type { LogoutConfirmModalProps as Props } from "../../types/components/auth";
import ConfirmActionModal from "../shared/ConfirmActionModal";

export default function LogoutConfirmModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch();

  return (
    <ConfirmActionModal
      open={open}
      title={strings.auth.logout}
      message="Çıxış etmək istədiyinizdən əminsiniz?"
      onConfirm={() => {
        onClose();
        dispatch(logout());
      }}
      onCancel={onClose}
      danger
    />
  );
}
