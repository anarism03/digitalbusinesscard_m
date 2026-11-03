import type { CSSProperties } from "react";

export const styles = {
  row: {
    padding: "14px 14px 2px",
    marginBottom: 12,
    borderRadius: 18,
    background: "var(--color-surface-muted)",
    border: "1px solid var(--color-surface-neutral)",
  },
  stepControls: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    margin: "4px 0 18px",
  },
} satisfies Record<string, CSSProperties>;
