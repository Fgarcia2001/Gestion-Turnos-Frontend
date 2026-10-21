import React, { useState } from 'react';
import { IconBuilding, IconCard, IconUser } from './SettingsComponents/SettingsIcons';
import BusinessTab from './SettingsComponents/BusinessTab';
import SubscriptionTab from './SettingsComponents/SubscriptionTab';
import AdminTab from './SettingsComponents/AdminTab';
import { useTranslation } from '../../../../CustomHooks/TraslateHook';

const Settings = ({ initialTab, autoOpenPlanId, profileOnly = false }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(initialTab || 'business');

  // Recepcionista/Profesional: solo su perfil, sin datos de la empresa.
  if (profileOnly) {
    return (
      <div data-tour="settings-content" className="w-full max-w-6xl mx-auto pb-10">
        <AdminTab self />
      </div>
    );
  }

  const tabs = [
    { id: 'business', label: t('Business') || 'Business', icon: IconBuilding },
    { id: 'subscription', label: t('Subscription') || 'Subscription', icon: IconCard },
    { id: 'admin', label: t('General Administrator') || 'General Administrator', icon: IconUser },
  ];

  return (
    <div className="flex flex-col gap-6 w-full h-full pb-10 items-center">
      {/* Tabs */}
      <div data-tour="settings-tabs" className="flex flex-wrap items-center justify-center gap-1 bg-[var(--surface-muted)] rounded-xl p-1 mx-auto max-w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              data-tour={`settings-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
                isActive
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div data-tour="settings-content" className="mt-2 w-full max-w-6xl">
        {activeTab === 'business' && <BusinessTab />}
        {activeTab === 'subscription' && <SubscriptionTab autoOpenPlanId={autoOpenPlanId} />}
        {activeTab === 'admin' && <AdminTab />}
      </div>
    </div>
  );
};

export default Settings;
