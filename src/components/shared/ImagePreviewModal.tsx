import { Modal } from "antd";
import { useAssetSrc } from "../../hooks/useAssetSrc";
import {
  modalStyles,
  styles,
} from "../../styles/shared/ImagePreviewModal.styles";
import type { ImagePreviewModalProps } from "../../types/components/shared";
import { useFrameContainer } from "../layout/FrameContainerContext";
import SwipeDownHandle from "./SwipeDownHandle";

export default function ImagePreviewModal({
  open,
  src,
  title,
  onClose,
}: ImagePreviewModalProps) {
  const imageSrc = useAssetSrc(src);
  const fallbackText = title?.trim()?.[0]?.toUpperCase() ?? "?";
  const getContainer = useFrameContainer();

  return (
    <Modal
      open={open}
      title={
        title || getContainer ? (
          <SwipeDownHandle
            onClose={onClose}
            open={open}
            enabled={Boolean(getContainer)}
          >
            {title}
          </SwipeDownHandle>
        ) : undefined
      }
      footer={null}
      centered
      onCancel={onClose}
      maskClosable
      width={420}
      styles={modalStyles}
      getContainer={getContainer}
    >
      {imageSrc ? (
        <img src={imageSrc} alt={title || ""} style={styles.image} />
      ) : (
        <div style={styles.fallback}>{fallbackText}</div>
      )}
    </Modal>
  );
}
