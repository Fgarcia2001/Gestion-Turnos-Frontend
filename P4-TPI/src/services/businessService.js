import { BASE_URL, fetchJson, fetchJsonOrThrow } from "./api";

export const fetchBusinessTypes = () => fetchJson(`${BASE_URL}/business/types`);

export const fetchBusinessesByType = (typeBusiness) =>
  fetchJsonOrThrow(`${BASE_URL}/business/type/${encodeURIComponent(typeBusiness)}`);

export const fetchGlobalBusinesses = () => fetchJsonOrThrow(`${BASE_URL}/Business/global`);
