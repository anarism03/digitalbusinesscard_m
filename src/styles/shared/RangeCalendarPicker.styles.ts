import type { CSSProperties } from "react";

export const styles = {
  footer: {
    display: "flex",
    gap: 8,
    padding: "10px 12px",
    borderTop: "1px solid var(--color-border)",
  },
  applyButton: { flex: 1 },
} satisfies Record<string, CSSProperties>;
