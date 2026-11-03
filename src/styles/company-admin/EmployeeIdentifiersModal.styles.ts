import type { CSSProperties } from "react";

export const styles = {
  title: { fontSize: 13 },
  titleIcon: { marginRight: 6, color: "var(--color-warning)" },
  row: { marginBottom: 14 },
  label: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "var(--color-text-secondary)",
    marginBottom: 6,
  },
  inputGroup: { display: "flex" },
} satisfies Record<string, CSSProperties>;
