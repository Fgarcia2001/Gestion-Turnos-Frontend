import { BASE_URL, putJson, postJson, deleteJson } from "./api";

// Publico, sin auth — igual que LandingContent. Devuelve null si falla para
// que el caller pueda seguir mostrando el fallback hardcodeado.
export const fetchHelpContent = async () => {
  try {
    const res = await fetch(`${BASE_URL}/HelpContent`, { method: "GET" });
    if (!res.ok) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
};

// SysAdmin — solo edita WhatsApp/email/horario, no toca las FAQs.
export const updateHelpContact = (payload) => putJson(`${BASE_URL}/HelpContent`, payload);

export const createFaq = (payload) => postJson(`${BASE_URL}/HelpContent/faqs`, payload);

export const updateFaq = (faqId, payload) => putJson(`${BASE_URL}/HelpContent/faqs/${faqId}`, payload);

export const deleteFaq = (faqId) => deleteJson(`${BASE_URL}/HelpContent/faqs/${faqId}`);
