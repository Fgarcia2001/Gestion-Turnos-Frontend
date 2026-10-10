import { BASE_URL, getAuthHeaders, fetchJsonOrThrow } from "./api";

// Horario semanal de una sucursal (distinto de fetchBranchSchedule en
// appointmentService.js, que trae la agenda de turnos de un día puntual).
export const fetchBranchWeeklySchedule = (branchId) =>
  fetchJsonOrThrow(`${BASE_URL}/Schedule/branch/${branchId}`);

export const updateBranchWeeklySchedule = async (branchId, days) => {
  const res = await fetch(`${BASE_URL}/Schedule/branch/${branchId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ days }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "No se pudo actualizar el horario. Inténtelo nuevamente.");
  }
  return res.json();
};
