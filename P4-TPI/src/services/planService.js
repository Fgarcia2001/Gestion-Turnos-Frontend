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
    throw new Error(err?.detail || err?.message || "Failed to create plan. Please try again.");
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
    throw new Error(err?.detail || err?.message || "Failed to update plan. Please try again.");
  }
  return res.json();
};

// Persiste un nuevo orden de planes (drag-and-drop en SysAdmin). `orderedIds`
// es la lista completa de ids en el orden deseado; el backend asigna
// displayOrder 0, 1, 2... segun esa posicion.
export const reorderPlans = async (orderedIds) => {
  const res = await fetch(`${BASE_URL}/plan/reorder`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ planIds: orderedIds }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "Failed to reorder plans. Please try again.");
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
    throw new Error(err?.detail || err?.message || "Failed to delete plan. Please try again.");
  }
};
