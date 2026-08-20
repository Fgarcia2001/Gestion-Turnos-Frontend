// ScheduleGrid.jsx
// Horizontal day agenda: staff as rows, time running left-to-right in 30-minute columns.

const LABEL_WIDTH = 176;
const SLOT_WIDTH = 88;
const ROW_HEIGHT = 68;
const STEP_MINUTES = 15;

const STATUS_STYLES = {
  Pending: { bg: "#fef3c7", border: "#f59e0b", text: "#b45309" },
  Confirmed: { bg: "#dcfce7", border: "#22c55e", text: "#15803d" },
  Cancelled: { bg: "#fee2e2", border: "#ef4444", text: "#b91c1c" },
};

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

const TimeHeader = ({ slots }) => (
  <div className="flex sticky top-0 z-20 bg-white border-b border-[#e2ddd8]">
    <div
      className="shrink-0 sticky left-0 z-30 bg-white border-r border-[#e2ddd8]"
      style={{ width: LABEL_WIDTH, height: 40 }}
    />
    {slots.map((slot) => (
      <div
        key={slot}
        className="shrink-0 flex items-center justify-center border-r border-[#e2ddd8] text-[11px] font-semibold text-[#5a5a6e]"
        style={{ width: SLOT_WIDTH, height: 40 }}
      >
        {slot}
      </div>
    ))}
  </div>
);

const AppointmentBlock = ({ appt, scheduleStart }) => {
  const style = STATUS_STYLES[appt.status] || STATUS_STYLES.Confirmed;
  const startOffset = timeToMinutes(appt.startTime) - timeToMinutes(scheduleStart);
  const duration = timeToMinutes(appt.endTime) - timeToMinutes(appt.startTime);
  const isCancelled = appt.status === "Cancelled";

  return (
    <div
      title={`${appt.clientName || "—"} · ${appt.serviceName || "—"} · ${appt.startTime}-${appt.endTime}${appt.status ? ` · ${appt.status}` : ""}`}
      className="absolute top-1.5 bottom-1.5 rounded-lg px-2 py-1 overflow-hidden border cursor-default"
      style={{
        left: (startOffset / STEP_MINUTES) * SLOT_WIDTH + 2,
        width: Math.max((duration / STEP_MINUTES) * SLOT_WIDTH - 4, 12),
        backgroundColor: style.bg,
        borderColor: style.border,
        opacity: isCancelled ? 0.6 : 1,
      }}
    >
      <p
        className="text-[11px] font-bold truncate leading-tight"
        style={{ color: style.text, textDecoration: isCancelled ? "line-through" : "none" }}
      >
        {appt.clientName || "—"}
      </p>
      <p className="text-[10px] truncate leading-tight mt-0.5" style={{ color: style.text }}>
        {appt.serviceName || "—"}
      </p>
    </div>
  );
};

const StaffRow = ({ staff, slots, scheduleStart }) => (
  <div className="flex border-b border-[#e2ddd8]" style={{ height: ROW_HEIGHT }}>
    <div
      className="shrink-0 sticky left-0 z-10 bg-white border-r border-[#e2ddd8] flex items-center gap-2 px-3"
      style={{ width: LABEL_WIDTH }}
    >
      <div className="w-8 h-8 shrink-0 rounded-full bg-[#f0ede8] text-[#1a1a2e] flex items-center justify-center text-[12px] font-bold">
        {getInitials(staff.staffName)}
      </div>
      <span className="text-sm font-semibold text-[#1a1a2e] truncate">{staff.staffName}</span>
    </div>

    <div className="relative" style={{ width: slots.length * SLOT_WIDTH }}>
      <div className="absolute inset-0 flex">
        {slots.map((slot) => (
          <div key={slot} className="shrink-0 border-r border-[#f0ede8]" style={{ width: SLOT_WIDTH }} />
        ))}
      </div>
      {(staff.appointments || []).map((appt) => (
        <AppointmentBlock key={appt.id} appt={appt} scheduleStart={scheduleStart} />
      ))}
    </div>
  </div>
);

const ScheduleGrid = ({ staff, schedule }) => {
  const slots = generateSlots(schedule.startTime, schedule.endTime);

  return (
    <div className="bg-white rounded-2xl border border-[#e2ddd8] overflow-hidden">
      <div className="overflow-x-auto">
        <div style={{ width: LABEL_WIDTH + slots.length * SLOT_WIDTH }}>
          <TimeHeader slots={slots} />
          {staff.map((s) => (
            <StaffRow key={s.staffId} staff={s} slots={slots} scheduleStart={schedule.startTime} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleGrid;
