import { BASE_URL, getAuthHeaders } from "./api";

export const createService = async (payload) => {
  const res = await fetch(`${BASE_URL}/Service`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to create service. Please try again.");
  }
  return res.json();
};

export const updateService = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/Service/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to update service. Please try again.");
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const deleteService = async (id) => {
  const res = await fetch(`${BASE_URL}/Service/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to delete service. Please try again.");
  }
};