import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../../../CustomHooks/AuthContext";
import { useTranslation } from "../../../../../CustomHooks/TraslateHook";
import { validateClientInfo } from "../../../ComponentsBookingPage/Steps/stepValidation";
import BookingCalendar from "../../../ComponentsBookingPage/Calendar";
import { addMonthsClamped } from "../../../ComponentsBookingPage/dateUtils";
import { createAppointment, fetchAvailableSlots } from "../../../../services/appointmentService";
import { toDateParam } from "../../../../services/api";
import { fetchStaffByBranch } from "../../../../services/staffService";
import { fetchBranchInfo } from "../../../../services/branchService";
import { fetchServiceData, searchClients } from "../ManagmentBusinessComponents/Data";
import { ModalOverlay, inputClass, labelClass } from "../ManagmentBusinessComponents/Shared";
import { IconX } from "../ManagmentBusinessComponents/Icons";
import PhoneField from "../../../Shared/PhoneField";

// ── Icons (self-contained, same convention as the rest of this section) ──────
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);
const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18L9 12L15 6" />
  </svg>
);
const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconClipboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
  </svg>
);

// Selection styling. In dark mode --brand barely differs from the surface, so
// selected state uses the dedicated --select-* tokens (see index.css).
const cardClass = (selected) =>
  `relative text-left p-4 rounded-2xl border-2 transition-all ${
    selected
      ? "border-[var(--select-border)] bg-[var(--select-bg)] shadow-sm"
      : "border-[var(--border-subtle)] hover:border-[var(--border-accent)] hover:bg-[var(--surface-faint)]"
  }`;
const chipClass = (selected, extra = "") =>
  `border-2 text-sm font-semibold transition-all ${
    selected
      ? "border-[var(--select-fill)] bg-[var(--select-fill)] text-[var(--on-select-fill)] shadow-sm"
      : "border-[var(--border-accent)] bg-[var(--surface-faint)] text-[var(--text-primary)] hover:border-[var(--select-border)]"
  } ${extra}`;
const CheckBadge = () => (
  <span className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-[var(--select-fill)] text-[var(--on-select-fill)]">
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  </span>
);

// ── Step list: branch only shown to Admin, staff skipped for Profesional ─────
const resolveSteps = (role) => {
  const steps = ["client"];
  if (role === "Admin") steps.push("branch");
  steps.push("service");
  if (role !== "Profesional") steps.push("staff");
  steps.push("datetime", "confirm");
  return steps;
};

const STEP_LABEL_KEYS = {
  client: "Client",
  branch: "Branch",
  service: "Service",
  staff: "Staff",
  datetime: "Date and time",
  confirm: "Confirm",
};
const STEP_LABEL_FALLBACKS = {
  client: "Client",
  branch: "Branch",
  service: "Service",
  staff: "Staff",
  datetime: "Date and time",
  confirm: "Confirm",
};

const emptyClientFields = { clientName: "", clientEmail: "", clientPhone: "", clientBirthDay: "" };

// New appointment, created by staff from the dashboard. Role decides what's
// fixed vs selectable: Admin picks any branch of the business; Recepcionista
// and Profesional are locked to their own branch (user.branchId); Profesional
// is additionally always the staff member of their own appointment (skips
// that step entirely — the appointment is for themselves).
const NewAppointmentModal = ({ branches = [], onClose, onCreated }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const role = user?.role;
  const isAdmin = role === "Admin";
  const isProfessional = role === "Profesional";

  const steps = useMemo(() => resolveSteps(role), [role]);
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];

  // ── Client ──
  const [clientMode, setClientMode] = useState("search"); // "search" | "form"
  const [clientQuery, setClientQuery] = useState("");
  const [clientResults, setClientResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pickedFromSearch, setPickedFromSearch] = useState(false);
  const [clientFields, setClientFields] = useState(emptyClientFields);
  const clientErrors = validateClientInfo(clientFields, t);

  useEffect(() => {
    if (clientMode !== "search" || clientQuery.trim().length < 2) {
      setClientResults([]);
      return;
    }
    setSearchLoading(true);
    const handle = setTimeout(() => {
      searchClients(clientQuery.trim())
        .then((data) => setClientResults(Array.isArray(data) ? data : []))
        .finally(() => setSearchLoading(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [clientQuery, clientMode]);

  const pickClient = (c) => {
    setClientFields({
      clientName: c.name || "",
      clientEmail: c.email || "",
      clientPhone: c.phone || "",
      clientBirthDay: c.birthday ? c.birthday.slice(0, 10) : "",
    });
    setPickedFromSearch(true);
    setClientMode("form");
  };

  const startNewClient = () => {
    setClientFields(emptyClientFields);
    setPickedFromSearch(false);
    setClientMode("form");
  };

  const backToSearch = () => {
    setClientFields(emptyClientFields);
    setClientQuery("");
    setClientMode("search");
  };

  // ── Branch ──
  const [branchId, setBranchId] = useState(isAdmin ? null : user?.branchId ?? null);
  const [myBranchName, setMyBranchName] = useState("");
  useEffect(() => {
    if (!isAdmin && user?.branchId) {
      fetchBranchInfo(user.branchId).then((info) => setMyBranchName(info?.name || "")).catch(() => {});
    }
  }, [isAdmin, user?.branchId]);
  const branchName = isAdmin
    ? branches.find((b) => (b.id ?? b.branchId) === branchId)?.name ?? branches.find((b) => (b.id ?? b.branchId) === branchId)?.branchName
    : myBranchName;

  const selectBranch = (id) => {
    setBranchId(id);
    setStaffId(null);
    setDay(null);
    setStartTime(null);
  };

  // ── Service ──
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  useEffect(() => {
    // Solo servicios activos: los inactivos no se pueden agendar.
    fetchServiceData().then((data) => setServices(Array.isArray(data) ? data.filter((s) => s.isActive !== false) : []));
  }, []);
  const selectedService = services.find((s) => s.id === serviceId);

  // ── Staff ──
  const [staffList, setStaffList] = useState([]);
  const [staffId, setStaffId] = useState(null);
  useEffect(() => {
    if (!branchId || isProfessional) return;
    fetchStaffByBranch(branchId).then((data) => setStaffList(Array.isArray(data) ? data : []));
  }, [branchId, isProfessional]);

  const effectiveStaffId = isProfessional ? user?.sub : staffId;
  const effectiveStaffName = isProfessional ? (user?.name || (t("selfStaffLabel") || "Me")) : staffList.find((s) => s.id === staffId)?.name;

  // ── Date & time ──
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Mismo límite que el backend (AppointmentService.MaxAppointmentMonthsAhead).
  const maxBookingDate = addMonthsClamped(today, 2);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [day, setDay] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    if (!day || !branchId || !effectiveStaffId || !serviceId) return;
    setSlotsLoading(true);
    fetchAvailableSlots({ branchId, staffId: effectiveStaffId, serviceId, date: day })
      .then((data) => setSlots(Array.isArray(data) ? data : []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [day, branchId, effectiveStaffId, serviceId]);

  const selectDay = (date) => {
    setDay(date);
    setStartTime(null);
  };

  // ── Submit ──
  const [observation, setObservation] = useState("");
  const [payment, setPayment] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const canContinue = {
    client: clientMode === "form" && Object.keys(clientErrors).length === 0,
    branch: Boolean(branchId),
    service: Boolean(serviceId),
    staff: Boolean(effectiveStaffId),
    datetime: Boolean(day && startTime),
    confirm: true,
  }[currentStep];

  const goBack = () => {
    if (stepIndex === 0) {
      onClose();
      return;
    }
    setSubmitError(null);
    setStepIndex((i) => i - 1);
  };

  const goNext = async () => {
    if (currentStep !== "confirm") {
      setStepIndex((i) => Math.min(steps.length - 1, i + 1));
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const datePart = toDateParam(day);
      const payload = {
        staffId: effectiveStaffId,
        branchId,
        serviceId,
        day: `${datePart}T00:00:00`,
        startTime: `${datePart}T${startTime}:00`,
        observation,
        payment,
        ...clientFields,
        clientBirthDay: `${clientFields.clientBirthDay}T00:00:00`,
      };
      const result = await createAppointment(payload);
      onCreated?.(result);
      onClose();
    } catch (e) {
      setSubmitError(e.message === "bookingFailed" ? (t("bookingFailedError") || "Couldn't create the appointment. Please try again.") : e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "client":
        return (
          <div className="flex flex-col gap-4">
            {clientMode === "search" ? (
              <>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><IconSearch /></span>
                  <input
                    autoFocus
                    value={clientQuery}
                    onChange={(e) => setClientQuery(e.target.value)}
                    placeholder={t("searchClientPlaceholder") || "Search by name or email..."}
                    className={inputClass + " pl-10"}
                  />
                </div>

                {searchLoading && <p className="text-sm text-[var(--text-muted)] text-center py-4">{t("Searching") || "Searching..."}</p>}

                {!searchLoading && clientQuery.trim().length >= 2 && (
                  clientResults.length ? (
                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
                      {clientResults.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => pickClient(c)}
                          className="flex flex-col items-start text-left px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--brand)] hover:bg-[var(--surface-faint)] transition-colors"
                        >
                          <span className="text-sm font-semibold text-[var(--text-primary)]">{c.name}</span>
                          <span className="text-xs text-[var(--text-muted)]">{c.email}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--text-muted)] text-center py-4">{t("No client found") || "No clients found."}</p>
                  )
                )}

                <button
                  type="button"
                  onClick={startNewClient}
                  className="text-sm font-semibold text-[var(--text-primary)] hover:underline self-start"
                >
                  + {t("Add Client") || "Add Client"}
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={backToSearch} className="flex items-center gap-1 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] self-start">
                  <IconChevronLeft /> {t("searchAnotherClient") || "Search another client"}
                </button>

                {pickedFromSearch && (
                  <div className="bg-[var(--info-bg)] border border-[var(--info-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--info-text)]">
                    {t("existingClientSelected") || "Existing client selected — you can edit their info if needed."}
                  </div>
                )}

                <div>
                  <label className={labelClass}>{t("fullName") || "Full name"}</label>
                  <input value={clientFields.clientName} onChange={(e) => setClientFields((p) => ({ ...p, clientName: e.target.value }))} className={inputClass} placeholder={t("fullNamePlaceholder") || "First and last name"} />
                  {clientErrors.clientName && <p className="text-xs text-[#dc2626] mt-1">{clientErrors.clientName}</p>}
                </div>
                <div>
                  <label className={labelClass}>{t("Email") || "Email"}</label>
                  <input type="email" value={clientFields.clientEmail} onChange={(e) => setClientFields((p) => ({ ...p, clientEmail: e.target.value }))} className={inputClass} placeholder="email@example.com" />
                  {clientErrors.clientEmail && <p className="text-xs text-[#dc2626] mt-1">{clientErrors.clientEmail}</p>}
                </div>
                <div>
                  <label className={labelClass}>{t("Phone") || "Phone"}</label>
                  <PhoneField
                    name="clientPhone"
                    value={clientFields.clientPhone}
                    onChange={(e) => setClientFields((p) => ({ ...p, clientPhone: e.target.value }))}
                    hasError={!!clientErrors.clientPhone}
                  />
                  {clientErrors.clientPhone && <p className="text-xs text-[#dc2626] mt-1">{clientErrors.clientPhone}</p>}
                </div>
                <div>
                  <label className={labelClass}>{t("birthDate") || "Date of birth"}</label>
                  <input type="date" value={clientFields.clientBirthDay} onChange={(e) => setClientFields((p) => ({ ...p, clientBirthDay: e.target.value }))} className={inputClass} />
                  {clientErrors.clientBirthDay && <p className="text-xs text-[#dc2626] mt-1">{clientErrors.clientBirthDay}</p>}
                </div>
              </>
            )}
          </div>
        );

      case "branch":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {branches.map((b) => {
              const id = b.id ?? b.branchId;
              const selected = branchId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectBranch(id)}
                  aria-pressed={selected}
                  className={`flex items-center gap-3 ${cardClass(selected)}`}
                >
                  {selected && <CheckBadge />}
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--surface-muted)] text-[var(--text-primary)] shrink-0"><IconMapPin /></span>
                  <span className="font-semibold text-[var(--text-primary)] pr-6">{b.name ?? b.branchName}</span>
                </button>
              );
            })}
          </div>
        );

      case "service":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((s) => {
              const selected = serviceId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  aria-pressed={selected}
                  className={`flex items-start gap-3 ${cardClass(selected)}`}
                >
                  {selected && <CheckBadge />}
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--surface-muted)] text-[var(--text-primary)] shrink-0"><IconClipboard /></span>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{s.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{s.durationMinutes} {t("minutesAbbrev") || "min"} · ${s.price}</p>
                  </div>
                </button>
              );
            })}
          </div>
        );

      case "staff":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {staffList.map((s) => {
              const selected = staffId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStaffId(s.id)}
                  aria-pressed={selected}
                  className={`flex items-center gap-3 ${cardClass(selected)}`}
                >
                  {selected && <CheckBadge />}
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--select-fill)] text-[var(--on-select-fill)] text-xs font-bold shrink-0">
                    {(s.name || "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")}
                  </span>
                  <span className="font-semibold text-[var(--text-primary)] pr-6">{s.name}</span>
                </button>
              );
            })}
          </div>
        );

      case "datetime":
        return (
          <div className="flex flex-col gap-5">
            <div className="w-full max-w-sm mx-auto border border-[var(--border-subtle)] rounded-2xl p-5">
              <BookingCalendar selected={day} onSelect={selectDay} viewDate={viewDate} onViewDateChange={setViewDate} minDate={today} maxDate={maxBookingDate} />
            </div>
            {day && (
              slotsLoading ? (
                <p className="text-sm text-[var(--text-muted)] text-center">{t("loadingSlots") || "Loading available times..."}</p>
              ) : slots.length ? (
                <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                  {slots.map((slot) => (
                    <button
                      key={slot.startTime}
                      type="button"
                      onClick={() => setStartTime(slot.startTime)}
                      aria-pressed={startTime === slot.startTime}
                      className={chipClass(startTime === slot.startTime, "py-2 rounded-lg")}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)] text-center">{t("noSlotsAvailable") || "No available times for that day."}</p>
              )
            )}
          </div>
        );

      case "confirm":
        return (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[var(--border-subtle)] p-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">{t("Client") || "Client"}</span><span className="font-semibold text-[var(--text-primary)]">{clientFields.clientName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">{t("Branch") || "Branch"}</span><span className="font-semibold text-[var(--text-primary)]">{branchName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">{t("Service") || "Service"}</span><span className="font-semibold text-[var(--text-primary)]">{selectedService?.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">{t("Staff") || "Staff"}</span><span className="font-semibold text-[var(--text-primary)]">{effectiveStaffName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">{t("Date") || "Date"}</span><span className="font-semibold text-[var(--text-primary)]">{day?.toLocaleDateString()} {startTime}</span></div>
            </div>

            <div>
              <label className={labelClass}>{t("Observation") || "Observation"} ({t("Optional") || "Optional"})</label>
              <textarea value={observation} onChange={(e) => setObservation(e.target.value)} rows={2} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>{t("paymentLabel") || t("Payment Method") || "Payment Method"}</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 0, key: "payment_cash", label: "Efectivo" },
                  { value: 1, key: "payment_transferencia", label: "Transferencia" },
                  { value: 2, key: "payment_mercadopago", label: "MercadoPago" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPayment(opt.value)}
                    aria-pressed={Number(payment) === opt.value}
                    className={chipClass(Number(payment) === opt.value, "py-2 rounded-xl")}
                  >
                    {t(opt.key) || opt.label}
                  </button>
                ))}
              </div>
            </div>

            {submitError && <p className="text-sm text-[#dc2626] text-center">{submitError}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">{t("New Appointment") || "New Appointment"}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1.5">
              <IconUser />
              {t(STEP_LABEL_KEYS[currentStep]) || STEP_LABEL_FALLBACKS[currentStep]} · {(t("stepOfTotal") || "step {current} of {total}").replace("{current}", stepIndex + 1).replace("{total}", steps.length)}
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-muted)]">
            <IconX />
          </button>
        </div>

        {renderStep()}

        <div className="flex justify-between pt-5 mt-5 border-t border-[var(--border-faint)]">
          <button
            onClick={goBack}
            disabled={submitting}
            className="px-5 py-2 rounded-xl border border-[var(--border-subtle)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors disabled:opacity-50"
          >
            {stepIndex === 0 ? (t("Cancel") || "Cancel") : (t("Back") || "Back")}
          </button>
          <button
            onClick={goNext}
            disabled={!canContinue || submitting}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors ${
              canContinue && !submitting ? "bg-[var(--select-fill)] text-[var(--on-select-fill)] hover:opacity-90" : "bg-[var(--border-subtle)] text-[var(--text-faint)] cursor-not-allowed"
            }`}
          >
            {submitting
              ? (t("creatingAppointment") || "Creating...")
              : currentStep === "confirm"
                ? (t("createAppointmentButton") || "Create appointment")
                : (t("continueButton") || "Continue")}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default NewAppointmentModal;
