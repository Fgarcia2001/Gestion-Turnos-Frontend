import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { useLandingContent } from "../../../CustomHooks/useLandingContent";
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

  return (
    <section id="about" className="pb-20">
      <div className="bg-white rounded-2xl border border-[#e2ddd8] px-6 py-12 sm:px-12 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e]">{aboutTitle}</h2>
        <p className="text-[#6b6b6b] text-base mt-4 leading-relaxed">{aboutDesc}</p>
      </div>
    </section>
  );
};

export default AboutSection;
