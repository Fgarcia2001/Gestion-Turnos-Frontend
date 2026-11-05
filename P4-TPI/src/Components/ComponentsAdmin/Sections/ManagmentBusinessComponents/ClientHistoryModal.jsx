import { useEffect, useState } from "react";
import { ModalOverlay } from "./Shared";
import { IconX } from "./Icons";
import { fetchAppointmentsByClient } from "../../../../services/api";

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600",
  Confirmed: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-600",
  PendingReassignment: "bg-purple-50 text-purple-600",
};
const STATUS_LABEL_KEYS = {
  Pending: "statusPending",
  Confirmed: "statusConfirmed",
  Cancelled: "statusCancelled",
  PendingReassignment: "statusPendingReassignment",
};
const PAYMENT_LABEL_KEYS = {
  Cash: "payment_cash",
  Transfer: "payment_transferencia",
  MercadoPago: "payment_mercadopago",
};
const STATUS_FILTERS = ["all", "Pending", "Confirmed", "Cancelled", "PendingReassignment"];

const formatDate = (day) => {
  if (!day) return "—";
  const d = new Date(day);
  return Number.isNaN(d.getTime()) ? day : d.toLocaleDateString();
};

// Historial completo de turnos de un cliente puntual (Managment Business →
// Clientes → "Ver historial"). Trae todo via /Appointment/by-client/{id} y
// filtra por estado del lado del cliente (la lista completa ya viene
// ordenada por fecha desde el backend).
export const ClientHistoryModal = ({ client, t, onClose, onViewAllAppointments }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const load = () => {
    setLoading(true);
    setError(false);
    fetchAppointmentsByClient(client.id)
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.id]);

  const filtered = statusFilter === "all" ? appointments : appointments.filter((a) => a.status === statusFilter);

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative flex flex-col"
        style={{ maxHeight: "85vh" }}
      >
        <div className="flex items-center justify-between mb-1 shrink-0">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[var(--text-primary)] truncate">
              {t("View history") || "View history"} <span className="text-[var(--text-muted)] font-semibold">— {client.name}</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
              {client.email}
              {client.phone ? ` · ${client.phone}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-muted)]"
          >
            <IconX />
          </button>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mt-4 mb-3 shrink-0">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                statusFilter === s
                  ? "bg-[var(--brand)] text-white"
                  : "bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted-2)]"
              }`}
            >
              {s === "all" ? (t("All") || "All") : (t(STATUS_LABEL_KEYS[s]) || s)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto -mx-1 px-1">
          {loading ? (
            <div className="flex flex-col gap-2 py-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-[var(--surface-muted)] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-sm text-[var(--text-muted)] mb-3">
                {t("Couldn't load the appointment history") || "Couldn't load the appointment history"}
              </p>
              <button
                onClick={load}
                className="bg-[var(--brand)] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[var(--brand-hover)] transition-colors cursor-pointer"
              >
                {t("Retry") || "Retry"}
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-10">
              {t("No appointments found.") || "No appointments found."}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between gap-3 border border-[var(--border-subtle)] rounded-xl px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{appt.serviceName}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                      {formatDate(appt.day)} · {appt.startTime}–{appt.endTime} · {appt.staffName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[appt.status] || STATUS_STYLES.Pending}`}>
                      {t(STATUS_LABEL_KEYS[appt.status]) || appt.status}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {t(PAYMENT_LABEL_KEYS[appt.payment]) || appt.payment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 mt-2 border-t border-[var(--border-faint)] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border-subtle)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors"
          >
            {t("Close") || "Close"}
          </button>
          <button
            type="button"
            onClick={onViewAllAppointments}
            className="flex-1 py-2.5 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors"
          >
            {t("viewAllAppointmentsButton") || "View all appointments"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};
