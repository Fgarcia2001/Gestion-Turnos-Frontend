import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Selector de pais (bandera + prefijo) + input del numero. La validacion de
// formato (no atada a un pais fijo) vive en ./phoneValidation.js.
const containerCls =
  "flex items-center h-12 w-full rounded-xl border bg-[var(--surface-faint)] px-3 gap-2 focus-within:border-[var(--brand)] focus-within:bg-[var(--surface)] transition-all duration-200";

const PhoneField = ({ name, value, onChange, onBlur, placeholder, hasError, defaultCountry = "AR" }) => (
  // react-phone-number-input no deja enganchar un onBlur propio (lo pisa
  // internamente para su manejo de foco), asi que se escucha en un div
  // envolvente: el blur del input nativo interno burbujea igual via React.
  <div onBlur={onBlur}>
    <PhoneInput
      international
      defaultCountry={defaultCountry}
      value={value || undefined}
      onChange={(val) => onChange({ target: { name, value: val || "" } })}
      placeholder={placeholder}
      className={`${containerCls} ${hasError ? "border-red-400" : "border-[var(--border-subtle)]"}`}
      numberInputProps={{
        className: "flex-1 min-w-0 bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-faint)]",
      }}
    />
  </div>
);

export default PhoneField;
