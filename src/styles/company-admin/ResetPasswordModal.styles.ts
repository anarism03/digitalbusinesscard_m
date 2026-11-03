import type { CSSProperties } from "react";

export const styles = {
  title: { fontSize: 13 },
  titleIcon: { marginRight: 6, color: "var(--color-warning)" },
  passwordInput: { width: "100%", marginBottom: 12 },
} satisfies Record<string, CSSProperties>;
