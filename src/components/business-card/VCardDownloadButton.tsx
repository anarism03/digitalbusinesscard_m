import { Button, ConfigProvider } from "antd";
import { useState } from "react";
import type { VCardDownloadButtonProps } from "../../types/components/business-card";
import { message } from "../../utils/feedback";
import { triggerBlobDownload } from "../../utils/file";
import { buildVcfText, resolveVcfPhotoDataUrl } from "../../utils/vcard";
import BrandIcon from "../shared/BrandIcon";

export default function VCardDownloadButton({
  employee,
  label,
  overrides,
}: VCardDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const photoDataUrl = await resolveVcfPhotoDataUrl(employee.photoUrl);
      const blob = new Blob(
        [buildVcfText(employee, overrides, photoDataUrl ?? employee.photoUrl)],
        {
          type: "text/vcard;charset=utf-8",
        },
      );
      triggerBlobDownload(
        blob,
        `${(overrides?.name || employee.fullName).replace(/\s+/g, "_")}.vcf`,
      );
    } catch {
      message.error("VCard yüklənmədi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider wave={{ disabled: true }}>
      <Button
        className="vcard-download-btn"
        type="primary"
        size="large"
        icon={
          <span className="vcard-download-btn__icon" aria-hidden="true">
            <BrandIcon
              className="vcard-download-btn__icon-image"
              src="/imgs/icons/contacts.svg"
              alt=""
            />
          </span>
        }
        onClick={handleDownload}
        loading={loading}
        block
      >
        {label}
      </Button>
    </ConfigProvider>
  );
}
