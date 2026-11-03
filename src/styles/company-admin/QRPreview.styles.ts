import type { CSSProperties } from "react";

export const getQrFallbackStyle = (size: number): CSSProperties => ({
  width: size,
  height: size,
  borderRadius: 8,
  background: "var(--color-surface-muted)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-text-muted)",
  fontWeight: 700,
  cursor: "default",
});

export const getQrImageStyle = (size: number): CSSProperties => ({
  width: size,
  height: size,
  display: "block",
  borderRadius: 8,
  cursor: "default",
});
