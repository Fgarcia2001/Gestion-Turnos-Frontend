import { useState } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18L9 12L15 6" />
  </svg>
);
const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18L15 12L9 6" />
  </svg>
);
const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9L12 15L18 9" />
  </svg>
);
const IconChevronUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 15L12 9L6 15" />
  </svg>
);
const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7V12L15 15" />
  </svg>
);
const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
  </svg>
);
const IconDollar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5V19M5 12H19" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

// Days that have appointments (day of month)
const HAS_APPOINTMENTS = new Set([3, 10, 15, 22, 30]);

const APPOINTMENTS = [
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    color: "#dbeafe",
    service: "Consultation",
    time: "09:00 AM",
    duration: "1h 30m",
    room: "Room 101",
    doctor: "Dr. Emily White",
    doctorInitials: "EW",
    amount: 150,
    status: "Confirmed",
    pending: false,
    description: "Initial consultation to discuss treatment options and create a personalized care plan. Patient has reported recurring symptoms that need evaluation.",
  },
  {
    id: 2,
    name: "Michael Chen",
    initials: "MC",
    color: "#fce7f3",
    service: "Follow-up",
    time: "11:00 AM",
    duration: "45m",
    room: "Room 203",
    doctor: "John Martinez",
    doctorInitials: "JM",
    amount: 75,
    status: "Confirmed",
    pending: false,
    description: "Follow-up visit to review recent lab results and adjust medication dosage if necessary.",
  },
  {
    id: 3,
    name: "Emily Davis",
    initials: "ED",
    color: "#fef3c7",
    service: "Initial Meeting",
    time: "02:30 PM",
    duration: "1h",
    room: "Room 105",
    doctor: "Dr. Emily White",
    doctorInitials: "EW",
    amount: 120,
    status: "Pending",
    pending: true,
    description: "First meeting with new patient. Review medical history and establish a baseline for ongoing treatment.",
  },
];

const UPCOMING = [
  { label: "Today",     count: 3, color: "#3b82f6" },
  { label: "Tomorrow",  count: 1, color: "#22c55e" },
  { label: "Friday",    count: 2, color: "#a855f7" },
  { label: "Saturday",  count: 0, color: "#9a9a9a" },
];

// ── Calendar ──────────────────────────────────────────────────────────────────
const Calendar = ({ selected, onSelect }) => {
  const [viewDate, setViewDate] = useState(new Date(2026, 4, 1)); // May 2026

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay  = new Date(year, month, 1).getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const prevDays  = new Date(year, month, 0).getDate();

  const cells = [];
  // prev month tail
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, cur: false });
  // current month
  for (let d = 1; d <= daysCount; d++)
    cells.push({ day: d, cur: true });
  // next month head
  let next = 1;
  while (cells.length % 7 !== 0) cells.push({ day: next++, cur: false });

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f0ede8] text-[#6b7280] transition-colors">
          <IconChevronLeft />
        </button>
        <span className="text-sm font-semibold text-[#1a1a2e]">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f0ede8] text-[#6b7280] transition-colors">
          <IconChevronRight />
        </button>
      </div>
      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-[#9a9a9a] py-1">{d}</div>
        ))}
      </div>
      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((c, i) => {
          const isSelected = c.cur && c.day === selected;
          const hasAppt    = c.cur && HAS_APPOINTMENTS.has(c.day);
          return (
            <button
              key={i}
              onClick={() => c.cur && onSelect(c.day)}
              className={`relative flex flex-col items-center justify-center h-9 w-full rounded-lg text-sm transition-all duration-150
                ${!c.cur ? "text-[#c9c5bf] cursor-default" : "cursor-pointer hover:bg-[#f0ede8]"}
                ${isSelected ? "!bg-[#1a1a2e] text-white font-semibold" : c.cur ? "text-[#1a1a2e]" : ""}
              `}
            >
              {c.day}
              {hasAppt && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#3b82f6]" />
              )}
            </button>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#f0ede8]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-[#3b82f6] bg-white inline-block" />
          <span className="text-xs text-[#9a9a9a]">Has appointments</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1a1a2e] inline-block" />
          <span className="text-xs text-[#9a9a9a]">Selected</span>
        </div>
      </div>
    </div>
  );
};

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status, pending }) => {
  const cfg = pending
    ? "bg-[#fef3c7] text-[#b45309]"
    : "bg-[#dcfce7] text-[#15803d]";
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg}`}>{status}</span>
  );
};

// ── Avatar initials ───────────────────────────────────────────────────────────
const Avatar = ({ initials, color, size = "md" }) => {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-semibold shrink-0`}
      style={{ background: color, color: "#1a1a2e" }}>
      {initials}
    </div>
  );
};

// ── Appointment card ──────────────────────────────────────────────────────────
const AppointmentCard = ({ appt }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer
        ${appt.pending ? "border-l-4 border-l-[#f59e0b] border-[#e2ddd8]" : "border-[#e2ddd8]"}
      `}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Main row */}
      <div className="flex items-center gap-4 px-5 py-4">
        <Avatar initials={appt.initials} color={appt.color} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1a1a2e] text-sm">{appt.name}</p>
          <p className="text-xs text-[#9a9a9a]">{appt.service}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 text-[#22c55e]">
            <IconDollar />
            <span className="text-sm font-semibold text-[#1a1a2e]">${appt.amount}.00</span>
          </div>
          <StatusBadge status={appt.status} pending={appt.pending} />
        </div>
      </div>

      {/* Detail row */}
      <div className="flex items-center justify-between px-5 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#6b7280]">
            <IconClock />
            <span className="text-xs">{appt.time}</span>
            <span className="text-xs text-[#b0aba5]">({appt.duration})</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#6b7280]">
            <IconMapPin />
            <span className="text-xs">{appt.room}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#6b7280]">
          <IconUser />
          <span className="text-xs">Assigned to:</span>
          <Avatar initials={appt.doctorInitials} color="#e2ddd8" size="sm" />
          <span className="text-xs font-semibold text-[#1a1a2e]">{appt.doctor}</span>
        </div>
      </div>

      {/* Expandable description */}
<div
  className={`
    overflow-hidden
    transition-all
    duration-500
    ease-in-out
    ${expanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
  `}
>
  <div className="px-5 pb-4 border-t border-[#f0ede8] pt-3">
    <div className="flex items-start gap-2 text-[#6b7280]">
      <span className="mt-0.5 shrink-0">
        <IconChevronDown />
      </span>
      <p className="text-xs leading-relaxed">{appt.description}</p>
    </div>
  </div>
</div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const Appointments = () => {
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState(30);

  const selectedDate = `Wednesday, April 10, 2024`; // static for now; wire to real date logic if needed

  return (
    <div className="flex flex-col gap-6">

      {/* Top: calendar + day appointments */}
      <div className="flex gap-5 items-start">

        {/* Calendar card */}
        <div className="w-[300px] shrink-0 bg-white rounded-2xl border border-[#e2ddd8] p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[#1a1a2e]">{t("Calendar") || "Calendar"}</h2>
            <button className="flex items-center gap-1.5 bg-[#1a1a2e] text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#2d2d44] transition-colors">
              <IconPlus />
              {t("New Appointment") || "New Appointment"}
            </button>
          </div>
          <Calendar selected={selectedDay} onSelect={setSelectedDay} />
        </div>

        {/* Day appointments */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="mb-1">
            <h2 className="text-lg font-bold text-[#1a1a2e]">{selectedDate}</h2>
            <p className="text-sm text-[#9a9a9a]">{APPOINTMENTS.length} appointments scheduled</p>
          </div>
          {APPOINTMENTS.map(appt => (
            <AppointmentCard key={appt.id} appt={appt} />
          ))}
        </div>
      </div>

      {/* Upcoming this week */}
      <div>
        <h2 className="text-base font-bold text-[#1a1a2e] mb-3">{t("Upcoming This Week") || "Upcoming This Week"}</h2>
        <div className="grid grid-cols-4 gap-4">
          {UPCOMING.map(({ label, count, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-[#e2ddd8] px-5 py-4 flex flex-col gap-1">
              <p className="text-xs text-[#9a9a9a] font-medium">{label}</p>
              <div className="flex items-end gap-2">
                <div className="w-1 h-8 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-3xl font-bold text-[#1a1a2e] leading-none">{count}</span>
              </div>
              <p className="text-xs text-[#9a9a9a]">
                {count === 1 ? "appointment" : "appointments"}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Appointments;