import { useEffect, useState } from "react";
import { useAuth } from "../CustomHooks/AuthContext";
import { NotificationProvider } from "../CustomHooks/NotificationContext";
import Navbar from "../src/Components/ComponentsAdmin/Navbar";
import Header from "../src/Components/ComponentsAdmin/Header";
import Home from "../src/Components/ComponentsAdmin/Sections/Home";
import ManagmentBusiness from "../src/Components/ComponentsAdmin/Sections/ManagmentBusiness";
import Appointments from "../src/Components/ComponentsAdmin/Sections/Appointments";
import Settings from "../src/Components/ComponentsAdmin/Sections/Settings";
import Schedule from "../src/Components/ComponentsAdmin/Sections/Schedule";
import Help from "../src/Components/ComponentsAdmin/Sections/Help";
import PendingReassignment from "../src/Components/ComponentsAdmin/Sections/PendingReassignment";
import { PENDING_PLAN_KEY, fetchPendingReassignmentAppointments } from "../src/services/api";
import { useProductTour } from "../CustomHooks/useProductTour";

// MercadoPago (Checkout Pro) redirige a /admin?payment_id=...&external_reference=<orderId>.
// Se resuelve en el initializer de useState para que Settings/SubscriptionTab
// monte ya en el tab correcto (un useEffect correría después del primer render).
const isMpPaymentReturn = () => {
  const params = new URLSearchParams(window.location.search);
  return Boolean(
    params.get("payment_id") || params.get("collection_id") || params.get("external_reference")
  );
};

// Plan elegido en la landing antes de registrarse (ver PlansSection.jsx). Se lee
// aquí sin borrarlo todavía: SubscriptionTab lo consume y recién ahí lo limpia,
// una vez que ya abrió el checkout de ese plan.
const getPendingPlanId = () => sessionStorage.getItem(PENDING_PLAN_KEY);

const isReceptionist = (role) => role === "Recepcionista" || role === "Receptionist";

// El recepcionista no ve Home ni Settings en el sidebar: aterriza en Appointments.
const RECEPTIONIST_HOME = "appointments";

const Admin = () => {
  const { user } = useAuth();
  const isProfessional = user?.role === "2" || user?.role === "Profesional" || user?.role === "Professional";
  const receptionist = isReceptionist(user?.role);
  const mpReturn = isMpPaymentReturn();
  const pendingPlanId = getPendingPlanId();
  // Settings solo se abre por el flujo de MercadoPago/plan, que no aplica a un
  // recepcionista; para el resto, la sección inicial depende del rol.
  const openSettings = (mpReturn || pendingPlanId) && !receptionist;
  const [section, setSection] = useState(() =>
    openSettings ? "settings" : isProfessional ? "appointments" : receptionist ? RECEPTIONIST_HOME : "home"
  );
  const [settingsTab, setSettingsTab] = useState(() => (openSettings ? "subscription" : "business"));

  // Turnos que quedaron pendientes de reasignar (cambio de rol/sucursal de un
  // profesional). Se re-consulta al cambiar de sección para mantener el botón al día.
  const [pendingReassignmentCount, setPendingReassignmentCount] = useState(0);
  useEffect(() => {
    if (isProfessional) return;
    let cancelled = false;
    fetchPendingReassignmentAppointments().then((list) => {
      if (!cancelled) setPendingReassignmentCount(Array.isArray(list) ? list.length : 0);
    });
    return () => { cancelled = true; };
  }, [section, isProfessional]);

  // Día al que debe abrir Appointments cuando se llega desde una notificación.
  // El nonce fuerza el remount aunque ya se esté en Appointments.
  const [appointmentsTarget, setAppointmentsTarget] = useState(null);

  // Tutorial de bienvenida (Driver.js). Auto-arranca en la primera visita y se
  // puede repetir desde Help. No arranca si el usuario ya viene de MercadoPago
  // o con un plan pendiente (esos flujos abren directo en Settings).
  const { startTour } = useProductTour({
    onNavigate: setSection,
    enabled: !mpReturn && !pendingPlanId,
  });

  // Secciones habilitadas por rol (el navbar ya las filtra; esto es el guard).
  const allowedSections = isProfessional
    ? ["appointments", "profile", "help"]
    : receptionist
      ? ["appointments", "managmentBusiness", "schedule", "pendingReassignment", "profile", "help"]
      : null;

  const handleSelectSection = (id) => {
    if (allowedSections && !allowedSections.includes(id)) return;
    setAppointmentsTarget(null);
    setSection(id);
  };

  const handleNotificationNavigate = (day) => {
    setAppointmentsTarget({ day, nonce: Date.now() });
    setSection("appointments");
  };

  const renderAppointments = () => (
    <Appointments initialDate={appointmentsTarget?.day} key={appointmentsTarget?.nonce} />
  );

  const renderSection = () => {
    if (isProfessional && section !== "help" && section !== "profile") return renderAppointments();
    // El recepcionista no puede ver Settings ni Home, sin importar de dónde venga el estado.
    if (receptionist && (section === "settings" || section === "home")) return renderAppointments();
    switch (section) {
      case "home": return (
        <Home onUpgradePlan={() => { setSettingsTab("subscription"); setSection("settings"); }} />
      );
      case "managmentBusiness": return <ManagmentBusiness />;
      case "appointments": return renderAppointments();
      case "schedule": return <Schedule />;
      case "settings": return <Settings key={settingsTab} initialTab={settingsTab} autoOpenPlanId={pendingPlanId} />;
      case "profile": return <Settings profileOnly />;
      case "help": return <Help onStartTour={startTour} />;
      case "pendingReassignment": return <PendingReassignment onChange={setPendingReassignmentCount} />;

      default: return <Home />;
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[var(--surface-muted)]">

      {/* Sidebar — ocupa toda la altura, NO es fixed */}
      <Navbar onSelectSection={handleSelectSection} role={user?.role} active={section} />

      {/* Right side: header + content */}
      <NotificationProvider>
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Header */}
          <Header
            username={user?.name}
            onNavigateToAppointments={handleNotificationNavigate}
            pendingReassignmentCount={isProfessional ? 0 : pendingReassignmentCount}
            onNavigateToPendingReassignment={() => handleSelectSection("pendingReassignment")}
            onNavigateToSettings={() => handleSelectSection(isProfessional || receptionist ? "profile" : "settings")}
          />

          {/* Scrollable content */}
          <div data-tour="section-content" className="flex-1 overflow-y-auto px-4 sm:px-8 pb-6 sm:pb-8">
            {renderSection()}
          </div>

        </div>
      </NotificationProvider>
    </div>
  );
};

export default Admin;