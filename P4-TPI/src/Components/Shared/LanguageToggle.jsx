import { useTranslation } from "../../../CustomHooks/TraslateHook";

// Selector de idioma ES|EN, mismo estilo que ya existia inline en
// Login/Home, ahora reutilizable en los dashboards (Admin, SysAdmin, etc).
const LanguageToggle = ({ className = "" }) => {
  const { language, toggleLanguage } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === "es" ? "Switch to English" : "Cambiar a Español"}
      title={language === "es" ? "Switch to English" : "Cambiar a Español"}
      className={`bg-[var(--surface)] border border-[var(--border-subtle)] px-4 py-2 rounded-full shadow-sm hover:bg-[var(--surface-muted)] transition-all font-medium text-sm flex items-center gap-2 ${className}`}
    >
      <span className={language === "es" ? "font-bold text-[var(--text-primary)]" : "text-[var(--text-muted)]"}>
        ES
      </span>
      <span className="text-[var(--text-faint)]">|</span>
      <span className={language === "en" ? "font-bold text-[var(--text-primary)]" : "text-[var(--text-muted)]"}>
        EN
      </span>
    </button>
  );
};

export default LanguageToggle;
