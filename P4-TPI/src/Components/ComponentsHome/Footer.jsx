import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { useLandingContent } from "../../../CustomHooks/useLandingContent";
import { IconMail, IconPhone } from "./FooterIcons";
import { SOCIAL_LINKS } from "./socialLinksConfig";

const Footer = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const content = useLandingContent();

  const brandName = content?.brandName || t("brandName");
  const footerDesc =
    (language === "en" ? content?.footerDescriptionEn : content?.footerDescriptionEs) || t("footerDesc");
  const year = new Date().getFullYear();

  const scrollToPlans = () => {
    document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
  };

  const activeSocials = SOCIAL_LINKS.filter(({ key }) => content?.[key]);
  const hasContact = Boolean(content?.contactEmail || content?.contactPhone);

  return (
    <footer className="bg-[#1a1a2e] text-white">
      <div
        className={`max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 gap-10 text-center ${
          hasContact ? "lg:grid-cols-3" : "lg:grid-cols-2"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="brand-icon bg-white/10 p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
            <span className="text-lg font-bold">{brandName}</span>
          </div>
          <p className="text-sm text-white/60 max-w-xs">{footerDesc}</p>

          {activeSocials.length > 0 && (
            <div className="flex justify-center gap-2.5 mt-5">
              {activeSocials.map((social) => (
                <a
                  key={social.key}
                  href={content[social.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <social.Icon />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-4">
            {t("footerLinksTitle")}
          </h4>
          <ul className="flex flex-col items-center gap-2.5 text-sm text-white/70">
            <li>
              <button onClick={() => navigate("/login")} className="hover:text-white transition-colors cursor-pointer">
                {t("footerSignIn")}
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/login", { state: { register: true } })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t("footerRegister")}
              </button>
            </li>
            <li>
              <button onClick={scrollToPlans} className="hover:text-white transition-colors cursor-pointer">
                {t("footerPlans")}
              </button>
            </li>
          </ul>
        </div>

        {hasContact && (
          <div className="flex flex-col items-center">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-4">
              {t("footerContactTitle")}
            </h4>
            <ul className="flex flex-col items-center gap-2.5 text-sm text-white/70">
              {content?.contactEmail && (
                <li>
                  <a href={`mailto:${content.contactEmail}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    <IconMail /> {content.contactEmail}
                  </a>
                </li>
              )}
              {content?.contactPhone && (
                <li>
                  <a href={`tel:${content.contactPhone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                    <IconPhone /> {content.contactPhone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 py-5 px-4 text-center text-xs text-white/40">
        © {year} {brandName}. {t("footerRights")}
      </div>
    </footer>
  );
};

export default Footer;
