import { useState } from "react";
import { ModalOverlay, inputClass, labelClass } from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Shared";
import { IconX } from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Icons";

// Modal compartido para cambiar el plan de un negocio (sin pasar por el
// checkout de MercadoPago). Lo usan tanto SysAdminSubscriptions.jsx como
// BusinessDetailModal.jsx, asi el comportamiento queda igual en los dos.
const ChangePlanModal = ({ businessName, currentPlanId, plans, onClose, onConfirm }) => {
  const otherPlans = plans.filter((p) => p.id !== currentPlanId);
  const [planId, setPlanId] = useState(otherPlans[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!planId) return;
    setError("");
    setSubmitting(true);
    try {
      await onConfirm(planId);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to change the plan. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors p-1.5 rounded-lg hover:bg-[#f0ede8]"
        >
          <IconX />
        </button>

        <h2 className="text-lg font-bold text-[#1a1a2e] mb-1">Change plan</h2>
        <p className="text-sm text-[#6b7280] mb-5">
          Change the plan for <span className="font-semibold text-[#1a1a2e]">"{businessName}"</span>.
          This takes effect immediately, without going through checkout.
        </p>

        {otherPlans.length === 0 ? (
          <p className="text-sm text-[#9a9a9a] mb-5">There are no other plans to switch to.</p>
        ) : (
          <div className="mb-5">
            <label className={labelClass}>New plan</label>
            <select value={planId} onChange={(e) => setPlanId(e.target.value)} className={inputClass}>
              {otherPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ${p.price}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-left">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-xl border border-[#e2ddd8] text-sm font-semibold text-[#6b7280] hover:bg-[#f0ede8] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || otherPlans.length === 0}
            className="flex-1 py-2.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d44] transition-colors disabled:opacity-50"
          >
            {submitting ? "Changing..." : "Change plan"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default ChangePlanModal;
