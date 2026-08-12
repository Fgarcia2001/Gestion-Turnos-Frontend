import { BASE_URL, getAuthHeaders, fetchJsonOrThrow, toDateParam } from "./api";

export const fetchAvailableSlots = ({ branchId, staffId, serviceId, date }) => {
  const params = new URLSearchParams({
    branchId,
    staffId,
    serviceId,
    date: toDateParam(date),
  });
  return fetchJsonOrThrow(`${BASE_URL}/appointments/available-slots?${params.toString()}`);
};

export const createAppointment = async (payload) => {
  const res = await fetch(`${BASE_URL}/appointment`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "bookingFailed");
  }
  return res.json();
};
