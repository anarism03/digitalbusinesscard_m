import { Switch } from "antd";
import BrandIcon from "../../../../components/shared/BrandIcon";
import { useIconSrc } from "../../../../hooks/useAssetSrc";
import { styles } from "../../../../styles/company-admin/CardLinkRow.styles";
import type { CardLinkRowProps as Props } from "../../../../types/pages/cardEditor";

function IconBadge({
  icon,
  iconSrc,
  tint,
}: Pick<Props, "icon" | "iconSrc" | "tint">) {
  const src = useIconSrc(iconSrc);

  if (src) {
    return (
      <span className="card-link-row-icon-badge" style={styles.iconBadgeImage}>
        <BrandIcon src={src} style={styles.iconBadgeImg} />
      </span>
    );
  }

  return (
    <span
      className="card-link-row-icon-badge"
      style={{ ...styles.iconBadge, background: `${tint}1a`, color: tint }}
    >
      {icon}
    </span>
  );
}

export default function CardLinkRow({
  icon,
  iconSrc,
  label,
  value,
  tint,
  enabled,
  onClick,
  onEnabledChange,
}: Props) {
  return (
    <div
      className={
        enabled
          ? "card-link-row-edit"
          : "card-link-row-edit card-link-row-edit--disabled"
      }
      style={styles.row}
    >
      <button
        type="button"
        className="card-link-row-edit-content"
        style={styles.editContent}
        onClick={onClick}
      >
        <IconBadge icon={icon} iconSrc={iconSrc} tint={tint} />
        <span className="card-link-row-body" style={styles.body}>
          <span className="card-link-row-label" style={styles.label}>
            {label}
          </span>
          {value && (
            <span className="card-link-row-value" style={styles.value}>
              {value}
            </span>
          )}
        </span>
      </button>

      <span
        className="card-link-row-toggle"
        style={styles.toggleWrap}
        onClick={(event) => event.stopPropagation()}
      >
        <Switch
          checked={enabled}
          onChange={onEnabledChange}
          aria-label={`${label} aktivliyi`}
          style={enabled ? styles.switchOn : undefined}
        />
      </span>
    </div>
  );
}
