import { Modal, Typography } from "antd";
import { strings } from "../../constants/strings";
import type { ConfirmActionModalProps as Props } from "../../types/components/shared";
import { useFrameContainer } from "../layout/FrameContainerContext";
import SwipeDownHandle from "./SwipeDownHandle";

export default function ConfirmActionModal({
  open,
  title,
  message,
  loading = false,
  danger = false,
  cancelButtonClassName,
  onConfirm,
  onCancel,
}: Props) {
  const getContainer = useFrameContainer();
  return (
    <Modal
      open={open}
      title={
        <SwipeDownHandle
          onClose={onCancel}
          open={open}
          enabled={Boolean(getContainer)}
        >
          {title}
        </SwipeDownHandle>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      maskClosable
      confirmLoading={loading}
      okText={strings.common.yes}
      cancelText={strings.common.no}
      okButtonProps={{ danger }}
      cancelButtonProps={{
        className: ["confirm-cancel-button", cancelButtonClassName]
          .filter(Boolean)
          .join(" "),
      }}
      centered
      width={400}
      getContainer={getContainer}
    >
      <Typography.Text>{message}</Typography.Text>
    </Modal>
  );
}
