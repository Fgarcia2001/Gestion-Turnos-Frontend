import { BASE_URL, getAuthHeaders, fetchJson, fetchJsonOrThrow, toDateParam } from "./api";

export const fetchMyAppointments = () => fetchJson(`${BASE_URL}/Appointment/my-appointments`);

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

export const updateAppointmentStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/Appointment/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to update appointment status. Please try again.");
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};
