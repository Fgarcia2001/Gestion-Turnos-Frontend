import { useState } from "react";
import { ModalOverlay } from "../ManagmentBusinessComponents/Shared";
import { IconX } from "../ManagmentBusinessComponents/Icons";
import { IconSparkles } from "./SettingsIcons";
import { useTranslation } from "../../../../../CustomHooks/TraslateHook";

const CSS_ANIMATIONS = `
  @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
`;

// NOTE: Confirm crea el checkout en MercadoPago (Checkout Pro). Si el plan es
// gratis el padre aplica el cambio directamente; si requiere pago, redirige a
// initPoint en la misma pestaña y el botón queda en spinner.
const ChangePlanConfirmModal = ({ plan, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);

  if (!plan) return null;

  const name = plan.name ?? plan.Name;
  const price = plan.price ?? plan.Price;
  const durationDays = plan.durationDays ?? plan.DurationDays;

  const handleConfirm = () => {
    setConfirming(true);
    onConfirm(plan);
  };

  return (
    <>
      <style>{CSS_ANIMATIONS}</style>
      <ModalOverlay onClose={onClose}>
        <div className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-muted)]"
          >
            <IconX />
          </button>

          <div className="w-14 h-14 rounded-full bg-[var(--surface-muted)] flex items-center justify-center mx-auto mb-4 text-[var(--text-primary)]">
            <IconSparkles />
          </div>

          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">{t("Change plan?") || "Change plan?"}</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            {t("You are about to switch to") || "You are about to switch to"} <span className="font-semibold text-[var(--text-primary)]">{name}</span>
            {price != null ? <> (${price}{durationDays ? ` / ${durationDays} ${t("days") || "days"}` : ""})</> : null}.
          </p>
          <p className="text-xs text-[var(--text-muted)] mb-6">
            {t("changePlanRedirectNotice") || "You'll be redirected to MercadoPago to complete the payment. Free plans are applied instantly."}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={confirming}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border-subtle)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors disabled:opacity-50"
            >
              {t("Cancel") || "Cancel"}
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="flex-1 py-2.5 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50"
            >
              {confirming ? (t("Redirecting") || "Redirecting…") : (t("Confirm") || "Confirm")}
            </button>
          </div>
        </div>
      </ModalOverlay>
    </>
  );
};

export default ChangePlanConfirmModal;
