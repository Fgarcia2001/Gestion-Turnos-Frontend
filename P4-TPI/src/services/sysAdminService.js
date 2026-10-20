import { BASE_URL, getAuthHeaders, fetchJsonOrThrow } from "./api";

export const fetchSysAdminDashboard = () => fetchJsonOrThrow(`${BASE_URL}/SysAdmin/dashboard`);

export const fetchSysAdminProfile = () => fetchJsonOrThrow(`${BASE_URL}/SysAdmin/me`);

export const updateSysAdminProfile = async (payload) => {
  const res = await fetch(`${BASE_URL}/SysAdmin/me`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "Failed to update your profile. Please try again.");
  }
  return res.json();
};

export const fetchSysAdminBusinesses = () => fetchJsonOrThrow(`${BASE_URL}/sysadmin/businesses`);

export const fetchSysAdminBusinessById = (businessId) =>
  fetchJsonOrThrow(`${BASE_URL}/sysadmin/businesses/${encodeURIComponent(businessId)}`);
