import BrandIcon from "../../../../components/shared/BrandIcon";
import { styles } from "../../../../styles/company-admin/LinkFormHeader.styles";
import type { LinkFormHeaderProps as Props } from "../../../../types/pages/cardEditor";

export default function LinkFormHeader({
  title,
  iconSrc,
  iconAlt = "",
  fallbackIcon,
}: Props) {
  return (
    <div style={styles.header}>
      <span style={styles.icon}>
        {iconSrc ? (
          <BrandIcon src={iconSrc} alt={iconAlt} style={styles.iconImage} />
        ) : (
          fallbackIcon
        )}
      </span>
      <strong style={styles.title}>{title}</strong>
    </div>
  );
}
