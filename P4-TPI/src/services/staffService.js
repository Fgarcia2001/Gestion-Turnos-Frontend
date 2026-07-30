import { BASE_URL, getAuthHeaders } from "./api";

export const createStaff = async (payload) => {
  const res = await fetch(`${BASE_URL}/Staff`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to create staff. Please try again.");
  }
  return res.json();
};

export const updateStaff = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/Staff/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to update staff. Please try again.");
  }
  return res.json();
};

export const deleteStaff = async (id) => {
  const res = await fetch(`${BASE_URL}/Staff/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to delete staff. Please try again.");
  }
};
