import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useAppearance } from "../../providers/AppearanceContext";

export default function ThemeControl() {
  const { resolvedMode, setMode } = useAppearance();
  const isDark = resolvedMode === "dark";
  const Icon = isDark ? SunOutlined : MoonOutlined;
  const label = isDark ? "Açıq rejimə keç" : "Tünd rejimə keç";

  return (
    <button
      type="button"
      className="theme-control"
      aria-label={label}
      title={label}
      onClick={() => setMode(isDark ? "light" : "dark")}
    >
      <Icon />
    </button>
  );
}
