import { BASE_URL, getAuthHeaders, fetchJsonOrThrow } from "./api";

export const fetchBranchesByBusiness = (businessId) =>
  fetchJsonOrThrow(`${BASE_URL}/branches/business/${businessId}`);

export const fetchBranchInfo = (branchId) =>
  fetchJsonOrThrow(`${BASE_URL}/Branch/InfoBranch/${branchId}`);

export const createBranch = async (payload) => {
  const res = await fetch(`${BASE_URL}/Branch`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "Failed to create branch. Please try again.");
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
    throw new Error(err?.detail || err?.message || "Failed to update branch. Please try again.");
  }
  return res.json();
};

// SysAdmin: habilita/deshabilita cualquier sucursal (no solo las del propio negocio).
export const setBranchActiveStatus = async (id, isActive) => {
  const res = await fetch(`${BASE_URL}/Branch/${id}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ isActive }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "Failed to update the branch status. Please try again.");
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
    throw new Error(err?.detail || err?.message || "Failed to delete branch. Please try again.");
  }
};