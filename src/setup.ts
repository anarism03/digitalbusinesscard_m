import dayjs from "dayjs";
import "dayjs/locale/az";
import updateLocale from "dayjs/plugin/updateLocale";
import { initializeAppearance } from "./utils/appearance";

dayjs.extend(updateLocale);
dayjs.locale("az");
dayjs.updateLocale("az", {
  weekdaysMin: ["B", "B.e", "Ç.a", "Ç", "C.a", "C", "Ş"],
});

initializeAppearance();
