import { DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import { memo, useEffect, useRef, useState } from "react";
import MobileBottomSheet from "../../../../components/shared/MobileBottomSheet";
import {
  CONTACT_CARD_FIELD_CONFIG as FIELD_CONFIG,
  CONTACT_CARD_FIELD_MAX as FIELD_MAX,
} from "../../../../constants/cardEditor";
import { styles } from "../../../../styles/company-admin/ContactCardForm.styles";
import type { ContactCardFormValues } from "../../../../types";
import type {
  ContactCardFormFieldErrors as FieldErrors,
  FieldWithHintProps,
  ContactCardFormProps as Props,
} from "../../../../types/pages/cardEditor";
import { maxMessage } from "../../../../validators/textRules";
import SheetActions from "./SheetActions";
import { areClosedSheetsEqual } from "../../../../utils/sheetVisibility";
import { isValidUrl, normalizeUrl } from "../../../../utils/url";

const { TextArea } = Input;

function FieldWithHint({
  value,
  onChange,
  placeholder,
  hint,
  maxLength,
  kind = "text",
  error,
}: FieldWithHintProps) {
  const status = error ? "error" : undefined;

  return (
    <div style={styles.field}>
      {kind === "textarea" ? (
        <TextArea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          showCount
          status={status}
          autoSize={{ minRows: 3, maxRows: 6 }}
          style={{ ...styles.input, ...styles.textarea }}
        />
      ) : kind === "date" ? (
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={(date) => onChange(date ? date.format("YYYY-MM-DD") : "")}
          format="DD/MM/YYYY"
          placeholder={placeholder}
          status={status}
          style={{ ...styles.input, ...styles.datePicker }}
        />
      ) : (
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          showCount
          status={status}
          style={styles.input}
        />
      )}
      <span style={styles.hint} role={error ? "alert" : undefined}>
        {error || hint}
      </span>
    </div>
  );
}

function ContactCardForm({
  open,
  initial,
  firstName,
  lastName,
  middleName,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [fields, setFields] = useState<ContactCardFormValues>(initial);
  const [nameParts, setNameParts] = useState({
    firstName,
    lastName,
    middleName,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) {
      setFields(initial);
      setNameParts({ firstName, lastName, middleName });
      setErrors({});
    }
    wasOpen.current = open;
  }, [open, initial, firstName, lastName, middleName]);

  const setField = (key: keyof ContactCardFormValues) => (value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = () => {
    if (fields.website.trim() && !isValidUrl(fields.website)) {
      setErrors({ website: "Düzgün vebsayt ünvanı daxil edin" });
      return;
    }
    if (fields.jobTitle.trim().length > FIELD_MAX) {
      setErrors({ jobTitle: maxMessage("Vəzifə", FIELD_MAX) });
      return;
    }

    const nextNameParts = {
      firstName: nameParts.firstName.trim(),
      lastName: nameParts.lastName.trim(),
      middleName: nameParts.middleName.trim(),
    };
    onSave(
      {
        buttonLabel: fields.buttonLabel.trim(),
        name: Object.values(nextNameParts).filter(Boolean).join(" "),
        jobTitle: fields.jobTitle.trim(),
        website: normalizeUrl(fields.website),
        birthday: fields.birthday.trim(),
        additionalInfo: fields.additionalInfo.trim(),
      },
      nextNameParts,
    );
  };

  return (
    <MobileBottomSheet
      open={open}
      onClose={onClose}
      title="Kontakt kartını tənzimlə"
    >
      <Form layout="vertical">
        <FieldWithHint
          value={fields.buttonLabel}
          onChange={setField("buttonLabel")}
          placeholder="Düymə adı"
          hint="Düymə adını daxil edin"
          maxLength={FIELD_MAX}
          error={errors.buttonLabel}
        />
        <FieldWithHint
          value={nameParts.firstName}
          onChange={(value) =>
            setNameParts((prev) => ({ ...prev, firstName: value }))
          }
          placeholder="Ad"
          hint="Kontaktda görünəcək ad"
          maxLength={FIELD_MAX}
        />
        <FieldWithHint
          value={nameParts.lastName}
          onChange={(value) =>
            setNameParts((prev) => ({ ...prev, lastName: value }))
          }
          placeholder="Soyad"
          hint="Kontaktda görünəcək soyad"
          maxLength={FIELD_MAX}
        />
        <FieldWithHint
          value={nameParts.middleName}
          onChange={(value) =>
            setNameParts((prev) => ({ ...prev, middleName: value }))
          }
          placeholder="Ata adı (ixtiyari)"
          hint="Kontaktda görünəcək ata adı"
          maxLength={50}
        />
        {FIELD_CONFIG.map((field) => (
          <FieldWithHint
            key={field.key}
            value={fields[field.key]}
            onChange={setField(field.key)}
            placeholder={field.placeholder}
            hint={field.hint}
            maxLength={field.maxLength}
            kind={field.kind}
            error={errors[field.key]}
          />
        ))}
      </Form>

      <SheetActions
        cancelText="Ləğv et"
        onCancel={onClose}
        onDelete={onDelete}
        deleteResetKey={`${open}:${initial.buttonLabel}:${initial.name}`}
        onSave={handleSave}
      />
    </MobileBottomSheet>
  );
}

export default memo(ContactCardForm, areClosedSheetsEqual);
