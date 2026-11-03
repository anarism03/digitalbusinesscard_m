import { useAppearance } from "../../../providers/AppearanceContext";
import { styles } from "../../../styles/business-card/SetClappPublicFooter.styles";
import SetClappLogo from "../../shared/SetClappLogo";

export default function SetClappPublicFooter() {
  const { resolvedMode } = useAppearance();

  return (
    <div style={styles.footer} className="setclapp-public-footer">
      <a
        href="https://www.setclapp.com/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="SetClapp"
        style={styles.logoLink}
      >
        <SetClappLogo
          height={22}
          variant={resolvedMode === "dark" ? "white" : "color"}
        />
      </a>
      <span>© 2019 - 2026 SetClapp MMC</span>
    </div>
  );
}
