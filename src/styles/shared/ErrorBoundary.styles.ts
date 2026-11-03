import type { CSSProperties } from "react";

export const styles = {
  errorBoundary: {
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--color-surface-muted)",
  },
} satisfies Record<string, CSSProperties>;
