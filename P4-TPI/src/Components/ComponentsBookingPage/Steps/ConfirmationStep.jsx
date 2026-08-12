import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { IconCheck } from "../Icons";

const ConfirmationStep = ({ confirmation, onBookAnother }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center text-center py-6">
      <div className="bg-[#dcfce7] text-[#15803d] p-4 rounded-full mb-5">
        <IconCheck />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{t("appointmentConfirmedTitle") || "Your appointment is confirmed!"}</h2>

      {confirmation?.id && (
        <p className="text-sm text-gray-500 mt-2">
          {t("appointmentIdLabel") || "Confirmation number"}: <span className="font-semibold text-gray-800">{confirmation.id}</span>
        </p>
      )}
      {confirmation?.day && confirmation?.startTime && (
        <p className="text-gray-600 mt-1">
          {new Date(confirmation.day).toLocaleDateString()} — {confirmation.startTime}
        </p>
      )}

      <button
        onClick={onBookAnother}
        className="mt-8 px-8 py-2.5 rounded-lg bg-[#1A1A1A] text-white font-semibold hover:opacity-90 transition-opacity"
      >
        {t("bookAnother") || "Book another appointment"}
      </button>
    </div>
  );
};

export default ConfirmationStep;
