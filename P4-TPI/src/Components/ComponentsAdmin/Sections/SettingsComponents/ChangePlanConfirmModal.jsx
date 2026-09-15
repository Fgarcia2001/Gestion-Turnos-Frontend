import { useState } from "react";
import { ModalOverlay } from "../ManagmentBusinessComponents/Shared";
import { IconX } from "../ManagmentBusinessComponents/Icons";
import { IconSparkles } from "./SettingsIcons";

const CSS_ANIMATIONS = `
  @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
`;

// NOTE: Confirm is currently a placeholder — it does not call a change-plan
// endpoint yet. That wiring (and any resulting subscription refresh) is left
// for a future task; this modal only captures the user's intent for now.
const ChangePlanConfirmModal = ({ plan, onClose, onConfirm }) => {
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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors p-1.5 rounded-lg hover:bg-[#f0ede8]"
          >
            <IconX />
          </button>

          <div className="w-14 h-14 rounded-full bg-[#f0ede8] flex items-center justify-center mx-auto mb-4 text-[#1a1a2e]">
            <IconSparkles />
          </div>

          <h2 className="text-lg font-bold text-[#1a1a2e] mb-1">Change plan?</h2>
          <p className="text-sm text-[#6b7280] mb-2">
            You are about to switch to <span className="font-semibold text-[#1a1a2e]">{name}</span>
            {price != null ? <> (${price}{durationDays ? ` / ${durationDays} days` : ""})</> : null}.
          </p>
          <p className="text-xs text-[#9a9a9a] mb-6">This request will be reviewed later — no changes are applied yet.</p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={confirming}
              className="flex-1 py-2.5 rounded-xl border border-[#e2ddd8] text-sm font-semibold text-[#6b7280] hover:bg-[#f0ede8] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="flex-1 py-2.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d44] transition-colors disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </div>
      </ModalOverlay>
    </>
  );
};

export default ChangePlanConfirmModal;
