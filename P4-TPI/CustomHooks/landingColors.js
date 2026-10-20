// Los 3 colores de marca de la landing (primaryColor/backgroundColor/
// accentColor) siempre tienen un valor guardado en la base (se precargaron
// con estos mismos defaults al armar la paleta), asi que un simple
// `content?.x || fallback` nunca cae al fallback. Si el negocio sigue en
// el valor semilla original (no lo personalizo), usamos la variable de
// tema para que reaccione a claro/oscuro; si lo cambio, su eleccion de
// marca manda siempre, sin importar el tema.
const DEFAULTS = {
  primaryColor: "#1a1a2e",
  backgroundColor: "#F8F5F0",
  accentColor: "#e2ddd8",
};

// Uso como fondo (botones, iconos, footer): se queda oscuro en los dos
// temas, porque siempre lleva texto blanco encima.
const THEME_VARS = {
  primaryColor: "var(--brand)",
  backgroundColor: "var(--page-bg)",
  accentColor: "var(--border-subtle)",
};

// Uso como texto (titulos, links): necesita ser claro en modo oscuro para
// que haga contraste con el fondo, no el mismo tono oscuro de los botones.
const THEME_TEXT_VARS = {
  primaryColor: "var(--text-primary)",
};

const resolve = (content, key, vars) => {
  const value = content?.[key];
  if (!value || value.toLowerCase() === DEFAULTS[key].toLowerCase()) {
    return vars[key];
  }
  return value;
};

export const resolveLandingColor = (content, key) => resolve(content, key, THEME_VARS);

export const resolveLandingTextColor = (content, key) =>
  resolve(content, key, { ...THEME_VARS, ...THEME_TEXT_VARS });
