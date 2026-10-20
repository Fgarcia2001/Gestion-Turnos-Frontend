import { useEffect, useRef, useState } from "react";

// Busqueda con debounce contra Nominatim (OpenStreetMap): gratis, sin API key.
// Compartido por AddressAutocomplete y CityAutocomplete.
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 500;

export const useNominatimSearch = (query, { countryCode = "ar", limit = 5 } = {}) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query || query.trim().length < MIN_QUERY_LENGTH) {
        setResults([]);
        return;
      }
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          format: "json",
          q: query,
          addressdetails: "1",
          limit: String(limit),
          ...(countryCode ? { countrycodes: countryCode } : {}),
        });
        const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
          signal: controller.signal,
          headers: { "Accept-Language": "es" },
        });
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        // Fetch cancelada (nueva tecla) o Nominatim no disponible: se ignora,
        // el usuario sigue pudiendo tipear a mano.
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query, countryCode, limit]);

  return { results, loading };
};
