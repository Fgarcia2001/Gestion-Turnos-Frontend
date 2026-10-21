import { useEffect, useState } from "react";
import { fetchAllPlans, createPlan, updatePlan, deletePlan } from "../../services/planService";
import { PlanFormModal, DeletePlanModal } from "./PlanModals";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconClock,
  IconUsers,
  IconBuilding,
  IconTag,
} from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Icons";
import { useTranslation } from "../../../CustomHooks/TraslateHook";

const formatLimit = (value, unlimitedLabel) => (value === -1 || value === "-1" ? unlimitedLabel : value);

const formatPrice = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? `$${n.toFixed(2)}` : value;
};

const StatBox = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 bg-[var(--surface-faint)] border border-[var(--border-subtle)] rounded-xl p-2.5">
    <div className="w-7 h-7 rounded-lg bg-[var(--surface-muted)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">{label}</p>
      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{value}</p>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-6 flex flex-col gap-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-4 w-28 rounded bg-[var(--surface-muted)]" />
      <div className="h-4 w-14 rounded-full bg-[var(--surface-muted)]" />
    </div>
    <div className="h-3 w-full rounded bg-[var(--surface-muted)]" />
    <div className="h-7 w-20 rounded bg-[var(--surface-muted)]" />
    <div className="grid grid-cols-2 gap-2.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-11 rounded-xl bg-[var(--surface-muted)]" />
      ))}
    </div>
  </div>
);

const SysAdminPlans = () => {
  const { t } = useTranslation();
  const unlimitedLabel = t("Unlimited") || "Unlimited";
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(null);
  const [formModal, setFormModal] = useState(null); // { mode: "create" | "edit", plan? }
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const list = await fetchAllPlans();
      setPlans(Array.isArray(list) ? list : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const list = await fetchAllPlans();
        if (!cancelled) setPlans(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (payload) => {
    if (formModal?.mode === "edit") {
      await updatePlan(formModal.plan.id, payload);
      showToast(t("Plan updated") || "Plan updated");
    } else {
      await createPlan(payload);
      showToast(t("Plan created") || "Plan created");
    }
    await load();
  };

  const handleDelete = async (plan) => {
    await deletePlan(plan.id);
    showToast(t("Plan deleted") || "Plan deleted");
    await load();
  };

  return (
    <div className="pt-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{t("Plans") || "Plans"}</h2>
          <p className="text-sm text-[var(--text-muted)]">{t("sysAdminPlansSubtitle") || "Manage the subscription plans offered on the platform."}</p>
        </div>
        <button
          onClick={() => setFormModal({ mode: "create" })}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[var(--brand)] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[var(--brand-hover)] transition-colors"
        >
          <IconPlus />
          {t("New plan") || "New plan"}
        </button>
      </div>

      {error ? (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-8 text-center">
          <p className="text-sm text-[var(--text-muted)] mb-4">{t("Couldn't load the plans") || "Couldn't load the plans"}</p>
          <button
            onClick={load}
            className="bg-[var(--brand)] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[var(--brand-hover)] transition-colors cursor-pointer"
          >
            {t("Retry") || "Retry"}
          </button>
        </div>
      ) : !loading && plans.length === 0 ? (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] py-16 text-center text-sm text-[var(--text-muted)]">
          {t("No plans found.") || "No plans found."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : plans.map((plan) => (
                <div key={plan.id} className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="font-semibold text-[var(--text-primary)] truncate">{plan.name}</h3>
                      <span
                        className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          plan.isActive ? "bg-green-50 text-green-600" : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                        }`}
                      >
                        {plan.isActive ? (t("Active") || "Active") : (t("Inactive") || "Inactive")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setFormModal({ mode: "edit", plan })}
                        className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
                        title={t("Edit plan") || "Edit plan"}
                      >
                        <IconEdit />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(plan)}
                        className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:bg-red-50 hover:text-red-500 transition-colors"
                        title={t("Delete plan") || "Delete plan"}
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>

                  {plan.description && (
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">{plan.description}</p>
                  )}

                  <p className="text-2xl font-bold text-[var(--text-primary)]">{formatPrice(plan.price)}</p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <StatBox icon={<IconClock />} label={t("Duration") || "Duration"} value={`${plan.durationDays} ${t("daysSuffix") || "days"}`} />
                    <StatBox icon={<IconUsers />} label={t("Staff") || "Staff"} value={formatLimit(plan.maxStaffAllowed, unlimitedLabel)} />
                    <StatBox icon={<IconBuilding />} label={t("Branches") || "Branches"} value={formatLimit(plan.maxBranchesAllowed, unlimitedLabel)} />
                    <StatBox icon={<IconTag />} label={t("Services") || "Services"} value={formatLimit(plan.maxServicesAllowed, unlimitedLabel)} />
                  </div>
                </div>
              ))}
        </div>
      )}

      {formModal && (
        <PlanFormModal
          mode={formModal.mode}
          plan={formModal.plan}
          onClose={() => setFormModal(null)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <DeletePlanModal plan={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      )}

      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[var(--brand)] text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-[fadeIn_0.2s_ease-out]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
};

export default SysAdminPlans;
