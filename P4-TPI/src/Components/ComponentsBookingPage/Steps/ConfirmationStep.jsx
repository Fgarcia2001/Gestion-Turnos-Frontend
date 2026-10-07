import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { IconCheck, IconCalendar, IconClock } from "../Icons";

const ConfirmationStep = ({ confirmation, onBookAnother }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center text-center py-6 animate-step-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-[#1a1a2e] animate-pulse-ring" />
        <div className="relative bg-[#1a1a2e] text-white p-5 rounded-full">
          <IconCheck />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#1a1a2e]">{t("appointmentConfirmedTitle") || "¡Tu turno está confirmado!"}</h2>
      <p className="text-[#6b6b6b] mt-1">Te esperamos, no faltes.</p>

      {(confirmation?.id || (confirmation?.day && confirmation?.startTime)) && (
        <div className="w-full mt-6 rounded-2xl border border-[#e2ddd8] bg-white p-5 flex flex-col gap-3 text-left">
          {confirmation?.id && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6b6b6b]">{t("appointmentIdLabel") || "Número de confirmación"}</span>
              <span className="font-semibold text-[#1a1a2e]">{confirmation.id}</span>
            </div>
          )}
          {confirmation?.day && (
            <div className="flex items-center gap-2 text-sm text-[#1a1a2e]">
              <IconCalendar />
              <span className="font-semibold">{new Date(confirmation.day).toLocaleDateString()}</span>
            </div>
          )}
          {confirmation?.startTime && (
            <div className="flex items-center gap-2 text-sm text-[#1a1a2e]">
              <IconClock />
              <span className="font-semibold">{confirmation.startTime}</span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onBookAnother}
        className="mt-8 px-8 py-2.5 rounded-xl bg-[#1a1a2e] text-white font-semibold hover:bg-[#2d2d4d] transition-colors"
      >
        {t("bookAnother") || "Reservar otro turno"}
      </button>
    </div>
  );
};

export default ConfirmationStep;
