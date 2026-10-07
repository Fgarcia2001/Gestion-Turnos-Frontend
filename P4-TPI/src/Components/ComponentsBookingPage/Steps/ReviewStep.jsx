import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { IconAlert, IconMapPin, IconClipboard, IconUser, IconCalendar, IconClock, IconDollar, IconMail, IconPhone } from "../Icons";

const Row = ({ icon, label, value, strong }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-[#e2ddd8] last:border-b-0">
    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F8F5F0] text-[#1a1a2e] shrink-0">
      {icon}
    </span>
    <span className="text-sm text-[#6b6b6b] flex-1">{label}</span>
    <span className={`text-sm text-right ${strong ? "font-bold text-[#1a1a2e]" : "font-semibold text-[#1a1a2e]"}`}>
      {value}
    </span>
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
        <h2 className="text-2xl font-bold text-[#1a1a2e]">{t("reviewYourAppointment") || "Review Your Appointment"}</h2>
        <p className="text-[#6b6b6b] mt-1">{t("reviewSummaryTitle") || "Revisá que todo esté correcto"}</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-[#e2ddd8] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#b3aca3] mb-1">Tu turno</p>
          <Row icon={<IconMapPin />} label={t("branchLabel") || "Sucursal"} value={booking.branchName} />
          <Row icon={<IconClipboard />} label={t("serviceLabel") || "Servicio"} value={booking.serviceName} />
          <Row icon={<IconUser />} label={t("professionalLabel") || "Profesional"} value={booking.staffName} />
          <Row icon={<IconCalendar />} label={t("dateLabel") || "Fecha"} value={formatDay(booking.day)} />
          <Row icon={<IconClock />} label={t("timeLabel") || "Hora"} value={booking.startTime} />
          {booking.serviceDuration != null && (
            <Row icon={<IconClock />} label={t("durationLabel") || "Duración"} value={`${booking.serviceDuration} ${t("minutesAbbrev") || "min"}`} />
          )}
          {booking.servicePrice != null && (
            <Row icon={<IconDollar />} label={t("priceLabel") || "Precio"} value={booking.servicePrice} strong />
          )}
        </div>

        <div className="rounded-2xl border border-[#e2ddd8] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#b3aca3] mb-1">Tus datos</p>
          <Row icon={<IconUser />} label={t("clientNameLabel") || "Nombre"} value={booking.clientName} />
          <Row icon={<IconMail />} label={t("clientEmailLabel") || "Email"} value={booking.clientEmail} />
          <Row icon={<IconPhone />} label={t("clientPhoneLabel") || "Teléfono"} value={booking.clientPhone} />
        </div>
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
