import { COLORS } from "../../../../constants/ui";
import { styles } from "../../../../styles/company-admin/EmployeeLimitProgress.styles";
import type { EmployeeLimitProgressProps } from "../../../../types/pages/companyAdmin";

export default function EmployeeLimitProgress({
  used,
  total,
}: EmployeeLimitProgressProps) {
  const percent =
    total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const color =
    used >= total
      ? "var(--color-danger)"
      : percent >= 80
        ? "var(--color-warning)"
        : COLORS.primary;

  return (
    <div style={styles.progressRow}>
      <span style={styles.progressLabel}>
        İstifadə: {used} / {total}
      </span>
      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${percent}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}
