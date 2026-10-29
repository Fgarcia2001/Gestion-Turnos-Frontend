import { BASE_URL, getJson, postJson, patchJson } from "./api";

// Cualquier usuario autenticado (Admin, Recepcionista, Profesional, SysAdmin).
// businessId/userId/userName los completa el backend desde el JWT.
export const submitBugReport = (payload) => postJson(`${BASE_URL}/BugReports`, payload);

// SysAdmin — lista completa, mas reciente primero.
export const fetchBugReports = () => getJson(`${BASE_URL}/BugReports`);

export const updateBugReportStatus = (id, status) =>
  patchJson(`${BASE_URL}/BugReports/${id}`, { status });
