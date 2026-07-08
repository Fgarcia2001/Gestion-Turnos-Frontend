export const BASE_URL = "https://localhost:7032/api";
export const AUTH_URL = `${BASE_URL}/Auth`;

const token = import.meta.env.VITE_JWT_TOKEN;

export const authHeaders = {
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
};

export const fetchJson = async (url) => {
  try {
    const res = await fetch(url, { method: "GET", headers: authHeaders });
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

export const signIn = async (credentials) => {
  const res = await fetch(`${AUTH_URL}/SignIn`, {
    method: "POST",
    headers: authHeaders,
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

export const decodeToken = () => {
  try {
    const payloadBase64 = token.split(".")[1];
    const json = JSON.parse(atob(payloadBase64));
    return {
      sub: json.sub,
      name: json.name,
      role: json["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      businessId: json.BusinessId,
      branchId: json.BranchId,
    };
  } catch {
    return null;
  }
};

const toDateParam = (date) => {
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
