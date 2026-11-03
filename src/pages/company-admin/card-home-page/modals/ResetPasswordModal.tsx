import { CopyOutlined, LockOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Space } from "antd";
import { useState } from "react";
import { useFrameContainer } from "../../../../components/layout/FrameContainerContext";
import SwipeDownHandle from "../../../../components/shared/SwipeDownHandle";
import { styles } from "../../../../styles/company-admin/ResetPasswordModal.styles";
import type { ResetPasswordModalProps } from "../../../../types/pages/cardEditor";
import { copyToClipboard } from "../../../../utils/feedback";
import { generateTemporaryPassword } from "../../../../utils/password";

export default function ResetPasswordModal({
  open,
  loading,
  onClose,
  onReset,
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState(generateTemporaryPassword);
  const getContainer = useFrameContainer();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      maskClosable
      title={
        <SwipeDownHandle
          onClose={onClose}
          open={open}
          enabled={Boolean(getContainer)}
        >
          <span style={styles.title}>
            <LockOutlined style={styles.titleIcon} />
            Şifrəni sıfırla
          </span>
        </SwipeDownHandle>
      }
      footer={null}
      centered
      destroyOnHidden
      getContainer={getContainer}
    >
      <Space.Compact style={styles.passwordInput}>
        <Input.Password
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          maxLength={150}
          aria-label="Yeni şifrə"
        />
        <Button
          type="default"
          icon={<ReloadOutlined />}
          onClick={() => setPassword(generateTemporaryPassword())}
          aria-label="Şifrə yarat"
        />
        <Button
          type="default"
          icon={<CopyOutlined />}
          onClick={() => copyToClipboard(password)}
          aria-label="Şifrəni kopyala"
        />
      </Space.Compact>
      <Button
        danger
        block
        loading={loading}
        disabled={password.trim().length < 6}
        onClick={() => onReset(password)}
      >
        Şifrəni sıfırla
      </Button>
    </Modal>
  );
}
