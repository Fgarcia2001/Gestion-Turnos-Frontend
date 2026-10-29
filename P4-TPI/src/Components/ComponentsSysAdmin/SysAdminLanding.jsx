import { useEffect, useState } from "react";
import { fetchLandingContent, updateLandingContent, applyBrandName } from "../../services/landingContentService";
import { resolveLandingColor, resolveLandingTextColor } from "../../../CustomHooks/landingColors";
import { translateText } from "../../services/translateService";
import { fetchPlans } from "../../services/api";
import { reorderPlans } from "../../services/planService";
import { IconMail, IconPhone } from "../ComponentsHome/FooterIcons";
import { SOCIAL_LINKS } from "../ComponentsHome/socialLinksConfig";
import { useTranslation } from "../../../CustomHooks/TraslateHook";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DEFAULT_BUSINESS_TYPE_ORDER,
  parseBusinessTypesOrder,
  serializeBusinessTypesOrder,
  sortByBusinessTypesOrder,
} from "../../../CustomHooks/businessTypesOrder";
import {
  DEFAULT_SECTIONS_ORDER,
  parseSectionsOrder,
  serializeSectionsOrder,
} from "../../../CustomHooks/landingSectionsOrder";
import barberiaImg from "../../assets/business-types/barberia.webp";
import spaImg from "../../assets/business-types/spa.webp";
import peluqueriaImg from "../../assets/business-types/peluqueria.webp";
import esteticaImg from "../../assets/business-types/estetica.webp";
import masajesImg from "../../assets/business-types/masajes.webp";
import tattooImg from "../../assets/business-types/tattoo.webp";

const SkeletonForm = () => (
  <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-6 flex flex-col gap-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <div className="h-3 w-24 rounded bg-[var(--surface-muted)]" />
        <div className="h-10 w-full rounded-xl bg-[var(--surface-muted)]" />
      </div>
    ))}
  </div>
);

const IconTranslate = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8h10M9 4v2m6 15 4-9 4 9m-7.3-2h6.6M4 21l5-11 5 11M6.1 15h5.8" />
  </svg>
);

const IconSun = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

// Handle de arrastre (drag-and-drop con @dnd-kit) para reordenar imagenes,
// planes y secciones directamente en el preview.
const IconGrip = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
    <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
    <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
  </svg>
);

const IconMoon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

const Field = ({ label, value, onChange, textarea, onTranslate, translating }) => {
  const { t } = useTranslation();
  return (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs font-semibold text-[var(--text-tertiary)]">{label}</label>
      {onTranslate && (
        <button
          type="button"
          onClick={onTranslate}
          disabled={translating || !value}
          title={t("Auto-translate to English") || "Auto-translate to English"}
          className="flex items-center gap-1 text-[10px] font-semibold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <IconTranslate />
          {translating ? (t("Translating...") || "Translating...") : (t("Translate → EN") || "Translate → EN")}
        </button>
      )}
    </div>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-[var(--border-subtle)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] resize-none"
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[var(--border-subtle)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)]"
      />
    )}
  </div>
  );
};

// Thumbnail arrastrable de una imagen ilustrativa dentro del preview —
// el tile entero es el handle (se arrastra tocando la imagen misma).
const SortableImageTile = ({ id, src, accentColor }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderColor: accentColor }}
      {...attributes}
      {...listeners}
      className="aspect-square rounded-lg overflow-hidden border cursor-grab active:cursor-grabbing touch-none"
    >
      <img src={src} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
    </div>
  );
};

// Mini card de un plan dentro del preview, arrastrable por el handle (los
// puntitos) para no interferir con el resto del contenido de la card.
const SortablePlanCard = ({ id, name, price, accentColor, primaryTextColor }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderColor: accentColor }}
      className="relative w-[68px] h-14 rounded-lg bg-[var(--surface)] border flex flex-col items-center justify-center px-1"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--text-muted)] cursor-grab active:cursor-grabbing touch-none"
      >
        <IconGrip />
      </button>
      <span className="text-[9px] font-semibold truncate w-full text-center" style={{ color: primaryTextColor }}>{name}</span>
      <span className="text-[9px] text-[var(--text-muted)]">${price}</span>
    </div>
  );
};

// Bloque de seccion de la landing (Imagenes / Planes / Quienes somos),
// arrastrable por el handle de su encabezado para reordenar entre si. El
// Hero y el Footer no pasan por aca, van siempre fijos.
const SortableSectionBlock = ({ id, label, accentColor, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="border-t" >
      <div
        {...attributes}
        {...listeners}
        style={{ borderColor: accentColor }}
        className="flex items-center gap-1.5 px-5 pt-2 text-[9px] font-semibold text-[var(--text-faint)] uppercase tracking-wide cursor-grab active:cursor-grabbing touch-none select-none"
      >
        <IconGrip />
        {label}
      </div>
      <div style={{ borderColor: accentColor }}>{children}</div>
    </div>
  );
};

// Mini mockup del hero + seccion de planes de la landing (Home.jsx,
// HeroSection.jsx y PlansSection.jsx), a escala reducida, reflejando en vivo
// lo que el SysAdmin esta tipeando en el form.
const LivePreview = ({
  brandName,
  title,
  desc,
  aboutTitle,
  aboutDesc,
  plansTitle,
  plansSubtitle,
  plans,
  onPlansDragEnd,
  footerDesc,
  contactEmail,
  contactPhone,
  socials,
  businessImages,
  onImagesDragEnd,
  sectionsOrder,
  onSectionsDragEnd,
  lang,
  onToggleLang,
  primaryColor,
  primaryTextColor,
  backgroundColor,
  accentColor,
  previewTheme,
  onToggleTheme,
}) => {
  const { t } = useTranslation();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const sectionLabels = {
    images: t("Illustrative images") || "Illustrative images",
    plans: t("Plans") || "Plans",
    about: t("About us") || "About us",
  };

  const sectionContent = {
    images: businessImages && businessImages.length > 0 && (
      <div className="px-5 py-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onImagesDragEnd}>
          <SortableContext items={businessImages.map((b) => b.key)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-1.5">
              {businessImages.map(({ key, src }) => (
                <SortableImageTile key={key} id={key} src={src} accentColor={accentColor} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    ),
    plans: (
      <div className="px-5 pb-6 text-center">
        <h2 className="text-sm font-bold break-words" style={{ color: primaryTextColor }}>{plansTitle || "..."}</h2>
        <p className="text-[var(--text-secondary-alt)] text-[11px] mt-1 max-w-[220px] mx-auto break-words">
          {plansSubtitle || "..."}
        </p>
        {plans && plans.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onPlansDragEnd}>
            <SortableContext items={plans.map((p) => p.id)} strategy={rectSortingStrategy}>
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {plans.map((plan) => (
                  <SortablePlanCard
                    key={plan.id}
                    id={plan.id}
                    name={plan.name}
                    price={plan.price}
                    accentColor={accentColor}
                    primaryTextColor={primaryTextColor}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-[68px] h-10 rounded-lg bg-[var(--surface)] border" style={{ borderColor: accentColor }} />
            ))}
          </div>
        )}
      </div>
    ),
    about: (
      <div className="px-5 pb-6 text-center">
        <h2 className="text-sm font-bold break-words" style={{ color: primaryTextColor }}>{aboutTitle || "..."}</h2>
        <p className="text-[var(--text-secondary-alt)] text-[11px] mt-1 max-w-[220px] mx-auto break-words">
          {aboutDesc || "..."}
        </p>
      </div>
    ),
  };

  return (
  <div className="lg:sticky lg:top-4 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">{t("Live preview") || "Live preview"}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={previewTheme === "dark" ? "Preview in light mode" : "Preview in dark mode"}
          title={previewTheme === "dark" ? (t("Light mode") || "Light mode") : (t("Dark mode") || "Dark mode")}
          className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-sm hover:bg-[var(--surface-muted)] transition-all"
        >
          {previewTheme === "dark" ? <IconSun /> : <IconMoon />}
        </button>
        <button
          onClick={onToggleLang}
          className="bg-[var(--surface)] border border-[var(--border-subtle)] px-3 py-1 rounded-full shadow-sm hover:bg-[var(--surface-muted)] transition-all font-medium text-[11px] flex items-center gap-1.5"
        >
          <span className={lang === "es" ? "font-bold text-[var(--text-primary)]" : "text-[var(--text-faint)]"}>ES</span>
          <span className="text-[var(--border-subtle)]">|</span>
          <span className={lang === "en" ? "font-bold text-[var(--text-primary)]" : "text-[var(--text-faint)]"}>EN</span>
        </button>
      </div>
    </div>

    <p className="text-[11px] text-[var(--text-muted)] -mt-1">
      {t("reorderImagesHint") || "Drag the images, plans or section handles below to reorder them."}
    </p>

    <div className={`border rounded-2xl overflow-hidden ${previewTheme === "dark" ? "dark" : ""}`} style={{ backgroundColor, borderColor: accentColor }}>
      <div className="h-8 flex items-center gap-1.5 px-3 border-b" style={{ backgroundColor: "var(--surface-muted)", borderColor: accentColor }}>
        <span className="w-2 h-2 rounded-full bg-[var(--surface-accent)]" />
        <span className="w-2 h-2 rounded-full bg-[var(--surface-accent)]" />
        <span className="w-2 h-2 rounded-full bg-[var(--surface-accent)]" />
      </div>

      <div className="px-5 py-8 text-center">
        <div className="inline-flex items-center gap-1.5 bg-[var(--surface)]/60 border px-3 py-1 rounded-full mb-4" style={{ borderColor: accentColor }}>
          <div className="p-1 rounded-md" style={{ backgroundColor: primaryColor }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold truncate max-w-[160px]" style={{ color: primaryTextColor }}>
            {brandName || "Turnify FMC"}
          </span>
        </div>

        <h1 className="text-xl font-bold leading-tight max-w-xs mx-auto break-words" style={{ color: primaryTextColor }}>
          {title || "..."}
        </h1>

        <p className="text-[var(--text-secondary-alt)] text-xs mt-3 max-w-[220px] mx-auto break-words">
          {desc || "..."}
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onSectionsDragEnd}>
        <SortableContext items={sectionsOrder} strategy={verticalListSortingStrategy}>
          {sectionsOrder.map((key) => (
            <SortableSectionBlock key={key} id={key} label={sectionLabels[key]} accentColor={accentColor}>
              {sectionContent[key]}
            </SortableSectionBlock>
          ))}
        </SortableContext>
      </DndContext>

      <div className="text-white px-5 py-6 flex flex-col items-center text-center" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center gap-1.5 mb-2">
          <div className="bg-[var(--surface)]/10 p-1 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold">{brandName || "Turnify FMC"}</span>
        </div>
        <p className="text-[10px] text-white/50 max-w-[200px] break-words">{footerDesc || "..."}</p>

        {(contactEmail || contactPhone) && (
          <div className="flex flex-col items-center gap-1 mt-2.5 text-[10px] text-white/60">
            {contactEmail && (
              <span className="flex items-center gap-1.5 truncate">
                <IconMail width="10" height="10" /> {contactEmail}
              </span>
            )}
            {contactPhone && (
              <span className="flex items-center gap-1.5 truncate">
                <IconPhone width="10" height="10" /> {contactPhone}
              </span>
            )}
          </div>
        )}

        <div className="flex justify-center gap-1.5 mt-3">
          {SOCIAL_LINKS.filter((social) => socials?.[social.key]).map((social) => (
            <div key={social.key} className="w-6 h-6 rounded-md bg-[var(--surface)]/10 flex items-center justify-center">
              <social.Icon width="11" height="11" />
            </div>
          ))}
        </div>

        <p className="text-[9px] text-white/30 mt-4 border-t border-white/10 pt-2.5 w-full">
          © {new Date().getFullYear()} {brandName || "Turnify FMC"}
        </p>
      </div>
    </div>
  </div>
  );
};

const ColorField = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-[var(--text-tertiary)]">{label}</label>
    <div className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] px-2 py-1.5">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg cursor-pointer shrink-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm text-[var(--text-primary)] focus:outline-none bg-transparent"
      />
    </div>
  </div>
);

const mapResponseToForm = (data) => ({
  brandName: data.brandName || "",
  primaryColor: data.primaryColor || "#1a1a2e",
  backgroundColor: data.backgroundColor || "#F8F5F0",
  accentColor: data.accentColor || "#e2ddd8",
  heroTitleEs: data.heroTitleEs || "",
  heroTitleEn: data.heroTitleEn || "",
  heroDescriptionEs: data.heroDescriptionEs || "",
  heroDescriptionEn: data.heroDescriptionEn || "",
  aboutTitleEs: data.aboutTitleEs || "",
  aboutTitleEn: data.aboutTitleEn || "",
  aboutDescriptionEs: data.aboutDescriptionEs || "",
  aboutDescriptionEn: data.aboutDescriptionEn || "",
  plansTitleEs: data.plansTitleEs || "",
  plansTitleEn: data.plansTitleEn || "",
  plansSubtitleEs: data.plansSubtitleEs || "",
  plansSubtitleEn: data.plansSubtitleEn || "",
  footerDescriptionEs: data.footerDescriptionEs || "",
  footerDescriptionEn: data.footerDescriptionEn || "",
  contactEmail: data.contactEmail || "",
  contactPhone: data.contactPhone || "",
  instagramUrl: data.instagramUrl || "",
  facebookUrl: data.facebookUrl || "",
  twitterUrl: data.twitterUrl || "",
  linkedinUrl: data.linkedinUrl || "",
  imageUrlBarberia: data.imageUrlBarberia || "",
  imageUrlSpa: data.imageUrlSpa || "",
  imageUrlPeluqueria: data.imageUrlPeluqueria || "",
  imageUrlEstetica: data.imageUrlEstetica || "",
  imageUrlMasajes: data.imageUrlMasajes || "",
  imageUrlTattoo: data.imageUrlTattoo || "",
  businessTypesOrder: data.businessTypesOrder || serializeBusinessTypesOrder(DEFAULT_BUSINESS_TYPE_ORDER),
  sectionsOrder: data.sectionsOrder || serializeSectionsOrder(DEFAULT_SECTIONS_ORDER),
});

// Rubros fijos mostrados en la landing (BusinessTypesSection.jsx) — si el
// campo queda vacio, el frontend sigue usando la imagen local empaquetada.
// `fallbackImg` se usa tambien aca en el preview para mostrar algo cuando
// el campo todavia no tiene una URL cargada.
const BUSINESS_TYPE_IMAGE_FIELDS = [
  { field: "imageUrlBarberia", labelKey: "bizBarberia", fallbackImg: barberiaImg },
  { field: "imageUrlSpa", labelKey: "bizSpa", fallbackImg: spaImg },
  { field: "imageUrlPeluqueria", labelKey: "bizPeluqueria", fallbackImg: peluqueriaImg },
  { field: "imageUrlEstetica", labelKey: "bizEstetica", fallbackImg: esteticaImg },
  { field: "imageUrlMasajes", labelKey: "bizMasajes", fallbackImg: masajesImg },
  { field: "imageUrlTattoo", labelKey: "bizTattoo", fallbackImg: tattooImg },
];

const ImageUrlField = ({ label, value, onChange, fallback }) => {
  const [failed, setFailed] = useState(false);
  const src = value && !failed ? value : fallback;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[var(--text-tertiary)]">{label}</label>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-muted)] shrink-0 flex items-center justify-center">
          <img src={src} alt="" onError={() => setFailed(true)} className="w-full h-full object-cover" />
        </div>
        <input
          value={value}
          onChange={(e) => {
            setFailed(false);
            onChange(e.target.value);
          }}
          placeholder="https://..."
          className="w-full rounded-xl border border-[var(--border-subtle)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)]"
        />
      </div>
    </div>
  );
};

const SysAdminLanding = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewPlans, setPreviewPlans] = useState([]);
  const [previewLang, setPreviewLang] = useState("es");
  const [previewTheme, setPreviewTheme] = useState("light");
  const [translating, setTranslating] = useState({});
  const [form, setForm] = useState({
    brandName: "",
    primaryColor: "#1a1a2e",
    backgroundColor: "#F8F5F0",
    accentColor: "#e2ddd8",
    heroTitleEs: "",
    heroTitleEn: "",
    heroDescriptionEs: "",
    heroDescriptionEn: "",
    aboutTitleEs: "",
    aboutTitleEn: "",
    aboutDescriptionEs: "",
    aboutDescriptionEn: "",
    plansTitleEs: "",
    plansTitleEn: "",
    plansSubtitleEs: "",
    plansSubtitleEn: "",
    footerDescriptionEs: "",
    footerDescriptionEn: "",
    contactEmail: "",
    contactPhone: "",
    instagramUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    imageUrlBarberia: "",
    imageUrlSpa: "",
    imageUrlPeluqueria: "",
    imageUrlEstetica: "",
    imageUrlMasajes: "",
    imageUrlTattoo: "",
    businessTypesOrder: serializeBusinessTypesOrder(DEFAULT_BUSINESS_TYPE_ORDER),
    sectionsOrder: serializeSectionsOrder(DEFAULT_SECTIONS_ORDER),
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchLandingContent();
      if (!data) throw new Error("no content");
      setForm(mapResponseToForm(data));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await fetchLandingContent();
        if (!data) throw new Error("no content");
        if (!cancelled) setForm(mapResponseToForm(data));
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Muestra los planes reales en el preview (igual que PlansSection.jsx en
  // la landing), ya ordenados por displayOrder como los devuelve el backend.
  // Arrastrarlos aca mismo persiste el nuevo orden via reorderPlans.
  useEffect(() => {
    let cancelled = false;
    fetchPlans().then((data) => {
      if (cancelled) return;
      const list = Array.isArray(data) ? data : [];
      setPreviewPlans(list.map((p) => ({ ...p, id: p.id ?? p.Id, name: p.name ?? p.Name, price: p.price ?? p.Price })));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  // dnd-kit entrega {active, over} en onDragEnd; `active.id`/`over.id` son
  // los ids que cada SortableContext declaro (ver DEFAULT_*_ORDER).
  const handleImagesDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setForm((prev) => {
      const order = parseBusinessTypesOrder(prev.businessTypesOrder);
      const oldIndex = order.indexOf(active.id);
      const newIndex = order.indexOf(over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return { ...prev, businessTypesOrder: serializeBusinessTypesOrder(arrayMove(order, oldIndex, newIndex)) };
    });
  };

  const handleSectionsDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setForm((prev) => {
      const order = parseSectionsOrder(prev.sectionsOrder);
      const oldIndex = order.indexOf(active.id);
      const newIndex = order.indexOf(over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return { ...prev, sectionsOrder: serializeSectionsOrder(arrayMove(order, oldIndex, newIndex)) };
    });
  };

  // A diferencia de imagenes/secciones (que viven en LandingContent y se
  // guardan recien con "Save changes"), el orden de planes se persiste al
  // toque via PUT /plan/reorder — son entidades propias, no un campo mas
  // del form.
  const handlePlansDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = previewPlans.findIndex((p) => p.id === active.id);
    const newIndex = previewPlans.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(previewPlans, oldIndex, newIndex);
    setPreviewPlans(reordered);
    try {
      await reorderPlans(reordered.map((p) => p.id));
    } catch (err) {
      showToast(err.message || (t("Failed to save changes") || "Failed to save changes"));
    }
  };

  const handleTranslate = (esField, enField) => async () => {
    const text = form[esField];
    if (!text) return;
    setTranslating((prev) => ({ ...prev, [esField]: true }));
    try {
      const translated = await translateText(text);
      setForm((prev) => ({ ...prev, [enField]: translated }));
    } catch (err) {
      showToast(err.message || (t("Translation failed. Please try again.") || "Translation failed. Please try again."));
    } finally {
      setTranslating((prev) => ({ ...prev, [esField]: false }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateLandingContent(form);
      showToast(t("Landing page updated") || "Landing page updated");
    } catch (err) {
      showToast(err.message || (t("Failed to save changes") || "Failed to save changes"));
    } finally {
      setSaving(false);
    }
  };

  const previewTitle = previewLang === "en" ? form.heroTitleEn : form.heroTitleEs;
  const previewDesc = previewLang === "en" ? form.heroDescriptionEn : form.heroDescriptionEs;
  const previewAboutTitle = previewLang === "en" ? form.aboutTitleEn : form.aboutTitleEs;
  const previewAboutDesc = applyBrandName(
    previewLang === "en" ? form.aboutDescriptionEn : form.aboutDescriptionEs,
    form.brandName
  );
  const previewPlansTitle = previewLang === "en" ? form.plansTitleEn : form.plansTitleEs;
  const previewPlansSubtitle = previewLang === "en" ? form.plansSubtitleEn : form.plansSubtitleEs;
  const previewFooterDesc = previewLang === "en" ? form.footerDescriptionEn : form.footerDescriptionEs;
  // Mismo criterio que la landing real (useLandingColors): si el color sigue
  // en el valor semilla, la preview usa la variable de tema para reaccionar
  // al toggle claro/oscuro de aca abajo; si lo personalizaste, se respeta.
  const previewPrimaryColor = resolveLandingColor(form, "primaryColor");
  const previewPrimaryTextColor = resolveLandingTextColor(form, "primaryColor");
  const previewBackgroundColor = resolveLandingColor(form, "backgroundColor");
  const previewAccentColor = resolveLandingColor(form, "accentColor");
  const previewSocials = {
    instagramUrl: form.instagramUrl,
    facebookUrl: form.facebookUrl,
    twitterUrl: form.twitterUrl,
    linkedinUrl: form.linkedinUrl,
  };
  const orderedBusinessTypeFields = sortByBusinessTypesOrder(
    BUSINESS_TYPE_IMAGE_FIELDS,
    parseBusinessTypesOrder(form.businessTypesOrder),
    (f) => f.field
  );
  const previewBusinessImages = orderedBusinessTypeFields.map(({ field, fallbackImg }) => ({
    key: field,
    src: form[field] || fallbackImg,
  }));

  return (
    <div className="pt-8 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{t("Landing Page") || "Landing Page"}</h2>
        <p className="text-sm text-[var(--text-muted)]">
          {t("sysAdminLandingSubtitle") || "Edit the brand name, hero and plans section copy shown on the public landing page, in both languages."}
        </p>
      </div>

      {error ? (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-8 text-center">
          <p className="text-sm text-[var(--text-muted)] mb-4">{t("Couldn't load the landing content") || "Couldn't load the landing content"}</p>
          <button
            onClick={load}
            className="bg-[var(--brand)] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[var(--brand-hover)] transition-colors cursor-pointer"
          >
            {t("Retry") || "Retry"}
          </button>
        </div>
      ) : loading ? (
        <SkeletonForm />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-6 flex flex-col gap-5">
            <Field label={t("Brand name") || "Brand name"} value={form.brandName} onChange={handleChange("brandName")} />

            <div className="h-px bg-[var(--border-subtle)]" />
            <p className="text-xs font-semibold text-[var(--text-tertiary)]">{t("Color palette") || "Color palette"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <ColorField label={t("Primary") || "Primary"} value={form.primaryColor} onChange={handleChange("primaryColor")} />
              <ColorField label={t("Background") || "Background"} value={form.backgroundColor} onChange={handleChange("backgroundColor")} />
              <ColorField label={t("Accent") || "Accent"} value={form.accentColor} onChange={handleChange("accentColor")} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label={t("Hero title (ES)") || "Hero title (ES)"}
                value={form.heroTitleEs}
                onChange={handleChange("heroTitleEs")}
                onTranslate={handleTranslate("heroTitleEs", "heroTitleEn")}
                translating={translating.heroTitleEs}
              />
              <Field
                label={t("Hero title (EN)") || "Hero title (EN)"}
                value={form.heroTitleEn}
                onChange={handleChange("heroTitleEn")}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label={t("Hero description (ES)") || "Hero description (ES)"}
                value={form.heroDescriptionEs}
                onChange={handleChange("heroDescriptionEs")}
                onTranslate={handleTranslate("heroDescriptionEs", "heroDescriptionEn")}
                translating={translating.heroDescriptionEs}
                textarea
              />
              <Field
                label={t("Hero description (EN)") || "Hero description (EN)"}
                value={form.heroDescriptionEn}
                onChange={handleChange("heroDescriptionEn")}
                textarea
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label={t("About us title (ES)") || "About us title (ES)"}
                value={form.aboutTitleEs}
                onChange={handleChange("aboutTitleEs")}
                onTranslate={handleTranslate("aboutTitleEs", "aboutTitleEn")}
                translating={translating.aboutTitleEs}
              />
              <Field
                label={t("About us title (EN)") || "About us title (EN)"}
                value={form.aboutTitleEn}
                onChange={handleChange("aboutTitleEn")}
              />
            </div>
            <p className="text-[11px] text-[var(--text-muted)] -mt-1">
              {t("brandNamePlaceholderTip") || "Tip: use"} <code className="bg-[var(--surface-muted)] px-1 py-0.5 rounded">{"{brandName}"}</code> {t("brandNamePlaceholderTip2") || "inside the description and it will automatically be replaced with the brand name above."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label={t("About us description (ES)") || "About us description (ES)"}
                value={form.aboutDescriptionEs}
                onChange={handleChange("aboutDescriptionEs")}
                onTranslate={handleTranslate("aboutDescriptionEs", "aboutDescriptionEn")}
                translating={translating.aboutDescriptionEs}
                textarea
              />
              <Field
                label={t("About us description (EN)") || "About us description (EN)"}
                value={form.aboutDescriptionEn}
                onChange={handleChange("aboutDescriptionEn")}
                textarea
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label={t("Plans title (ES)") || "Plans title (ES)"}
                value={form.plansTitleEs}
                onChange={handleChange("plansTitleEs")}
                onTranslate={handleTranslate("plansTitleEs", "plansTitleEn")}
                translating={translating.plansTitleEs}
              />
              <Field
                label={t("Plans title (EN)") || "Plans title (EN)"}
                value={form.plansTitleEn}
                onChange={handleChange("plansTitleEn")}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label={t("Plans subtitle (ES)") || "Plans subtitle (ES)"}
                value={form.plansSubtitleEs}
                onChange={handleChange("plansSubtitleEs")}
                onTranslate={handleTranslate("plansSubtitleEs", "plansSubtitleEn")}
                translating={translating.plansSubtitleEs}
                textarea
              />
              <Field
                label={t("Plans subtitle (EN)") || "Plans subtitle (EN)"}
                value={form.plansSubtitleEn}
                onChange={handleChange("plansSubtitleEn")}
                textarea
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label={t("Footer description (ES)") || "Footer description (ES)"}
                value={form.footerDescriptionEs}
                onChange={handleChange("footerDescriptionEs")}
                onTranslate={handleTranslate("footerDescriptionEs", "footerDescriptionEn")}
                translating={translating.footerDescriptionEs}
                textarea
              />
              <Field
                label={t("Footer description (EN)") || "Footer description (EN)"}
                value={form.footerDescriptionEn}
                onChange={handleChange("footerDescriptionEn")}
                textarea
              />
            </div>

            <div className="h-px bg-[var(--border-subtle)]" />
            <div>
              <p className="text-xs font-semibold text-[var(--text-tertiary)]">{t("Illustrative images") || "Illustrative images"}</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                {t("illustrativeImagesHint") || "One per business type, shown on the public landing. Leave blank to use the default image."}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {orderedBusinessTypeFields.map(({ field, labelKey, fallbackImg }) => (
                <ImageUrlField
                  key={field}
                  label={t(labelKey) || labelKey}
                  value={form[field]}
                  onChange={handleChange(field)}
                  fallback={fallbackImg}
                />
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-muted)] -mt-2">
              {t("reorderImagesHint") || "Use the arrows on each image in the preview to reorder them."}
            </p>

            <div className="h-px bg-[var(--border-subtle)]" />
            <p className="text-xs font-semibold text-[var(--text-tertiary)]">
              {t("Contact & social links (optional — hidden on the landing if left blank)") || "Contact & social links (optional — hidden on the landing if left blank)"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={t("Contact email") || "Contact email"} value={form.contactEmail} onChange={handleChange("contactEmail")} />
              <Field label={t("Contact phone") || "Contact phone"} value={form.contactPhone} onChange={handleChange("contactPhone")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={t("Instagram URL") || "Instagram URL"} value={form.instagramUrl} onChange={handleChange("instagramUrl")} />
              <Field label={t("Facebook URL") || "Facebook URL"} value={form.facebookUrl} onChange={handleChange("facebookUrl")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={t("Twitter / X URL") || "Twitter / X URL"} value={form.twitterUrl} onChange={handleChange("twitterUrl")} />
              <Field label={t("LinkedIn URL") || "LinkedIn URL"} value={form.linkedinUrl} onChange={handleChange("linkedinUrl")} />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[var(--brand)] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-60 cursor-pointer"
              >
                {saving ? (t("Saving...") || "Saving...") : (t("Save changes") || "Save changes")}
              </button>
            </div>
          </div>

          <LivePreview
            brandName={form.brandName}
            title={previewTitle}
            desc={previewDesc}
            aboutTitle={previewAboutTitle}
            aboutDesc={previewAboutDesc}
            plansTitle={previewPlansTitle}
            plansSubtitle={previewPlansSubtitle}
            plans={previewPlans}
            onPlansDragEnd={handlePlansDragEnd}
            footerDesc={previewFooterDesc}
            contactEmail={form.contactEmail}
            contactPhone={form.contactPhone}
            primaryColor={previewPrimaryColor}
            primaryTextColor={previewPrimaryTextColor}
            backgroundColor={previewBackgroundColor}
            accentColor={previewAccentColor}
            previewTheme={previewTheme}
            onToggleTheme={() => setPreviewTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            socials={previewSocials}
            businessImages={previewBusinessImages}
            onImagesDragEnd={handleImagesDragEnd}
            sectionsOrder={parseSectionsOrder(form.sectionsOrder)}
            onSectionsDragEnd={handleSectionsDragEnd}
            lang={previewLang}
            onToggleLang={() => setPreviewLang((prev) => (prev === "es" ? "en" : "es"))}
          />
        </div>
      )}

      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[var(--brand)] text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-[fadeIn_0.2s_ease-out]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
};

export default SysAdminLanding;
