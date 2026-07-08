import { useState, useEffect } from "react";
import { BASE_URL, authHeaders } from "../../../../services/api";
import { IconSparkles, IconCheck } from './SettingsIcons';

const SubscriptionTab = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch(`${BASE_URL}/BusinessSubscription/my`, { headers: authHeaders });
        const data = await res.json();
        setPlan(data);
      } catch {
        // API not available yet
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
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
        <div className="grid grid-cols-3 gap-6">
          {[
            { name: "Starter", desc: "For small businesses getting started", price: "$0", features: ["1 branch", "Up to 3 staff", "Basic appointments", "Email support"], btn: "Downgrade" },
            { name: "Professional", desc: "For growing businesses", price: "$49", features: ["Up to 5 branches", "Unlimited staff", "Advanced scheduling", "Client management", "Priority support"], btn: "Current plan" },
            { name: "Enterprise", desc: "For large operations", price: "$149", features: ["Unlimited branches", "Unlimited staff", "Custom integrations", "Analytics dashboard", "Dedicated account manager", "24/7 phone support"], btn: "Upgrade" },
          ].map((tier) => {
            const isCurrent = planName && planName.toLowerCase() === tier.name.toLowerCase();
            return (
              <div key={tier.name} className={`bg-white rounded-2xl border p-6 flex flex-col relative ${isCurrent ? "border-2 border-[#1a1a2e] shadow-sm" : "border-[#e2ddd8]"}`}>
                {isCurrent && <div className="absolute top-4 right-4 bg-[#f0ede8] text-[#1a1a2e] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Current</div>}
                <h4 className="font-semibold text-[#1a1a2e]">{tier.name}</h4>
                <p className="text-xs text-[#9a9a9a] mt-1 mb-6">{tier.desc}</p>
                <div className="mb-8">
                  <span className="text-3xl font-bold text-[#1a1a2e]">{tier.price}</span>
                  <span className="text-sm text-[#9a9a9a]">/mo</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> {f}</li>
                  ))}
                </ul>
                {isCurrent ? (
                  <button className="w-full py-2.5 bg-[#fcfbf9] text-[#9a9a9a] border border-[#e2ddd8] rounded-xl text-sm font-semibold cursor-not-allowed mt-auto">
                    Current plan
                  </button>
                ) : (
                  <button className="w-full py-2.5 bg-[#1a1a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#2d2d44] transition-colors mt-auto">
                    {tier.btn}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;