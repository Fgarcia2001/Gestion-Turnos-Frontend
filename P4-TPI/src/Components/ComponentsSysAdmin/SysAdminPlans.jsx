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

const formatLimit = (value) => (value === -1 || value === "-1" ? "Unlimited" : value);

const formatPrice = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? `$${n.toFixed(2)}` : value;
};

const StatBox = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 bg-[#faf9f7] border border-[#e2ddd8] rounded-xl p-2.5">
    <div className="w-7 h-7 rounded-lg bg-[#f0ede8] flex items-center justify-center text-[#1a1a2e] shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-[#9a9a9a] uppercase tracking-wide">{label}</p>
      <p className="text-xs font-semibold text-[#1a1a2e] truncate">{value}</p>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 flex flex-col gap-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-4 w-28 rounded bg-[#f0ede8]" />
      <div className="h-4 w-14 rounded-full bg-[#f0ede8]" />
    </div>
    <div className="h-3 w-full rounded bg-[#f0ede8]" />
    <div className="h-7 w-20 rounded bg-[#f0ede8]" />
    <div className="grid grid-cols-2 gap-2.5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-11 rounded-xl bg-[#f0ede8]" />
      ))}
    </div>
  </div>
);

const SysAdminPlans = () => {
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
      showToast("Plan updated");
    } else {
      await createPlan(payload);
      showToast("Plan created");
    }
    await load();
  };

  const handleDelete = async (plan) => {
    await deletePlan(plan.id);
    showToast("Plan deleted");
    await load();
  };

  return (
    <div className="pt-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Plans</h2>
          <p className="text-sm text-[#9a9a9a]">Manage the subscription plans offered on the platform.</p>
        </div>
        <button
          onClick={() => setFormModal({ mode: "create" })}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#1a1a2e] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#2d2d44] transition-colors"
        >
          <IconPlus />
          New plan
        </button>
      </div>

      {error ? (
        <div className="bg-white rounded-2xl border border-[#e2ddd8] p-8 text-center">
          <p className="text-sm text-[#9a9a9a] mb-4">Couldn't load the plans</p>
          <button
            onClick={load}
            className="bg-[#1a1a2e] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#2d2d44] transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : !loading && plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2ddd8] py-16 text-center text-sm text-[#9a9a9a]">
          No plans found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : plans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-2xl border border-[#e2ddd8] p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="font-semibold text-[#1a1a2e] truncate">{plan.name}</h3>
                      <span
                        className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          plan.isActive ? "bg-green-50 text-green-600" : "bg-[#f0ede8] text-[#9a9a9a]"
                        }`}
                      >
                        {plan.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setFormModal({ mode: "edit", plan })}
                        className="p-1.5 rounded-lg text-[#5a5a6e] hover:bg-[#f0ede8] hover:text-[#1a1a2e] transition-colors"
                        title="Edit plan"
                      >
                        <IconEdit />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(plan)}
                        className="p-1.5 rounded-lg text-[#5a5a6e] hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Delete plan"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>

                  {plan.description && (
                    <p className="text-xs text-[#9a9a9a] line-clamp-2">{plan.description}</p>
                  )}

                  <p className="text-2xl font-bold text-[#1a1a2e]">{formatPrice(plan.price)}</p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <StatBox icon={<IconClock />} label="Duration" value={`${plan.durationDays} days`} />
                    <StatBox icon={<IconUsers />} label="Staff" value={formatLimit(plan.maxStaffAllowed)} />
                    <StatBox icon={<IconBuilding />} label="Branches" value={formatLimit(plan.maxBranchesAllowed)} />
                    <StatBox icon={<IconTag />} label="Services" value={formatLimit(plan.maxServicesAllowed)} />
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
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#1a1a2e] text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-[fadeIn_0.2s_ease-out]">
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
