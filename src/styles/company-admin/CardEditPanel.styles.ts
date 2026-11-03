import type { CSSProperties } from "react";

export const styles = {
  wrap: {
    padding: "0 20px",
  },
  identityField: {
    marginTop: 20,
  },
  fieldLabel: {
    display: "block",
    color: "var(--color-text-secondary)",
    fontSize: 14,
    fontWeight: 700,
  },
  flatInput: {
    background: "var(--color-surface-muted)",
    border: "1px solid var(--color-border-strong)",
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 16,
    height: "auto",
    marginBottom: 10,
    transition:
      "border-color var(--dur-fast) ease, background-color var(--dur-fast) ease, box-shadow var(--dur-fast) ease",
  },
  flatInputError: {
    borderColor: "var(--color-danger)",
  },
  bottomBar: {
    position: "sticky",
    bottom: 0,
    zIndex: 5,
    marginInline: -20,
    marginTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: "max(14px, env(safe-area-inset-bottom))",
    background: "var(--color-canvas, var(--color-canvas))",
  },
  addLinkButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    background: "var(--color-primary-soft)",
    border: "1px dashed var(--color-border-strong)",
    borderRadius: 14,
    minHeight: 52,
    padding: "12px 16px",
    color: "var(--color-primary)",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  hiddenInput: {
    display: "none",
  },
} satisfies Record<string, CSSProperties>;
