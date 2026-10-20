import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { useLandingContent } from "../../../CustomHooks/useLandingContent";
import { resolveLandingColor, resolveLandingTextColor } from "../../../CustomHooks/landingColors";
import { applyBrandName } from "../../services/landingContentService";

const AboutSection = () => {
  const { t, language } = useTranslation();
  const content = useLandingContent();

  const brandName = content?.brandName || t("brandName");
  const aboutTitle =
    (language === "en" ? content?.aboutTitleEn : content?.aboutTitleEs) || t("aboutTitle");
  const aboutDesc = applyBrandName(
    (language === "en" ? content?.aboutDescriptionEn : content?.aboutDescriptionEs) || t("aboutDesc"),
    brandName
  );
  const primaryTextColor = resolveLandingTextColor(content, "primaryColor");
  const accentColor = resolveLandingColor(content, "accentColor");

  return (
    <section id="about" className="pb-20">
      <div className="bg-[var(--surface)] rounded-2xl border px-6 py-12 sm:px-12 text-center max-w-3xl mx-auto" style={{ borderColor: accentColor }}>
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: primaryTextColor }}>{aboutTitle}</h2>
        <p className="text-[var(--text-secondary-alt)] text-base mt-4 leading-relaxed">{aboutDesc}</p>
      </div>
    </section>
  );
};

export default AboutSection;
