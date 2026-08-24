import { useState, useEffect } from "react";
import { BASE_URL, getAuthHeaders, fetchPlans } from "../../../../services/api";
import { IconSparkles } from './SettingsIcons';

const SubscriptionTab = () => {
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch(`${BASE_URL}/BusinessSubscription/my`, { headers: getAuthHeaders() });
        const data = await res.json();
        setPlan(data);
      } catch {
        // API not available yet
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
    fetchPlans().then(setPlans);
  }, []);

  const planName = plan?.planName || null;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="size-8 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 mb-8 w-full">
        <h2 className="text-lg font-semibold text-[#1a1a2e]">Current Plan</h2>
        <p className="text-sm text-[#9a9a9a] mb-6 mt-1">{plan?.businessName ? plan.businessName : "Your subscription plan details."}</p>
        
        <div className="bg-[#fcfbf9] border border-[#e2ddd8] rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#f0ede8] rounded-xl flex items-center justify-center text-[#1a1a2e]">
              <IconSparkles />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[#1a1a2e]">{plan?.planName || "---"}</span>
                {plan?.status && (
                  <span className="text-[10px] font-bold bg-[#1a1a2e] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">{plan.status}</span>
                )}
              </div>
              <p className="text-xs text-[#9a9a9a]">{plan?.businessName || "---"}</p>
            </div>
          </div>
          <div className="text-right text-xs text-[#9a9a9a]">
            {plan?.startDate ? (
              <>
                <span className="block font-medium text-[#1a1a2e]">{new Date(plan.startDate).toLocaleDateString()}</span>
                <span className="block text-[10px]">to</span>
                <span className="block font-medium text-[#1a1a2e]">{new Date(plan.endDate).toLocaleDateString()}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-[#1a1a2e]">--</span>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Upgrade your plan</h3>
        {plans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e2ddd8] py-12 text-center text-sm text-[#9a9a9a]">
            No plans available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...plans]
              .sort((a, b) => (a.price ?? a.Price ?? 0) - (b.price ?? b.Price ?? 0))
              .map((tier) => {
                const id = tier.id ?? tier.Id;
                const name = tier.name ?? tier.Name;
                const description = tier.description ?? tier.Description;
                const price = tier.price ?? tier.Price;
                const durationDays = tier.durationDays ?? tier.DurationDays;
                const isCurrent = planName && name && planName.toLowerCase() === name.toLowerCase();
                return (
                  <div key={id ?? name} className={`bg-white rounded-2xl border p-6 flex flex-col relative ${isCurrent ? "border-2 border-[#1a1a2e] shadow-sm" : "border-[#e2ddd8]"}`}>
                    {isCurrent && <div className="absolute top-4 right-4 bg-[#f0ede8] text-[#1a1a2e] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Current</div>}
                    <h4 className="font-semibold text-[#1a1a2e]">{name}</h4>
                    <p className="text-xs text-[#9a9a9a] mt-1 mb-6">{description}</p>
                    <div className="mb-10 flex-1">
                      <span className="text-3xl font-bold text-[#1a1a2e]">${price}</span>
                      {durationDays ? (
                        <span className="text-sm text-[#9a9a9a]"> / {durationDays} days</span>
                      ) : null}
                    </div>
                    {isCurrent ? (
                      <button className="w-full py-2.5 bg-[#fcfbf9] text-[#9a9a9a] border border-[#e2ddd8] rounded-xl text-sm font-semibold cursor-not-allowed mt-auto">
                        Current plan
                      </button>
                    ) : (
                      <button
                        disabled
                        title="Coming soon"
                        className="w-full py-2.5 bg-[#f0ede8] text-[#9a9a9a] rounded-xl text-sm font-semibold cursor-not-allowed mt-auto"
                      >
                        Change plan
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionTab;