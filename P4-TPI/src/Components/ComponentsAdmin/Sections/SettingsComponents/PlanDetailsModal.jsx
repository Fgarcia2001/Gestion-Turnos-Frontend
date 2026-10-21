import { ModalOverlay } from "../ManagmentBusinessComponents/Shared";
import { IconX } from "../ManagmentBusinessComponents/Icons";
import { IconUser, IconBuilding, IconTag } from "./SettingsIcons";
import { useTranslation } from "../../../../../CustomHooks/TraslateHook";

const CSS_ANIMATIONS = `
  @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
`;

const formatLimit = (value, unlimitedLabel) => (value === -1 || value === "-1" ? unlimitedLabel : value);

const LimitRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-[var(--surface-faint-2)] border border-[var(--border-subtle)] rounded-xl">
    <div className="w-9 h-9 rounded-lg bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  </div>
);

const PlanDetailsModal = ({ plan, isCurrent, onClose, onRequestChange }) => {
  const { t } = useTranslation();
  if (!plan) return null;
  const unlimitedLabel = t("Unlimited") || "Unlimited";

  const name = plan.name ?? plan.Name;
  const description = plan.description ?? plan.Description;
  const price = plan.price ?? plan.Price;
  const durationDays = plan.durationDays ?? plan.DurationDays;
  const isActive = plan.isActive ?? plan.IsActive;
  const maxStaffAllowed = plan.maxStaffAllowed ?? plan.MaxStaffAllowed;
  const maxBranchesAllowed = plan.maxBranchesAllowed ?? plan.MaxBranchesAllowed;
  const maxServicesAllowed = plan.maxServicesAllowed ?? plan.MaxServicesAllowed;

  return (
    <>
      <style>{CSS_ANIMATIONS}</style>
      <ModalOverlay onClose={onClose}>
        <div className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-md p-6 relative" style={{ maxHeight: "90vh", overflowY: "auto" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">{name}</h2>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isActive ? "bg-green-50 text-green-600" : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                    }`}
                >
                  {isActive ? (t("Active") || "Active") : (t("Inactive") || "Inactive")}
                </span>
              </div>
              {description && <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-muted)] shrink-0"
            >
              <IconX />
            </button>
          </div>

          <div className="mb-5">
            <span className="text-3xl font-bold text-[var(--text-primary)]">${price}</span>
            {durationDays ? <span className="text-sm text-[var(--text-muted)]"> / {durationDays} {t("days") || "days"}</span> : null}
          </div>

          <div className="flex flex-col gap-2.5 mb-6">
            <LimitRow icon={<IconUser />} label={t("Staff") || "Staff"} value={formatLimit(maxStaffAllowed, unlimitedLabel)} />
            <LimitRow icon={<IconBuilding />} label={t("Branches") || "Branches"} value={formatLimit(maxBranchesAllowed, unlimitedLabel)} />
            <LimitRow icon={<IconTag />} label={t("Services") || "Services"} value={formatLimit(maxServicesAllowed, unlimitedLabel)} />
          </div>

          {isCurrent ? (
            <div className="text-center text-sm font-semibold text-[var(--text-muted)] bg-[var(--surface-faint-2)] border border-[var(--border-subtle)] rounded-xl py-2.5">
              {t("This is your current plan") || "This is your current plan"}
            </div>
          ) : (
            <button
              onClick={() => onRequestChange(plan)}
              className="w-full py-2.5 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors"
            >
              {t("Change Plan") || "Change Plan"}
            </button>
          )}
        </div>
      </ModalOverlay>
    </>
  );
};

export default PlanDetailsModal;
