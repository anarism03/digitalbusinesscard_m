import type { CSSProperties } from "react";

export const styles = {
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    margin: "0 0 18px",
  },
  icon: {
    width: 68,
    height: 68,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    color: "var(--color-primary)",
    fontSize: 34,
    background: "var(--color-surface-muted)",
    boxShadow: "0 10px 24px rgba(15,23,42,.08)",
  },
  iconImage: {
    width: 44,
    height: 44,
    objectFit: "contain",
  },
  title: {
    color: "var(--color-text)",
    fontSize: 18,
    lineHeight: 1.25,
  },
} satisfies Record<string, CSSProperties>;
