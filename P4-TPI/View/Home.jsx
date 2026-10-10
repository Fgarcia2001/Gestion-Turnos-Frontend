import { useNavigate } from "react-router-dom";
import { useTranslation } from "../CustomHooks/TraslateHook";
import HeroSection from "../src/Components/ComponentsHome/HeroSection";
import OptionCard from "../src/Components/ComponentsHome/OptionCard";
import PlansSection from "../src/Components/ComponentsHome/PlansSection";

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

const Home = () => {
  const navigate = useNavigate();
  const { t, toggleLanguage, language } = useTranslation();

  const goToRegister = () => navigate("/login", { state: { register: true } });

  return (
    <main className="min-h-screen w-full bg-[#F8F5F0]">
      <nav className="w-full px-4 py-6 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="brand-icon bg-[#1a1a2e] p-1.5 rounded-lg text-white cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <span className="text-lg font-bold text-[#1a1a2e]">{t("brandName")}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="bg-white border border-[#e2ddd8] px-3 py-1.5 rounded-full shadow-sm hover:bg-[#F0EDE8] transition-all font-medium text-xs flex items-center gap-1.5"
          >
            <span className={language === "es" ? "font-bold text-[#1a1a2e]" : "text-[#b3aca3]"}>ES</span>
            <span className="text-[#e2ddd8]">|</span>
            <span className={language === "en" ? "font-bold text-[#1a1a2e]" : "text-[#b3aca3]"}>EN</span>
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#1a1a2e] hover:bg-[#F0EDE8] transition-colors"
          >
            {t("signIn")}
          </button>
          <button
            onClick={goToRegister}
            className="px-4 py-2 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d44] transition-colors"
          >
            {t("registerBusinessCta")}
          </button>
        </div>
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

        <PlansSection />
      </div>
    </main>
  );
};

export default Home;
