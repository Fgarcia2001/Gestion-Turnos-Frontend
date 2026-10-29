import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../CustomHooks/TraslateHook";
import { useLandingContent } from "../CustomHooks/useLandingContent";
import { resolveLandingColor, resolveLandingTextColor } from "../CustomHooks/landingColors";
import { parseSectionsOrder } from "../CustomHooks/landingSectionsOrder";
import HeroSection from "../src/Components/ComponentsHome/HeroSection";
import OptionCard from "../src/Components/ComponentsHome/OptionCard";
import BusinessTypesSection from "../src/Components/ComponentsHome/BusinessTypesSection";
import PlansSection from "../src/Components/ComponentsHome/PlansSection";
import AboutSection from "../src/Components/ComponentsHome/AboutSection";
import Footer from "../src/Components/ComponentsHome/Footer";
import ThemeToggle from "../src/Components/Shared/ThemeToggle";

const BuildingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1a1a2e"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18Z" />
    <path d="M6 12H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" />
    <path d="M18 9h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2" />
    <path d="M10 6h.01" />
    <path d="M14 6h.01" />
    <path d="M10 10h.01" />
    <path d="M14 10h.01" />
    <path d="M10 14h.01" />
    <path d="M14 14h.01" />
    <path d="M10 18h.01" />
    <path d="M14 18h.01" />
  </svg>
);

const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const { t, toggleLanguage, language } = useTranslation();
  const content = useLandingContent();
  const brandName = content?.brandName || t("brandName");
  const primaryColor = resolveLandingColor(content, "primaryColor");
  const primaryTextColor = resolveLandingTextColor(content, "primaryColor");
  const backgroundColor = resolveLandingColor(content, "backgroundColor");
  const accentColor = resolveLandingColor(content, "accentColor");
  const sectionsOrder = parseSectionsOrder(content?.sectionsOrder);
  const sectionBlocks = {
    images: <BusinessTypesSection key="images" />,
    plans: <PlansSection key="plans" />,
    about: <AboutSection key="about" />,
  };

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const goToRegister = () => {
    setMobileNavOpen(false);
    navigate("/register");
  };
  const scrollToAbout = () => {
    setMobileNavOpen(false);
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      className="min-h-screen w-full"
      style={{
        backgroundColor,
        "--landing-primary": primaryColor,
        "--landing-bg": backgroundColor,
        "--landing-accent": accentColor,
      }}
    >
      <nav className="relative w-full px-4 py-6 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          <div className="brand-icon p-1.5 rounded-lg text-white cursor-pointer shrink-0" style={{ backgroundColor: primaryColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <span className="text-lg font-bold truncate" style={{ color: primaryTextColor }}>{brandName}</span>
          <button
            onClick={scrollToAbout}
            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--surface-muted)] transition-colors"
            style={{ color: primaryTextColor }}
          >
            {t("navAbout")}
          </button>
        </div>

        {/* Controles de escritorio */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={toggleLanguage}
            className="bg-[var(--surface)] border px-3 py-1.5 rounded-full shadow-sm hover:bg-[var(--surface-muted)] transition-all font-medium text-xs flex items-center gap-1.5"
            style={{ borderColor: accentColor }}
          >
            <span style={language === "es" ? { fontWeight: "bold", color: primaryTextColor } : { color: "var(--text-faint)" }}>ES</span>
            <span style={{ color: accentColor }}>|</span>
            <span style={language === "en" ? { fontWeight: "bold", color: primaryTextColor } : { color: "var(--text-faint)" }}>EN</span>
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[var(--surface-muted)] transition-colors"
            style={{ color: primaryTextColor }}
          >
            {t("signIn")}
          </button>
          <button
            onClick={goToRegister}
            className="px-4 py-2 rounded-xl text-white text-sm font-semibold transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            {t("registerBusinessCta")}
          </button>
        </div>

        {/* Boton hamburguesa (movil) */}
        <button
          onClick={() => setMobileNavOpen((open) => !open)}
          aria-label={mobileNavOpen ? "Cerrar menu" : "Abrir menu"}
          className="sm:hidden shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border bg-[var(--surface)]"
          style={{ borderColor: accentColor, color: primaryTextColor }}
        >
          {mobileNavOpen ? <IconX /> : <IconMenu />}
        </button>

        {/* Persiana movil */}
        {mobileNavOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black/40 sm:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <div
              className="absolute top-full left-4 right-4 mt-2 z-40 sm:hidden bg-[var(--surface)] border rounded-2xl shadow-xl p-3 flex flex-col gap-1"
              style={{ borderColor: accentColor }}
            >
              <button
                onClick={scrollToAbout}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-left hover:bg-[var(--surface-muted)] transition-colors"
                style={{ color: primaryTextColor }}
              >
                {t("navAbout")}
              </button>

              <div className="flex items-center justify-between px-4 py-2">
                <button
                  onClick={toggleLanguage}
                  className="bg-[var(--surface-muted)] px-3 py-1.5 rounded-full font-medium text-xs flex items-center gap-1.5"
                >
                  <span style={language === "es" ? { fontWeight: "bold", color: primaryTextColor } : { color: "var(--text-faint)" }}>ES</span>
                  <span style={{ color: accentColor }}>|</span>
                  <span style={language === "en" ? { fontWeight: "bold", color: primaryTextColor } : { color: "var(--text-faint)" }}>EN</span>
                </button>
                <ThemeToggle />
              </div>

              <div className="h-px my-1" style={{ backgroundColor: accentColor }} />

              <button
                onClick={() => { setMobileNavOpen(false); navigate("/login"); }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-left hover:bg-[var(--surface-muted)] transition-colors"
                style={{ color: primaryTextColor }}
              >
                {t("signIn")}
              </button>
              <button
                onClick={goToRegister}
                className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold text-center transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                {t("registerBusinessCta")}
              </button>
            </div>
          </>
        )}
      </nav>

      <div className="max-w-5xl mx-auto px-4">
        <HeroSection />

        <section className="flex flex-col md:flex-row gap-6 pb-20">
          <OptionCard
            icon={<BuildingIcon />}
            title={t("businessCardTitle")}
            description={t("businessCardDesc")}
            buttonLabel={t("registerBusinessCta")}
            onAction={goToRegister}
          />
        </section>

        {sectionsOrder.map((key) => sectionBlocks[key])}
      </div>

      <Footer />
    </main>
  );
};

export default Home;
