import { useTranslation } from "../../../CustomHooks/TraslateHook";
import barberiaImg from "../../assets/business-types/barberia.webp";
import spaImg from "../../assets/business-types/spa.webp";
import peluqueriaImg from "../../assets/business-types/peluqueria.webp";
import esteticaImg from "../../assets/business-types/estetica.webp";
import masajesImg from "../../assets/business-types/masajes.webp";
import tattooImg from "../../assets/business-types/tattoo.webp";

// Rubros fijos (mismos tipos del registro).
const RUBROS = [
  { img: barberiaImg, key: "bizBarberia" },
  { img: spaImg, key: "bizSpa" },
  { img: peluqueriaImg, key: "bizPeluqueria" },
  { img: esteticaImg, key: "bizEstetica" },
  { img: masajesImg, key: "bizMasajes" },
  { img: tattooImg, key: "bizTattoo" },
];

// Íconos de las 3 features (decorativos).
const IconSpark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.5l2 5.7 5.7 2-5.7 2-2 5.7-2-5.7-5.7-2 5.7-2z" />
  </svg>
);
const IconAgendaWhatsapp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="17" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="16" y1="2" x2="16" y2="6" /><path d="M9 14h6v3l-2-1.2H9z" />
  </svg>
);
const IconSalesReports = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="20" x2="20" y2="20" /><rect x="5" y="12" width="3" height="6" rx="1" /><rect x="10.5" y="8" width="3" height="10" rx="1" /><rect x="16" y="4.5" width="3" height="13.5" rx="1" />
  </svg>
);
const IconClients = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6" /><path d="M17 14.7a5.5 5.5 0 0 1 4 5.3" />
  </svg>
);
const FEATURES = [
  { key: "featAgendaWhatsapp", icon: <IconAgendaWhatsapp /> },
  { key: "featSalesReports", icon: <IconSalesReports /> },
  { key: "featClients", icon: <IconClients /> },
];

const BusinessTypesSection = () => {
  const { t } = useTranslation();
  const list = RUBROS.map((r) => t(r.key)).join(", ");
  const subtitle = t("landingFreeSubtitle").replace("{list}", list);

  return (
    <section id="rubros" className="pb-20">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-[#f59e0b]"><IconSpark /></span>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">{t("landingFreeTitle")}</h2>
        </div>
        <p className="text-[var(--text-secondary-alt)] max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-14">
        {FEATURES.map(({ icon, key }) => (
          <div key={key} className="flex flex-col items-center text-center gap-3">
            <div className="bg-[var(--surface-muted)] p-3.5 rounded-2xl text-[var(--text-primary)]">{icon}</div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">{t(key)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {RUBROS.map((r) => (
          <div key={r.key} className="aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-muted)]">
            <img
              src={r.img}
              alt={t(r.key)}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BusinessTypesSection;
