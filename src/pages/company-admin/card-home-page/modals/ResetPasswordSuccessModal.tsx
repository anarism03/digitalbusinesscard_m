import { CopyOutlined, LockOutlined } from "@ant-design/icons";
import { Alert, Button, Input, Modal, Space } from "antd";
import { useFrameContainer } from "../../../../components/layout/FrameContainerContext";
import SwipeDownHandle from "../../../../components/shared/SwipeDownHandle";
import { styles } from "../../../../styles/company-admin/ResetPasswordSuccessModal.styles";
import type { ResetPasswordSuccessModalProps } from "../../../../types/pages/cardEditor";
import { copyToClipboard } from "../../../../utils/feedback";

export default function ResetPasswordSuccessModal({
  password,
  onClose,
}: ResetPasswordSuccessModalProps) {
  const getContainer = useFrameContainer();

  return (
    <Modal
      open={Boolean(password)}
      onCancel={onClose}
      maskClosable
      onOk={onClose}
      okText="Bağla"
      cancelButtonProps={{ style: styles.hiddenCancel }}
      title={
        <SwipeDownHandle
          onClose={onClose}
          open={Boolean(password)}
          enabled={Boolean(getContainer)}
        >
          <span style={styles.title}>
            <LockOutlined style={styles.titleIcon} />
            Şifrə sıfırlandı
          </span>
        </SwipeDownHandle>
      }
      centered
      destroyOnHidden
      getContainer={getContainer}
    >
      <Alert
        type="success"
        showIcon
        message="Şifrə uğurla yeniləndi. Yeni şifrə:"
        style={styles.successAlert}
      />
      <Space.Compact style={styles.passwordInput}>
        <Input.Password
          value={password ?? ""}
          readOnly
          aria-label="Yeni şifrə"
        />
        <Button
          type="default"
          icon={<CopyOutlined />}
          onClick={() => copyToClipboard(password ?? "")}
          aria-label="Şifrəni kopyala"
        />
      </Space.Compact>
    </Modal>
  );
}
