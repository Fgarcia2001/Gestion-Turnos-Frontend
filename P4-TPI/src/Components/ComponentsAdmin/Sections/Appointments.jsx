import { useState, useEffect } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { fetchBranchData } from "./ManagmentBusinessComponents/Data";
import { fetchAppointmentsByDate, fetchMyBranchAppointmentsByDate } from "../../../services/api";
import { updateAppointmentStatus, fetchMyAppointments } from "../../../services/appointmentService";
import { useAuth } from "../../../../CustomHooks/AuthContext";
import { ModalOverlay } from "./ManagmentBusinessComponents/Shared";
import { IconX, IconWarning } from "./ManagmentBusinessComponents/Icons";

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
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const CSS_ANIMATIONS = `
  @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
`;



// ── Calendar ──────────────────────────────────────────────────────────────────
const Calendar = ({ selected, onSelect, appointments, viewDate, onViewDateChange }) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, cur: false });
  for (let d = 1; d <= daysCount; d++)
    cells.push({ day: d, cur: true });
  let next = 1;
  while (cells.length % 7 !== 0) cells.push({ day: next++, cur: false });

  const apptDays = new Set(
    (appointments || [])
      .map((a) => (a.day || "").split("-").map(Number))
      .filter(([y, m]) => y === year && m === month + 1)
      .map(([, , d]) => d)
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
          const hasAppt = c.cur && apptDays.has(c.day);
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
const APPOINTMENT_STATUS = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Confirmed" },
  { value: 2, label: "Cancelled" },
];

const STATUS_STYLES = {
  Pending: "bg-[#fef3c7] text-[#b45309]",
  Confirmed: "bg-[#dcfce7] text-[#15803d]",
  Cancelled: "bg-[#fee2e2] text-[#b91c1c]",
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_STYLES[status] || STATUS_STYLES.Confirmed;
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg}`}>{status}</span>
  );
};

// ── Status change menu ───────────────────────────────────────────────────────
const StatusMenu = ({ status, onChangeStatus, disabled }) => {
  const [open, setOpen] = useState(false);
  const current = APPOINTMENT_STATUS.find(s => s.label === status)?.value;

  return (
    <div
      className="relative"
      onClick={e => e.stopPropagation()}
      onMouseEnter={() => !disabled && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <StatusBadge status={status} />
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-32 bg-white border border-[#e2ddd8] rounded-xl shadow-lg overflow-hidden z-20">
            {APPOINTMENT_STATUS.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => { setOpen(false); if (s.value !== current) onChangeStatus(s.value); }}
                className={`w-full text-left text-xs px-3 py-2 hover:bg-[#f0ede8] transition-colors ${s.value === current ? "font-semibold text-[#1a1a2e]" : "text-[#6b7280]"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
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

// ── Cancel appointment modal ──────────────────────────────────────────────────
const CancelAppointmentModal = ({ appt, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  const close = () => {
    if (!submitting) onClose();
  };

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onConfirm();
    } catch {
      // El rollback y el toast de error ya los maneja el handler principal
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  const [y, m, d] = (appt.day || "---").split("-");
  const dateLabel = `${d}/${m}/${y}`;
  const timeLabel = appt.startTime || "--";

  return (
    <ModalOverlay onClose={close}>
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#e2ddd8] p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#b91c1c] shrink-0">
            <IconWarning />
          </div>
          <button onClick={close} disabled={submitting} aria-label="Close" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0ede8] text-[#6b7280] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <IconX />
          </button>
        </div>

        <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">{t("Cancel appointment") || "Cancelar turno"}</h3>

        <div className="bg-[#f9f8f6] rounded-xl p-4 space-y-2 mb-4">
          <p className="text-sm">
            <span className="font-semibold text-[#1a1a2e]">{t("Client") || "Cliente"}: </span>
            <span className="text-[#6b7280]">{appt.clientName || "—"}</span>
          </p>
          <p className="text-sm">
            <span className="font-semibold text-[#1a1a2e]">{t("Service") || "Servicio"}: </span>
            <span className="text-[#6b7280]">{appt.serviceName || "—"}</span>
          </p>
          <p className="text-sm">
            <span className="font-semibold text-[#1a1a2e]">{t("Date and time") || "Fecha y hora"}: </span>
            <span className="text-[#6b7280]">{dateLabel} {t("at") || "a las"} {timeLabel}</span>
          </p>
        </div>

        <div className="bg-[#fef3c7] border border-[#fde68a] rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-[#92400e] leading-relaxed">
            {t("Cancel email warning") || "Se enviará un email al cliente avisándole que su turno fue cancelado."}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={close}
            disabled={submitting}
            className="px-4 py-2 rounded-xl border border-[#e2ddd8] text-sm font-semibold text-[#6b7280] hover:bg-[#f0ede8] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("Back") || "Volver"}
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting && <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {t("Yes, cancel appointment") || "Sí, cancelar turno"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

// ── Appointment card ──────────────────────────────────────────────────────────
const AppointmentCard = ({ appt, onStatusChange, canChangeStatus }) => {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const isPending = appt.status === "Pending";
  const timeRange = `${toTime12(appt.startTime)} - ${toTime12(appt.endTime)}`;

  const handleStatusChange = async (value) => {
    if (value === 2) {
      setConfirming(true);
      return;
    }
    setUpdating(true);
    try {
      await onStatusChange(appt.id, value);
    } catch {
      // El toast de error ya lo muestra el handler principal
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmCancel = () => onStatusChange(appt.id, 2);

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 cursor-pointer
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
            <span className="text-sm font-semibold text-[#1a1a2e]">{Number(appt.totalCost || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          {canChangeStatus ? (
            <StatusMenu status={appt.status || "Confirmed"} onChangeStatus={handleStatusChange} disabled={updating} />
          ) : (
            <StatusBadge status={appt.status || "Confirmed"} />
          )}
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

      {confirming && (
        <CancelAppointmentModal appt={appt} onClose={() => setConfirming(false)} onConfirm={handleConfirmCancel} />
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
  const [toast, setToast] = useState(null);

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const { user } = useAuth();

  const isProfessional = role === "2" || role === "Profesional" || role === "Professional";

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setUserBranchId(user.branchId);
    }
  }, [user]);

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
        if (role === "2" || role === "Profesional" || role === "Professional") {
          const all = await fetchMyAppointments();
          data = all.filter((a) => {
            const [y, m, d] = (a.day || "").split("-").map(Number);
            return y === viewDate.getFullYear() && m === viewDate.getMonth() + 1 && d === selectedDay;
          });
        } else if (role === "Recepcionista" || role === "Receptionist") {
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

  const handleStatusChange = async (apptId, statusValue) => {
    const prevAppointments = appointments;
    const newLabel = APPOINTMENT_STATUS.find(s => s.value === statusValue)?.label;
    setAppointments(list => list.map(a => (a.id === apptId ? { ...a, status: newLabel } : a)));
    try {
      await updateAppointmentStatus(apptId, statusValue);
      if (statusValue === 2) {
        showToast(t("Appointment cancelled, email sent") || "Turno cancelado. Se envió un email al cliente.");
      }
    } catch (e) {
      console.error(e);
      setAppointments(prevAppointments);
      showToast(e?.message || "No se pudo actualizar el turno. Inténtelo nuevamente.", true);
      throw e;
    }
  };

  const formatDate = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex flex-col gap-6">
      <style>{CSS_ANIMATIONS}</style>

      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg ${toast.isError ? "bg-[#dc2626]" : "bg-[#1a1a2e]"}`}>
          {toast.isError ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17L4 12" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}

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
                appointments.map(appt => <AppointmentCard key={appt.id} appt={appt} onStatusChange={handleStatusChange} canChangeStatus={!isProfessional} />)
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default Appointments;