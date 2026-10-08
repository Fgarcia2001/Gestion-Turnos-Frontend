import { useState } from "react";
import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { createAppointment } from "../../services/appointmentService";
import { toDateParam } from "../../services/api";
import StepIndicator from "./StepIndicator";
import { STEP } from "./stepMeta";
import { IconMapPin, IconClipboard, IconUser, IconCalendar } from "./Icons";
import BranchStep from "./Steps/BranchStep";
import ServiceStep from "./Steps/ServiceStep";
import StaffStep from "./Steps/StaffStep";
import DateTimeStep from "./Steps/DateTimeStep";
import ClientInfoStep from "./Steps/ClientInfoStep";
import ReviewStep from "./Steps/ReviewStep";
import ConfirmationStep from "./Steps/ConfirmationStep";
import {
  isBranchStepComplete,
  isServiceStepComplete,
  isStaffStepComplete,
  isDateTimeStepComplete,
  isClientInfoStepComplete,
} from "./Steps/stepValidation";

const emptyBooking = {
  currentStep: STEP.BRANCH,
  businessId: null, businessName: "",
  branchId: null, branchName: "", branchAddress: "",
  serviceId: null, serviceName: "", serviceDuration: null, servicePrice: null,
  staffId: null, staffName: "",
  day: null, startTime: null, endTime: null,
  clientName: "", clientEmail: "", clientPhone: "", clientBirthDay: "",
  observation: "", payment: 0,
};

// The business (and optionally branch) is always already resolved by the time
// this wizard opens, from the business's public page at /:businessSlug — so
// it always starts at the branch step, or past it when a branch was picked
// directly (e.g. via that branch's own "Reservar acá" button).
const resolveStartStep = (prefill) => (prefill?.branchId ? STEP.SERVICE : STEP.BRANCH);

const buildInitialBooking = (prefill) => {
  const booking = {
    ...emptyBooking,
    businessId: prefill?.businessId ?? null,
    businessName: prefill?.businessName || "",
    currentStep: resolveStartStep(prefill),
  };

  if (prefill?.branchId) {
    booking.branchId = prefill.branchId;
    booking.branchName = prefill.branchName || "";
    booking.branchAddress = prefill.branchAddress || "";
  }

  return booking;
};

const formatShortDay = (date) =>
  date ? new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "";

const SummaryRow = ({ icon, label, value }) =>
  value ? (
    <div className="flex items-start gap-3">
      <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#F8F5F0] text-[#1a1a2e] shrink-0">
        {icon}
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-[10px] uppercase tracking-wide text-[#b3aca3] font-bold">{label}</p>
        <p className="text-sm font-semibold text-[#1a1a2e] truncate">{value}</p>
      </div>
    </div>
  ) : null;

// The booking wizard's content: stepper + current step + persistent selection
// summary. Deliberately has no page chrome of its own (no nav bar, no <main>
// wrapper) — it's embedded directly in a business's public page at
// /:businessSlug, whose own header stays on screen the whole time.
//
// `prefill` (business, optionally branch) means those steps were already
// answered elsewhere (by navigating to that business's page), so the wizard
// opens past them. `onExit`, when given, is called instead of disabling the
// back button once there's nowhere left to go — collapsing the wizard back
// into the business page's branch listing.
const BookingWizard = ({ prefill = null, onExit }) => {
  const { t } = useTranslation();
  const minStep = resolveStartStep(prefill);
  const [booking, setBooking] = useState(() => buildInitialBooking(prefill));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [showClientErrors, setShowClientErrors] = useState(false);

  const updateBooking = (partial) => setBooking((prev) => ({ ...prev, ...partial }));

  const selectBranch = (id, name, address) =>
    updateBooking({
      branchId: id, branchName: name, branchAddress: address || "",
      staffId: null, staffName: "",
      day: null, startTime: null, endTime: null,
    });

  const selectService = (id, name, duration, price) =>
    updateBooking({
      serviceId: id, serviceName: name, serviceDuration: duration, servicePrice: price,
      day: null, startTime: null, endTime: null,
    });

  const selectStaff = (id, name) =>
    updateBooking({ staffId: id, staffName: name, day: null, startTime: null, endTime: null });

  const selectDay = (date) => updateBooking({ day: date, startTime: null, endTime: null });
  const selectSlot = (startTime, endTime) => updateBooking({ startTime, endTime });

  const stepCompletion = {
    [STEP.BRANCH]: isBranchStepComplete(booking),
    [STEP.SERVICE]: isServiceStepComplete(booking),
    [STEP.STAFF]: isStaffStepComplete(booking),
    [STEP.DATE_TIME]: isDateTimeStepComplete(booking),
    [STEP.CLIENT_INFO]: isClientInfoStepComplete(booking, t),
    [STEP.REVIEW]: true,
    [STEP.CONFIRMATION]: true,
  };

  const canContinue = stepCompletion[booking.currentStep];
  const isAtStart = booking.currentStep <= minStep;

  const goBack = () => {
    if (isAtStart) {
      onExit?.();
      return;
    }
    setSubmitError(null);
    updateBooking({ currentStep: booking.currentStep - 1 });
  };

  const goToStep = (step) => {
    setSubmitError(null);
    setShowClientErrors(false);
    updateBooking({ currentStep: Math.max(minStep, Math.min(STEP.REVIEW, step)) });
  };

  const goNext = async () => {
    if (booking.currentStep === STEP.CLIENT_INFO && !canContinue) {
      setShowClientErrors(true);
      return;
    }

    if (booking.currentStep === STEP.REVIEW) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const datePart = toDateParam(booking.day);
        const payload = {
          staffId: booking.staffId,
          branchId: booking.branchId,
          serviceId: booking.serviceId,
          day: `${datePart}T00:00:00`,
          startTime: `${datePart}T${booking.startTime}:00`,
          observation: booking.observation,
          payment: booking.payment,
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          clientPhone: booking.clientPhone,
          clientBirthDay: `${booking.clientBirthDay}T00:00:00`,
        };
        const result = await createAppointment(payload);
        setConfirmation(result);
        updateBooking({ currentStep: STEP.CONFIRMATION });
      } catch (e) {
        setSubmitError(e.message === "bookingFailed" ? (t("bookingFailed") || "Couldn't complete your booking. Please try again.") : e.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setShowClientErrors(false);
    updateBooking({ currentStep: Math.min(STEP.CONFIRMATION, booking.currentStep + 1) });
  };

  const bookAnother = () => {
    setBooking(buildInitialBooking(prefill));
    setConfirmation(null);
    setSubmitError(null);
    setShowClientErrors(false);
  };

  const renderStep = () => {
    switch (booking.currentStep) {
      case STEP.BRANCH:
        return <BranchStep booking={booking} onSelect={selectBranch} />;
      case STEP.SERVICE:
        return <ServiceStep booking={booking} onSelect={selectService} />;
      case STEP.STAFF:
        return <StaffStep booking={booking} onSelect={selectStaff} />;
      case STEP.DATE_TIME:
        return <DateTimeStep booking={booking} onSelectDay={selectDay} onSelectSlot={selectSlot} />;
      case STEP.CLIENT_INFO:
        return <ClientInfoStep booking={booking} updateBooking={updateBooking} showErrors={showClientErrors} />;
      case STEP.REVIEW:
        return <ReviewStep booking={booking} submitError={submitError} />;
      case STEP.CONFIRMATION:
        return <ConfirmationStep confirmation={confirmation} onBookAnother={bookAnother} />;
      default:
        return null;
    }
  };

  const isConfirmation = booking.currentStep === STEP.CONFIRMATION;
  const hasSelection = booking.branchName || booking.serviceName || booking.staffName || booking.day;
  const showSummary = !isConfirmation && hasSelection;

  return (
    <div className="w-full">
      {!isConfirmation && <StepIndicator currentStep={booking.currentStep} onStepClick={goToStep} />}

      <div className={`max-w-5xl mx-auto grid grid-cols-1 gap-6 items-start ${showSummary ? "lg:grid-cols-[1fr_300px]" : ""}`}>
        <div className="bg-white rounded-3xl shadow-sm border border-[#e2ddd8] overflow-hidden">
          <div className="p-8 sm:p-10 flex flex-col items-center">
            <div key={booking.currentStep} className="w-full flex flex-col items-center animate-step-in">
              {renderStep()}
            </div>

            {!isConfirmation && (
              <div className="w-full flex justify-between pt-6 mt-6 border-t border-[#e2ddd8]">
                <button
                  onClick={goBack}
                  disabled={(isAtStart && !onExit) || submitting}
                  className="px-8 py-2.5 rounded-xl border border-[#e2ddd8] font-semibold text-[#6b6b6b] hover:bg-[#F8F5F0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("back") || "ATRÁS"}
                </button>
                <button
                  onClick={goNext}
                  disabled={!canContinue || submitting}
                  className={`px-10 py-2.5 rounded-xl font-semibold transition-all
                    ${canContinue && !submitting
                      ? "bg-[#1a1a2e] text-white hover:bg-[#2d2d4d] shadow-sm"
                      : "bg-[#e2ddd8] text-[#b3aca3] cursor-not-allowed"}
                  `}
                >
                  {submitting
                    ? (t("loading") || "Cargando...")
                    : booking.currentStep === STEP.REVIEW
                    ? (t("confirmButton") || "Confirmar turno")
                    : (t("continue") || "CONTINUAR")}
                </button>
              </div>
            )}
          </div>
        </div>

        {showSummary && (
          <aside className="lg:sticky lg:top-6 rounded-3xl border border-[#e2ddd8] bg-white p-6 flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#b3aca3]">Tu selección</p>

            <SummaryRow icon={<IconMapPin />} label="Sucursal" value={booking.branchName} />
            <SummaryRow icon={<IconClipboard />} label="Servicio" value={booking.serviceName} />
            <SummaryRow icon={<IconUser />} label="Profesional" value={booking.staffName} />
            <SummaryRow
              icon={<IconCalendar />}
              label="Fecha y hora"
              value={booking.day ? `${formatShortDay(booking.day)}${booking.startTime ? ` · ${booking.startTime}` : ""}` : null}
            />

            {booking.servicePrice != null && (
              <div className="pt-3 border-t border-[#e2ddd8] flex items-center justify-between">
                <span className="text-sm text-[#6b6b6b]">Total</span>
                <span className="text-lg font-bold text-[#1a1a2e]">${booking.servicePrice}</span>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};

export default BookingWizard;
