import { CalendarOutlined } from "@ant-design/icons";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { styles } from "../../styles/shared/RangeCalendarPicker.styles";
import type {
  RangeCalendarPickerDraftRange as DraftRange,
  RangeCalendarPickerProps,
} from "../../types/components/shared";
import { useFrameContainer } from "../layout/FrameContainerContext";
import { getDateRange } from "../../utils/date";

const { RangePicker } = DatePicker;

export default function RangeCalendarPicker({
  from,
  to,
  onChange,
  className,
  style,
}: RangeCalendarPickerProps) {
  const getPopupContainer = useFrameContainer();
  const [open, setOpen] = useState(false);
  const committedValue: DraftRange = getDateRange(from, to)
    ? [dayjs(from), dayjs(to)]
    : null;
  const [draft, setDraft] = useState<DraftRange>(committedValue);
  const justPickedFullRangeRef = useRef(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && justPickedFullRangeRef.current) {
      justPickedFullRangeRef.current = false;
      return;
    }
    if (nextOpen) {
      setDraft(committedValue);
    }
    setOpen(nextOpen);
  };

  return (
    <RangePicker
      value={open ? draft : committedValue}
      onCalendarChange={(dates) => {
        setDraft(dates ?? null);
        if (dates && dates[0] && dates[1]) {
          justPickedFullRangeRef.current = true;
        }
      }}
      onChange={(dates) => {
        if (!dates) {
          setDraft(null);
          onChange(null, null);
        }
      }}
      format="DD/MM/YYYY"
      size="large"
      allowClear
      placeholder={["Başlama tarixi", "Bitmə tarixi"]}
      suffixIcon={<CalendarOutlined />}
      className={className}
      style={style}
      getPopupContainer={getPopupContainer}
      popupAlign={{
        htmlRegion: "visible",
        offset: [0, 0],
        overflow: { adjustX: true, adjustY: true, shiftY: true },
      }}
      classNames={{ popup: { root: "cadmin-range-popup" } }}
      open={open}
      onOpenChange={handleOpenChange}
      panelRender={(panel) => (
        <>
          {panel}
          <div className="cadmin-range-popup-footer" style={styles.footer}>
            <Button
              onClick={() => {
                setDraft(null);
                onChange(null, null);
                setOpen(false);
              }}
            >
              Təmizlə
            </Button>
            <Button
              type="primary"
              style={styles.applyButton}
              disabled={!draft?.[0] || !draft[1]}
              onClick={() => {
                if (draft?.[0] && draft[1]) {
                  onChange(
                    draft[0].format("YYYY-MM-DD"),
                    draft[1].format("YYYY-MM-DD"),
                  );
                }
                setOpen(false);
              }}
            >
              Hazır
            </Button>
          </div>
        </>
      )}
    />
  );
}
