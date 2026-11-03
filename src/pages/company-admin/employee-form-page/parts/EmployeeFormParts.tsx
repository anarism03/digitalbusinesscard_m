import { CopyOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { Controller } from "react-hook-form";
import type {
  EmployeeFormPartsPasswordFieldProps as PasswordFieldProps,
  EmployeeFormPartsTextFieldProps as TextFieldProps,
} from "../../../../types/pages/companyAdmin";

export function TextField({
  control,
  errors,
  name,
  label,
  placeholder,
  required,
  maxLength,
  type,
}: TextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Form.Item
          label={label}
          required={required}
          validateStatus={errors[name] ? "error" : undefined}
          help={errors[name]?.message}
        >
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            maxLength={maxLength}
            showCount
          />
        </Form.Item>
      )}
    />
  );
}

export function PasswordField({
  control,
  errors,
  onRegenerate,
  onCopy,
}: PasswordFieldProps) {
  return (
    <Controller
      name="password"
      control={control}
      render={({ field }) => (
        <Form.Item
          label="Şifrə"
          required
          validateStatus={errors.password ? "error" : undefined}
          help={errors.password?.message}
        >
          <Space.Compact style={{ width: "100%" }}>
            <Input.Password
              {...field}
              placeholder="Ən az 6 simvol"
              autoComplete="new-password"
              maxLength={150}
            />
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={onRegenerate}
              aria-label="Şifrə yarat"
            />
            <Button
              type="default"
              icon={<CopyOutlined />}
              onClick={onCopy}
              aria-label="Şifrəni kopyala"
            />
          </Space.Compact>
        </Form.Item>
      )}
    />
  );
}
