import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";

// ── Datos de contacto — reemplazar por los reales ─────────────────────────────
const CONTACT_WHATSAPP = "+5493410000000";
const CONTACT_EMAIL = "soporte@ejemplo.com";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconHelpCircle = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" /><path d="M12 17V17.01" /><path d="M12 13.5A1.5 1.5 0 0 1 13.5 12C14.33 11.17 14.5 10 14 9.27A3 3 0 0 0 9.17 9" />
  </svg>
);
const IconChat = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
const IconMail = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconClock = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" /><path d="M12 7V12L15 14" />
  </svg>
);
const IconBug = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m8 2 1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" /><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" /><path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4" />
  </svg>
);
const IconChevron = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const IconSend = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);
const IconCopy = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconCheck = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconAlert = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

// ── Datos ─────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: "faq1Q", a: "faq1A" },
  { q: "faq2Q", a: "faq2A" },
  { q: "faq3Q", a: "faq3A" },
  { q: "faq4Q", a: "faq4A" },
  { q: "faq5Q", a: "faq5A" },
  { q: "faq6Q", a: "faq6A" },
];

const INPUT_CLASSES =
  "w-full px-3 py-2 rounded-xl border border-[#e2ddd8] bg-[#fcfbf9] text-sm text-[#1a1a2e] placeholder:text-[#b5aea6] focus:outline-none focus:border-[#1a1a2e] transition-colors";

// ── Card header ───────────────────────────────────────────────────────────────
const CardHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-start gap-3 mb-5">
    <div className="w-11 h-11 rounded-xl bg-[#f0ede8] flex items-center justify-center text-[#1a1a2e] shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <h2 className="text-base font-semibold text-[#1a1a2e]">{title}</h2>
      <p className="text-xs text-[#9a9a9a] mt-0.5 leading-relaxed">{subtitle}</p>
    </div>
  </div>
);

const ContactRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-[#fcfbf9] border border-[#e2ddd8] rounded-xl px-3 py-2.5">
    <div className="w-8 h-8 rounded-lg bg-[#f0ede8] flex items-center justify-center text-[#1a1a2e] shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] text-[#9a9a9a]">{label}</p>
      <p className="text-sm font-semibold text-[#1a1a2e] break-all" dir="ltr">{value}</p>
    </div>
  </div>
);

// ── Help ──────────────────────────────────────────────────────────────────────
const Help = () => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(0);
  const [bugType, setBugType] = useState("bug");
  const [bugDescription, setBugDescription] = useState("");
  const [bugSteps, setBugSteps] = useState("");
  const [formError, setFormError] = useState(null);
  const [toast, setToast] = useState(null);
  const [userAgent] = useState(() => navigator.userAgent);
  const toastTimer = useRef(null);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  };

  const waDigits = CONTACT_WHATSAPP.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${waDigits}?text=${encodeURIComponent(t("whatsappDefaultMessage") || "Hola, necesito ayuda con Gestión Turnos.")}`;
  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t("bugMailSubjectPrefix") || "Gestión Turnos")}`;

  const buildBugReport = () => {
    const typeLabel = t(`bugType${bugType === "bug" ? "Bug" : bugType === "suggestion" ? "Suggestion" : "Other"}`);
    const subject = `[${t("bugMailSubjectPrefix") || "Gestión Turnos"}] ${typeLabel}`;
    const lines = [
      `${t("bugTypeLabel")}: ${typeLabel}`,
      `${t("bugDescriptionLabel")}:`,
      bugDescription.trim(),
      "",
      `${t("bugStepsLabel")}:`,
      bugSteps.trim() || "-",
      "",
      `${t("bugBrowserLabel")}: ${userAgent}`,
      `${t("bugPageLabel")}: ${window.location.pathname}`,
      `${t("bugDateLabel")}: ${new Date().toLocaleString()}`,
    ];
    return { subject, body: lines.join("\r\n") };
  };

  const validateReport = () => {
    if (!bugDescription.trim()) {
      setFormError(t("bugDescriptionRequired") || "Describí qué pasó.");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSendReport = (event) => {
    event.preventDefault();
    if (!validateReport()) return;
    const { subject, body } = buildBugReport();
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast(t("bugEmailOpened") || "Se abrió tu cliente de correo.");
  };

  const handleCopyReport = async () => {
    if (!validateReport()) return;
    const { subject, body } = buildBugReport();
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      showToast(t("bugCopied") || "Reporte copiado al portapapeles.");
    } catch {
      showToast(t("bugCopyFailed") || "No se pudo copiar el reporte.", "error");
    }
  };

  const toastEl = toast ? (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-2 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-[fadeIn_0.2s_ease-out] ${toast.type === "error" ? "bg-[#b91c1c]" : "bg-[#1a1a2e]"}`}
    >
      {toast.type === "error" ? <IconAlert /> : <IconCheck />}
      {toast.message}
    </div>
  ) : null;

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">{t("helpTitle") || "Help & Support"}</h1>
        <p className="text-sm text-[#9a9a9a] mt-1">{t("helpSubtitle") || "Find answers, contact us or report a problem."}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* 1 · Preguntas frecuentes */}
        <section className="bg-white rounded-2xl border border-[#e2ddd8] p-6">
          <CardHeader
            icon={<IconHelpCircle />}
            title={t("faqTitle") || "Frequently asked questions"}
            subtitle={t("faqSubtitle") || "The most common questions about the platform."}
          />
          <div className="flex flex-col gap-2.5">
            {FAQ_ITEMS.map((item, index) => {
              const open = openFaq === index;
              return (
                <div
                  key={item.q}
                  className={`rounded-xl border overflow-hidden transition-colors ${open ? "border-[#c9c2b8] bg-[#fcfbf9]" : "border-[#e2ddd8] bg-white"}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-[#1a1a2e]">{t(item.q)}</span>
                    <IconChevron className={`shrink-0 text-[#9a9a9a] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && (
                    <p className="px-4 pb-4 -mt-0.5 text-xs leading-relaxed text-[#6b7280]">
                      {t(item.a)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 2 · Contacto */}
        <section className="bg-white rounded-2xl border border-[#e2ddd8] p-6">
          <CardHeader
            icon={<IconChat />}
            title={t("contactTitle") || "Contact us"}
            subtitle={t("contactSubtitle") || "We answer Monday to Friday during business hours."}
          />
          <div className="flex flex-col gap-3 mb-5">
            <ContactRow icon={<IconChat className="w-4 h-4" />} label={t("contactWhatsAppLabel") || "WhatsApp"} value={CONTACT_WHATSAPP} />
            <ContactRow icon={<IconMail className="w-4 h-4" />} label={t("contactEmailLabel") || "Email"} value={CONTACT_EMAIL} />
            <ContactRow icon={<IconClock className="w-4 h-4" />} label={t("contactHoursLabel") || "Business hours"} value={t("contactHoursValue") || "Mon–Fri · 9:00 to 18:00 (GMT-3)"} />
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25d366] text-white text-sm font-semibold hover:bg-[#1fbe5a] transition-colors"
            >
              <IconChat className="w-4 h-4" />
              {t("contactWriteWhatsapp") || "Write on WhatsApp"}
            </a>
            <a
              href={mailtoUrl}
              className="inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d44] transition-colors"
            >
              <IconMail className="w-4 h-4" />
              {t("contactSendEmail") || "Send an email"}
            </a>
          </div>
        </section>

        {/* 3 · Reportar un bug */}
        <section className="bg-white rounded-2xl border border-[#e2ddd8] p-6">
          <CardHeader
            icon={<IconBug />}
            title={t("bugTitle") || "Report a bug"}
            subtitle={t("bugSubtitle") || "Tell us what happened and we will get back to you."}
          />
          <form onSubmit={handleSendReport} className="flex flex-col gap-3" noValidate>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#1a1a2e]">{t("bugTypeLabel") || "Type"}</span>
              <select
                value={bugType}
                onChange={(e) => setBugType(e.target.value)}
                className={INPUT_CLASSES}
              >
                <option value="bug">{t("bugTypeBug") || "Bug / Error"}</option>
                <option value="suggestion">{t("bugTypeSuggestion") || "Suggestion"}</option>
                <option value="other">{t("bugTypeOther") || "Other"}</option>
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#1a1a2e]">{t("bugDescriptionLabel") || "What happened?"}</span>
              <textarea
                value={bugDescription}
                onChange={(e) => {
                  setBugDescription(e.target.value);
                  if (formError) setFormError(null);
                }}
                rows={3}
                placeholder={t("bugDescriptionPlaceholder") || "Describe the problem you saw…"}
                className={`${INPUT_CLASSES} resize-y`}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#1a1a2e]">{t("bugStepsLabel") || "Steps to reproduce (optional)"}</span>
              <textarea
                value={bugSteps}
                onChange={(e) => setBugSteps(e.target.value)}
                rows={2}
                placeholder={t("bugStepsPlaceholder") || "1. I opened… 2. I clicked… 3. Then…"}
                className={`${INPUT_CLASSES} resize-y`}
              />
            </label>

            <p className="text-[11px] text-[#9a9a9a] break-all">
              <span className="font-semibold text-[#6b7280]">{t("bugBrowserLabel") || "Browser"}:</span> {userAgent}
            </p>

            {formError && (
              <p className="text-xs font-semibold text-[#b91c1c]">{formError}</p>
            )}

            <div className="flex gap-3 mt-1">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d44] transition-colors"
              >
                <IconSend />
                {t("bugSend") || "Send report"}
              </button>
              <button
                type="button"
                onClick={handleCopyReport}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#e2ddd8] bg-[#fcfbf9] text-[#1a1a2e] text-sm font-semibold hover:bg-[#f0ede8] transition-colors"
              >
                <IconCopy />
                {t("bugCopy") || "Copy"}
              </button>
            </div>
          </form>
        </section>
      </div>

      {toastEl}
    </div>
  );
};

export default Help;
