import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useAuth } from "./AuthContext";
import { fetchAppointmentsByDate, fetchMyBranchAppointmentsByDate } from "../src/services/api";
import { fetchMyAppointments } from "../src/services/appointmentService";

// ── Configuración del hub (ajustar cuando se implemente en el backend) ────────
const HUB_URL = "https://localhost:7032/notificationHub";
const HUB_EVENT_NEW_APPOINTMENT = "NewAppointment";
const HUB_JOIN_METHOD = "JoinGroup";

const NotificationContext = createContext(null);

const isToday = (appt) => {
  const [y, m, d] = (appt.day || "").split("-").map(Number);
  const now = new Date();
  return y === now.getFullYear() && m === now.getMonth() + 1 && d === now.getDate();
};

const isPending = (appt) => !appt.status || appt.status === "Pending";

// ── Provider ───────────────────────────────────────────────────────────────────
export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const seenIdsRef = useRef(new Set());

  const isProfessional = user?.role === "2" || user?.role === "Profesional" || user?.role === "Professional";
  const isReceptionist = user?.role === "Recepcionista" || user?.role === "Receptionist";

  const loadAppointments = useCallback(async () => {
    if (!user) return;
    try {
      let data;
      if (isProfessional) {
        data = await fetchMyAppointments();
      } else if (isReceptionist) {
        data = await fetchMyBranchAppointmentsByDate(new Date());
      } else {
        data = await fetchAppointmentsByDate(new Date(), user.branchId);
      }
      const pendingToday = (Array.isArray(data) ? data : []).filter((a) => isToday(a) && isPending(a));
      setAppointments(pendingToday);
      const unseen = pendingToday.filter((a) => !seenIdsRef.current.has(a.id)).length;
      setUnreadCount(unseen);
    } catch (e) {
      console.error("Error cargando turnos para notificaciones:", e);
    }
  }, [user, isProfessional, isReceptionist]);

  const markAllRead = useCallback(() => {
    seenIdsRef.current = new Set(appointments.map((a) => a.id));
    setUnreadCount(0);
  }, [appointments]);

  // ── Conexión SignalR ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("auth_token");
    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    connection.onreconnecting(() => setConnected(false));
    connection.onreconnected(() => {
      setConnected(true);
      loadAppointments();
    });
    connection.onclose(() => setConnected(false));
    connection.on(HUB_EVENT_NEW_APPOINTMENT, () => loadAppointments());

    connection
      .start()
      .then(() => {
        setConnected(true);
        if (HUB_JOIN_METHOD && user.businessId) {
          connection.invoke(HUB_JOIN_METHOD, user.businessId).catch(() => {});
        }
        loadAppointments();
      })
      .catch((e) => console.error("SignalR no disponible:", e));

    return () => {
      connection.stop().catch(() => {});
    };
  }, [user, loadAppointments]);

  const value = { appointments, unreadCount, connected, refresh: loadAppointments, markAllRead };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// ── Custom hook ────────────────────────────────────────────────────────────────
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications debe usarse dentro de un NotificationProvider");
  }
  return context;
};

export default NotificationContext;