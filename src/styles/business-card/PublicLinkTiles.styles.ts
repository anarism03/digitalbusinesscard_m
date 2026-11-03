import type { CSSProperties } from "react";
import { COLORS, SHADOWS } from "../../constants/ui";

export const styles = {
  contactTile: {
    width: "var(--public-tile-size, 62px)",
    height: "var(--public-tile-size, 62px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--public-tile-radius, 15px)",
    border: "1px solid var(--color-border)",
    background:
      "linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-muted) 100%)",
    color: COLORS.primary,
    textDecoration: "none",
    boxShadow: "var(--shadow-sm)",
  },
  contactTileIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "var(--public-tile-icon-size, 25px)",
    lineHeight: 1,
  },
  linkCard: {
    minHeight: 58,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 12px",
    borderRadius: 15,
    border: "1px solid var(--color-border)",
    background:
      "linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-muted) 100%)",
    color: COLORS.text,
    textDecoration: "none",
    boxShadow: "var(--shadow-sm)",
  },
  linkCardIcon: {
    width: "var(--public-tile-secondary-size, 38px)",
    height: "var(--public-tile-secondary-size, 38px)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--public-tile-secondary-radius, 10px)",
    background: "var(--color-surface)",
    flexShrink: 0,
    boxShadow: SHADOWS.sm,
    border: "1px solid var(--color-border)",
  },
  linkCardText: {
    flex: 1,
    minWidth: 0,
  },
  linkCardLabel: {
    display: "block",
    fontSize: 14,
    fontWeight: 650,
    lineHeight: 1.3,
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: COLORS.textSecondary,
  },
  linkCardValue: {
    display: "block",
    marginTop: 3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 1.4,
    fontWeight: 400,
  },
  linkCardArrow: {
    flexShrink: 0,
    color: "var(--color-text-muted)",
    fontSize: 13,
  },
  iconImage: {
    width: "var(--public-tile-icon-img-size, 28px)",
    height: "var(--public-tile-icon-img-size, 28px)",
    objectFit: "contain",
  },
  iconFallback: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "var(--public-tile-icon-fallback-size, 24px)",
  },
  iconTile: {
    width: "var(--public-tile-size, 62px)",
    height: "var(--public-tile-size, 62px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--public-tile-radius, 15px)",
    border: "1px solid var(--color-border)",
    background:
      "linear-gradient(145deg, var(--color-surface) 0%, var(--color-surface-muted) 100%)",
    textDecoration: "none",
    boxShadow: "var(--shadow-sm)",
  },
  groupTrigger: {
    padding: 0,
    font: "inherit",
    cursor: "pointer",
    appearance: "none",
  },
} satisfies Record<string, CSSProperties>;

export function getIconTileStyle(color: string): CSSProperties {
  return {
    ...styles.iconTile,
    color,
  };
}
