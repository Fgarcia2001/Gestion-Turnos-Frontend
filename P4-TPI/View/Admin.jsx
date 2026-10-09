import { useState } from "react";
import { useAuth } from "../CustomHooks/AuthContext";
import { NotificationProvider } from "../CustomHooks/NotificationContext";
import Navbar from "../src/Components/ComponentsAdmin/Navbar";
import Header from "../src/Components/ComponentsAdmin/Header";
import Home from "../src/Components/ComponentsAdmin/Sections/Home";
import ManagmentBusiness from "../src/Components/ComponentsAdmin/Sections/ManagmentBusiness";
import Appointments from "../src/Components/ComponentsAdmin/Sections/Appointments";
import Settings from "../src/Components/ComponentsAdmin/Sections/Settings";
import Calendar from "../src/Components/ComponentsAdmin/Sections/Calendar";
import Schedule from "../src/Components/ComponentsAdmin/Sections/Schedule";
import Help from "../src/Components/ComponentsAdmin/Sections/Help";

// MercadoPago (Checkout Pro) redirige a /admin?payment_id=...&external_reference=<orderId>.
// Se resuelve en el initializer de useState para que Settings/SubscriptionTab
// monte ya en el tab correcto (un useEffect correría después del primer render).
const isMpPaymentReturn = () => {
  const params = new URLSearchParams(window.location.search);
  return Boolean(
    params.get("payment_id") || params.get("collection_id") || params.get("external_reference")
  );
};

const Admin = () => {
  const { user } = useAuth();
  const isProfessional = user?.role === "2" || user?.role === "Profesional" || user?.role === "Professional";
  const mpReturn = isMpPaymentReturn();
  const [section, setSection] = useState(() => (mpReturn ? "settings" : isProfessional ? "appointments" : "home"));
  const [settingsTab, setSettingsTab] = useState(() => (mpReturn ? "subscription" : "business"));

  const handleSelectSection = (id) => {
    // Los profesionales solo ven Appointments y Help en el navbar.
    if (isProfessional && id !== "help" && id !== "appointments") return;
    setSection(id);
  };

  const renderSection = () => {
    if (isProfessional && section !== "help") return <Appointments />;
    switch (section) {
      case "home": return (
        <Home onUpgradePlan={() => { setSettingsTab("subscription"); setSection("settings"); }} />
      );
      case "managmentBusiness": return <ManagmentBusiness />;
      case "appointments": return <Appointments />;
      case "calendar": return <Calendar />;
      case "schedule": return <Schedule />;
      case "settings": return <Settings key={settingsTab} initialTab={settingsTab} />;
      case "help": return <Help />;

      default: return <Home />;
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[#f0ede8]">

      {/* Sidebar — ocupa toda la altura, NO es fixed */}
      <Navbar onSelectSection={handleSelectSection} role={user?.role} />

      {/* Right side: header + content */}
      <NotificationProvider>
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Header */}
          <Header username={user?.name} onNavigateToAppointments={() => setSection("appointments")} />

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-6 sm:pb-8">
            {renderSection()}
          </div>

        </div>
      </NotificationProvider>
    </div>
  );
};

export default Admin;