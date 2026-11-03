import {
  CheckOutlined,
  DesktopOutlined,
  MoonOutlined,
  ReloadOutlined,
  RightOutlined,
  SkinOutlined,
  SunOutlined,
} from "@ant-design/icons";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useAppearance } from "../../../../providers/AppearanceContext";
import { useAppSelector } from "../../../../store/hooks";
import {
  BRAND_PRESETS,
  DEFAULT_BRAND_COLOR,
  normalizeHex,
  setCompanyBrand,
} from "../../../../utils/appearance";
import { apiClient } from "../../../../services/axios/axiosInstance";
import { getApiErrorMessage } from "../../../../utils/apiError";
import { message } from "../../../../utils/feedback";

const THEME_OPTIONS = [
  { value: "light", label: "Açıq", Icon: SunOutlined },
  { value: "dark", label: "Tünd", Icon: MoonOutlined },
  { value: "system", label: "Sistem", Icon: DesktopOutlined },
] as const;

export default function AppearanceSettingsCard() {
  const { mode, setMode, brandColor } = useAppearance();
  const companyId = useAppSelector((state) => state.auth.user?.companyId ?? "");
  const [draft, setDraft] = useState(brandColor.toUpperCase());
  const [invalid, setInvalid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const fieldId = useId();
  const contentId = `${fieldId}-content`;
  const colorInput = useRef<HTMLInputElement>(null);
  const selectedPreset = BRAND_PRESETS.find(
    (preset) => preset.color === brandColor,
  );
  const saveBrand = useCallback(
    (color: string) => {
      if (!companyId || color.toLowerCase() === brandColor) return;
      void apiClient
        .put(`/appearance/${encodeURIComponent(companyId)}`, { color })
        .then(() => setCompanyBrand(companyId, color))
        .catch((error) => message.error(getApiErrorMessage(error)));
    },
    [companyId, brandColor],
  );

  useEffect(() => {
    setDraft(brandColor.toUpperCase());
    setInvalid(false);
  }, [brandColor]);

  useEffect(() => {
    const input = colorInput.current;
    if (!input) return;
    const commitColor = () => saveBrand(input.value);
    input.addEventListener("change", commitColor);
    return () => input.removeEventListener("change", commitColor);
  }, [saveBrand]);

  const applyCustomColor = () => {
    const color = normalizeHex(draft);
    setInvalid(!color);
    if (color) {
      saveBrand(color);
      setDraft(color.toUpperCase());
    }
  };

  return (
    <section
      className="appearance-card mb-5 overflow-hidden rounded-[18px] border border-line bg-panel text-ink"
      aria-labelledby={`${fieldId}-title`}
      data-open={isOpen || undefined}
    >
      <h2 className="m-0">
        <button
          type="button"
          className="appearance-card-header flex items-center gap-3 px-5 py-4"
          aria-expanded={isOpen}
          aria-controls={contentId}
          aria-label="Görünüş və brend"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <SkinOutlined aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span
              id={`${fieldId}-title`}
              className="block text-base font-semibold tracking-tight"
            >
              Görünüş və brend
            </span>
            <span className="mt-0.5 block text-xs font-normal text-ink-muted">
              Şirkətinizə uyğun, hər rejimdə ahəngdar.
            </span>
          </span>
          <span className="appearance-card-arrow">
            <RightOutlined aria-hidden />
          </span>
        </button>
      </h2>

      <div id={contentId} className="appearance-collapse" aria-hidden={!isOpen}>
        <div className="appearance-collapse-inner">
          <div className="appearance-card-content flex flex-col gap-5 p-4 sm:p-5">
            <fieldset
              className="appearance-fieldset appearance-reveal appearance-reveal-mode"
              disabled={!isOpen}
            >
              <legend className="mb-2.5 text-sm font-semibold">
                Görünüş rejimi
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {THEME_OPTIONS.map(({ value, label, Icon }, index) => (
                  <label
                    key={value}
                    style={{ "--appearance-order": index } as CSSProperties}
                    className={`appearance-mode flex cursor-pointer flex-col items-center gap-2 rounded-xl px-2 py-3 text-xs font-medium ${mode === value ? "appearance-mode--selected" : ""}`}
                  >
                    <input
                      className="appearance-radio"
                      type="radio"
                      name={`${fieldId}-mode`}
                      value={value}
                      checked={mode === value}
                      onChange={() => setMode(value)}
                    />
                    <Icon className="text-xl" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset
              className="appearance-fieldset appearance-reveal appearance-reveal-brand"
              disabled={!isOpen || !companyId}
            >
              <legend className="mb-2.5 text-sm font-semibold">
                Brend rəngi
              </legend>
              <div className="appearance-palette grid grid-cols-4 gap-2">
                {BRAND_PRESETS.map(({ name, color }, index) => (
                  <label
                    key={color}
                    style={{ "--appearance-order": index } as CSSProperties}
                    className={`appearance-swatch flex cursor-pointer flex-col items-center gap-2 rounded-xl px-1 py-2.5 ${brandColor === color ? "appearance-swatch--selected" : ""}`}
                  >
                    <input
                      className="appearance-radio"
                      type="radio"
                      name={`${fieldId}-brand`}
                      value={color}
                      checked={brandColor === color}
                      onChange={() => saveBrand(color)}
                    />
                    <span
                      className="appearance-swatch-color flex size-8 items-center justify-center rounded-full"
                      style={{ background: color }}
                    >
                      {brandColor === color && (
                        <CheckOutlined className="appearance-swatch-check" />
                      )}
                    </span>
                    <span className="text-[11px] font-medium">{name}</span>
                  </label>
                ))}
                <button
                  type="button"
                  className={`appearance-swatch appearance-custom-swatch flex cursor-pointer flex-col items-center gap-2 rounded-xl px-1 py-2.5 ${!selectedPreset ? "appearance-swatch--selected" : ""}`}
                  style={
                    {
                      "--appearance-order": BRAND_PRESETS.length,
                    } as CSSProperties
                  }
                  onClick={() => colorInput.current?.click()}
                  aria-label="Fərdi brend rəngi seç"
                  aria-pressed={!selectedPreset}
                >
                  <span className="appearance-custom-color flex size-8 items-center justify-center rounded-full">
                    <SkinOutlined />
                  </span>
                  <span className="text-[11px] font-medium">Fərdi</span>
                </button>
              </div>

              <div className="appearance-reveal appearance-reveal-custom">
                <label
                  className="mt-4 mb-2 block text-xs font-medium text-ink-muted"
                  htmlFor={fieldId}
                >
                  Fərdi rəng
                </label>
                <div className="flex items-stretch gap-2">
                  <label className="appearance-color-picker" title="Rəng seç">
                    <span className="appearance-sr-only">
                      Fərdi brend rəngi seç
                    </span>
                    <input
                      ref={colorInput}
                      type="color"
                      value={normalizeHex(draft) ?? brandColor}
                      onChange={(event) => {
                        setDraft(event.target.value.toUpperCase());
                        setInvalid(false);
                      }}
                      onBlur={(event) => saveBrand(event.currentTarget.value)}
                    />
                  </label>
                  <input
                    id={fieldId}
                    className="appearance-hex min-w-0 flex-1 rounded-xl px-3 text-sm"
                    type="text"
                    value={draft}
                    maxLength={7}
                    placeholder="#1B4A75"
                    spellCheck={false}
                    autoComplete="off"
                    aria-invalid={invalid}
                    aria-describedby={
                      invalid ? `${fieldId}-error` : `${fieldId}-help`
                    }
                    onChange={(event) => {
                      setDraft(event.target.value);
                      setInvalid(false);
                    }}
                    onBlur={applyCustomColor}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        applyCustomColor();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="appearance-reset"
                    disabled={brandColor === DEFAULT_BRAND_COLOR}
                    onClick={() => {
                      saveBrand(DEFAULT_BRAND_COLOR);
                      setDraft(DEFAULT_BRAND_COLOR.toUpperCase());
                      setInvalid(false);
                    }}
                    aria-label="Standart brend rənginə qaytar"
                    title="Standart rəngə qaytar"
                  >
                    <ReloadOutlined />
                  </button>
                </div>
                {invalid && (
                  <p
                    id={`${fieldId}-error`}
                    className="m-0 mt-2 text-xs text-status-danger"
                    role="alert"
                  >
                    Düzgün HEX rəng daxil edin: #1B4A75 və ya #ABC.
                  </p>
                )}
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </section>
  );
}
