import { useAppearance } from "../../providers/AppearanceContext";
import type { SetClappLogoProps } from "../../types/components/shared";

export default function SetClappLogo({
  height = 40,
  variant,
}: SetClappLogoProps) {
  const { resolvedMode } = useAppearance();
  const resolvedVariant =
    variant ?? (resolvedMode === "dark" ? "white" : "color");
  return (
    <span className="setclapp-logo">
      <img
        src={
          resolvedVariant === "white"
            ? "/setclapp-logo-white.svg"
            : "/setclapp-logo.svg"
        }
        alt="SetClapp"
        style={{
          display: "block",
          width: "auto",
          flexShrink: 0,
          height,
          objectFit: "contain",
        }}
      />
    </span>
  );
}
