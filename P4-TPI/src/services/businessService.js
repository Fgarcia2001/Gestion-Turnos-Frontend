import { BASE_URL, fetchJson, fetchJsonOrThrow } from "./api";

export const fetchBusinessTypes = () => fetchJson(`${BASE_URL}/business/types`);

export const fetchGlobalBusinesses = () => fetchJsonOrThrow(`${BASE_URL}/Business/global`);

export const fetchBusinessEcosystemByUrl = (url) =>
  fetchJsonOrThrow(`${BASE_URL}/Business/by-url/${encodeURIComponent(url)}/ecosystem`);
