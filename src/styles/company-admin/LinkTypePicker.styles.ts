import type { CSSProperties } from "react";

export const styles = {
  search: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "var(--color-text-muted)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    margin: "14px 0 10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
  },
  gridItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
    fontSize: 11.5,
    fontWeight: 600,
    color: "var(--color-label)",
    textAlign: "center",
  },
  iconBadgeBase: {
    width: 52,
    height: 52,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadgeImage: {
    background: "var(--color-surface)",
    border: "1px solid var(--color-surface-neutral)",
    boxShadow: "0 1px 3px rgba(16,24,40,0.08)",
  },
  iconBadgeTinted: {
    color: "var(--color-on-primary)",
    fontSize: 22,
    boxShadow: "0 1px 3px rgba(16,24,40,0.12)",
  },
  iconImage: {
    width: 28,
    height: 28,
    objectFit: "contain",
  },
} satisfies Record<string, CSSProperties>;

export function getIconBadgeStyle(
  hasImage: boolean,
  tint: string,
): CSSProperties {
  return hasImage
    ? { ...styles.iconBadgeBase, ...styles.iconBadgeImage }
    : { ...styles.iconBadgeBase, ...styles.iconBadgeTinted, background: tint };
}
