import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { IconAlert } from "../Icons";

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
);

const formatDay = (day) =>
  day
    ? new Date(day).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    : "";

const ReviewStep = ({ booking, submitError }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t("reviewYourAppointment") || "Review Your Appointment"}</h2>
        <p className="text-gray-500 mt-1">{t("reviewSummaryTitle") || "Review your appointment"}</p>
      </div>

      <div className="rounded-xl border border-gray-200 p-5">
        <Row label={t("businessLabel") || "Business"} value={booking.businessName} />
        <Row label={t("branchLabel") || "Branch"} value={booking.branchName} />
        <Row label={t("serviceLabel") || "Service"} value={booking.serviceName} />
        {booking.serviceDuration != null && (
          <Row label={t("durationLabel") || "Duration"} value={`${booking.serviceDuration} ${t("minutesAbbrev") || "min"}`} />
        )}
        {booking.servicePrice != null && <Row label={t("priceLabel") || "Price"} value={booking.servicePrice} />}
        <Row label={t("professionalLabel") || "Professional"} value={booking.staffName} />
        <Row label={t("dateLabel") || "Date"} value={formatDay(booking.day)} />
        <Row label={t("timeLabel") || "Time"} value={booking.startTime} />
        <Row label={t("clientNameLabel") || "Full name"} value={booking.clientName} />
        <Row label={t("clientEmailLabel") || "Email"} value={booking.clientEmail} />
        <Row label={t("clientPhoneLabel") || "Phone"} value={booking.clientPhone} />
      </div>

      {submitError && (
        <div className="flex items-center gap-2 mt-4 text-[#b91c1c] text-sm justify-center">
          <IconAlert />
          <span>{submitError}</span>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
