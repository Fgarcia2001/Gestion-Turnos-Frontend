import { useState } from "react";
import { useNominatimSearch } from "./useNominatimSearch";

// Autocomplete de direcciones via Nominatim (OpenStreetMap): gratis, sin API
// key. Al elegir una sugerencia devuelve direccion y ciudad por separado
// (onSelect) para completar los dos campos del formulario de una sola vez;
// si Nominatim no responde o el usuario prefiere tipear a mano, el input
// sigue funcionando como un campo de texto comun (onChange).
const AddressAutocomplete = ({
  name,
  value,
  onChange,
  onSelect,
  placeholder,
  className,
  countryCode = "ar",
}) => {
  const [open, setOpen] = useState(false);
  const { results, loading } = useNominatimSearch(value, { countryCode });

  const pick = (item) => {
    const addr = item.address || {};
    const city = addr.city || addr.town || addr.village || addr.municipality || "";
    const line =
      [addr.road, addr.house_number].filter(Boolean).join(" ") ||
      item.display_name.split(",")[0];
    setOpen(false);
    onSelect({ address: line, city });
  };

  const showPanel = open && (loading || results.length > 0);

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
        <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-[#e2ddd8] rounded-xl shadow-lg max-h-56 overflow-y-auto">
          {loading && <p className="px-3 py-2 text-xs text-[#9a9a9a]">Buscando...</p>}
          {results.map((item) => (
            <button
              key={item.place_id}
              type="button"
              onMouseDown={() => pick(item)}
              className="w-full text-left px-3 py-2 text-sm text-[#1a1a2e] hover:bg-[#f0ede8] transition-colors"
            >
              {item.display_name}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default AddressAutocomplete;
