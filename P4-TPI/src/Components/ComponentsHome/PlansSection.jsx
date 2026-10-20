import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { useLandingContent } from "../../../CustomHooks/useLandingContent";
import { resolveLandingColor, resolveLandingTextColor } from "../../../CustomHooks/landingColors";
import { fetchPlans, PENDING_PLAN_KEY } from "../../services/api";

const PlansSection = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const content = useLandingContent();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const plansTitle =
    (language === "en" ? content?.plansTitleEn : content?.plansTitleEs) || t("plansTitle");
  const plansSubtitle =
    (language === "en" ? content?.plansSubtitleEn : content?.plansSubtitleEs) || t("plansSubtitle");
  const primaryColor = resolveLandingColor(content, "primaryColor");
  const primaryTextColor = resolveLandingTextColor(content, "primaryColor");
  const accentColor = resolveLandingColor(content, "accentColor");

  useEffect(() => {
    fetchPlans()
      .then((data) => setPlans(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const choosePlan = (planId) => {
    sessionStorage.setItem(PENDING_PLAN_KEY, planId);
    navigate("/register");
  };

  if (loading) return null;

  return (
    <section id="plans" className="pb-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: primaryTextColor }}>{plansTitle}</h2>
        <p className="text-[var(--text-secondary-alt)] mt-2 max-w-xl mx-auto">{plansSubtitle}</p>
      </div>

      {plans.length === 0 ? (
        <p className="text-center text-sm text-[var(--text-muted)]">{t("noPlansAvailable")}</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {[...plans]
            .sort((a, b) => (a.price ?? a.Price ?? 0) - (b.price ?? b.Price ?? 0))
            .map((tier) => {
              const id = tier.id ?? tier.Id;
              const name = tier.name ?? tier.Name;
              const description = tier.description ?? tier.Description;
              const price = tier.price ?? tier.Price;
              const durationDays = tier.durationDays ?? tier.DurationDays;
              return (
                <div
                  key={id ?? name}
                  className="w-full sm:w-[300px] bg-[var(--surface)] rounded-2xl shadow-sm border p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  style={{ borderColor: accentColor }}
                >
                  <h3 className="font-bold text-lg" style={{ color: primaryTextColor }}>{name}</h3>
                  {description && <p className="text-sm text-[var(--text-secondary-alt)] mt-1 mb-6 flex-1">{description}</p>}
                  <div className="mb-6">
                    <span className="text-3xl font-bold" style={{ color: primaryTextColor }}>${price}</span>
                    {durationDays ? (
                      <span className="text-sm text-[var(--text-muted)]"> / {durationDays} {t("daysSuffix")}</span>
                    ) : null}
                  </div>
                  <button
                    onClick={() => choosePlan(id)}
                    className="w-full py-2.5 text-white rounded-xl text-sm font-semibold transition-colors mt-auto"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {t("choosePlanCta")}
                  </button>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
};

export default PlansSection;
