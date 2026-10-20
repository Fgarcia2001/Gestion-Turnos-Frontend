import { ModalOverlay } from "../ManagmentBusinessComponents/Shared";
import { IconX } from "../ManagmentBusinessComponents/Icons";
import { IconUser, IconBuilding, IconTag } from "./SettingsIcons";

const CSS_ANIMATIONS = `
  @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
`;

const formatLimit = (value) => (value === -1 || value === "-1" ? "Unlimited" : value);

const LimitRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-[var(--surface-faint-2)] border border-[var(--border-subtle)] rounded-xl">
    <div className="w-9 h-9 rounded-lg bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--text-primary)]">{formatLimit(value)}</p>
    </div>
  </div>
);

const PlanDetailsModal = ({ plan, isCurrent, onClose, onRequestChange }) => {
  if (!plan) return null;

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
                  {isActive ? "Active" : "Inactive"}
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
            {durationDays ? <span className="text-sm text-[var(--text-muted)]"> / {durationDays} days</span> : null}
          </div>

          <div className="flex flex-col gap-2.5 mb-6">
            <LimitRow icon={<IconUser />} label="Staff" value={maxStaffAllowed} />
            <LimitRow icon={<IconBuilding />} label="Branches" value={maxBranchesAllowed} />
            <LimitRow icon={<IconTag />} label="Services" value={maxServicesAllowed} />
          </div>

          {isCurrent ? (
            <div className="text-center text-sm font-semibold text-[var(--text-muted)] bg-[var(--surface-faint-2)] border border-[var(--border-subtle)] rounded-xl py-2.5">
              This is your current plan
            </div>
          ) : (
            <button
              onClick={() => onRequestChange(plan)}
              className="w-full py-2.5 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors"
            >
              Change Plan
            </button>
          )}
        </div>
      </ModalOverlay>
    </>
  );
};

export default PlanDetailsModal;
