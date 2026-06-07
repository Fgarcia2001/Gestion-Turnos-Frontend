import { useState } from "react";

const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12L3 12L12 3L21 12L19 12" /><path d="M5 12V19A1 1 0 0 0 6 20H9V16A1 1 0 0 1 10 15H14A1 1 0 0 1 15 16V20H18A1 1 0 0 0 19 19V12" />
  </svg>
);
const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" /><path d="M3 21V19A4 4 0 0 1 7 15H11A4 4 0 0 1 15 19V21" /><path d="M16 3.13A4 4 0 0 1 16 11.87" /><path d="M21 21V19A4 4 0 0 0 17 15" />
  </svg>
);
const IconCalendarEvent = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><rect x="8" y="15" width="2" height="2" />
  </svg>
);
const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" />
  </svg>
);
const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconHelp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 17V17.01" /><path d="M12 13.5A1.5 1.5 0 0 1 13.5 12C14.33 11.17 14.5 10 14 9.27A3 3 0 0 0 9.17 9" />
  </svg>
);
const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 8V6A2 2 0 0 0 12 4H6A2 2 0 0 0 4 6V18A2 2 0 0 0 6 20H12A2 2 0 0 0 14 18V16" /><path d="M9 12H21M21 12L18 9M21 12L18 15" />
  </svg>
);
const IconLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="5" width="16" height="16" rx="2" /><line x1="16" y1="3" x2="16" y2="7" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="4" y1="11" x2="20" y2="11" /><line x1="8" y1="15" x2="8" y2="18" /><line x1="12" y1="15" x2="12" y2="18" /><line x1="16" y1="15" x2="16" y2="18" />
  </svg>
);

const navItems = [
  { id: "home",         label: "Home",         Icon: IconHome },
  { id: "managmentBusiness",      label: "Managment Business",      Icon: IconUsers },
  { id: "appointments", label: "Appointments", Icon: IconCalendarEvent },
  { id: "calendar",     label: "Calendar",     Icon: IconCalendar },
  { id: "settings",     label: "Settings",     Icon: IconSettings },
];
const bottomItems = [
  { id: "help",   label: "Help",    Icon: IconHelp },
  { id: "logout", label: "Log out", Icon: IconLogout },
];

const NavButton = ({ id, label, Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    title={label}
    aria-label={label}
    className={`flex items-center justify-center w-[42px] h-[42px] rounded-xl border-none cursor-pointer transition-all duration-200
      ${active ? "bg-[#1a1a2e] text-white" : "bg-transparent text-[#8a8a8a] hover:bg-[#e4e0da] hover:text-[#1a1a2e]"}`}
  >
    <Icon />
  </button>
);

const Navbar = ({ onSelectSection }) => {
  const [active, setActive] = useState("home");

  const handleClick = (id) => {
    setActive(id);
    if (onSelectSection) onSelectSection(id);
  };

  return (
    <nav className="flex flex-col items-center w-[68px] h-full bg-[#f0ede8] border-r border-[#e2ddd8] py-5">
      <div className="flex items-center justify-center w-[42px] h-[42px] bg-[#1a1a2e] rounded-xl mb-7 text-white shrink-0">
        <IconLogo />
      </div>
      <div className="flex flex-col items-center gap-1 flex-1">
        {navItems.map(({ id, label, Icon }) => (
          <NavButton key={id} id={id} label={label} Icon={Icon} active={active === id} onClick={handleClick} />
        ))}
      </div>
      <div className="flex flex-col items-center gap-1">
        {bottomItems.map(({ id, label, Icon }) => (
          <NavButton key={id} id={id} label={label} Icon={Icon} active={active === id} onClick={handleClick} />
        ))}
      </div>
    </nav>
  );
};

export default Navbar;