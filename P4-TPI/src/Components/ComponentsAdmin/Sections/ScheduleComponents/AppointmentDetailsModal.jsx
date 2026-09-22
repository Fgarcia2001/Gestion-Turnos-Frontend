// AppointmentDetailsModal.jsx — read-only details modal for a schedule appointment block.
import { useEffect } from "react";
import { ModalOverlay } from "../ManagmentBusinessComponents/Shared";
import { IconX } from "../ManagmentBusinessComponents/Icons";
import { useTranslation } from "../../../../../CustomHooks/TraslateHook";
import { STATUS_STYLES } from "./statusStyles";

const CSS_ANIMATIONS = `
  @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
`;

const DetailRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#f0ede8] last:border-b-0">
      <span className="text-xs font-semibold text-[#9a9a9a] uppercase tracking-wide shrink-0">{label}</span>
      <span className="text-sm text-[#1a1a2e] text-right">{value}</span>
    </div>
  );
};

const AppointmentDetailsModal = ({ appt, staffName, date, onClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const style = STATUS_STYLES[appt.status] || STATUS_STYLES.Confirmed;

  return (
    <>
      <style>{CSS_ANIMATIONS}</style>
      <ModalOverlay onClose={onClose}>
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#e2ddd8] shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2ddd8]">
            <h2 className="text-base font-bold text-[#1a1a2e]">
              {t("Appointment Details") || "Appointment Details"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors"
              aria-label={t("Close") || "Close"}
            >
              <IconX />
            </button>
          </div>

          <div className="px-5 py-2">
            <div className="flex items-center justify-between py-2.5 border-b border-[#f0ede8]">
              <span className="text-xs font-semibold text-[#9a9a9a] uppercase tracking-wide">
                {t("Status") || "Status"}
              </span>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: style.bg, color: style.text }}
              >
                {appt.status || "—"}
              </span>
            </div>
            <DetailRow label={t("Client") || "Client"} value={appt.clientName} />
            <DetailRow label={t("Service") || "Service"} value={appt.serviceName} />
            <DetailRow label={t("Staff") || "Staff"} value={staffName} />
            <DetailRow label={t("Date") || "Date"} value={date} />
            <DetailRow label={t("Start Time") || "Start Time"} value={appt.startTime} />
            <DetailRow label={t("End Time") || "End Time"} value={appt.endTime} />
            <DetailRow label={t("Payment Method") || "Payment Method"} value={appt.payment} />
            {appt.observation && (
              <div className="py-2.5">
                <span className="text-xs font-semibold text-[#9a9a9a] uppercase tracking-wide block mb-1.5">
                  {t("Observation") || "Observation"}
                </span>
                <p className="text-sm text-[#1a1a2e] bg-[#f9f8f6] rounded-xl px-3 py-2.5">{appt.observation}</p>
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-[#e2ddd8] flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold bg-[#1a1a2e] text-white rounded-xl px-4 py-2 hover:bg-[#2d2d44] transition-colors"
            >
              {t("Close") || "Close"}
            </button>
          </div>
        </div>
      </ModalOverlay>
    </>
  );
};

export default AppointmentDetailsModal;
