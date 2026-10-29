// Orden de los 6 rubros fijos de la landing (BusinessTypesSection.jsx) y su
// preview en SysAdmin (SysAdminLanding.jsx). Se persiste en
// LandingContent.businessTypesOrder como una lista separada por comas de
// los mismos nombres de campo que ya usa cada imagen (imageUrlBarberia,
// imageUrlSpa, etc.), en el orden elegido por el SysAdmin.

export const DEFAULT_BUSINESS_TYPE_ORDER = [
  "imageUrlBarberia",
  "imageUrlSpa",
  "imageUrlPeluqueria",
  "imageUrlEstetica",
  "imageUrlMasajes",
  "imageUrlTattoo",
];

export const parseBusinessTypesOrder = (orderString) => {
  if (!orderString) return DEFAULT_BUSINESS_TYPE_ORDER;
  const parsed = orderString.split(",").map((k) => k.trim()).filter(Boolean);
  // Solo claves conocidas; si vino vacio/corrupto, cae al orden por defecto.
  const known = parsed.filter((k) => DEFAULT_BUSINESS_TYPE_ORDER.includes(k));
  if (known.length === 0) return DEFAULT_BUSINESS_TYPE_ORDER;
  // Completa con las claves faltantes (si alguna vez se agrega un 7mo rubro
  // y el valor guardado es viejo) al final, en su orden por defecto.
  const missing = DEFAULT_BUSINESS_TYPE_ORDER.filter((k) => !known.includes(k));
  return [...known, ...missing];
};

export const serializeBusinessTypesOrder = (orderKeys) => orderKeys.join(",");

// Reordena `items` (cualquier shape) segun `orderKeys`, usando `getKey` para
// obtener el nombre de campo de cada item.
export const sortByBusinessTypesOrder = (items, orderKeys, getKey) => {
  const indexOf = (key) => {
    const i = orderKeys.indexOf(key);
    return i === -1 ? orderKeys.length : i;
  };
  return [...items].sort((a, b) => indexOf(getKey(a)) - indexOf(getKey(b)));
};
