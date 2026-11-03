import type { CSSProperties } from "react";

export const styles = {
  metaRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr 1fr 1fr",
    gap: 14,
    alignItems: "center",
    paddingBottom: 12,
    borderBottom: "1px solid var(--color-border)",
  },
  metaItem: {
    minWidth: 0,
  },
  metaLabel: {
    fontSize: 11,
    color: "var(--color-text-muted)",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: 700,
    color: "var(--color-text)",
  },
} satisfies Record<string, CSSProperties>;
