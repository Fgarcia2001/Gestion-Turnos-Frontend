import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { useLandingContent } from "../../../CustomHooks/useLandingContent";
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

  useEffect(() => {
    fetchPlans()
      .then((data) => setPlans(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const choosePlan = (planId) => {
    sessionStorage.setItem(PENDING_PLAN_KEY, planId);
    navigate("/login", { state: { register: true } });
  };

  if (loading) return null;

  return (
    <section id="plans" className="pb-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e]">{plansTitle}</h2>
        <p className="text-[#6b6b6b] mt-2 max-w-xl mx-auto">{plansSubtitle}</p>
      </div>

      {plans.length === 0 ? (
        <p className="text-center text-sm text-[#9a9a9a]">{t("noPlansAvailable")}</p>
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
                  className="w-full sm:w-[300px] bg-white rounded-2xl shadow-sm border border-[#e2ddd8] p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="font-bold text-lg text-[#1a1a2e]">{name}</h3>
                  {description && <p className="text-sm text-[#6b6b6b] mt-1 mb-6 flex-1">{description}</p>}
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-[#1a1a2e]">${price}</span>
                    {durationDays ? (
                      <span className="text-sm text-[#9a9a9a]"> / {durationDays} {t("daysSuffix")}</span>
                    ) : null}
                  </div>
                  <button
                    onClick={() => choosePlan(id)}
                    className="w-full py-2.5 bg-[#1a1a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#2d2d44] transition-colors mt-auto"
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
