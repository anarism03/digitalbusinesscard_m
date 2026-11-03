import type { CSSProperties } from "react";

export const styles = {
  container: {
    width: "min(100%, 384px)",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 0,
    background: "var(--color-surface)",
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    aspectRatio: "16 / 9",
    borderRadius: 0,
    background: "var(--color-surface-neutral)",
  },
  avatar: {
    marginTop: -44,
    width: 110,
    height: 110,
    borderRadius: "50%",
    background: "var(--color-border)",
    border: "4px solid var(--color-surface)",
    boxShadow: "0 2px 10px rgba(16,24,40,0.1)",
  },
  name: { marginTop: 10, width: 150, height: 18 },
  subtitle: { marginTop: 6, width: 100, height: 13 },
  rows: { width: "100%", marginTop: 14, padding: "0 16px 24px" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "var(--color-surface-neutral)",
    borderRadius: 14,
    padding: "8px 12px",
    marginBottom: 8,
  },
  rowIcon: { borderRadius: 9 },
  rowText: { flex: 1, height: 14 },
} satisfies Record<string, CSSProperties>;
