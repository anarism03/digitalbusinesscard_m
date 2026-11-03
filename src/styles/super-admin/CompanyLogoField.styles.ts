import type { CSSProperties } from "react";

export const styles = {
  logoLabel: { fontSize: 13, display: "block", marginBottom: 12 },
  logoItem: { marginBottom: 20 },
  logoRow: { display: "flex", alignItems: "center", gap: 16 },
  previewWrap: { position: "relative", flexShrink: 0 },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 22,
    height: 22,
    minWidth: 0,
    padding: 0,
    borderRadius: "50%",
    background: "var(--color-surface)",
    border: "1px solid var(--color-danger-border)",
  },
  uploadLabel: { cursor: "pointer" },
  uploadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 12px",
    border: "1px solid var(--color-border-strong)",
    borderRadius: 6,
    fontSize: 13,
    color: "var(--color-text)",
  },
  hiddenFile: { display: "none" },
  logoHint: { fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 },
} satisfies Record<string, CSSProperties>;
