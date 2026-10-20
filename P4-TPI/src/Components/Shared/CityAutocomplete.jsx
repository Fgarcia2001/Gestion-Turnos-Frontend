import { useState } from "react";
import { useNominatimSearch } from "./useNominatimSearch";

// Autocomplete de ciudades via Nominatim (OpenStreetMap), independiente del
// de direccion: por si el usuario llena la ciudad sin pasar por ese campo.
// onSelect recibe directamente el nombre de la ciudad (string).
const CityAutocomplete = ({
  name,
  value,
  onChange,
  onSelect,
  placeholder,
  className,
  countryCode = "ar",
}) => {
  const [open, setOpen] = useState(false);
  const { results, loading } = useNominatimSearch(value, { countryCode, limit: 8 });

  const cities = [
    ...new Set(
      results
        .map((item) => item.address?.city || item.address?.town || item.address?.village || item.address?.municipality)
        .filter(Boolean)
    ),
  ];

  const pick = (city) => {
    setOpen(false);
    onSelect(city);
  };

  const showPanel = open && (loading || cities.length > 0);

  return (
    <>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        autoComplete="off"
        className={className}
      />
      {showPanel && (
        <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl shadow-lg max-h-56 overflow-y-auto">
          {loading && <p className="px-3 py-2 text-xs text-[var(--text-muted)]">Buscando...</p>}
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onMouseDown={() => pick(city)}
              className="w-full text-left px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default CityAutocomplete;
