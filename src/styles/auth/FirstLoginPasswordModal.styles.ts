import type { CSSProperties } from "react";

export const styles = {
  alert: {
    marginBottom: 16,
  },
  description: {
    color: "var(--color-text-secondary)",
    fontSize: 13,
  },
} satisfies Record<string, CSSProperties>;
