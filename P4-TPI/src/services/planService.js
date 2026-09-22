import { BASE_URL, getAuthHeaders, fetchJsonOrThrow } from "./api";

export const fetchAllPlans = () => fetchJsonOrThrow(`${BASE_URL}/plan/all`);

export const createPlan = async (payload) => {
  const res = await fetch(`${BASE_URL}/plan`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to create plan. Please try again.");
  }
  return res.json();
};

export const updatePlan = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/plan/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to update plan. Please try again.");
  }
  return res.json();
};

export const deletePlan = async (id) => {
  const res = await fetch(`${BASE_URL}/plan/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to delete plan. Please try again.");
  }
};
