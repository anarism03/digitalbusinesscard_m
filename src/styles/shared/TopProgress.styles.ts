import type { CSSProperties } from "react";

export const styles = {
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 2000,
    pointerEvents: "none",
  },
  bar: {
    height: "100%",
    borderRadius: "0 999px 999px 0",
    background:
      "linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary) 52%, var(--color-primary) 100%)",
    boxShadow:
      "0 0 12px color-mix(in srgb, var(--color-primary) 50%, transparent)",
    transition:
      "width 220ms cubic-bezier(.4,0,.2,1), opacity 320ms cubic-bezier(.4,0,.2,1)",
  },
} satisfies Record<string, CSSProperties>;

export const getProgressBarStyle = (
  progress: number,
  visible: boolean,
): CSSProperties => ({
  ...styles.bar,
  width: `${progress}%`,
  opacity: visible ? 1 : 0,
});
