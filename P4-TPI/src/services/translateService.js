const MYMEMORY_URL = "https://api.mymemory.translated.net/get";

// Traduccion automatica "borrador" usando la API gratuita de MyMemory
// (sin API key, CORS habilitado). Pensada para auto-completar el campo EN
// a partir del ES en SysAdminLanding; el SysAdmin siempre puede corregirla
// a mano antes de guardar.
export const translateText = async (text, langpair = "es|en") => {
  const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${langpair}`;
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("No se pudo conectar con el servicio de traduccion.");
  }
  if (!res.ok) throw new Error("El servicio de traduccion no respondio correctamente.");
  const data = await res.json().catch(() => null);
  const translated = data?.responseData?.translatedText;
  if (!translated || data?.responseStatus !== 200) {
    throw new Error("No se pudo traducir el texto. Intenta de nuevo.");
  }
  return translated;
};
