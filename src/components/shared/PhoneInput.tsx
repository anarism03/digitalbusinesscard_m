import { Input } from "antd";
import { styles } from "../../styles/shared/PhoneInput.styles";
import type { PhoneInputProps } from "../../types/components/shared";
import { normalizePhone } from "../../utils/url";
import { PHONE_MAX } from "../../validators/phone";

export default function PhoneInput({
  value = "",
  onChange,
  status,
}: PhoneInputProps) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(normalizePhone(event.target.value))}
      placeholder="+9941234567890"
      status={status}
      inputMode="tel"
      type="tel"
      maxLength={PHONE_MAX}
      style={styles.phoneInput}
    />
  );
}
