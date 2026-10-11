import { BASE_URL, getAuthHeaders } from "./api";

// Publico, sin auth. Devuelve null si falla para que el caller pueda
// seguir mostrando el fallback hardcodeado (t("heroTitle")/t("heroDesc"))
// en vez de romper la landing.
export const fetchLandingContent = async () => {
  try {
    const res = await fetch(`${BASE_URL}/LandingContent`, { method: "GET" });
    if (!res.ok) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
};

// Reemplaza el placeholder "{brandName}" dentro de textos editables (por
// ahora, la descripcion de "Quienes somos") por el nombre de marca actual,
// asi ese texto no queda desactualizado si se cambia el BrandName.
export const applyBrandName = (text, brandName) =>
  text ? text.replace(/\{brandName\}/g, brandName || "") : text;

export const updateLandingContent = async (payload) => {
  const res = await fetch(`${BASE_URL}/LandingContent`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || err?.message || "Failed to update landing content. Please try again.");
  }
  return res.json();
};
