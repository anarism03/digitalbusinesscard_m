import { BankOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAssetSrc } from "../../hooks/useAssetSrc";
import type { CompanyLogoProps as Props } from "../../types/components/shared";

export default function CompanyLogo({
  src,
  name,
  size = 40,
  className,
  style,
  variant = "tile",
}: Props) {
  const resolvedSrc = useAssetSrc(src);
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = resolvedSrc && resolvedSrc !== failedSrc;
  const label = name ? `${name} loqosu` : "Şirkət loqosu";
  const isTile = variant === "tile";

  return (
    <span
      className={["company-logo", className].filter(Boolean).join(" ")}
      role={showImage ? undefined : "img"}
      aria-label={showImage ? undefined : label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        boxSizing: "border-box",
        verticalAlign: "middle",
        padding: isTile ? Math.max(3, Math.round(size * 0.08)) : 0,
        borderRadius: isTile ? Math.round(size * 0.22) : 0,
        border: isTile ? "1px solid var(--color-border)" : undefined,
        background: "transparent",
        color: "var(--color-primary)",
        fontSize: Math.round(size * 0.45),
        ...style,
      }}
    >
      {showImage ? (
        <img
          src={resolvedSrc}
          alt={label}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(resolvedSrc)}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            minWidth: 0,
            minHeight: 0,
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      ) : (
        <BankOutlined aria-hidden="true" />
      )}
    </span>
  );
}
