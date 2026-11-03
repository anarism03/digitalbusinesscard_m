import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form } from "antd";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "../../../../components/shared/PhoneInput";
import { strings } from "../../../../constants/strings";
import { styles } from "../../../../styles/company-admin/EmployeeForm.styles";
import type { EmployeeFormProps } from "../../../../types/pages/companyAdmin";
import { copyToClipboard } from "../../../../utils/feedback";
import { generateTemporaryPassword } from "../../../../utils/password";
import {
  createEmployeeSchema,
  type EmployeeFormValues,
} from "../../../../validators/employee";
import { PasswordField, TextField } from "./EmployeeFormParts";

const s = strings.employees.form;

export default function EmployeeForm({
  onSubmit,
  onCancel,
  isLoading,
}: EmployeeFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      jobTitle: "",
      email: "",
      phone1: "",
      password: generateTemporaryPassword(),
    },
  });

  const regeneratePassword = () => {
    setValue("password", generateTemporaryPassword(), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <Form
      layout="vertical"
      className="employee-create-form"
      onFinish={handleSubmit(onSubmit)}
    >
      <TextField
        control={control}
        errors={errors}
        name="firstName"
        label="Ad"
        placeholder="Ad"
        maxLength={50}
        required
      />
      <TextField
        control={control}
        errors={errors}
        name="lastName"
        label="Soyad"
        placeholder="Soyad"
        maxLength={50}
        required
      />
      <TextField
        control={control}
        errors={errors}
        name="middleName"
        label="Ata adı"
        placeholder="Ata adı (ixtiyari)"
        maxLength={50}
      />
      <TextField
        control={control}
        errors={errors}
        name="jobTitle"
        label={s.position}
        placeholder="Vəzifə"
        maxLength={100}
        required
      />
      <TextField
        control={control}
        errors={errors}
        name="email"
        label="E-poçt"
        placeholder="email@sirket.az"
        maxLength={50}
        type="email"
        required
      />
      <Controller
        name="phone1"
        control={control}
        render={({ field }) => (
          <Form.Item
            label="İş telefonu"
            required
            validateStatus={errors.phone1 ? "error" : undefined}
            help={errors.phone1?.message}
          >
            <PhoneInput
              value={field.value}
              onChange={field.onChange}
              status={errors.phone1 ? "error" : undefined}
            />
          </Form.Item>
        )}
      />
      <PasswordField
        control={control}
        errors={errors}
        onRegenerate={regeneratePassword}
        onCopy={() => copyToClipboard(getValues("password"))}
      />
      <Form.Item style={styles.actionsItem}>
        <div style={styles.actions}>
          <Button onClick={onCancel}>{s.cancelButton}</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Yadda saxla
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
