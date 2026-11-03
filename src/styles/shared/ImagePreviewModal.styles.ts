import type { CSSProperties } from "react";

export const modalStyles = {
  body: { paddingTop: 8 },
};

export const styles = {
  image: {
    width: "100%",
    maxHeight: "70vh",
    objectFit: "contain",
    borderRadius: 12,
    display: "block",
    background: "var(--color-primary-soft)",
  },
  fallback: {
    width: "min(320px, 100%)",
    aspectRatio: "1 / 1",
    margin: "0 auto",
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, var(--color-primary-soft) 0%, var(--color-border-strong) 100%)",
    color: "var(--color-primary)",
    fontSize: 72,
    fontWeight: 700,
  },
} satisfies Record<string, CSSProperties>;
