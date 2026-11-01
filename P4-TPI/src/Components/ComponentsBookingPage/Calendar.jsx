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

const BookingCalendar = ({ selected, onSelect, viewDate, onViewDateChange, minDate, maxDate }) => {
  const { t } = useTranslation();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const min = minDate ? startOfDay(minDate) : null;
  const max = maxDate ? startOfDay(maxDate) : null;

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
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-dim)] transition-colors"
        >
          <IconChevronLeft />
        </button>
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          {(t(MONTH_KEYS[month]) || MONTH_KEYS[month])} {year}
        </span>
        <button
          onClick={() => onViewDateChange(new Date(year, month + 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-dim)] transition-colors"
        >
          <IconChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_KEYS.map((k) => (
          <div key={k} className="text-center text-[11px] font-semibold text-[var(--text-muted)] py-1">
            {t(k) || k}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((c, i) => {
          const date = c.cur ? new Date(year, month, c.day) : null;
          const isPast = c.cur && min && date < min;
          const isTooFar = c.cur && max && date > max;
          const isOutOfRange = isPast || isTooFar;
          const isSelected = c.cur && isSameDay(date, selected);
          const isTodayCell = c.cur && !isSelected && isToday(date);
          const disabled = !c.cur || isOutOfRange;

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(date)}
              className={`flex items-center justify-center h-9 w-full rounded-full text-sm transition-all
                ${!c.cur ? "text-transparent cursor-default" : ""}
                ${isOutOfRange ? "text-[var(--day-disabled)] cursor-not-allowed" : ""}
                ${c.cur && !isOutOfRange && !isSelected ? "text-[var(--text-primary)] font-medium cursor-pointer hover:bg-[var(--hover-bg)]" : ""}
                ${isTodayCell ? "ring-1 ring-inset ring-[var(--select-border)] font-semibold" : ""}
                ${isSelected ? "bg-[var(--select-fill)] text-[var(--on-select-fill)] font-bold shadow-sm" : ""}
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
