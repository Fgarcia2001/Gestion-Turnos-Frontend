import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { useLandingContent } from "../../../CustomHooks/useLandingContent";
import { resolveLandingColor, resolveLandingTextColor } from "../../../CustomHooks/landingColors";

const HeroSection = () => {
  const { t, language } = useTranslation();
  const content = useLandingContent();

  const brandName = content?.brandName || t("brandName");
  const heroTitle =
    (language === "en" ? content?.heroTitleEn : content?.heroTitleEs) || t("heroTitle");
  const heroDesc =
    (language === "en" ? content?.heroDescriptionEn : content?.heroDescriptionEs) || t("heroDesc");
  const primaryColor = resolveLandingColor(content, "primaryColor");
  const primaryTextColor = resolveLandingTextColor(content, "primaryColor");
  const accentColor = resolveLandingColor(content, "accentColor");

  return (
    <section className="text-center px-4 pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="inline-flex items-center gap-2 bg-[var(--surface)]/60 border px-4 py-1.5 rounded-full mb-6" style={{ borderColor: accentColor }}>
        <div className="brand-icon p-1 rounded-md" style={{ backgroundColor: primaryColor }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </div>
        <span className="text-sm font-semibold" style={{ color: primaryTextColor }}>{brandName}</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl mx-auto" style={{ color: primaryTextColor }}>
        {heroTitle}
      </h1>

      <p className="text-[var(--text-secondary-alt)] text-base md:text-lg mt-6 max-w-xl mx-auto">
        {heroDesc}
      </p>
    </section>
  );
};

export default HeroSection;
