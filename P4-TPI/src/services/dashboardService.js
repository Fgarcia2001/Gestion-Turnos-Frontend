import { BASE_URL, fetchJsonOrThrow } from "./api";

export const fetchDashboardSummary = () =>
  fetchJsonOrThrow(`${BASE_URL}/Dashboard/summary`);
