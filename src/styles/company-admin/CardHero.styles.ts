import type { CSSProperties } from "react";
import { companyLogoCoverMediaStyle } from "../business-card/BusinessCardPublicView.styles";

const GRADIENT =
  "linear-gradient(135deg, var(--card-accent-deep) 0%, var(--card-accent) 58%, var(--card-accent-light) 100%)";

export function getHeroStyle(
  backgroundSrc?: string,
  isCompanyLogo = false,
): CSSProperties {
  return {
    width: "100%",
    aspectRatio: "16 / 9",
    borderRadius: 0,
    background: isCompanyLogo
      ? "transparent"
      : backgroundSrc
        ? "linear-gradient(145deg, var(--color-surface-subtle) 0%, var(--color-surface) 48%, var(--color-surface-subtle) 100%)"
        : GRADIENT,
    boxShadow: "inset 0 0 0 1px rgba(15,23,42,.06)",
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
  };
}

const backgroundMediaStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  objectPosition: "center",
  imageRendering: "auto",
} satisfies CSSProperties;

export const styles = {
  wrap: {
    width: "calc(100% + 40px)",
    marginInline: -20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backgroundMedia: backgroundMediaStyle,
  companyLogoCoverMedia: {
    ...backgroundMediaStyle,
    ...companyLogoCoverMediaStyle,
  },
  bgEditButton: {
    position: "absolute",
    zIndex: 2,
    right: 10,
    bottom: 10,
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "rgba(15,23,42,0.62)",
    backdropFilter: "blur(12px) saturate(1.12)",
    border: "1px solid rgba(255,255,255,.72)",
    boxShadow: "0 10px 24px rgba(15,23,42,.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
    color: "#fff",
    fontSize: 13,
  },
  bgRemoveButton: {
    position: "absolute",
    zIndex: 2,
    left: 10,
    bottom: 10,
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "rgba(15,23,42,0.62)",
    backdropFilter: "blur(12px) saturate(1.12)",
    border: "1px solid rgba(255,255,255,.72)",
    boxShadow: "0 10px 24px rgba(15,23,42,.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
    color: "#fff",
    fontSize: 13,
  },
  avatarWrap: {
    position: "relative",
    zIndex: 3,
    width: 110,
    height: 110,
    marginTop: -44,
    flexShrink: 0,
  },
  avatarRing: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    border: "4px solid var(--color-surface)",
    boxShadow:
      "0 12px 30px rgba(15,23,42,.16), 0 0 0 1px rgba(15,23,42,.05), 0 0 0 5px var(--color-primary-soft)",
    background: "var(--color-surface-neutral)",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 34,
    fontWeight: 700,
    color: "var(--color-text-muted)",
  },
  avatarEditButton: {
    position: "absolute",
    right: -1,
    bottom: 1,
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "var(--color-action)",
    border: "2px solid var(--color-surface)",
    boxShadow:
      "0 10px 24px color-mix(in srgb, var(--color-primary) 28%, transparent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
    color: "var(--color-on-primary)",
    fontSize: 13,
  },
  avatarRemoveButton: {
    position: "absolute",
    left: -1,
    bottom: 1,
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "rgba(15,23,42,0.68)",
    border: "2px solid var(--color-surface)",
    boxShadow: "0 10px 24px rgba(15,23,42,.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
    color: "#fff",
    fontSize: 13,
  },
} satisfies Record<string, CSSProperties>;
