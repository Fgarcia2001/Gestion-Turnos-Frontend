import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useAuth } from "./AuthContext";
import { fetchAllAppointments, fetchMyBranchAppointments } from "../src/services/api";
import { fetchMyAppointments } from "../src/services/appointmentService";

// ── Configuración del hub (ajustar cuando se implemente en el backend) ────────
const HUB_URL = "https://localhost:7032/notificationHub";
const HUB_EVENT_NEW_APPOINTMENT = "NewAppointment";
const HUB_JOIN_METHOD = "JoinGroup";

const NotificationContext = createContext(null);

const isPending = (appt) => !appt.status || appt.status === "Pending";

const seenStorageKey = (userId) => `notification_seen_${userId}`;

const readSeenIds = (userId) => {
  try {
    const raw = localStorage.getItem(seenStorageKey(userId));
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveSeenIds = (userId, ids) => {
  try {
    localStorage.setItem(seenStorageKey(userId), JSON.stringify([...ids]));
  } catch {
    // storage no disponible: se ignora
  }
};

// ── Provider ───────────────────────────────────────────────────────────────────
export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const appointmentsRef = useRef([]);
  const seenIdsRef = useRef(new Set());

  const userId = user?.sub;

  useEffect(() => {
    seenIdsRef.current = userId ? readSeenIds(userId) : new Set();
  }, [userId]);

  const isProfessional = user?.role === "2" || user?.role === "Profesional" || user?.role === "Professional";
  const isReceptionist = user?.role === "Recepcionista" || user?.role === "Receptionist";

  const loadAppointments = useCallback(async () => {
    if (!user) return;
    try {
      let data;
      if (isProfessional) {
        data = await fetchMyAppointments();
      } else if (isReceptionist) {
        data = await fetchMyBranchAppointments();
      } else {
        data = await fetchAllAppointments();
      }
      const pendingAppointments = (Array.isArray(data) ? data : []).filter((a) => isPending(a));
      appointmentsRef.current = pendingAppointments;
      setAppointments(pendingAppointments);
      const unseen = pendingAppointments.filter((a) => !seenIdsRef.current.has(a.id)).length;
      setUnreadCount(unseen);
    } catch (e) {
      console.error("Error cargando turnos para notificaciones:", e);
    }
  }, [user, isProfessional, isReceptionist]);

  const markAllRead = useCallback(() => {
    const ids = new Set(appointmentsRef.current.map((a) => a.id));
    seenIdsRef.current = ids;
    if (userId) saveSeenIds(userId, ids);
    setUnreadCount(0);
  }, [userId]);

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
    connection.on(HUB_EVENT_NEW_APPOINTMENT, (payload) => {
      if (isProfessional) {
        loadAppointments();
        return;
      }
      if (
        isPending(payload)
        && !seenIdsRef.current.has(payload?.id)
        && !appointmentsRef.current.some((a) => a.id === payload?.id)
      ) {
        appointmentsRef.current = [...appointmentsRef.current, payload];
        setAppointments(appointmentsRef.current);
        setUnreadCount((c) => c + 1);
      }
    });

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
  }, [user, loadAppointments, isProfessional]);

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