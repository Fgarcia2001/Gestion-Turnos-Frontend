import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../CustomHooks/AuthContext";

const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" />
  </svg>
);
const IconBuilding = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="1.5" /><line x1="8" y1="7" x2="8" y2="7.01" /><line x1="12" y1="7" x2="12" y2="7.01" /><line x1="16" y1="7" x2="16" y2="7.01" /><line x1="8" y1="11" x2="8" y2="11.01" /><line x1="12" y1="11" x2="12" y2="11.01" /><line x1="16" y1="11" x2="16" y2="11.01" /><line x1="9" y1="21" x2="9" y2="17" /><line x1="15" y1="21" x2="15" y2="17" />
  </svg>
);
const IconLayers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>
);
const IconCreditCard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 8V6A2 2 0 0 0 12 4H6A2 2 0 0 0 4 6V18A2 2 0 0 0 6 20H12A2 2 0 0 0 14 18V16" /><path d="M9 12H21M21 12L18 9M21 12L18 15" />
  </svg>
);

const navItems = [
  { to: "/sysadmin", end: true, label: "Dashboard", Icon: IconDashboard },
  { to: "/sysadmin/businesses", label: "Businesses", Icon: IconBuilding },
  { to: "/sysadmin/plans", label: "Plans", Icon: IconLayers },
  { to: "/sysadmin/subscriptions", label: "Subscriptions", Icon: IconCreditCard },
];

const getInitials = (name) => {
  if (!name) return "SA";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
};

const SysAdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#f0ede8]">
      <nav className="flex flex-col w-[220px] h-full bg-[#f0ede8] border-r border-[#e2ddd8] py-5 px-3 shrink-0">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="flex items-center justify-center w-[38px] h-[38px] bg-[#1a1a2e] rounded-xl text-white shrink-0">
            <IconLayers />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1a1a2e] leading-tight">SysAdmin</p>
            <p className="text-[11px] text-[#9a9a9a] leading-tight">Platform console</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          {navItems.map(({ to, end, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive ? "bg-[#1a1a2e] text-white" : "text-[#5a5a6e] hover:bg-[#e4e0da] hover:text-[#1a1a2e]"
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#5a5a6e] hover:bg-[#e4e0da] hover:text-[#1a1a2e] transition-all duration-200"
        >
          <IconLogout />
          Log out
        </button>
      </nav>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between w-full px-8 py-5 bg-[#f0ede8]">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] leading-tight">
              Hello, <span className="font-bold">{user?.name || "there"}</span>
            </h1>
            <p className="text-sm text-[#9a9a9a] mt-0.5">Manage businesses, plans and subscriptions.</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#e2ddd8] shrink-0">
            <div className="w-full h-full bg-[#1a1a2e] flex items-center justify-center text-white text-sm font-semibold">
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SysAdminLayout;
