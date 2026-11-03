import { ClockCircleOutlined, LockOutlined } from "@ant-design/icons";
import { Alert, Button, Modal } from "antd";
import type { PasswordExpiryWarningModalProps as Props } from "../../types/components/auth";
import { useFrameContainer } from "../layout/FrameContainerContext";
import SwipeDownHandle from "../shared/SwipeDownHandle";

export default function PasswordExpiryWarningModal({
  open,
  daysLeft,
  onClose,
  onChangePassword,
}: Props) {
  const getContainer = useFrameContainer();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      maskClosable
      centered
      destroyOnHidden
      getContainer={getContainer}
      title={
        <SwipeDownHandle
          onClose={onClose}
          open={open}
          enabled={Boolean(getContainer)}
        >
          <span>
            <ClockCircleOutlined
              style={{ marginRight: 8, color: "var(--color-warning)" }}
            />
            Şifrənin istifadə müddəti bitir
          </span>
        </SwipeDownHandle>
      }
      footer={[
        <Button key="close" onClick={onClose}>
          Bağla
        </Button>,
        <Button
          key="change"
          type="primary"
          icon={<LockOutlined />}
          onClick={onChangePassword}
        >
          Şifrəni yenilə
        </Button>,
      ]}
    >
      <Alert
        type="warning"
        showIcon
        message={`Şifrənizin istifadə müddəti ${daysLeft} gün sonra bitir. Zəhmət olmasa şifrənizi yeniləyin.`}
      />
    </Modal>
  );
}
