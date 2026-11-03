import { CopyOutlined, RightOutlined, UndoOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "antd";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateNickname } from "../../../../hooks/useUpdateNickname";
import { useAppSelector } from "../../../../store/hooks";
import { styles } from "../../../../styles/company-admin/ProfileLinkEditor.styles";
import "../../../../styles/company-admin/ProfileLinkEditor.css";
import type { ProfileLinkEditorProps } from "../../../../types/pages/cardEditor";
import {
  canManageProfileLink,
  getNicknameErrorMessage,
} from "../../../../utils/nickname";
import { buildProfileUrl } from "../../../../utils/profileUrl";
import { copyToClipboard } from "../../../../utils/feedback";
import {
  NICKNAME_MAX_LENGTH,
  nicknameSchema,
} from "../../../../validators/nickname";

const schema = z.object({ nickname: nicknameSchema });

export default function ProfileLinkEditor({
  employee,
}: ProfileLinkEditorProps) {
  const user = useAppSelector((state) => state.auth.user);
  const update = useUpdateNickname();
  const inputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const detailsId = `${inputId}-details`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { nickname: employee.nickname ?? "" },
    mode: "onChange",
  });
  const nickname = watch("nickname");
  const preview = nicknameSchema.safeParse(nickname);

  if (!canManageProfileLink(user, employee)) return null;

  const save = handleSubmit(async (values) => {
    try {
      const result = await update.mutateAsync({
        id: employee.id,
        nickname: values.nickname,
        isOwnCard: user?.id === employee.id,
      });
      reset({ nickname: result.nickname ?? "" });
    } catch (error) {
      setError(
        "nickname",
        { type: "server", message: getNicknameErrorMessage(error) },
        { shouldFocus: true },
      );
    }
  });

  return (
    <form
      aria-label="Vizitkart linki"
      style={styles.panel}
      onSubmit={save}
      noValidate
    >
      <button
        type="button"
        className="profile-link-toggle"
        aria-label="Vizitkart linkini redaktə et"
        aria-expanded={isOpen}
        aria-controls={detailsId}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>
          <span style={styles.label}>Vizitkart linki</span>
          <span style={styles.subtitle}>Linkin son hissəsini dəyişin</span>
        </span>
        <span
          className="profile-link-toggle-arrow"
          data-open={isOpen || undefined}
        >
          <RightOutlined aria-hidden />
        </span>
      </button>
      <div
        id={detailsId}
        className="profile-link-details"
        data-open={isOpen || undefined}
        aria-hidden={!isOpen}
      >
        <div className="profile-link-details-inner">
          <fieldset
            className="profile-link-details-content"
            disabled={!isOpen || update.isPending}
          >
            <div
              className="profile-link-field"
              data-invalid={Boolean(errors.nickname) || undefined}
              title={buildProfileUrl(
                employee.id,
                preview.success ? preview.data : employee.nickname,
              )}
            >
              <span
                style={styles.prefix}
                title={`${window.location.origin}/v/`}
              >
                <span style={styles.host}>{window.location.host}</span>
                <span style={styles.path}>/v/</span>
              </span>
              <Controller
                name="nickname"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id={inputId}
                    aria-label="İstifadəçi adı"
                    placeholder={employee.id}
                    variant="borderless"
                    style={styles.input}
                    maxLength={NICKNAME_MAX_LENGTH}
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    disabled={update.isPending}
                    aria-invalid={Boolean(errors.nickname)}
                    aria-describedby={`${hintId}${errors.nickname ? ` ${errorId}` : ""}`}
                    onChange={(event) => {
                      clearErrors("nickname");
                      field.onChange(event);
                    }}
                  />
                )}
              />
              <Button
                type="text"
                htmlType="button"
                icon={<CopyOutlined />}
                style={styles.copy}
                aria-label="Vizitkart linkini kopyala"
                title={
                  isDirty
                    ? "Əvvəlcə dəyişikliyi yadda saxlayın"
                    : "Linki kopyala"
                }
                disabled={isDirty || update.isPending}
                onClick={() =>
                  void copyToClipboard(
                    buildProfileUrl(employee.id, employee.nickname),
                  )
                }
              />
            </div>
            {errors.nickname && (
              <div id={errorId} role="alert" style={styles.error}>
                {errors.nickname.message}
              </div>
            )}
            <p id={hintId} style={styles.hint}>
              3–30 simvol. Boş saxlasanız, standart link istifadə olunur.
            </p>
            <div style={styles.actions}>
              <Button
                type="text"
                htmlType="button"
                icon={<UndoOutlined aria-hidden />}
                style={styles.reset}
                disabled={update.isPending || !nickname}
                onClick={() =>
                  setValue("nickname", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                Standart link
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={styles.save}
                loading={update.isPending}
                disabled={!isDirty || !preview.success}
              >
                Linki yadda saxla
              </Button>
            </div>
          </fieldset>
        </div>
      </div>
    </form>
  );
}
