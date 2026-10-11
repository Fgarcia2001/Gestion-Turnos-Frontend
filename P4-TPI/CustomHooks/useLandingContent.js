import { useEffect, useState } from "react";
import { fetchLandingContent } from "../src/services/landingContentService";

// Contenido editable de la landing (brandName, hero ES/EN). Devuelve null
// mientras carga o si falla, para que el caller pueda caer al texto fijo
// de translations.js sin romper nada.
export const useLandingContent = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchLandingContent().then((data) => {
      if (!cancelled) setContent(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return content;
};
