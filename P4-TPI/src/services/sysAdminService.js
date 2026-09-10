import { BASE_URL, fetchJsonOrThrow } from "./api";

export const fetchSysAdminDashboard = () => fetchJsonOrThrow(`${BASE_URL}/SysAdmin/dashboard`);

export const fetchSysAdminBusinesses = () => fetchJsonOrThrow(`${BASE_URL}/sysadmin/businesses`);

export const fetchSysAdminBusinessById = (businessId) =>
  fetchJsonOrThrow(`${BASE_URL}/sysadmin/businesses/${encodeURIComponent(businessId)}`);
