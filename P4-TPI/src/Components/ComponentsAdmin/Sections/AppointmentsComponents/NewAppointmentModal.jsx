import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../../../CustomHooks/AuthContext";
import { useTranslation } from "../../../../../CustomHooks/TraslateHook";
import { validateClientInfo } from "../../../ComponentsBookingPage/Steps/stepValidation";
import BookingCalendar from "../../../ComponentsBookingPage/Calendar";
import { createAppointment, fetchAvailableSlots } from "../../../../services/appointmentService";
import { toDateParam } from "../../../../services/api";
import { fetchStaffByBranch } from "../../../../services/staffService";
import { fetchBranchInfo } from "../../../../services/branchService";
import { fetchServiceData, searchClients } from "../ManagmentBusinessComponents/Data";
import { ModalOverlay, inputClass, labelClass } from "../ManagmentBusinessComponents/Shared";
import { IconX } from "../ManagmentBusinessComponents/Icons";

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

// ── Step list: branch only shown to Admin, staff skipped for Profesional ─────
const resolveSteps = (role) => {
  const steps = ["client"];
  if (role === "Admin") steps.push("branch");
  steps.push("service");
  if (role !== "Profesional") steps.push("staff");
  steps.push("datetime", "confirm");
  return steps;
};

const STEP_LABELS = {
  client: "Cliente",
  branch: "Sucursal",
  service: "Servicio",
  staff: "Profesional",
  datetime: "Fecha y hora",
  confirm: "Confirmar",
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
    fetchServiceData().then((data) => setServices(Array.isArray(data) ? data : []));
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
  const effectiveStaffName = isProfessional ? (user?.name || "Yo") : staffList.find((s) => s.id === staffId)?.name;

  // ── Date & time ──
  const today = new Date();
  today.setHours(0, 0, 0, 0);
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
      setSubmitError(e.message === "bookingFailed" ? "No se pudo crear el turno. Intentá nuevamente." : e.message);
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9a9a]"><IconSearch /></span>
                  <input
                    autoFocus
                    value={clientQuery}
                    onChange={(e) => setClientQuery(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    className={inputClass + " pl-10"}
                  />
                </div>

                {searchLoading && <p className="text-sm text-[#9a9a9a] text-center py-4">Buscando...</p>}

                {!searchLoading && clientQuery.trim().length >= 2 && (
                  clientResults.length ? (
                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
                      {clientResults.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => pickClient(c)}
                          className="flex flex-col items-start text-left px-4 py-2.5 rounded-xl border border-[#e2ddd8] hover:border-[#1a1a2e] hover:bg-[#faf9f7] transition-colors"
                        >
                          <span className="text-sm font-semibold text-[#1a1a2e]">{c.name}</span>
                          <span className="text-xs text-[#9a9a9a]">{c.email}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#9a9a9a] text-center py-4">No se encontraron clientes.</p>
                  )
                )}

                <button
                  type="button"
                  onClick={startNewClient}
                  className="text-sm font-semibold text-[#1a1a2e] hover:underline self-start"
                >
                  + Nuevo cliente
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={backToSearch} className="flex items-center gap-1 text-sm font-semibold text-[#6b7280] hover:text-[#1a1a2e] self-start">
                  <IconChevronLeft /> Buscar otro cliente
                </button>

                {pickedFromSearch && (
                  <div className="bg-[#eef2ff] border border-[#c7d2fe] rounded-xl px-4 py-2.5 text-xs text-[#3730a3]">
                    Cliente existente seleccionado — podés corregir sus datos si hace falta.
                  </div>
                )}

                <div>
                  <label className={labelClass}>Nombre completo</label>
                  <input value={clientFields.clientName} onChange={(e) => setClientFields((p) => ({ ...p, clientName: e.target.value }))} className={inputClass} placeholder="Nombre y apellido" />
                  {clientErrors.clientName && <p className="text-xs text-[#dc2626] mt-1">{clientErrors.clientName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={clientFields.clientEmail} onChange={(e) => setClientFields((p) => ({ ...p, clientEmail: e.target.value }))} className={inputClass} placeholder="email@example.com" />
                  {clientErrors.clientEmail && <p className="text-xs text-[#dc2626] mt-1">{clientErrors.clientEmail}</p>}
                </div>
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input value={clientFields.clientPhone} onChange={(e) => setClientFields((p) => ({ ...p, clientPhone: e.target.value }))} className={inputClass} placeholder="+54 9 ..." />
                  {clientErrors.clientPhone && <p className="text-xs text-[#dc2626] mt-1">{clientErrors.clientPhone}</p>}
                </div>
                <div>
                  <label className={labelClass}>Fecha de nacimiento</label>
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
                  className={`flex items-center gap-3 text-left p-4 rounded-2xl border-2 transition-all ${
                    selected ? "border-[#1a1a2e] bg-[#faf9f7]" : "border-[#e2ddd8] hover:border-[#b3aca3]"
                  }`}
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#f0ede8] text-[#1a1a2e] shrink-0"><IconMapPin /></span>
                  <span className="font-semibold text-[#1a1a2e]">{b.name ?? b.branchName}</span>
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
                  className={`flex items-start gap-3 text-left p-4 rounded-2xl border-2 transition-all ${
                    selected ? "border-[#1a1a2e] bg-[#faf9f7]" : "border-[#e2ddd8] hover:border-[#b3aca3]"
                  }`}
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#f0ede8] text-[#1a1a2e] shrink-0"><IconClipboard /></span>
                  <div>
                    <p className="font-semibold text-[#1a1a2e]">{s.name}</p>
                    <p className="text-xs text-[#9a9a9a]">{s.durationMinutes} min · ${s.price}</p>
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
                  className={`flex items-center gap-3 text-left p-4 rounded-2xl border-2 transition-all ${
                    selected ? "border-[#1a1a2e] bg-[#faf9f7]" : "border-[#e2ddd8] hover:border-[#b3aca3]"
                  }`}
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1a1a2e] text-white text-xs font-bold shrink-0">
                    {(s.name || "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("")}
                  </span>
                  <span className="font-semibold text-[#1a1a2e]">{s.name}</span>
                </button>
              );
            })}
          </div>
        );

      case "datetime":
        return (
          <div className="flex flex-col gap-5">
            <div className="w-full max-w-sm mx-auto border border-[#e2ddd8] rounded-2xl p-5">
              <BookingCalendar selected={day} onSelect={selectDay} viewDate={viewDate} onViewDateChange={setViewDate} minDate={today} />
            </div>
            {day && (
              slotsLoading ? (
                <p className="text-sm text-[#9a9a9a] text-center">Cargando horarios...</p>
              ) : slots.length ? (
                <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                  {slots.map((slot) => (
                    <button
                      key={slot.startTime}
                      type="button"
                      onClick={() => setStartTime(slot.startTime)}
                      className={`py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                        startTime === slot.startTime ? "border-[#1a1a2e] bg-[#1a1a2e] text-white" : "border-[#e2ddd8] hover:border-[#b3aca3]"
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#9a9a9a] text-center">No hay horarios disponibles ese día.</p>
              )
            )}
          </div>
        );

      case "confirm":
        return (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[#e2ddd8] p-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm"><span className="text-[#9a9a9a]">Cliente</span><span className="font-semibold text-[#1a1a2e]">{clientFields.clientName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#9a9a9a]">Sucursal</span><span className="font-semibold text-[#1a1a2e]">{branchName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#9a9a9a]">Servicio</span><span className="font-semibold text-[#1a1a2e]">{selectedService?.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#9a9a9a]">Profesional</span><span className="font-semibold text-[#1a1a2e]">{effectiveStaffName}</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#9a9a9a]">Fecha</span><span className="font-semibold text-[#1a1a2e]">{day?.toLocaleDateString()} {startTime}</span></div>
            </div>

            <div>
              <label className={labelClass}>Observaciones (opcional)</label>
              <textarea value={observation} onChange={(e) => setObservation(e.target.value)} rows={2} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Método de pago</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: 0, label: "Efectivo" }, { value: 1, label: "Tarjeta" }].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPayment(opt.value)}
                    className={`py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                      Number(payment) === opt.value ? "border-[#1a1a2e] bg-[#1a1a2e] text-white" : "border-[#e2ddd8] hover:border-[#b3aca3]"
                    }`}
                  >
                    {opt.label}
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a2e]">Nuevo turno</h2>
            <p className="text-xs text-[#9a9a9a] mt-0.5 flex items-center gap-1.5">
              <IconUser />
              {STEP_LABELS[currentStep]} · paso {stepIndex + 1} de {steps.length}
            </p>
          </div>
          <button onClick={onClose} className="text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors p-1.5 rounded-lg hover:bg-[#f0ede8]">
            <IconX />
          </button>
        </div>

        {renderStep()}

        <div className="flex justify-between pt-5 mt-5 border-t border-[#f0ede8]">
          <button
            onClick={goBack}
            disabled={submitting}
            className="px-5 py-2 rounded-xl border border-[#e2ddd8] text-sm font-semibold text-[#6b7280] hover:bg-[#f0ede8] transition-colors disabled:opacity-50"
          >
            {stepIndex === 0 ? "Cancelar" : "Atrás"}
          </button>
          <button
            onClick={goNext}
            disabled={!canContinue || submitting}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors ${
              canContinue && !submitting ? "bg-[#1a1a2e] text-white hover:bg-[#2d2d44]" : "bg-[#e2ddd8] text-[#b3aca3] cursor-not-allowed"
            }`}
          >
            {submitting ? "Creando..." : currentStep === "confirm" ? "Crear turno" : "Continuar"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default NewAppointmentModal;
