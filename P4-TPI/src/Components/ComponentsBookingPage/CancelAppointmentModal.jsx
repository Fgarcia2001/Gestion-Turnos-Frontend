import { useEffect, useState } from "react";
import { cancelAppointmentByClient } from "../../services/api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STEPS = ["Email", "ID del turno", "Confirmar"];

const CancelAppointmentModal = ({ onClose, brandColor = "#1a1a2e" }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const close = () => {
    if (!submitting) onClose();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const trimmedEmail = email.trim();
  const trimmedId = appointmentId.trim();
  const canContinue = step === 1 ? EMAIL_REGEX.test(trimmedEmail) : step === 2 ? trimmedId !== "" : true;

  const handleNext = (e) => {
    e.preventDefault();
    if (!canContinue) return;
    setError("");
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setSubmitting(true);
    cancelAppointmentByClient(trimmedId, trimmedEmail)
      .then(() => setDone(true))
      .catch((err) => setError(err?.message || "No se pudo cancelar el turno."))
      .finally(() => setSubmitting(false));
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-[#e2ddd8] bg-[#F8F5F0] text-sm text-[#1a1a2e] outline-none focus:border-[#1a1a2e]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={close}>
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-[#e2ddd8] shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cancelar turno"
      >
        <h3 className="text-lg font-bold text-[#1a1a2e]">Cancelar turno</h3>

        {done ? (
          <>
            <p className="mt-3 text-sm text-[#1a1a2e]">Tu turno fue cancelado correctamente.</p>
            <button
              onClick={onClose}
              className="mt-6 w-full px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ backgroundColor: brandColor }}
            >
              Cerrar
            </button>
          </>
        ) : (
          <form onSubmit={handleNext}>
            <p className="mt-2 text-sm text-[#b91c1c] bg-[#fee2e2] rounded-xl px-3 py-2">
              Atención: esta operación resultará en la cancelación de tu turno.
            </p>

            <ol className="flex items-center gap-2 mt-5 mb-5">
              {STEPS.map((label, idx) => {
                const n = idx + 1;
                const active = n === step;
                const reached = n <= step;
                return (
                  <li key={label} className="flex items-center gap-2 flex-1 text-xs font-semibold">
                    <span
                      className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: reached ? brandColor : "#cfc9c2" }}
                    >
                      {n}
                    </span>
                    <span className={active ? "text-[#1a1a2e]" : "text-[#9a9a9a]"}>{label}</span>
                  </li>
                );
              })}
            </ol>

            {step === 1 && (
              <label className="block text-sm font-semibold text-[#1a1a2e]">
                Email con el que reservaste
                <input
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className={`${inputClass} mt-1.5 font-normal`}
                />
              </label>
            )}

            {step === 2 && (
              <label className="block text-sm font-semibold text-[#1a1a2e]">
                ID del turno
                <input
                  type="text"
                  autoFocus
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  placeholder="Ej: 123"
                  className={`${inputClass} mt-1.5 font-normal`}
                />
              </label>
            )}

            {step === 3 && (
              <div className="text-sm text-[#4a4a4a] space-y-1">
                <p>Vas a enviar la siguiente información para cancelar tu turno:</p>
                <p><span className="font-semibold text-[#1a1a2e]">Email:</span> {trimmedEmail}</p>
                <p><span className="font-semibold text-[#1a1a2e]">ID del turno:</span> {trimmedId}</p>
              </div>
            )}

            {error && <p className="mt-3 text-sm text-[#b91c1c]">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={step === 1 ? close : () => { setError(""); setStep(step - 1); }}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#e2ddd8] text-sm font-semibold text-[#1a1a2e] hover:bg-[#F8F5F0] disabled:opacity-50"
              >
                {step === 1 ? "Cerrar" : "Atrás"}
              </button>
              <button
                type="submit"
                disabled={!canContinue || submitting}
                className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: step === 3 ? "#b91c1c" : brandColor }}
              >
                {step < 3 ? "Siguiente" : submitting ? "Cancelando..." : "Confirmar cancelación"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CancelAppointmentModal;
