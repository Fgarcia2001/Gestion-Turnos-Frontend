import { BASE_URL, getAuthHeaders } from "./api";

export const createBranch = async (payload) => {
  const res = await fetch(`${BASE_URL}/Branch`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to create branch. Please try again.");
  }
  return res.json();
};

export const updateBranch = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/Branch/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to update branch. Please try again.");
  }
  return res.json();
};

export const deleteBranch = async (id) => {
  const res = await fetch(`${BASE_URL}/Branch/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to delete branch. Please try again.");
  }
};