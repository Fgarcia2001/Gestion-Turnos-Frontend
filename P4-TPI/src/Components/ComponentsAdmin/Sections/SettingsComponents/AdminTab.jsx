import React, { useState } from 'react';
import { IconCamera } from './SettingsIcons';

const AdminTab = () => {
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    smsReminders: true,
    marketing: false,
    weeklyReport: true,
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <div 
      onClick={onChange}
      className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${checked ? 'bg-[#1a1a2e]' : 'bg-[#e2ddd8]'}`}
    >
      <div 
        className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-200 ${checked ? 'right-0.5 translate-x-0' : 'left-0.5 translate-x-0'}`}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6">
        <h2 className="text-lg font-semibold text-[#1a1a2e]">Administrator Profile</h2>
        <p className="text-sm text-[#9a9a9a] mb-6 mt-1">Manage your personal account data.</p>
        
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#e2ddd8]">
          <div className="relative">
            {/* Standard icon or placeholder if image is not available */}
            <div className="w-16 h-16 rounded-full bg-[#f0ede8] border border-[#e2ddd8] overflow-hidden flex items-center justify-center">
              <img src="https://i.pravatar.cc/150?u=ramiro" alt="Ramiro Garcia" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-[#e2ddd8] shadow-sm text-[#1a1a2e] hover:bg-gray-50 transition-colors">
              <IconCamera />
            </button>
          </div>
          <div>
            <h3 className="font-semibold text-[#1a1a2e]">Ramiro Garcia</h3>
            <p className="text-xs text-[#9a9a9a]">Administrator</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">First name</label>
            <input 
              type="text" 
              defaultValue="Ramiro" 
              className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">Last name</label>
            <input 
              type="text" 
              defaultValue="Garcia" 
              className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">Email</label>
            <input 
              type="email" 
              defaultValue="ramiro.garcia@barberhome.com" 
              className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">Phone</label>
            <input 
              type="text" 
              defaultValue="+54 341 6504050" 
              className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent" 
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-10">
          <button className="px-4 py-2 text-sm font-semibold text-[#1a1a2e] bg-[#f0ede8] rounded-xl hover:bg-[#e2ddd8] transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-[#1a1a2e] rounded-xl hover:bg-[#2d2d44] transition-colors">
            Save changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6">
        <h2 className="text-lg font-semibold text-[#1a1a2e]">Notifications</h2>
        <p className="text-sm text-[#9a9a9a] mb-6 mt-1">Choose how you want to be notified.</p>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#1a1a2e]">Email on new bookings</h4>
              <p className="text-xs text-[#9a9a9a]">Get an email when a client books.</p>
            </div>
            <ToggleSwitch 
              checked={notifications.emailBookings} 
              onChange={() => toggleNotification('emailBookings')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#1a1a2e]">SMS reminders</h4>
              <p className="text-xs text-[#9a9a9a]">Send appointment reminders by SMS.</p>
            </div>
            <ToggleSwitch 
              checked={notifications.smsReminders} 
              onChange={() => toggleNotification('smsReminders')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#1a1a2e]">Marketing emails</h4>
              <p className="text-xs text-[#9a9a9a]">Receive product news and offers.</p>
            </div>
            <ToggleSwitch 
              checked={notifications.marketing} 
              onChange={() => toggleNotification('marketing')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#1a1a2e]">Weekly report</h4>
              <p className="text-xs text-[#9a9a9a]">A summary of your week every Monday.</p>
            </div>
            <ToggleSwitch 
              checked={notifications.weeklyReport} 
              onChange={() => toggleNotification('weeklyReport')} 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <h2 className="text-sm font-semibold text-red-600 mb-1">Danger Zone</h2>
        <p className="text-xs text-[#9a9a9a] mb-4">Irreversible actions for your account.</p>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a2e]">Delete account</h4>
            <p className="text-xs text-[#9a9a9a]">Permanently remove your account and all data.</p>
          </div>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTab;
