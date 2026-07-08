import { useState, useEffect } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { fetchBranchData } from "./ManagmentBusinessComponents/Data";
import { decodeToken, fetchAppointmentsByDate, fetchMyBranchAppointmentsByDate } from "../../../services/api";

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



// ── Calendar ──────────────────────────────────────────────────────────────────
const Calendar = ({ selected, onSelect, appointments, viewDate, onViewDateChange }) => {
  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay  = new Date(year, month, 1).getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const prevDays  = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, cur: false });
  for (let d = 1; d <= daysCount; d++)
    cells.push({ day: d, cur: true });
  let next = 1;
  while (cells.length % 7 !== 0) cells.push({ day: next++, cur: false });

  const apptDays = new Set(
    (appointments || []).filter(a => { const d = new Date(a.day); return d.getMonth() === month && d.getFullYear() === year; }).map(a => new Date(a.day).getDate())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => onViewDateChange(new Date(year, month - 1, 1))} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f0ede8] text-[#6b7280] transition-colors">
          <IconChevronLeft />
        </button>
        <span className="text-sm font-semibold text-[#1a1a2e]">{MONTHS[month]} {year}</span>
        <button onClick={() => onViewDateChange(new Date(year, month + 1, 1))} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#f0ede8] text-[#6b7280] transition-colors">
          <IconChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-[#9a9a9a] py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((c, i) => {
          const isSelected = c.cur && c.day === selected;
          const hasAppt    = c.cur && apptDays.has(c.day);
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

const getInitials = (name) => {
  if (!name) return "--";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
};

const toTime12 = (iso) => {
  if (!iso) return "--";
  const [h, m] = iso.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${m} ${ampm}`;
};

// ── Appointment card ──────────────────────────────────────────────────────────
const AppointmentCard = ({ appt }) => {
  const [expanded, setExpanded] = useState(false);
  const isPending = appt.status === "Pending";
  const timeRange = `${toTime12(appt.startTime)} - ${toTime12(appt.endTime)}`;

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer
        ${isPending ? "border-l-4 border-l-[#f59e0b] border-[#e2ddd8]" : "border-[#e2ddd8]"}
      `}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex items-center gap-4 px-5 py-4">
        <Avatar initials={getInitials(appt.clientName)} color="#dbeafe" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1a1a2e] text-sm">{appt.clientName || "—"}</p>
          <p className="text-xs text-[#9a9a9a]">{appt.serviceName || "—"}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 text-[#22c55e]">
            <IconDollar />
            <span className="text-sm font-semibold text-[#1a1a2e]">${Number(appt.totalCost || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <StatusBadge status={appt.status || "Confirmed"} pending={isPending} />
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#6b7280]">
            <IconClock />
            <span className="text-xs">{timeRange}</span>
          </div>
          {appt.payment && (
            <div className="flex items-center gap-1.5 text-[#6b7280]">
              <IconDollar />
              <span className="text-xs">{appt.payment}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-[#6b7280]">
          <IconUser />
          <span className="text-xs">{appt.staffName || "--"}</span>
        </div>
      </div>

      {appt.observation && (
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-5 pb-4 border-t border-[#f0ede8] pt-3">
            <p className="text-xs text-[#6b7280] leading-relaxed">{appt.observation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const Appointments = () => {
  const { t } = useTranslation();
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [userBranchId, setUserBranchId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  useEffect(() => {
    const user = decodeToken();
    if (user) {
      setRole(user.role);
      setUserBranchId(user.branchId);
    }
  }, []);

  useEffect(() => {
    const lastDay = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    if (selectedDay > lastDay) setSelectedDay(lastDay);
  }, [viewDate]);

  useEffect(() => {
    if (role !== "Admin") return;
    fetchBranchData().then(setBranches);
  }, [role]);

  useEffect(() => {
    async function loadAppointments() {
      setLoading(true);
      try {
        const day = new Date(viewDate.getFullYear(), viewDate.getMonth(), selectedDay);
        let data;
        if (role === "Recepcionista" || role === "Receptionist") {
          data = await fetchMyBranchAppointmentsByDate(day);
        } else {
          data = await fetchAppointmentsByDate(day, selectedBranchId);
        }
        setAppointments(Array.isArray(data) ? data : []);
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }
    if (role && selectedDay) loadAppointments();
  }, [selectedDay, selectedBranchId, role, viewDate]);

  const formatDate = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex flex-col gap-6">

      <div className="flex gap-5 items-start">

        <div className="w-[300px] shrink-0 bg-white rounded-2xl border border-[#e2ddd8] p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[#1a1a2e]">{t("Calendar") || "Calendar"}</h2>
            <button className="flex items-center gap-1.5 bg-[#1a1a2e] text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#2d2d44] transition-colors">
              <IconPlus />
              {t("New Appointment") || "New Appointment"}
            </button>
          </div>
          {role === "Admin" && branches.length > 0 && (
            <div className="mb-4">
              <label className="text-xs font-semibold text-[#6b7280] block mb-1.5">{t("Branch") || "Branch"}</label>
              <select
                value={selectedBranchId || ""}
                onChange={e => setSelectedBranchId(e.target.value || null)}
                className="w-full text-sm bg-[#f9f8f6] border border-[#e2ddd8] rounded-xl px-3 py-2 text-[#1a1a2e] outline-none focus:border-[#1a1a2e] transition-colors"
              >
                <option value="">{t("All branches") || "All branches"}</option>
                {branches.map(b => (
                  <option key={b.id || b.branchId} value={b.id || b.branchId}>
                    {b.name || b.branchName}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Calendar selected={selectedDay} onSelect={setSelectedDay} appointments={appointments} viewDate={viewDate} onViewDateChange={setViewDate} />
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="size-8 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="mb-1">
                <h2 className="text-lg font-bold text-[#1a1a2e]">{formatDate(selectedDay)}</h2>
                <p className="text-sm text-[#9a9a9a]">{appointments.length} appointments scheduled</p>
              </div>
              {appointments.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#e2ddd8] p-8 text-center">
                  <p className="text-sm text-[#9a9a9a]">{t("No appointments for this day") || "No appointments for this day"}</p>
                </div>
              ) : (
                appointments.map(appt => <AppointmentCard key={appt.id} appt={appt} />)
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default Appointments;