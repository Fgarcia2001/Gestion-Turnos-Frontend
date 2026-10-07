import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { IconChevronLeft, IconChevronRight } from "./Icons";

const MONTH_KEYS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];
const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const isSameDay = (a, b) =>
  a && b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const BookingCalendar = ({ selected, onSelect, viewDate, onViewDateChange, minDate }) => {
  const { t } = useTranslation();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const min = minDate ? startOfDay(minDate) : null;

  const firstDay = new Date(year, month, 1).getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, cur: false });
  for (let d = 1; d <= daysCount; d++) cells.push({ day: d, cur: true });
  let next = 1;
  while (cells.length % 7 !== 0) cells.push({ day: next++, cur: false });

  const isToday = (date) => date && isSameDay(date, startOfDay(new Date()));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => onViewDateChange(new Date(year, month - 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8F5F0] text-[#4a4a4a] transition-colors"
        >
          <IconChevronLeft />
        </button>
        <span className="text-sm font-semibold text-[#1a1a2e]">
          {(t(MONTH_KEYS[month]) || MONTH_KEYS[month])} {year}
        </span>
        <button
          onClick={() => onViewDateChange(new Date(year, month + 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8F5F0] text-[#4a4a4a] transition-colors"
        >
          <IconChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_KEYS.map((k) => (
          <div key={k} className="text-center text-[11px] font-semibold text-[#b3aca3] py-1">
            {t(k) || k}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((c, i) => {
          const date = c.cur ? new Date(year, month, c.day) : null;
          const isPast = c.cur && min && date < min;
          const isSelected = c.cur && isSameDay(date, selected);
          const isTodayCell = c.cur && !isSelected && isToday(date);
          const disabled = !c.cur || isPast;

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(date)}
              className={`flex items-center justify-center h-9 w-full rounded-full text-sm transition-all
                ${!c.cur ? "text-transparent cursor-default" : ""}
                ${isPast ? "text-[#d8d2cb] cursor-not-allowed" : ""}
                ${c.cur && !isPast && !isSelected ? "text-[#1a1a2e] cursor-pointer hover:bg-[#F8F5F0]" : ""}
                ${isTodayCell ? "ring-1 ring-inset ring-[#1a1a2e]/40 font-semibold" : ""}
                ${isSelected ? "bg-[#1a1a2e] text-white font-semibold shadow-sm shadow-[#1a1a2e]/30" : ""}
              `}
            >
              {c.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;
