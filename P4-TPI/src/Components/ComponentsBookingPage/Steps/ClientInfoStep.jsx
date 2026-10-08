import { useState } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { validateClientInfo } from "./stepValidation";
import { IconUser, IconMail, IconPhone, IconCake, IconClipboard, IconDollar } from "../Icons";

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-[#1a1a2e]">{label}</label>
    {children}
    {error && <span className="text-xs text-[#b91c1c]">{error}</span>}
  </div>
);

const inputClass = (hasError) =>
  `w-full pl-10 pr-4 py-2.5 rounded-xl border-2 text-sm outline-none transition-colors bg-white focus:border-[#1a1a2e] ${
    hasError ? "border-[#fca5a5]" : "border-[#e2ddd8]"
  }`;

const IconInput = ({ icon, children }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9a9a]">{icon}</span>
    {children}
  </div>
);

const ClientInfoStep = ({ booking, updateBooking, showErrors }) => {
  const { t } = useTranslation();
  const [touched, setTouched] = useState({});
  const errors = validateClientInfo(booking, t);

  const shouldShow = (field) => showErrors || touched[field];
  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const handleChange = (field) => (e) => updateBooking({ [field]: e.target.value });

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a1a2e]">{t("enterYourInformation") || "Enter Your Information"}</h2>
        <p className="text-[#6b6b6b] mt-1">Así podemos confirmarte el turno</p>
      </div>

      <div className="flex flex-col gap-4">
        <Field label={t("clientNameLabel") || "Full name"} error={shouldShow("clientName") ? errors.clientName : null}>
          <IconInput icon={<IconUser />}>
            <input
              type="text"
              value={booking.clientName}
              onChange={handleChange("clientName")}
              onBlur={() => markTouched("clientName")}
              className={inputClass(shouldShow("clientName") && errors.clientName)}
            />
          </IconInput>
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t("clientEmailLabel") || "Email"} error={shouldShow("clientEmail") ? errors.clientEmail : null}>
            <IconInput icon={<IconMail />}>
              <input
                type="email"
                value={booking.clientEmail}
                onChange={handleChange("clientEmail")}
                onBlur={() => markTouched("clientEmail")}
                className={inputClass(shouldShow("clientEmail") && errors.clientEmail)}
              />
            </IconInput>
          </Field>

          <Field label={t("clientPhoneLabel") || "Phone"} error={shouldShow("clientPhone") ? errors.clientPhone : null}>
            <IconInput icon={<IconPhone />}>
              <input
                type="tel"
                value={booking.clientPhone}
                onChange={handleChange("clientPhone")}
                onBlur={() => markTouched("clientPhone")}
                className={inputClass(shouldShow("clientPhone") && errors.clientPhone)}
              />
            </IconInput>
          </Field>
        </div>

        <Field label={t("clientBirthDayLabel") || "Date of birth"} error={shouldShow("clientBirthDay") ? errors.clientBirthDay : null}>
          <IconInput icon={<IconCake />}>
            <input
              type="date"
              value={booking.clientBirthDay || ""}
              onChange={handleChange("clientBirthDay")}
              onBlur={() => markTouched("clientBirthDay")}
              className={inputClass(shouldShow("clientBirthDay") && errors.clientBirthDay)}
            />
          </IconInput>
        </Field>

        <Field label={t("paymentLabel") || "Payment method"}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 0, label: t("payment_cash") || "Efectivo" },
              { value: 1, label: t("payment_card") || "Tarjeta" },
            ].map((option) => {
              const selected = Number(booking.payment) === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateBooking({ payment: option.value })}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                    selected
                      ? "border-[#1a1a2e] bg-[#1a1a2e] text-white"
                      : "border-[#e2ddd8] text-[#1a1a2e] hover:border-[#b3aca3] bg-white"
                  }`}
                >
                  <IconDollar />
                  {option.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label={t("observationLabel") || "Notes (optional)"}>
          <div className="relative">
            <span className="absolute left-3 top-3 text-[#9a9a9a]">
              <IconClipboard />
            </span>
            <textarea
              value={booking.observation}
              onChange={handleChange("observation")}
              placeholder={t("observationPlaceholder") || "Any details the professional should know"}
              rows={3}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#e2ddd8] text-sm outline-none transition-colors bg-white focus:border-[#1a1a2e]"
            />
          </div>
        </Field>
      </div>
    </div>
  );
};

export default ClientInfoStep;
