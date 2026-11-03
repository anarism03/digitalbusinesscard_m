import { Form, InputNumber, Modal } from "antd";
import { useEffect, useState } from "react";
import { styles } from "../../../../styles/super-admin/CompanyLimitModal.styles";
import type { CompanyLimitModalProps } from "../../../../types/pages/superAdmin";
import { isAllowedNumberKey } from "../../../../utils/text";

const LIMIT_MAX = 100;

export default function CompanyLimitModal({
  open,
  company,
  value,
  loading = false,
  onChange,
  onConfirm,
  onCancel,
}: CompanyLimitModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const isInvalid = value < 1 || value > LIMIT_MAX;

  useEffect(() => {
    if (open) setSubmitted(false);
  }, [open, value]);

  const handleConfirm = () => {
    setSubmitted(true);
    if (isInvalid) return;
    onConfirm();
  };

  return (
    <Modal
      open={open}
      title={`${company?.name} - İstifadəçi limiti`}
      onOk={handleConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      centered
    >
      <Form layout="vertical" style={styles.form}>
        <Form.Item
          label="Yeni limit"
          validateStatus={submitted && isInvalid ? "error" : undefined}
        >
          <InputNumber
            value={value}
            onChange={(nextValue) => onChange(nextValue ?? 0)}
            min={1}
            precision={0}
            inputMode="numeric"
            onKeyDown={(event) => {
              if (!isAllowedNumberKey(event.key)) event.preventDefault();
            }}
            style={styles.input}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
