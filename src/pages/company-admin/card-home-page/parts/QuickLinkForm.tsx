import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { memo, useEffect, useState } from "react";
import MobileBottomSheet from "../../../../components/shared/MobileBottomSheet";
import PhoneInput from "../../../../components/shared/PhoneInput";
import { QUICK_LINK_FIELD_LABELS as FIELD_LABELS } from "../../../../constants/cardEditor";
import { styles } from "../../../../styles/company-admin/QuickLinkForm.styles";
import type { QuickLinkResult } from "../../../../types";
import type {
  QuickLinkFormProps as Props,
  QuickLinkFormRowErrors as RowErrors,
} from "../../../../types/pages/cardEditor";
import { domainLabel } from "../../../../utils/url";
import {
  QUICK_LINK_EMAIL_MAX,
  QUICK_LINK_LABEL_MAX,
  QUICK_LINK_MAX_ROWS,
  QUICK_LINK_URL_MAX,
  QUICK_LINK_USERNAME_MAX,
  quickLinkRowsSchema,
} from "../../../../validators/quickLink";
import LinkFormHeader from "./LinkFormHeader";
import SheetActions from "./SheetActions";
import { areClosedSheetsEqual } from "../../../../utils/sheetVisibility";

const emptyRow = (title: string): QuickLinkResult => ({
  label: title,
  value: "",
});

function QuickLinkForm({
  open,
  title,
  icon,
  iconSrc,
  placeholder,
  fieldKind,
  urlPrefix,
  allowMultiple = false,
  initial,
  onBack,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [rows, setRows] = useState<QuickLinkResult[]>([emptyRow(title)]);
  const [errors, setErrors] = useState<RowErrors[]>([]);

  useEffect(() => {
    if (open) {
      setRows([initial ?? emptyRow(title)]);
      setErrors([]);
    }
  }, [open, title, initial]);

  const updateRow = (
    index: number,
    field: keyof QuickLinkResult,
    value: string,
  ) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
    setErrors((current) =>
      current.map((rowError, rowIndex) =>
        rowIndex === index ? { ...rowError, [field]: undefined } : rowError,
      ),
    );
  };

  const handleSave = () => {
    const candidates = rows.map((row) => ({
      ...row,
      label: row.label.trim() || title,
    }));
    const parsed = quickLinkRowsSchema(fieldKind).safeParse(candidates);

    if (!parsed.success) {
      const nextErrors: RowErrors[] = candidates.map(() => ({}));
      parsed.error.issues.forEach((issue) => {
        const [rowIndex, field] = issue.path;
        if (
          typeof rowIndex === "number" &&
          (field === "label" || field === "value")
        ) {
          nextErrors[rowIndex][field] = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    onSave(parsed.data);
  };

  return (
    <MobileBottomSheet open={open} onClose={onClose} title={title}>
      <LinkFormHeader title={title} iconSrc={iconSrc} fallbackIcon={icon} />

      <Form layout="vertical">
        {rows.map((row, index) => (
          <div key={index} style={styles.row}>
            <Form.Item
              label="Başlıq"
              validateStatus={errors[index]?.label ? "error" : undefined}
              help={errors[index]?.label}
            >
              <Input
                value={row.label}
                onChange={(event) =>
                  updateRow(index, "label", event.target.value)
                }
                placeholder={title}
                maxLength={QUICK_LINK_LABEL_MAX}
              />
            </Form.Item>
            <Form.Item
              label={FIELD_LABELS[fieldKind]}
              validateStatus={errors[index]?.value ? "error" : undefined}
              help={errors[index]?.value}
            >
              {fieldKind === "phone" ? (
                <PhoneInput
                  value={row.value}
                  onChange={(value) => updateRow(index, "value", value)}
                  status={errors[index]?.value ? "error" : undefined}
                />
              ) : fieldKind === "username" ? (
                <Input
                  value={row.value}
                  onChange={(event) =>
                    updateRow(index, "value", event.target.value)
                  }
                  placeholder={placeholder}
                  autoFocus={index === 0}
                  addonBefore={domainLabel(urlPrefix)}
                  maxLength={QUICK_LINK_USERNAME_MAX}
                />
              ) : (
                <Input
                  value={row.value}
                  onChange={(event) =>
                    updateRow(index, "value", event.target.value)
                  }
                  placeholder={placeholder}
                  autoFocus={index === 0}
                  inputMode={fieldKind === "email" ? "email" : "url"}
                  type={fieldKind === "email" ? "email" : "url"}
                  maxLength={
                    fieldKind === "email"
                      ? QUICK_LINK_EMAIL_MAX
                      : QUICK_LINK_URL_MAX
                  }
                />
              )}
            </Form.Item>
          </div>
        ))}
      </Form>

      {allowMultiple && !initial && (
        <div style={styles.stepControls}>
          <Button
            shape="circle"
            icon={<MinusOutlined />}
            aria-label="Sonuncu məlumatı sil"
            disabled={rows.length === 1}
            onClick={() => {
              setRows((current) => current.slice(0, -1));
              setErrors((current) => current.slice(0, -1));
            }}
          />
          <Button
            shape="circle"
            type="primary"
            icon={<PlusOutlined />}
            aria-label="Yeni məlumat əlavə et"
            disabled={rows.length >= QUICK_LINK_MAX_ROWS}
            onClick={() => {
              setRows((current) => [...current, emptyRow(title)]);
              setErrors((current) => [...current, {}]);
            }}
          />
        </div>
      )}

      <SheetActions
        cancelText="Geri"
        onCancel={onBack}
        onDelete={onDelete}
        deleteResetKey={`${open}:${initial?.value ?? ""}`}
        onSave={handleSave}
        saveDisabled={rows.some((row) => !row.value.trim())}
        divided
      />
    </MobileBottomSheet>
  );
}

export default memo(QuickLinkForm, areClosedSheetsEqual);
