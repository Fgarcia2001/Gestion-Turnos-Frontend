import React from 'react';
import { IconSparkles, IconCheck } from './SettingsIcons';

const SubscriptionTab = () => {
  return (
    <div className="flex flex-col w-full max-w-5xl">
      <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 mb-8 w-full">
        <h2 className="text-lg font-semibold text-[#1a1a2e]">Current Plan</h2>
        <p className="text-sm text-[#9a9a9a] mb-6 mt-1">You are currently on the Professional plan.</p>
        
        <div className="bg-[#fcfbf9] border border-[#e2ddd8] rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#f0ede8] rounded-xl flex items-center justify-center text-[#1a1a2e]">
              <IconSparkles />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[#1a1a2e]">Professional</span>
                <span className="text-[10px] font-bold bg-[#1a1a2e] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
              </div>
              <p className="text-xs text-[#9a9a9a]">Renews on July 7, 2025</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-[#1a1a2e]">$49</span>
            <span className="text-xs text-[#9a9a9a] font-medium">/mo</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Upgrade your plan</h3>
        <div className="grid grid-cols-3 gap-6">
          {/* Starter */}
          <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 flex flex-col">
            <h4 className="font-semibold text-[#1a1a2e]">Starter</h4>
            <p className="text-xs text-[#9a9a9a] mt-1 mb-6">For small businesses getting started</p>
            <div className="mb-8">
              <span className="text-3xl font-bold text-[#1a1a2e]">$0</span>
              <span className="text-sm text-[#9a9a9a]">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> 1 branch</li>
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Up to 3 staff</li>
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Basic appointments</li>
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Email support</li>
            </ul>
            <button className="w-full py-2.5 bg-[#1a1a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#2d2d44] transition-colors mt-auto">
              Downgrade
            </button>
          </div>
          
          {/* Professional */}
          <div className="bg-white rounded-2xl border-2 border-[#1a1a2e] p-6 flex flex-col relative shadow-sm">
            <div className="absolute top-4 right-4 bg-[#f0ede8] text-[#1a1a2e] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Current</div>
            <h4 className="font-semibold text-[#1a1a2e]">Professional</h4>
            <p className="text-xs text-[#9a9a9a] mt-1 mb-6">For growing businesses</p>
            <div className="mb-8">
              <span className="text-3xl font-bold text-[#1a1a2e]">$49</span>
              <span className="text-sm text-[#9a9a9a]">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Up to 5 branches</li>
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Unlimited staff</li>
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Advanced scheduling</li>
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Client management</li>
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Priority support</li>
            </ul>
            <button className="w-full py-2.5 bg-[#fcfbf9] text-[#9a9a9a] border border-[#e2ddd8] rounded-xl text-sm font-semibold cursor-not-allowed mt-auto">
              Current plan
            </button>
          </div>
          
          {/* Enterprise */}
          <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 flex flex-col">
            <h4 className="font-semibold text-[#1a1a2e]">Enterprise</h4>
            <p className="text-xs text-[#9a9a9a] mt-1 mb-6">For large operations</p>
            <div className="mb-8">
              <span className="text-3xl font-bold text-[#1a1a2e]">$149</span>
              <span className="text-sm text-[#9a9a9a]">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Unlimited branches</li>
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Unlimited staff</li>
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Custom integrations</li>
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Analytics dashboard</li>
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> Dedicated account manager</li>
              <li className="flex items-center gap-3 text-sm text-[#5a5a6e]"><IconCheck /> 24/7 phone support</li>
            </ul>
            <button className="w-full py-2.5 bg-[#1a1a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#2d2d44] transition-colors mt-auto">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;
