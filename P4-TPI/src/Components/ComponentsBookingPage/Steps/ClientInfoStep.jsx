import { useState } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { validateClientInfo } from "./stepValidation";

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    {children}
    {error && <span className="text-xs text-[#b91c1c]">{error}</span>}
  </div>
);

const inputClass = (hasError) =>
  `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-[#1A1A1A] ${
    hasError ? "border-[#b91c1c]" : "border-gray-200"
  }`;

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
        <h2 className="text-2xl font-bold text-gray-900">{t("enterYourInformation") || "Enter Your Information"}</h2>
      </div>

      <div className="flex flex-col gap-4">
        <Field label={t("clientNameLabel") || "Full name"} error={shouldShow("clientName") ? errors.clientName : null}>
          <input
            type="text"
            value={booking.clientName}
            onChange={handleChange("clientName")}
            onBlur={() => markTouched("clientName")}
            className={inputClass(shouldShow("clientName") && errors.clientName)}
          />
        </Field>

        <Field label={t("clientEmailLabel") || "Email"} error={shouldShow("clientEmail") ? errors.clientEmail : null}>
          <input
            type="email"
            value={booking.clientEmail}
            onChange={handleChange("clientEmail")}
            onBlur={() => markTouched("clientEmail")}
            className={inputClass(shouldShow("clientEmail") && errors.clientEmail)}
          />
        </Field>

        <Field label={t("clientPhoneLabel") || "Phone"} error={shouldShow("clientPhone") ? errors.clientPhone : null}>
          <input
            type="tel"
            value={booking.clientPhone}
            onChange={handleChange("clientPhone")}
            onBlur={() => markTouched("clientPhone")}
            className={inputClass(shouldShow("clientPhone") && errors.clientPhone)}
          />
        </Field>

        <Field label={t("clientBirthDayLabel") || "Date of birth"} error={shouldShow("clientBirthDay") ? errors.clientBirthDay : null}>
          <input
            type="date"
            value={booking.clientBirthDay || ""}
            onChange={handleChange("clientBirthDay")}
            onBlur={() => markTouched("clientBirthDay")}
            className={inputClass(shouldShow("clientBirthDay") && errors.clientBirthDay)}
          />
        </Field>

        <Field label={t("paymentLabel") || "Payment method"}>
          <select
            value={booking.payment}
            onChange={handleChange("payment")}
            className={inputClass(false)}
          >
            <option value={0}>{t("payment_cash") || "Cash"}</option>
            <option value={1}>{t("payment_card") || "Card"}</option>
          </select>
        </Field>

        <Field label={t("observationLabel") || "Notes (optional)"}>
          <textarea
            value={booking.observation}
            onChange={handleChange("observation")}
            placeholder={t("observationPlaceholder") || "Any details the professional should know"}
            rows={3}
            className={inputClass(false)}
          />
        </Field>
      </div>
    </div>
  );
};

export default ClientInfoStep;
