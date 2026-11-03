export interface LogoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

export interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export interface FirstLoginPasswordModalProps {
  open: boolean;
  reason?: "first-login" | "expired";
}

export interface PasswordExpiryWarningModalProps {
  open: boolean;
  daysLeft: number;
  onClose: () => void;
  onChangePassword: () => void;
}
