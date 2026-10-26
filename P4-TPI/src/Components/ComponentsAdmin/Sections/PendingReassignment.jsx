import { useEffect, useState } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import {
  fetchPendingReassignmentAppointments,
  fetchStaffData,
  reassignAppointment,
} from "../../../services/api";
import { ModalOverlay, inputClass, labelClass } from "./ManagmentBusinessComponents/Shared";
import { IconX } from "./ManagmentBusinessComponents/Icons";

const isProfessionalRole = (rol) => rol === 2 || rol === "Profesional" || rol === "Professional";

const formatDate = (day) => {
  if (!day) return "—";
  const [y, m, d] = day.split("-");
  return `${d}/${m}/${y}`;
};

const formatMoney = (value) =>
  typeof value === "number" ? `$${value.toLocaleString("es-AR")}` : "—";

const DetailRow = ({ label, value }) => (
  <div>
    <p className={labelClass}>{label}</p>
    <p className="text-sm text-[var(--text-primary)] break-words">{value || "—"}</p>
  </div>
);

// ── Reassign modal ────────────────────────────────────────────────────────────
const ReassignModal = ({ appointment, staff, onClose, onReassigned }) => {
  const { t } = useTranslation();
  const [staffId, setStaffId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Profesionales de la misma sucursal del turno, distintos del anterior.
  const candidates = staff.filter((s) => {
    const id = s.id ?? s.staffId;
    const sameBranch = s.branchId
      ? s.branchId === appointment.branchId
      : s.branchName === appointment.branchName;
    return isProfessionalRole(s.rol) && id !== appointment.staffId && sameBranch;
  });

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");
    try {
      await reassignAppointment(appointment.id, staffId);
      onReassigned(appointment.id);
    } catch (e) {
      setError(e.message || "No se pudo reasignar el turno");
      setSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={onClose} aria-label="Close"
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-muted)]">
          <IconX />
        </button>

        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-5">
          {t("Reassign appointment") || "Reasignar turno"}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <DetailRow label={t("Client") || "Cliente"} value={appointment.clientName} />
          <DetailRow label="Email" value={appointment.clientEmail} />
          <DetailRow label={t("Phone") || "Teléfono"} value={appointment.clientPhone} />
          <DetailRow label={t("Service") || "Servicio"} value={
            appointment.serviceName
              ? `${appointment.serviceName}${appointment.serviceDuration ? ` (${appointment.serviceDuration} min)` : ""}`
              : ""
          } />
          <DetailRow label={t("Date") || "Fecha"} value={formatDate(appointment.day)} />
          <DetailRow label={t("Time") || "Horario"} value={`${appointment.startTime} - ${appointment.endTime}`} />
          <DetailRow label={t("Branch") || "Sucursal"} value={appointment.branchName} />
          <DetailRow label={t("Previous professional") || "Profesional anterior"} value={appointment.staffName} />
          <DetailRow label={t("Payment") || "Pago"} value={appointment.payment} />
          <DetailRow label="Total" value={formatMoney(appointment.totalCost)} />
          <div className="col-span-2">
            <DetailRow label={t("Observation") || "Observación"} value={appointment.observation} />
          </div>
        </div>

        <div className="mb-5">
          <label className={labelClass}>{t("New professional") || "Nuevo profesional"}</label>
          <select value={staffId} onChange={(e) => setStaffId(e.target.value)} className={inputClass}
            disabled={candidates.length === 0}>
            <option value="">{t("Select a professional") || "Seleccionar profesional"}</option>
            {candidates.map((s) => {
              const id = s.id ?? s.staffId;
              return <option key={id} value={id}>{s.staffName}</option>;
            })}
          </select>
          {candidates.length === 0 && (
            <p className="text-xs text-[#b45309] mt-1.5">
              {t("No professionals available in this branch") || "No hay profesionales disponibles en esta sucursal"}
            </p>
          )}
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={onClose} disabled={submitting}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border-subtle)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors disabled:opacity-50 cursor-pointer">
            {t("Cancel") || "Cancelar"}
          </button>
          <button type="button" onClick={handleConfirm} disabled={!staffId || submitting}
            className="flex-1 py-2.5 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50 cursor-pointer">
            {submitting ? "Saving..." : t("Confirm") || "Confirmar"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const PendingReassignment = ({ onChange }) => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchPendingReassignmentAppointments(), fetchStaffData()]).then(([appts, staffList]) => {
      if (cancelled) return;
      setAppointments(Array.isArray(appts) ? appts : []);
      setStaff(Array.isArray(staffList) ? staffList : []);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleReassigned = (id) => {
    const remaining = appointments.filter((a) => a.id !== id);
    setAppointments(remaining);
    setSelected(null);
    onChange?.(remaining.length);
    setToast(t("Appointment reassigned email sent") || "Turno reasignado. Se envió un email al cliente.");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          {t("Pending reassignment appointments title") || "Turnos pendientes de reasignar"}
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          {t("Pending reassignment subtitle") || "Elegí un nuevo profesional para cada turno."}
        </p>
      </div>

      {toast && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 text-green-700 text-sm font-semibold border border-green-100">
          {toast}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading...</p>
      ) : appointments.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl p-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            {t("No pending reassignment appointments") || "No hay turnos pendientes de reasignar"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((a) => (
            <div key={a.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl px-4 py-3">
              <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="min-w-0">
                  <p className={labelClass}>{t("Client") || "Cliente"}</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{a.clientName || "—"}</p>
                </div>
                <div>
                  <p className={labelClass}>{t("Date") || "Fecha"}</p>
                  <p className="text-sm text-[var(--text-primary)]">{formatDate(a.day)}</p>
                </div>
                <div>
                  <p className={labelClass}>{t("Time") || "Horario"}</p>
                  <p className="text-sm text-[var(--text-primary)]">{a.startTime} - {a.endTime}</p>
                </div>
                <div className="min-w-0">
                  <p className={labelClass}>{t("Branch") || "Sucursal"}</p>
                  <p className="text-sm text-[var(--text-primary)] truncate">{a.branchName || "—"}</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelected(a)}
                className="shrink-0 h-10 px-4 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors cursor-pointer">
                {t("Reassign") || "Reasignar"}
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <ReassignModal
          appointment={selected}
          staff={staff}
          onClose={() => setSelected(null)}
          onReassigned={handleReassigned}
        />
      )}
    </div>
  );
};

export default PendingReassignment;
