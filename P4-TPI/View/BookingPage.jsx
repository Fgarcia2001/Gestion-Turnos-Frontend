import React, { useState } from "react";
import { useTranslation } from "../CustomHooks/TraslateHook";
import { createAppointment } from "../src/services/appointmentService";
import { toDateParam } from "../src/services/api";
import StepIndicator from "../src/Components/ComponentsBookingPage/StepIndicator";
import { STEP } from "../src/Components/ComponentsBookingPage/stepMeta";
import BusinessTypeStep from "../src/Components/ComponentsBookingPage/Steps/BusinessTypeStep";
import BusinessStep from "../src/Components/ComponentsBookingPage/Steps/BusinessStep";
import BranchStep from "../src/Components/ComponentsBookingPage/Steps/BranchStep";
import ServiceStep from "../src/Components/ComponentsBookingPage/Steps/ServiceStep";
import StaffStep from "../src/Components/ComponentsBookingPage/Steps/StaffStep";
import DateTimeStep from "../src/Components/ComponentsBookingPage/Steps/DateTimeStep";
import ClientInfoStep from "../src/Components/ComponentsBookingPage/Steps/ClientInfoStep";
import ReviewStep from "../src/Components/ComponentsBookingPage/Steps/ReviewStep";
import ConfirmationStep from "../src/Components/ComponentsBookingPage/Steps/ConfirmationStep";
import {
  isBusinessTypeStepComplete,
  isBusinessStepComplete,
  isBranchStepComplete,
  isServiceStepComplete,
  isStaffStepComplete,
  isDateTimeStepComplete,
  isClientInfoStepComplete,
} from "../src/Components/ComponentsBookingPage/Steps/stepValidation";

const initialBooking = {
  currentStep: STEP.BUSINESS_TYPE,
  businessTypeId: null, businessTypeName: "",
  businessId: null, businessName: "",
  branchId: null, branchName: "", branchAddress: "",
  serviceId: null, serviceName: "", serviceDuration: null, servicePrice: null,
  staffId: null, staffName: "",
  day: null, startTime: null, endTime: null,
  clientName: "", clientEmail: "", clientPhone: "", clientBirthDay: "",
  observation: "", payment: 0,
};

const BookingPage = () => {
  const { t, toggleLanguage, language } = useTranslation();
  const [booking, setBooking] = useState(initialBooking);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [showClientErrors, setShowClientErrors] = useState(false);

  const updateBooking = (partial) => setBooking((prev) => ({ ...prev, ...partial }));

  const selectBusinessType = (id, name) =>
    updateBooking({
      businessTypeId: id, businessTypeName: name,
      businessId: null, businessName: "",
      branchId: null, branchName: "", branchAddress: "",
      serviceId: null, serviceName: "", serviceDuration: null, servicePrice: null,
      staffId: null, staffName: "",
      day: null, startTime: null, endTime: null,
    });

  const selectBusiness = (id, name) =>
    updateBooking({
      businessId: id, businessName: name,
      branchId: null, branchName: "", branchAddress: "",
      serviceId: null, serviceName: "", serviceDuration: null, servicePrice: null,
      staffId: null, staffName: "",
      day: null, startTime: null, endTime: null,
    });

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
    [STEP.BUSINESS_TYPE]: isBusinessTypeStepComplete(booking),
    [STEP.BUSINESS]: isBusinessStepComplete(booking),
    [STEP.BRANCH]: isBranchStepComplete(booking),
    [STEP.SERVICE]: isServiceStepComplete(booking),
    [STEP.STAFF]: isStaffStepComplete(booking),
    [STEP.DATE_TIME]: isDateTimeStepComplete(booking),
    [STEP.CLIENT_INFO]: isClientInfoStepComplete(booking, t),
    [STEP.REVIEW]: true,
    [STEP.CONFIRMATION]: true,
  };

  const canContinue = stepCompletion[booking.currentStep];

  const goBack = () => {
    setSubmitError(null);
    updateBooking({ currentStep: Math.max(STEP.BUSINESS_TYPE, booking.currentStep - 1) });
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
    setBooking(initialBooking);
    setConfirmation(null);
    setSubmitError(null);
    setShowClientErrors(false);
  };

  const renderStep = () => {
    switch (booking.currentStep) {
      case STEP.BUSINESS_TYPE:
        return <BusinessTypeStep booking={booking} onSelect={selectBusinessType} />;
      case STEP.BUSINESS:
        return <BusinessStep booking={booking} onSelect={selectBusiness} />;
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

  return (
    <main className="min-h-screen bg-[#F8F5F0] flex flex-col">
      {/* 1. NAV BAR */}
      <nav className="w-full p-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-2">
          <div className="bg-[#1A1A1A] p-1.5 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
          </div>
          <span className="text-xl font-bold">FGSTurniFy</span>
        </div>
        <button
          onClick={toggleLanguage}
          className="absolute top-6 right-6 z-10 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-all font-medium text-sm flex items-center gap-2"
        >
          <span className={language === "es" ? "font-bold text-black" : "text-gray-400"}>ES</span>
          <span className="text-gray-300">|</span>
          <span className={language === "en" ? "font-bold text-black" : "text-gray-400"}>EN</span>
        </button>
      </nav>

      {/* 2. STEP INDICATOR */}
      {!isConfirmation && <StepIndicator currentStep={booking.currentStep} />}

      {/* 3. STEP CONTENT */}
      <section className="flex-grow flex items-start justify-center px-4 pb-20">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-10 flex flex-col items-center">
            {renderStep()}

            {!isConfirmation && (
              <div className="w-full flex justify-between pt-6 mt-6 border-t border-gray-100">
                <button
                  onClick={goBack}
                  disabled={booking.currentStep === STEP.BUSINESS_TYPE || submitting}
                  className="px-8 py-2.5 rounded-lg border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("back") || "BACK"}
                </button>
                <button
                  onClick={goNext}
                  disabled={!canContinue || submitting}
                  className={`px-10 py-2.5 rounded-lg font-semibold transition-all
                    ${canContinue && !submitting
                      ? "bg-black text-white hover:opacity-90"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                  `}
                >
                  {submitting
                    ? (t("loading") || "Loading...")
                    : booking.currentStep === STEP.REVIEW
                    ? (t("confirmButton") || "Confirm Appointment")
                    : (t("continue") || "CONTINUE")}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;
