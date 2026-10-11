import { BASE_URL, getAuthHeaders, fetchJson, fetchJsonOrThrow } from "./api";

export const fetchBusinessTypes = () => fetchJson(`${BASE_URL}/business/types`);

export const fetchGlobalBusinesses = () => fetchJsonOrThrow(`${BASE_URL}/Business/global`);

// SysAdmin edita cualquier negocio (no solo el propio, como MyBusiness/Update).
export const updateBusinessAsAdmin = async (businessId, payload) => {
  const res = await fetch(`${BASE_URL}/Business/${businessId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "Failed to update the business. Please try again.");
  }
};

export const fetchBusinessEcosystemByUrl = (url) =>
  fetchJsonOrThrow(`${BASE_URL}/Business/by-url/${encodeURIComponent(url)}/ecosystem`);
