import { useState } from "react";
import { useTranslation } from "../../../CustomHooks/TraslateHook";
import { useNotifications } from "../../../CustomHooks/NotificationContext";

const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 5A2 2 0 0 1 14 5A7 7 0 0 1 18 11V14L20 16V17H4V16L6 14V11A7 7 0 0 1 10 5Z" /><path d="M9 17V18A3 3 0 0 0 15 18V17" />
  </svg>
);

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7V12L15 15" />
  </svg>
);

const toTime12 = (iso) => {
  if (!iso) return "--";
  const [h, m] = iso.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${m} ${ampm}`;
};

const getInitials = (name) => {
  if (!name) return "--";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
};

const Header = ({ username, onNavigateToAppointments }) => {
  const { t } = useTranslation();
  const { appointments, unreadCount, refresh, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const displayName = username || "";
  const initials = displayName
    ? displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "--";

  const handleToggle = () => {
    if (!open) {
      markAllRead();
      refresh();
    }
    setOpen(o => !o);
  };

  const handleSelect = () => {
    markAllRead();
    setOpen(false);
    onNavigateToAppointments?.();
  };

  return (
    <header className="flex items-center justify-between w-full px-8 py-5 bg-[#f0ede8]">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e] leading-tight">
          Hello, <span className="font-bold">{displayName || "there"}</span>
        </h1>
        <p className="text-sm text-[#9a9a9a] mt-0.5">View and control your appointments here!</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button aria-label="Notifications" onClick={handleToggle} className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[#e2ddd8] text-[#8a8a8a] hover:bg-[#e4e0da] hover:text-[#1a1a2e] transition-all duration-200 cursor-pointer">
            <IconBell />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ef4444] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-[#e2ddd8] rounded-2xl shadow-xl z-30">
                <div className="px-4 py-3 border-b border-[#f0ede8]">
                  <h3 className="text-sm font-bold text-[#1a1a2e]">{t("New appointments") || "New appointments"}</h3>
                  <p className="text-xs text-[#9a9a9a]">{t("Live updates") || "Live updates"}</p>
                </div>
                {appointments.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-[#9a9a9a]">{t("No new appointments") || "No new appointments"}</p>
                  </div>
                ) : (
                  appointments.map(appt => (
                    <button
                      key={appt.id}
                      onClick={handleSelect}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f0ede8] transition-colors border-b border-[#f0ede8] last:border-b-0 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#dbeafe] flex items-center justify-center text-xs font-semibold text-[#1a1a2e] shrink-0">
                        {getInitials(appt.clientName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1a1a2e] truncate">{appt.clientName || "—"}</p>
                        <p className="text-xs text-[#9a9a9a] truncate">{appt.serviceName || "—"}</p>
                        <div className="flex items-center gap-1 text-[#6b7280] mt-0.5">
                          <IconClock />
                          <span className="text-[11px]">{toTime12(appt.startTime)} - {toTime12(appt.endTime)}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#fef3c7] text-[#b45309] shrink-0">{t("Pending") || "Pending"}</span>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
        <button aria-label="Profile" className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#e2ddd8] cursor-pointer hover:border-[#1a1a2e] transition-all duration-200 shrink-0">
          <div className="w-full h-full bg-[#1a1a2e] flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;