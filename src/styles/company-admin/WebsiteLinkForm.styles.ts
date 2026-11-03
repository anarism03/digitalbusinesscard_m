import type { CSSProperties } from "react";

export const styles = {
  row: {
    padding: "14px 14px 2px",
    marginBottom: 12,
    borderRadius: 18,
    background: "var(--color-surface-muted)",
    border: "1px solid var(--color-surface-neutral)",
  },
  logoActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoUploadButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 40,
    padding: "7px 14px",
    border: "1px solid var(--color-border-strong)",
    borderRadius: 10,
    background: "var(--color-surface)",
    color: "var(--color-text)",
    cursor: "pointer",
    fontWeight: 600,
  },
  hiddenFileInput: {
    display: "none",
  },
} satisfies Record<string, CSSProperties>;
