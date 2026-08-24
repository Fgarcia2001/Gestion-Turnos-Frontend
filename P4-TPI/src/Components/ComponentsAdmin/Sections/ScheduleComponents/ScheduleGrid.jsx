// ScheduleGrid.jsx
// Horizontal day agenda: staff as rows, time running left-to-right in 30-minute columns.
import { useState, useEffect, useMemo } from "react";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import { STATUS_STYLES } from "./statusStyles";

const LABEL_WIDTH = 184;
const SLOT_WIDTH = 120;
const COLLAPSED_WIDTH = 1;
const ROW_HEIGHT = 76;
const STEP_MINUTES = 15;
const GRID_MAX_HEIGHT = "calc(100vh - 320px)";

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

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
const computeScale = (slots, occupied, compact) => {
  const widths = slots.map((_, i) => (occupied[i] || !compact ? SLOT_WIDTH : COLLAPSED_WIDTH));
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
  <div className="flex sticky top-0 z-20 bg-white border-b border-[#e2ddd8]">
    <div
      className="shrink-0 sticky left-0 z-30 bg-white border-r border-[#e2ddd8]"
      style={{ width: LABEL_WIDTH, height: 44 }}
    />
    {slots.map((slot, i) => {
      const collapsed = widths[i] < SLOT_WIDTH;
      return (
        <div
          key={slot}
          className={
            collapsed
              ? "shrink-0 border-r border-[#f0ede8] bg-[#f9f8f6]"
              : "shrink-0 flex items-center justify-center border-r border-[#f0ede8] text-[12px] font-semibold text-[#5a5a6e] tracking-wide"
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
  const style = STATUS_STYLES[appt.status] || STATUS_STYLES.Confirmed;
  const left = minutesToX(appt.startTime);
  const right = minutesToX(appt.endTime);
  const isCancelled = appt.status === "Cancelled";

  return (
    <button
      type="button"
      onClick={() => onSelect(appt)}
      title={`${appt.clientName || "—"} · ${appt.serviceName || "—"} · ${appt.startTime}-${appt.endTime}${appt.status ? ` · ${appt.status}` : ""}`}
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
  <div className="flex border-b border-[#e2ddd8]" style={{ height: ROW_HEIGHT }}>
    <div
      className="shrink-0 sticky left-0 z-10 bg-white border-r border-[#e2ddd8] flex items-center gap-2.5 px-3.5"
      style={{ width: LABEL_WIDTH }}
    >
      <div className="w-9 h-9 shrink-0 rounded-full bg-[#f0ede8] text-[#1a1a2e] flex items-center justify-center text-[12px] font-bold">
        {getInitials(staff.staffName)}
      </div>
      <span className="text-sm font-semibold text-[#1a1a2e] truncate">{staff.staffName}</span>
    </div>

    <div className="relative" style={{ width: totalWidth }}>
      <div className="absolute inset-0 flex">
        {widths.map((w, i) => (
          <div key={i} className="shrink-0 border-r border-[#f0ede8]" style={{ width: w }} />
        ))}
      </div>
      {(staff.appointments || []).map((appt) => (
        <AppointmentBlock key={appt.id} appt={appt} onSelect={onSelect} minutesToX={minutesToX} />
      ))}
    </div>
  </div>
);

const ScheduleGrid = ({ staff, schedule, isToday, selectedDate }) => {
  const slots = useMemo(() => generateSlots(schedule.startTime, schedule.endTime), [schedule.startTime, schedule.endTime]);
  const [selected, setSelected] = useState(null);
  const [compact, setCompact] = useState(true);
  const rowsHeight = staff.length * ROW_HEIGHT;

  const occupied = useMemo(() => computeOccupied(slots, staff, schedule.startTime), [slots, staff, schedule.startTime]);
  const { widths, cumX, totalWidth } = useMemo(() => computeScale(slots, occupied, compact), [slots, occupied, compact]);
  const minutesToX = useMemo(() => makeMinutesToX(schedule.startTime, widths, cumX), [schedule.startTime, widths, cumX]);

  const handleSelect = (appt, staffName) => setSelected({ appt, staffName });

  return (
    <div className="bg-white rounded-2xl border border-[#e2ddd8] overflow-hidden">
      <div className="flex items-center justify-end px-4 py-2.5 border-b border-[#e2ddd8] bg-[#fcfbf9]">
        <button
          type="button"
          onClick={() => setCompact((c) => !c)}
          className="text-xs font-semibold bg-white border border-[#e2ddd8] text-[#1a1a2e] rounded-lg px-3 py-1.5 hover:bg-[#f0ede8] transition-colors"
        >
          {compact ? "Show full day" : "Hide empty slots"}
        </button>
      </div>

      <div className="overflow-auto" style={{ maxHeight: GRID_MAX_HEIGHT }}>
        <div className="relative" style={{ width: LABEL_WIDTH + totalWidth }}>
          <TimeHeader slots={slots} widths={widths} />
          {isToday && (
            <CurrentTimeLine
              scheduleStart={schedule.startTime}
              scheduleEnd={schedule.endTime}
              rowsHeight={rowsHeight}
              minutesToX={minutesToX}
            />
          )}
          {staff.map((s) => (
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
