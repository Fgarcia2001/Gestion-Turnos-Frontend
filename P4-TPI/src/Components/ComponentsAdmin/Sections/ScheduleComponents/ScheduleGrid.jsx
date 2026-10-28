// ScheduleGrid.jsx
// Horizontal day agenda: staff as rows, time running left-to-right in 30-minute columns.
import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "../../../../../CustomHooks/TraslateHook";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { STATUS_STYLES } from "./statusStyles";

const STATUS_LABEL_KEYS = {
  Pending: "statusPending",
  Confirmed: "statusConfirmed",
  Cancelled: "statusCancelled",
};

const LABEL_WIDTH = 184;
const SLOT_WIDTH = 120;
const COLLAPSED_WIDTH = 1;
const ROW_HEIGHT = 76;
const STEP_MINUTES = 15;
const GRID_MAX_HEIGHT = "calc(100vh - 320px)";

const timeToMinutes = (timeStr) => {
  if (typeof timeStr === "number") return timeStr;
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (mins) =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

const generateSlots = (startTime, endTime, stepMinutes = STEP_MINUTES) => {
  const slots = [];
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  for (let mins = start; mins < end; mins += stepMinutes) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
};

const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("") || "?";

// Which slots have at least one appointment (from any staff), derived from already-fetched data.
const computeOccupied = (slots, staff, scheduleStart) => {
  const startMinutes = timeToMinutes(scheduleStart);
  const intervals = [];
  (staff || []).forEach((s) => {
    (s.appointments || []).forEach((appt) => {
      intervals.push([timeToMinutes(appt.startTime), timeToMinutes(appt.endTime)]);
    });
  });
  return slots.map((_, i) => {
    const slotStart = startMinutes + i * STEP_MINUTES;
    const slotEnd = slotStart + STEP_MINUTES;
    return intervals.some(([s, e]) => s < slotEnd && e > slotStart);
  });
};

// Per-slot pixel widths + cumulative offsets, so empty slots can be rendered narrower
// without breaking real-time proportional positioning of appointments.
const computeScale = (slots, occupied, compact, slotWidth = SLOT_WIDTH) => {
  const widths = slots.map((_, i) => (occupied[i] || !compact ? slotWidth : COLLAPSED_WIDTH));
  const cumX = [];
  let acc = 0;
  widths.forEach((w) => {
    cumX.push(acc);
    acc += w;
  });
  return { widths, cumX, totalWidth: acc };
};

const makeMinutesToX = (scheduleStart, widths, cumX) => {
  const startMinutes = timeToMinutes(scheduleStart);
  const lastIndex = widths.length - 1;
  return (timeStr) => {
    const minutes = typeof timeStr === "number" ? timeStr : timeToMinutes(timeStr);
    const rawIndex = Math.floor((minutes - startMinutes) / STEP_MINUTES);
    const index = Math.min(Math.max(rawIndex, 0), lastIndex);
    const slotStart = startMinutes + index * STEP_MINUTES;
    const fraction = Math.min(Math.max((minutes - slotStart) / STEP_MINUTES, 0), 1);
    return cumX[index] + fraction * widths[index];
  };
};

const TimeHeader = ({ slots, widths }) => (
  <div className="flex sticky top-0 z-20 bg-[var(--surface)] border-b border-[var(--border-subtle)]">
    <div
      className="shrink-0 sticky left-0 z-30 bg-[var(--surface)] border-r border-[var(--border-subtle)]"
      style={{ width: LABEL_WIDTH, height: 44 }}
    />
    {slots.map((slot, i) => {
      const collapsed = widths[i] < SLOT_WIDTH;
      return (
        <div
          key={slot}
          className={
            collapsed
              ? "shrink-0 border-r border-[var(--border-faint)] bg-[var(--surface-muted-3)]"
              : "shrink-0 flex items-center justify-center border-r border-[var(--border-faint)] text-[12px] font-semibold text-[var(--text-tertiary)] tracking-wide"
          }
          style={{ width: widths[i], height: 44 }}
        >
          {!collapsed && slot}
        </div>
      );
    })}
  </div>
);

const CurrentTimeLine = ({ scheduleStart, scheduleEnd, rowsHeight, minutesToX }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = timeToMinutes(scheduleStart);
  const endMinutes = timeToMinutes(scheduleEnd);

  if (nowMinutes < startMinutes || nowMinutes > endMinutes) return null;

  const offset = minutesToX(nowMinutes);

  return (
    <div
      className="absolute top-0 pointer-events-none z-10"
      style={{ left: LABEL_WIDTH + offset, height: rowsHeight }}
    >
      <div className="absolute -top-1.5 -left-[5px] w-3 h-3 rounded-full bg-[#ef4444]" />
      <div className="absolute top-0 bottom-0 w-px bg-[#ef4444]" />
    </div>
  );
};

const AppointmentBlock = ({ appt, onSelect, minutesToX }) => {
  const { t } = useTranslation();
  const style = STATUS_STYLES[appt.status] || STATUS_STYLES.Confirmed;
  const left = minutesToX(appt.startTime);
  const right = minutesToX(appt.endTime);
  const isCancelled = appt.status === "Cancelled";
  const statusLabel = appt.status ? (t(STATUS_LABEL_KEYS[appt.status]) || appt.status) : "";

  return (
    <button
      type="button"
      onClick={() => onSelect(appt)}
      title={`${appt.clientName || "—"} · ${appt.serviceName || "—"} · ${appt.startTime}-${appt.endTime}${statusLabel ? ` · ${statusLabel}` : ""}`}
      className="absolute top-1.5 bottom-1.5 rounded-lg pl-2.5 pr-2 py-1.5 overflow-hidden border border-l-4 text-left cursor-pointer transition-shadow hover:shadow-md"
      style={{
        left: left + 2,
        width: Math.max(right - left - 4, 16),
        backgroundColor: style.bg,
        borderColor: `${style.border}55`,
        borderLeftColor: style.border,
        opacity: isCancelled ? 0.65 : 1,
      }}
    >
      <p
        className="text-[12px] font-bold truncate leading-tight"
        style={{ color: style.text, textDecoration: isCancelled ? "line-through" : "none" }}
      >
        {appt.clientName || "—"}
      </p>
      <p className="text-[11px] truncate leading-tight mt-0.5" style={{ color: style.text }}>
        {appt.serviceName || "—"}
      </p>
      <p className="text-[10px] truncate leading-tight mt-0.5 opacity-80" style={{ color: style.text }}>
        {appt.startTime}–{appt.endTime}
      </p>
    </button>
  );
};

const StaffRow = ({ staff, widths, totalWidth, onSelect, minutesToX }) => (
  <div className="flex border-b border-[var(--border-subtle)]" style={{ height: ROW_HEIGHT }}>
    <div
      className="shrink-0 sticky left-0 z-10 bg-[var(--surface)] border-r border-[var(--border-subtle)] flex items-center gap-2.5 px-3.5"
      style={{ width: LABEL_WIDTH }}
    >
      <div className="w-9 h-9 shrink-0 rounded-full bg-[var(--surface-muted)] text-[var(--text-primary)] flex items-center justify-center text-[12px] font-bold">
        {getInitials(staff.staffName)}
      </div>
      <span className="text-sm font-semibold text-[var(--text-primary)] truncate">{staff.staffName}</span>
    </div>

    <div className="relative" style={{ width: totalWidth }}>
      <div className="absolute inset-0 flex">
        {widths.map((w, i) => (
          <div key={i} className="shrink-0 border-r border-[var(--border-faint)]" style={{ width: w }} />
        ))}
      </div>
      {(staff.appointments || []).map((appt) => (
        <AppointmentBlock key={appt.id} appt={appt} onSelect={onSelect} minutesToX={minutesToX} />
      ))}
    </div>
  </div>
);

const PagerButton = ({ direction, disabled, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className="w-7 h-7 flex items-center justify-center bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-muted)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--surface)]"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "prev" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  </button>
);

const ScheduleGrid = ({ staff, schedule, isToday, selectedDate }) => {
  const { t } = useTranslation();
  const slots = useMemo(() => generateSlots(schedule.startTime, schedule.endTime), [schedule.startTime, schedule.endTime]);
  const [selected, setSelected] = useState(null);
  const [compact, setCompact] = useState(true);
  const [page, setPage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollRef = useRef(null);
  const rowsHeight = staff.length * ROW_HEIGHT;
  const startMinutes = timeToMinutes(schedule.startTime);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    setContainerWidth(el.clientWidth);
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Full-day mode shows the day in blocks that fit the available width, so there is no horizontal scroll.
  const paged = !compact;
  const fits = containerWidth >= LABEL_WIDTH + SLOT_WIDTH;
  const slotsPerPage = fits ? Math.floor((containerWidth - LABEL_WIDTH) / SLOT_WIDTH) : 1;
  const slotWidth = paged && fits ? (containerWidth - LABEL_WIDTH) / slotsPerPage : SLOT_WIDTH;
  const pageCount = Math.max(1, Math.ceil(slots.length / slotsPerPage));
  const currentPage = Math.min(page, pageCount - 1);

  const firstPage = () => {
    if (!isToday) return 0;
    const now = new Date();
    const idx = Math.floor((now.getHours() * 60 + now.getMinutes() - startMinutes) / STEP_MINUTES);
    return Math.min(Math.max(Math.floor(idx / slotsPerPage), 0), pageCount - 1);
  };

  const resetKey = `${String(selectedDate)}|${schedule.startTime}|${schedule.endTime}`;
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setPage(firstPage());
  }

  const toggleCompact = () => {
    setPage(compact ? firstPage() : 0);
    setCompact((c) => !c);
  };

  const pageStartIdx = paged ? currentPage * slotsPerPage : 0;
  const viewSlots = paged ? slots.slice(pageStartIdx, pageStartIdx + slotsPerPage) : slots;
  const viewStart = startMinutes + pageStartIdx * STEP_MINUTES;
  const viewEnd = paged ? viewStart + viewSlots.length * STEP_MINUTES : timeToMinutes(schedule.endTime);

  // Cancelled appointments free the slot, so another booking can land on the same time
  // and the two blocks would overlap. Hide them from both the occupancy and the render.
  // In paged mode, appointments outside the visible block are dropped; the ones crossing
  // its edges are clamped by minutesToX.
  const visibleStaff = useMemo(
    () =>
      staff.map((s) => ({
        ...s,
        appointments: (s.appointments || []).filter(
          (a) =>
            a.status !== "Cancelled" &&
            (!paged || (timeToMinutes(a.endTime) > viewStart && timeToMinutes(a.startTime) < viewEnd))
        ),
      })),
    [staff, paged, viewStart, viewEnd]
  );

  const occupied = useMemo(() => computeOccupied(slots, visibleStaff, schedule.startTime), [slots, visibleStaff, schedule.startTime]);
  const { widths, cumX, totalWidth } = useMemo(
    () => computeScale(viewSlots, occupied.slice(pageStartIdx), compact, slotWidth),
    [viewSlots, occupied, pageStartIdx, compact, slotWidth]
  );
  const minutesToX = useMemo(() => makeMinutesToX(viewStart, widths, cumX), [viewStart, widths, cumX]);

  const handleSelect = (appt, staffName) => setSelected({ appt, staffName });

  return (
    <div data-tour="schedule-grid" className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
      <div className="flex items-center justify-end gap-3 px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--surface-faint-2)]">
        {paged && pageCount > 1 && (
          <div className="flex items-center gap-2 mr-auto">
            <PagerButton
              direction="prev"
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
              label={t("Previous block") || "Previous block"}
            />
            <span className="text-xs font-semibold text-[var(--text-primary)] tabular-nums">
              {minutesToTime(viewStart)} – {minutesToTime(viewEnd)}
            </span>
            <span className="text-xs text-[var(--text-muted)] tabular-nums">{currentPage + 1} / {pageCount}</span>
            <PagerButton
              direction="next"
              disabled={currentPage === pageCount - 1}
              onClick={() => setPage(currentPage + 1)}
              label={t("Next block") || "Next block"}
            />
          </div>
        )}
        <button
          type="button"
          onClick={toggleCompact}
          className="text-xs font-semibold bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-lg px-3 py-1.5 hover:bg-[var(--surface-muted)] transition-colors"
        >
          {compact ? (t("showFullDay") || "Show full day") : (t("hideEmptySlots") || "Hide empty slots")}
        </button>
      </div>

      <div ref={scrollRef} className={paged ? "overflow-y-auto overflow-x-hidden" : "overflow-auto"} style={{ maxHeight: GRID_MAX_HEIGHT }}>
        <div className="relative" style={{ width: LABEL_WIDTH + totalWidth }}>
          <TimeHeader slots={viewSlots} widths={widths} />
          {isToday && (
            <CurrentTimeLine
              scheduleStart={viewStart}
              scheduleEnd={viewEnd}
              rowsHeight={rowsHeight}
              minutesToX={minutesToX}
            />
          )}
          {visibleStaff.map((s) => (
            <StaffRow
              key={s.staffId}
              staff={s}
              widths={widths}
              totalWidth={totalWidth}
              onSelect={(appt) => handleSelect(appt, s.staffName)}
              minutesToX={minutesToX}
            />
          ))}
        </div>
      </div>

      {selected && (
        <AppointmentDetailsModal
          appt={selected.appt}
          staffName={selected.staffName}
          date={selectedDate}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default ScheduleGrid;
