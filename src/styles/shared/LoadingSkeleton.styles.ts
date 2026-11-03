import type { CSSProperties } from "react";

export const styles = {
  loadingSkeleton: {
    padding: 24,
    borderRadius: 18,
    border: "1px solid var(--color-border)",
    background: "var(--color-surface)",
    boxShadow: "var(--shadow-sm)",
  },
} satisfies Record<string, CSSProperties>;
