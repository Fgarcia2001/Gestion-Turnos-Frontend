import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { useLandingContent } from "../../../CustomHooks/useLandingContent";
import { resolveLandingColor, resolveLandingTextColor } from "../../../CustomHooks/landingColors";
import { fetchPlans, PENDING_PLAN_KEY } from "../../services/api";

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// -1 es el valor que usa el backend para "sin limite" (ver PlanModals.jsx,
// mismo criterio que ya usa el panel de Admin).
const formatLimit = (value, unlimitedLabel) => (value === -1 || value === "-1" ? unlimitedLabel : value);

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
  const unlimitedLabel = t("Unlimited") || "Unlimited";

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
          {/* El orden ya viene del backend por displayOrder (lo que el
              SysAdmin arma arrastrando los planes en el preview) — no
              reordenar aca por precio, pisaria esa eleccion. */}
          {plans.map((tier) => {
              const id = tier.id ?? tier.Id;
              const name = tier.name ?? tier.Name;
              const description = tier.description ?? tier.Description;
              const price = tier.price ?? tier.Price;
              const durationDays = tier.durationDays ?? tier.DurationDays;
              const maxStaffAllowed = tier.maxStaffAllowed ?? tier.MaxStaffAllowed;
              const maxBranchesAllowed = tier.maxBranchesAllowed ?? tier.MaxBranchesAllowed;
              const maxServicesAllowed = tier.maxServicesAllowed ?? tier.MaxServicesAllowed;
              // El Free Plan (precio 0) no vence nunca — mismo criterio que ya
              // usa el backend (Plan.Price <= 0) para tratarlo como permanente.
              const isFree = Number(price) <= 0;
              return (
                <div
                  key={id ?? name}
                  className="w-full sm:w-[300px] bg-[var(--surface)] rounded-2xl shadow-sm border p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  style={{ borderColor: accentColor }}
                >
                  <h3 className="font-bold text-lg" style={{ color: primaryTextColor }}>{name}</h3>
                  {description && <p className="text-sm text-[var(--text-secondary-alt)] mt-1 mb-4">{description}</p>}
                  <div className="mb-5">
                    <span className="text-3xl font-bold" style={{ color: primaryTextColor }}>${price}</span>
                    <span className="text-sm text-[var(--text-muted)]">
                      {isFree
                        ? ` ${t("planForever") || "Forever"}`
                        : durationDays
                          ? ` / ${durationDays} ${t("daysSuffix")}`
                          : null}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2 mb-6 flex-1 text-sm text-[var(--text-secondary-alt)]">
                    <li className="flex items-center gap-2">
                      <span className="shrink-0" style={{ color: primaryColor }}><IconCheck /></span>
                      {formatLimit(maxStaffAllowed, unlimitedLabel)} {t("Staff") || "Staff"}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="shrink-0" style={{ color: primaryColor }}><IconCheck /></span>
                      {formatLimit(maxBranchesAllowed, unlimitedLabel)} {t("Branches") || "Branches"}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="shrink-0" style={{ color: primaryColor }}><IconCheck /></span>
                      {formatLimit(maxServicesAllowed, unlimitedLabel)} {t("Services") || "Services"}
                    </li>
                  </ul>
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
