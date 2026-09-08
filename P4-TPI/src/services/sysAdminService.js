import { BASE_URL, fetchJsonOrThrow } from "./api";

export const fetchSysAdminDashboard = () => fetchJsonOrThrow(`${BASE_URL}/SysAdmin/dashboard`);
