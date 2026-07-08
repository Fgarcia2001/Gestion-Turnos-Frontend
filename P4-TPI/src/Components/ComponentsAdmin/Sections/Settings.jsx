import React, { useState } from 'react';
import { IconBuilding, IconCard, IconUser } from './SettingsComponents/SettingsIcons';
import BusinessTab from './SettingsComponents/BusinessTab';
import SubscriptionTab from './SettingsComponents/SubscriptionTab';
import AdminTab from './SettingsComponents/AdminTab';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('business');

  const tabs = [
    { id: 'business', label: 'Business', icon: IconBuilding },
    { id: 'subscription', label: 'Subscription', icon: IconCard },
    { id: 'admin', label: 'General Administrator', icon: IconUser },
  ];

  return (
    <div className="flex flex-col gap-6 w-full h-full pb-10 items-center">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#f0ede8] rounded-xl p-1 mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[#1a1a2e] text-white shadow-sm"
                  : "text-[#9a9a9a] hover:text-[#1a1a2e]"
              }`}
            >
              <Icon />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="mt-2 w-full max-w-6xl">
        {activeTab === 'business' && <BusinessTab />}
        {activeTab === 'subscription' && <SubscriptionTab />}
        {activeTab === 'admin' && <AdminTab />}
      </div>
    </div>
  );
};

export default Settings;
