import { CopyOutlined, IdcardOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Space } from "antd";
import { useFrameContainer } from "../../../../components/layout/FrameContainerContext";
import SwipeDownHandle from "../../../../components/shared/SwipeDownHandle";
import { strings } from "../../../../constants/strings";
import { styles } from "../../../../styles/company-admin/EmployeeIdentifiersModal.styles";
import type {
  IdentifierRowProps,
  EmployeeIdentifiersModalProps as Props,
} from "../../../../types/pages/cardEditor";
import { copyToClipboard } from "../../../../utils/feedback";
import { buildProfileUrl } from "../../../../utils/profileUrl";

const s = strings.employees;

function IdentifierRow({ label, value }: IdentifierRowProps) {
  return (
    <div style={styles.row}>
      <div style={styles.label}>{label}</div>
      <Space.Compact style={styles.inputGroup}>
        <Input value={value} readOnly aria-label={label} />
        <Button
          icon={<CopyOutlined />}
          onClick={() => copyToClipboard(value)}
          disabled={!value}
          aria-label={`${label} kopyala`}
        />
      </Space.Compact>
    </div>
  );
}

export default function EmployeeIdentifiersModal({ employee, onClose }: Props) {
  const getContainer = useFrameContainer();

  return (
    <Modal
      open={Boolean(employee)}
      onCancel={onClose}
      maskClosable
      footer={null}
      centered
      destroyOnHidden
      getContainer={getContainer}
      title={
        <SwipeDownHandle
          onClose={onClose}
          open={Boolean(employee)}
          enabled={Boolean(getContainer)}
        >
          <span style={styles.title}>
            <IdcardOutlined style={styles.titleIcon} />
            {s.identifiers}
          </span>
        </SwipeDownHandle>
      }
    >
      {employee && (
        <>
          <IdentifierRow label={s.uidLabel} value={employee.id} />
          <IdentifierRow
            label={s.cardLinkLabel}
            value={buildProfileUrl(employee.id, employee.nickname)}
          />
        </>
      )}
    </Modal>
  );
}
