import { BASE_URL, fetchJson } from "./api";

export const fetchBusinessTypes = () => fetchJson(`${BASE_URL}/business/types`);
