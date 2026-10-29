// Orden de las secciones de la landing debajo del Hero (que siempre va
// primero, fijo). Se persiste en LandingContent.sectionsOrder como una
// lista separada por comas con estos 3 valores.
export const DEFAULT_SECTIONS_ORDER = ["images", "plans", "about"];

export const parseSectionsOrder = (orderString) => {
  if (!orderString) return DEFAULT_SECTIONS_ORDER;
  const parsed = orderString.split(",").map((k) => k.trim()).filter(Boolean);
  const known = parsed.filter((k) => DEFAULT_SECTIONS_ORDER.includes(k));
  if (known.length === 0) return DEFAULT_SECTIONS_ORDER;
  const missing = DEFAULT_SECTIONS_ORDER.filter((k) => !known.includes(k));
  return [...known, ...missing];
};

export const serializeSectionsOrder = (orderKeys) => orderKeys.join(",");
