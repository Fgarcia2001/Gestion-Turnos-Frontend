import { IconInstagram, IconFacebook, IconTwitter, IconLinkedin } from "./FooterIcons";

// Lista de redes sociales en comun para Footer.jsx (la landing real) y la
// vista previa de SysAdminLanding.jsx, asi ambas quedan siempre en sync.
export const SOCIAL_LINKS = [
  { key: "instagramUrl", Icon: IconInstagram, label: "Instagram" },
  { key: "facebookUrl", Icon: IconFacebook, label: "Facebook" },
  { key: "twitterUrl", Icon: IconTwitter, label: "Twitter / X" },
  { key: "linkedinUrl", Icon: IconLinkedin, label: "LinkedIn" },
];
