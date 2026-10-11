import { BASE_URL, getAuthHeaders, fetchJsonOrThrow } from "./api";

export const fetchAllSubscriptions = () => fetchJsonOrThrow(`${BASE_URL}/BusinessSubscription`);

export const updateSubscriptionStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/BusinessSubscription/${id}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "Failed to update subscription status. Please try again.");
  }
  return res.json();
};

export const changeSubscriptionPlan = async (businessId, planId) => {
  const res = await fetch(`${BASE_URL}/BusinessSubscription/business/${businessId}/plan`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ planId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "Failed to change the plan. Please try again.");
  }
  return res.json();
};

export const deleteSubscription = async (id) => {
  const res = await fetch(`${BASE_URL}/BusinessSubscription/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "Failed to delete subscription. Please try again.");
  }
};
