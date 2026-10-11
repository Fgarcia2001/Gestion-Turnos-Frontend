import { useEffect, useState } from "react";
import {
  fetchAllSubscriptions,
  updateSubscriptionStatus,
  changeSubscriptionPlan,
  deleteSubscription,
} from "../../services/subscriptionService";
import { fetchAllPlans } from "../../services/planService";
import { ModalOverlay } from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Shared";
import { IconX, IconWarning, IconTrash, IconEdit } from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Icons";
import ChangePlanModal from "./ChangePlanModal";

const STATUS_OPTIONS = ["Active", "Inactive", "Cancelled", "Expired"];

const STATUS_STYLES = {
  Active: "bg-green-50 text-green-600",
  Inactive: "bg-[#f0ede8] text-[#9a9a9a]",
  Cancelled: "bg-red-50 text-red-600",
  Expired: "bg-amber-50 text-amber-600",
};

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
};

const SkeletonGroup = () => (
  <div className="bg-white rounded-2xl border border-[#e2ddd8] p-5 animate-pulse flex flex-col gap-3">
    <div className="h-4 w-40 rounded bg-[#f0ede8]" />
    <div className="h-9 w-full rounded-lg bg-[#f0ede8]" />
    <div className="h-9 w-full rounded-lg bg-[#f0ede8]" />
  </div>
);

// Agrupa las suscripciones por negocio (el backend devuelve el historial
// completo, no solo la actual) y ordena cada grupo por fecha de inicio
// descendente, asi la fila de arriba es siempre la mas reciente.
const groupByBusiness = (subscriptions) => {
  const groups = new Map();
  for (const sub of subscriptions) {
    const key = sub.businessId;
    if (!groups.has(key)) groups.set(key, { businessId: key, businessName: sub.businessName, items: [] });
    groups.get(key).items.push(sub);
  }
  for (const group of groups.values()) {
    group.items.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }
  return [...groups.values()].sort((a, b) => a.businessName.localeCompare(b.businessName));
};

const DeleteSubscriptionModal = ({ subscription, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");
    setDeleting(true);
    try {
      await onConfirm(subscription);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to delete subscription. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors p-1.5 rounded-lg hover:bg-[#f0ede8]"
        >
          <IconX />
        </button>

        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
          <IconWarning />
        </div>

        <h2 className="text-lg font-bold text-[#1a1a2e] mb-1">Delete subscription?</h2>
        <p className="text-sm text-[#6b7280] mb-2">You are about to delete the subscription of</p>
        <p className="text-sm font-semibold text-[#1a1a2e] mb-2">"{subscription?.businessName}"</p>
        <p className="text-xs text-[#9a9a9a] mb-6">This action cannot be undone.</p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-left">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl border border-[#e2ddd8] text-sm font-semibold text-[#6b7280] hover:bg-[#f0ede8] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

const SysAdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [changePlanTarget, setChangePlanTarget] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [list, planList] = await Promise.all([fetchAllSubscriptions(), fetchAllPlans()]);
      setSubscriptions(Array.isArray(list) ? list : []);
      setPlans(Array.isArray(planList) ? planList : []);
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
        const [list, planList] = await Promise.all([fetchAllSubscriptions(), fetchAllPlans()]);
        if (!cancelled) {
          setSubscriptions(Array.isArray(list) ? list : []);
          setPlans(Array.isArray(planList) ? planList : []);
        }
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

  const handleStatusChange = async (subscription, status) => {
    if (status === subscription.status) return;
    setUpdatingId(subscription.id);
    try {
      const updated = await updateSubscriptionStatus(subscription.id, status);
      setSubscriptions((prev) => prev.map((s) => (s.id === subscription.id ? updated : s)));
      showToast("Subscription status updated");
    } catch (err) {
      showToast(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleChangePlan = async (planId) => {
    await changeSubscriptionPlan(changePlanTarget.businessId, planId);
    await load();
    showToast("Plan changed");
  };

  const handleDelete = async (subscription) => {
    await deleteSubscription(subscription.id);
    setSubscriptions((prev) => prev.filter((s) => s.id !== subscription.id));
    showToast("Subscription deleted");
  };

  return (
    <div className="pt-8 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Subscriptions</h2>
        <p className="text-sm text-[#9a9a9a]">
          Full subscription history, grouped by business. Change a status, switch plans or remove a subscription.
        </p>
      </div>

      {!error && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by business name..."
          className="w-full sm:w-80 border border-[#e2ddd8] rounded-xl px-4 py-2.5 text-sm text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition-all bg-white"
        />
      )}

      {error ? (
        <div className="bg-white rounded-2xl border border-[#e2ddd8] p-8 text-center">
          <p className="text-sm text-[#9a9a9a] mb-4">Couldn't load the subscriptions</p>
          <button
            onClick={load}
            className="bg-[#1a1a2e] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#2d2d44] transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonGroup key={i} />)}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2ddd8] py-16 text-center text-sm text-[#9a9a9a]">
          No subscriptions found.
        </div>
      ) : (
        (() => {
          const groups = groupByBusiness(subscriptions).filter((g) =>
            g.businessName.toLowerCase().includes(search.trim().toLowerCase())
          );

          if (groups.length === 0) {
            return (
              <div className="bg-white rounded-2xl border border-[#e2ddd8] py-16 text-center text-sm text-[#9a9a9a]">
                No businesses match "{search}".
              </div>
            );
          }

          return (
            <div className="flex flex-col gap-4">
              {groups.map((group) => (
                <div key={group.businessId} className="bg-white rounded-2xl border border-[#e2ddd8] overflow-hidden">
                  <div className="px-6 pt-5 pb-1 flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#1a1a2e]">{group.businessName}</h3>
                    <span className="text-[11px] text-[#9a9a9a]">
                      {group.items.length} subscription{group.items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="px-6 pt-2 pb-4 overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#e2ddd8]">
                          {["Plan", "Status", "Start date", "End date", ""].map((header) => (
                            <th
                              key={header}
                              className="text-left text-xs font-semibold text-[#9a9a9a] uppercase tracking-wide pb-2 pr-6"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((sub, i) => (
                          <tr key={sub.id} className="border-b border-[#e2ddd8] last:border-0">
                            <td className="py-3 pr-6 text-sm font-semibold text-[#1a1a2e]">
                              {sub.planName}
                              {i === 0 && (
                                <span className="ml-2 text-[10px] font-semibold text-[#9a9a9a] uppercase">
                                  Most recent
                                </span>
                              )}
                            </td>
                            <td className="py-3 pr-6">
                              <select
                                value={sub.status}
                                disabled={updatingId === sub.id}
                                onChange={(e) => handleStatusChange(sub, e.target.value)}
                                className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 cursor-pointer disabled:opacity-50 ${
                                  STATUS_STYLES[sub.status] || "bg-[#f0ede8] text-[#9a9a9a]"
                                }`}
                              >
                                {STATUS_OPTIONS.map((opt) => (
                                  <option
                                    key={opt}
                                    value={opt}
                                    disabled={opt === "Expired" && sub.status !== "Expired"}
                                  >
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 pr-6 text-sm text-[#5a5a6e]">{formatDate(sub.startDate)}</td>
                            <td className="py-3 pr-6 text-sm text-[#5a5a6e]">{formatDate(sub.endDate)}</td>
                            <td className="py-3 pr-2 text-right whitespace-nowrap">
                              <button
                                onClick={() => setChangePlanTarget(sub)}
                                className="p-1.5 rounded-lg text-[#5a5a6e] hover:bg-[#f0ede8] hover:text-[#1a1a2e] transition-colors"
                                title="Change plan"
                              >
                                <IconEdit />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(sub)}
                                className="p-1.5 rounded-lg text-[#5a5a6e] hover:bg-red-50 hover:text-red-500 transition-colors"
                                title="Delete subscription"
                              >
                                <IconTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          );
        })()
      )}

      {changePlanTarget && (
        <ChangePlanModal
          businessName={changePlanTarget.businessName}
          currentPlanId={changePlanTarget.planId}
          plans={plans}
          onClose={() => setChangePlanTarget(null)}
          onConfirm={handleChangePlan}
        />
      )}

      {deleteTarget && (
        <DeleteSubscriptionModal
          subscription={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
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

export default SysAdminSubscriptions;
