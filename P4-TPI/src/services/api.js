export const BASE_URL = "https://localhost:7032/api";
export const AUTH_URL = `${BASE_URL}/Auth`;

const TOKEN_KEY = "auth_token";

export const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const fetchJson = async (url) => {
  try {
    const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
    if (!res.ok) {
      console.error(`Error ${res.status} en ${url}`);
      return [];
    }
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  } catch (e) {
    console.error(`Error en fetch ${url}:`, e);
    return [];
  }
};

export const fetchJsonOrThrow = async (url) => {
  let res;
  try {
    res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
  } catch {
    throw new Error("networkError");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "apiError");
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

// ── Errores de la API ──────────────────────────────────────────────────────────
// Los endpoints de BusinessSubscription/payments devuelven problemas RFC7807:
// { status, title, detail, traceId }. `detail` es el mensaje visible.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const parseApiError = async (res) => {
  const body = await res.json().catch(() => null);
  return body?.detail || body?.title || body?.message || `Error ${res.status}`;
};

const requestJson = async (url, method) => {
  let res;
  try {
    res = await fetch(url, { method, headers: getAuthHeaders() });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor", 0);
  }
  if (!res.ok) {
    throw new ApiError(await parseApiError(res), res.status);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const getJson = (url) => requestJson(url, "GET");
export const postJson = (url) => requestJson(url, "POST");

// ── Suscripción y pagos (MercadoPago Checkout Pro) ─────────────────────────────
export const fetchMySubscription = () => getJson(`${BASE_URL}/BusinessSubscription/my`);

export const changePlanCheckout = (planId) =>
  postJson(`${BASE_URL}/BusinessSubscription/my/change-plan/${planId}/checkout`);

export const renewCheckout = () => postJson(`${BASE_URL}/BusinessSubscription/my/renew/checkout`);

export const fetchPaymentStatus = (orderId, paymentId) =>
  getJson(`${BASE_URL}/payments/${orderId}/status?paymentId=${encodeURIComponent(paymentId ?? "")}`);

export const signIn = async (credentials) => {
  const res = await fetch(`${AUTH_URL}/SignIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "Invalid credentials. Please try again.");
  }
  return res.json();
};

export const signUp = async (payload) => {
  const res = await fetch(`${AUTH_URL}/SignUp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "Registration failed. Please try again.");
  }
  return res.json();
};

export const toDateParam = (date) => {
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const fetchAppointmentsByDate = (date, branchId) => {
  let url = `${BASE_URL}/Appointment/by-date?day=${toDateParam(date)}`;
  if (branchId) url += `&branchId=${branchId}`;
  return fetchJson(url);
};

export const fetchMyBranchAppointmentsByDate = (date) =>
  fetchJson(`${BASE_URL}/Appointment/my-branch/by-date?day=${toDateParam(date)}`);

export const fetchStaffData = () => fetchJson(`${BASE_URL}/Staff/Business/Staffs`);
export const fetchClientData = () => fetchJson(`${BASE_URL}/Client`);
export const fetchBranchData = () => fetchJson(`${BASE_URL}/Branch`);
export const fetchServiceData = () => fetchJson(`${BASE_URL}/Service`);
export const fetchPlans = () => fetchJson(`${BASE_URL}/plan`);

// Plan elegido en la landing antes de registrarse, para retomarlo en el
// dashboard (SubscriptionTab) y disparar el checkout automáticamente.
export const PENDING_PLAN_KEY = "pending_plan_id";

export const fetchAllAppointments = () => fetchJson(`${BASE_URL}/Appointment`);
export const fetchMyBranchAppointments = () => fetchJson(`${BASE_URL}/Appointment/my-branch`);

// Version liviana de las stats de turnos del negocio (2 numeros) en vez de
// traer el historial completo via fetchAllAppointments.
export const fetchAppointmentStats = async () => {
  const fallback = { totalAppointments: 0, activeClients: 0 };
  try {
    const res = await fetch(`${BASE_URL}/Appointment/stats`, { headers: getAuthHeaders() });
    if (!res.ok) return fallback;
    const text = await res.text();
    return text ? JSON.parse(text) : fallback;
  } catch {
    return fallback;
  }
};

