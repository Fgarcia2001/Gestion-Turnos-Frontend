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
    throw new Error(err?.message || "apiError");
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

export const signIn = async (credentials) => {
  const res = await fetch(`${AUTH_URL}/SignIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Invalid credentials. Please try again.");
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
    throw new Error(err?.message || "Registration failed. Please try again.");
  }
  return res.json();
};

export const toDateParam = (date) => {
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

export const fetchStaffData   = () => fetchJson(`${BASE_URL}/Staff/Business/Staffs`);
export const fetchClientData  = () => fetchJson(`${BASE_URL}/Client`);
export const fetchBranchData  = () => fetchJson(`${BASE_URL}/Branch`);
export const fetchServiceData = () => fetchJson(`${BASE_URL}/Service`);

