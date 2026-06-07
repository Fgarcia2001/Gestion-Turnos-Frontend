export const BASE_URL = "https://localhost:7032/api";

const token = import.meta.env.VITE_JWT_TOKEN;

const authHeaders = {
  "Content-Type": "application/json",
  ...(token && { Authorization: `Bearer ${token}` }),
};

const fetchJson = async (url) => {
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

// ── Fetch functions ────────────────────────────────────────────────────────
export const fetchStaffData   = () => fetchJson(`${BASE_URL}/Staff/Business/Staffs`);
export const fetchClientData  = () => fetchJson(`${BASE_URL}/Client`);
export const fetchBranchData  = () => fetchJson(`${BASE_URL}/Branch`);
export const fetchServiceData = () => fetchJson(`${BASE_URL}/Service`);

// ── Static data ────────────────────────────────────────────────────────────
export const DEFAULT_SCHEDULES = [
  { day: "Monday",    open: true,  from: "09:00", to: "18:00" },
  { day: "Tuesday",   open: true,  from: "09:00", to: "18:00" },
  { day: "Wednesday", open: true,  from: "09:00", to: "18:00" },
  { day: "Thursday",  open: true,  from: "09:00", to: "18:00" },
  { day: "Friday",    open: true,  from: "09:00", to: "17:00" },
  { day: "Saturday",  open: false, from: "10:00", to: "14:00" },
  { day: "Sunday",    open: false, from: "10:00", to: "14:00" },
];

export const TABS = [
  { id: "staff",   labelKey: "Staff" },
  { id: "client",  labelKey: "Clients" },
  { id: "branch",  labelKey: "Branches" },
  { id: "service", labelKey: "Services" },
];