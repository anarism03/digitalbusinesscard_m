import type { CSSProperties } from "react";

const messageBoxBase: CSSProperties = {
  background: "var(--color-surface)",
  borderRadius: 22,
  border: "1px solid var(--color-border)",
  boxShadow: "var(--shadow-lg)",
};

export const styles = {
  centerBox: {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    background:
      "radial-gradient(90% 70% at 50% 0%, var(--color-primary-soft) 0%, var(--color-surface-muted) 56%, var(--color-avatar-muted) 100%)",
  },
  messageCard: {
    ...messageBoxBase,
    padding: "40px 24px",
    maxWidth: 360,
    width: "100%",
    textAlign: "center",
  },
  inactiveBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 28px",
    textAlign: "center",
  },
  loadingCard: {
    ...messageBoxBase,
    width: "100%",
    maxWidth: 390,
    padding: "32px 24px",
  },
  messageIcon: {
    fontSize: 48,
    color: "var(--color-primary)",
  },
  inactiveIconBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "linear-gradient(145deg, var(--color-avatar-muted) 0%, var(--color-avatar-muted) 100%)",
    marginBottom: 16,
  },
  inactiveIcon: {
    fontSize: 30,
    color: "var(--color-text-secondary)",
  },
  messageTitle: {
    marginTop: 16,
    fontFamily: "var(--font-display)",
    fontSize: 19,
    fontWeight: 750,
  },
  inactiveTitle: {
    margin: 0,
    fontSize: "clamp(15px, 4.2vw, 19px)",
    color: "var(--color-label)",
    fontWeight: 600,
    lineHeight: 1.4,
    whiteSpace: "nowrap",
  },
  messageSubtitle: {
    color: "var(--color-text-secondary)",
    fontSize: 14,
    lineHeight: 1.55,
  },
} satisfies Record<string, CSSProperties>;
