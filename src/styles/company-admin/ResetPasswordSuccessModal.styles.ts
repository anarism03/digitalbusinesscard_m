import type { CSSProperties } from "react";

export const styles = {
  title: { fontSize: 13 },
  titleIcon: { marginRight: 6, color: "var(--color-warning)" },
  successAlert: { marginBottom: 12 },
  passwordInput: { width: "100%", marginBottom: 12 },
  hiddenCancel: { display: "none" },
} satisfies Record<string, CSSProperties>;
