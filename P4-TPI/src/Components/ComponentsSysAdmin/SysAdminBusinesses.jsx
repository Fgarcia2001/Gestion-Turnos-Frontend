import { useState, useEffect } from "react";
import { fetchSysAdminBusinesses, fetchSysAdminBusinessById } from "../../services/sysAdminService";
import { fetchBusinessTypes, updateBusinessAsAdmin } from "../../services/businessService";
import { fetchAllPlans } from "../../services/planService";
import { changeSubscriptionPlan } from "../../services/subscriptionService";
import BusinessCard from "./BusinessCard";
import BusinessDetailModal from "./BusinessDetailModal";
import ChangePlanModal from "./ChangePlanModal";
import EditBusinessModal from "./EditBusinessModal";

const ALL = "All";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 flex flex-col items-center gap-3 animate-pulse">
    <div className="w-16 h-16 rounded-full bg-[#f0ede8]" />
    <div className="h-3.5 w-28 rounded bg-[#f0ede8] mt-1" />
    <div className="h-3 w-20 rounded-full bg-[#f0ede8]" />
    <div className="flex flex-col gap-1.5 mt-2 w-full items-center">
      <div className="h-2.5 w-24 rounded bg-[#f0ede8]" />
      <div className="h-2.5 w-28 rounded bg-[#f0ede8]" />
      <div className="h-2.5 w-20 rounded bg-[#f0ede8]" />
    </div>
    <div className="h-8 w-24 rounded-xl bg-[#f0ede8] mt-2" />
  </div>
);

const SysAdminBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [types, setTypes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(null);

  // Detail modal state
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const [detailReloadKey, setDetailReloadKey] = useState(0);
  const [changingPlan, setChangingPlan] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(false);

  const modalOpen = selectedId != null;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [businessList, typeList, planList] = await Promise.all([
        fetchSysAdminBusinesses(),
        fetchBusinessTypes(),
        fetchAllPlans(),
      ]);
      setBusinesses(Array.isArray(businessList) ? businessList : []);
      setTypes(Array.isArray(typeList) ? typeList : []);
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
        const [businessList, typeList, planList] = await Promise.all([
          fetchSysAdminBusinesses(),
          fetchBusinessTypes(),
          fetchAllPlans(),
        ]);
        if (!cancelled) {
          setBusinesses(Array.isArray(businessList) ? businessList : []);
          setTypes(Array.isArray(typeList) ? typeList : []);
          setPlans(Array.isArray(planList) ? planList : []);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Lazy-load the detail payload only when a business is selected.
  useEffect(() => {
    if (selectedId == null) return;
    let cancelled = false;
    (async () => {
      setDetailLoading(true);
      setDetailError(false);
      setDetail(null);
      try {
        const res = await fetchSysAdminBusinessById(selectedId);
        if (!cancelled) setDetail(res && !Array.isArray(res) ? res : null);
      } catch {
        if (!cancelled) setDetailError(true);
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedId, detailReloadKey]);

  const openDetail = (id) => {
    if (id == null || id === selectedId) return; // dedupe repeat clicks on the open business
    setSelectedId(id);
  };

  const closeModal = () => {
    setSelectedId(null);
    setDetail(null);
    setDetailError(false);
    setDetailLoading(false);
    setChangingPlan(false);
    setEditingBusiness(false);
  };

  const retryDetail = () => setDetailReloadKey((k) => k + 1);

  const handleChangePlan = async (planId) => {
    await changeSubscriptionPlan(selectedId, planId);
    retryDetail();
    showToast("Plan changed");
  };

  const handleEditBusiness = async (payload) => {
    await updateBusinessAsAdmin(selectedId, payload);
    retryDetail();
    await load();
    showToast("Business updated");
  };

  if (loading) {
    return (
      <div className="pt-8 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Businesses</h2>
          <p className="text-sm text-[#9a9a9a]">All businesses registered on the platform.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2ddd8] p-8 text-center mt-8">
        <p className="text-sm text-[#9a9a9a] mb-4">Couldn't load the businesses</p>
        <button
          onClick={load}
          className="bg-[#1a1a2e] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#2d2d44] transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const filtered = selectedCategory === ALL
    ? businesses
    : businesses.filter((b) => b.typeBusiness === selectedCategory);

  return (
    <div className="pt-8 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Businesses</h2>
        <p className="text-sm text-[#9a9a9a]">All businesses registered on the platform.</p>
      </div>

      {businesses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2ddd8] py-16 text-center text-sm text-[#9a9a9a]">
          No businesses found.
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory(ALL)}
              className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors ${
                selectedCategory === ALL
                  ? "bg-[#1a1a2e] text-white"
                  : "bg-white border border-[#e2ddd8] text-[#5a5a6e] hover:bg-[#f0ede8]"
              }`}
            >
              All
            </button>
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedCategory(type.name)}
                className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors ${
                  selectedCategory === type.name
                    ? "bg-[#1a1a2e] text-white"
                    : "bg-white border border-[#e2ddd8] text-[#5a5a6e] hover:bg-[#f0ede8]"
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e2ddd8] py-16 text-center text-sm text-[#9a9a9a]">
              No businesses found for this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {filtered.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onClick={() => openDetail(business.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <BusinessDetailModal
          detail={detail}
          loading={detailLoading}
          error={detailError}
          onClose={closeModal}
          onRetry={retryDetail}
          onChangePlan={!detailLoading && !detailError && detail ? () => setChangingPlan(true) : null}
          onEdit={!detailLoading && !detailError && detail ? () => setEditingBusiness(true) : null}
        />
      )}

      {changingPlan && detail && (
        <ChangePlanModal
          businessName={detail.name}
          currentPlanId={detail.currentPlanId}
          plans={plans}
          onClose={() => setChangingPlan(false)}
          onConfirm={handleChangePlan}
        />
      )}

      {editingBusiness && detail && (
        <EditBusinessModal
          business={detail}
          onClose={() => setEditingBusiness(false)}
          onSave={handleEditBusiness}
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

export default SysAdminBusinesses;
