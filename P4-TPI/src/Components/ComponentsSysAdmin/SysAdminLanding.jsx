import { useEffect, useState } from "react";
import { fetchLandingContent, updateLandingContent, applyBrandName } from "../../services/landingContentService";
import { translateText } from "../../services/translateService";
import { fetchPlans } from "../../services/api";
import { IconMail, IconPhone } from "../ComponentsHome/FooterIcons";
import { SOCIAL_LINKS } from "../ComponentsHome/socialLinksConfig";

const SkeletonForm = () => (
  <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 flex flex-col gap-4 animate-pulse">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <div className="h-3 w-24 rounded bg-[#f0ede8]" />
        <div className="h-10 w-full rounded-xl bg-[#f0ede8]" />
      </div>
    ))}
  </div>
);

const IconTranslate = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8h10M9 4v2m6 15 4-9 4 9m-7.3-2h6.6M4 21l5-11 5 11M6.1 15h5.8" />
  </svg>
);

const Field = ({ label, value, onChange, textarea, onTranslate, translating }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs font-semibold text-[#5a5a6e]">{label}</label>
      {onTranslate && (
        <button
          type="button"
          onClick={onTranslate}
          disabled={translating || !value}
          title="Auto-translate to English"
          className="flex items-center gap-1 text-[10px] font-semibold text-[#5a5a6e] hover:text-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <IconTranslate />
          {translating ? "Translating..." : "Translate → EN"}
        </button>
      )}
    </div>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-[#e2ddd8] px-3 py-2.5 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] resize-none"
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#e2ddd8] px-3 py-2.5 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e]"
      />
    )}
  </div>
);

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
  footerDesc,
  contactEmail,
  contactPhone,
  socials,
  lang,
  onToggleLang,
}) => (
  <div className="lg:sticky lg:top-4 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-[#5a5a6e] uppercase tracking-wide">Live preview</p>
      <button
        onClick={onToggleLang}
        className="bg-white border border-[#e2ddd8] px-3 py-1 rounded-full shadow-sm hover:bg-[#F0EDE8] transition-all font-medium text-[11px] flex items-center gap-1.5"
      >
        <span className={lang === "es" ? "font-bold text-[#1a1a2e]" : "text-[#b3aca3]"}>ES</span>
        <span className="text-[#e2ddd8]">|</span>
        <span className={lang === "en" ? "font-bold text-[#1a1a2e]" : "text-[#b3aca3]"}>EN</span>
      </button>
    </div>

    <div className="bg-[#F8F5F0] border border-[#e2ddd8] rounded-2xl overflow-hidden">
      <div className="h-8 bg-[#eee9e2] border-b border-[#e2ddd8] flex items-center gap-1.5 px-3">
        <span className="w-2 h-2 rounded-full bg-[#d8d2c9]" />
        <span className="w-2 h-2 rounded-full bg-[#d8d2c9]" />
        <span className="w-2 h-2 rounded-full bg-[#d8d2c9]" />
      </div>

      <div className="px-5 py-8 text-center">
        <div className="inline-flex items-center gap-1.5 bg-white/60 border border-[#e2ddd8] px-3 py-1 rounded-full mb-4">
          <div className="bg-[#1a1a2e] p-1 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-[#1a1a2e] truncate max-w-[160px]">
            {brandName || "Turnify FMC"}
          </span>
        </div>

        <h1 className="text-xl font-bold text-[#1a1a2e] leading-tight max-w-xs mx-auto break-words">
          {title || "..."}
        </h1>

        <p className="text-[#6b6b6b] text-xs mt-3 max-w-[220px] mx-auto break-words">
          {desc || "..."}
        </p>
      </div>

      <div className="px-5 py-6 border-t border-[#e2ddd8] text-center">
        <h2 className="text-sm font-bold text-[#1a1a2e] break-words">{plansTitle || "..."}</h2>
        <p className="text-[#6b6b6b] text-[11px] mt-1 max-w-[220px] mx-auto break-words">
          {plansSubtitle || "..."}
        </p>
        {plans && plans.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {plans.map((plan) => {
              const id = plan.id ?? plan.Id;
              const name = plan.name ?? plan.Name;
              const price = plan.price ?? plan.Price;
              return (
                <div
                  key={id ?? name}
                  className="w-[68px] h-14 rounded-lg bg-white border border-[#e2ddd8] flex flex-col items-center justify-center px-1"
                >
                  <span className="text-[9px] font-semibold text-[#1a1a2e] truncate w-full text-center">{name}</span>
                  <span className="text-[9px] text-[#9a9a9a]">${price}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-[68px] h-10 rounded-lg bg-white border border-[#e2ddd8]" />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-6 border-t border-[#e2ddd8] text-center">
        <h2 className="text-sm font-bold text-[#1a1a2e] break-words">{aboutTitle || "..."}</h2>
        <p className="text-[#6b6b6b] text-[11px] mt-1 max-w-[220px] mx-auto break-words">
          {aboutDesc || "..."}
        </p>
      </div>

      <div className="bg-[#1a1a2e] text-white px-5 py-6 flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="bg-white/10 p-1 rounded-md">
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
            <div key={social.key} className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
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

const mapResponseToForm = (data) => ({
  brandName: data.brandName || "",
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
});

const SysAdminLanding = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [previewPlans, setPreviewPlans] = useState([]);
  const [previewLang, setPreviewLang] = useState("es");
  const [translating, setTranslating] = useState({});
  const [form, setForm] = useState({
    brandName: "",
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

  // Solo para mostrar los planes reales en el preview (igual que
  // PlansSection.jsx en la landing) - no se edita nada aca.
  useEffect(() => {
    let cancelled = false;
    fetchPlans().then((data) => {
      if (cancelled) return;
      const list = Array.isArray(data) ? data : [];
      setPreviewPlans([...list].sort((a, b) => (a.price ?? a.Price ?? 0) - (b.price ?? b.Price ?? 0)));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleTranslate = (esField, enField) => async () => {
    const text = form[esField];
    if (!text) return;
    setTranslating((prev) => ({ ...prev, [esField]: true }));
    try {
      const translated = await translateText(text);
      setForm((prev) => ({ ...prev, [enField]: translated }));
    } catch (err) {
      showToast(err.message || "Translation failed. Please try again.");
    } finally {
      setTranslating((prev) => ({ ...prev, [esField]: false }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateLandingContent(form);
      showToast("Landing page updated");
    } catch (err) {
      showToast(err.message || "Failed to save changes");
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
  const previewSocials = {
    instagramUrl: form.instagramUrl,
    facebookUrl: form.facebookUrl,
    twitterUrl: form.twitterUrl,
    linkedinUrl: form.linkedinUrl,
  };

  return (
    <div className="pt-8 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Landing Page</h2>
        <p className="text-sm text-[#9a9a9a]">
          Edit the brand name, hero and plans section copy shown on the public landing page, in both languages.
        </p>
      </div>

      {error ? (
        <div className="bg-white rounded-2xl border border-[#e2ddd8] p-8 text-center">
          <p className="text-sm text-[#9a9a9a] mb-4">Couldn't load the landing content</p>
          <button
            onClick={load}
            className="bg-[#1a1a2e] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#2d2d44] transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <SkeletonForm />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
          <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 flex flex-col gap-5">
            <Field label="Brand name" value={form.brandName} onChange={handleChange("brandName")} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Hero title (ES)"
                value={form.heroTitleEs}
                onChange={handleChange("heroTitleEs")}
                onTranslate={handleTranslate("heroTitleEs", "heroTitleEn")}
                translating={translating.heroTitleEs}
              />
              <Field
                label="Hero title (EN)"
                value={form.heroTitleEn}
                onChange={handleChange("heroTitleEn")}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Hero description (ES)"
                value={form.heroDescriptionEs}
                onChange={handleChange("heroDescriptionEs")}
                onTranslate={handleTranslate("heroDescriptionEs", "heroDescriptionEn")}
                translating={translating.heroDescriptionEs}
                textarea
              />
              <Field
                label="Hero description (EN)"
                value={form.heroDescriptionEn}
                onChange={handleChange("heroDescriptionEn")}
                textarea
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="About us title (ES)"
                value={form.aboutTitleEs}
                onChange={handleChange("aboutTitleEs")}
                onTranslate={handleTranslate("aboutTitleEs", "aboutTitleEn")}
                translating={translating.aboutTitleEs}
              />
              <Field
                label="About us title (EN)"
                value={form.aboutTitleEn}
                onChange={handleChange("aboutTitleEn")}
              />
            </div>
            <p className="text-[11px] text-[#9a9a9a] -mt-1">
              Tip: use <code className="bg-[#f0ede8] px-1 py-0.5 rounded">{"{brandName}"}</code> inside the
              description and it will automatically be replaced with the brand name above.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="About us description (ES)"
                value={form.aboutDescriptionEs}
                onChange={handleChange("aboutDescriptionEs")}
                onTranslate={handleTranslate("aboutDescriptionEs", "aboutDescriptionEn")}
                translating={translating.aboutDescriptionEs}
                textarea
              />
              <Field
                label="About us description (EN)"
                value={form.aboutDescriptionEn}
                onChange={handleChange("aboutDescriptionEn")}
                textarea
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Plans title (ES)"
                value={form.plansTitleEs}
                onChange={handleChange("plansTitleEs")}
                onTranslate={handleTranslate("plansTitleEs", "plansTitleEn")}
                translating={translating.plansTitleEs}
              />
              <Field
                label="Plans title (EN)"
                value={form.plansTitleEn}
                onChange={handleChange("plansTitleEn")}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Plans subtitle (ES)"
                value={form.plansSubtitleEs}
                onChange={handleChange("plansSubtitleEs")}
                onTranslate={handleTranslate("plansSubtitleEs", "plansSubtitleEn")}
                translating={translating.plansSubtitleEs}
                textarea
              />
              <Field
                label="Plans subtitle (EN)"
                value={form.plansSubtitleEn}
                onChange={handleChange("plansSubtitleEn")}
                textarea
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Footer description (ES)"
                value={form.footerDescriptionEs}
                onChange={handleChange("footerDescriptionEs")}
                onTranslate={handleTranslate("footerDescriptionEs", "footerDescriptionEn")}
                translating={translating.footerDescriptionEs}
                textarea
              />
              <Field
                label="Footer description (EN)"
                value={form.footerDescriptionEn}
                onChange={handleChange("footerDescriptionEn")}
                textarea
              />
            </div>

            <div className="h-px bg-[#e2ddd8]" />
            <p className="text-xs font-semibold text-[#5a5a6e]">
              Contact &amp; social links (optional — hidden on the landing if left blank)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Contact email" value={form.contactEmail} onChange={handleChange("contactEmail")} />
              <Field label="Contact phone" value={form.contactPhone} onChange={handleChange("contactPhone")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Instagram URL" value={form.instagramUrl} onChange={handleChange("instagramUrl")} />
              <Field label="Facebook URL" value={form.facebookUrl} onChange={handleChange("facebookUrl")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Twitter / X URL" value={form.twitterUrl} onChange={handleChange("twitterUrl")} />
              <Field label="LinkedIn URL" value={form.linkedinUrl} onChange={handleChange("linkedinUrl")} />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#1a1a2e] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#2d2d44] transition-colors disabled:opacity-60 cursor-pointer"
              >
                {saving ? "Saving..." : "Save changes"}
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
            footerDesc={previewFooterDesc}
            contactEmail={form.contactEmail}
            contactPhone={form.contactPhone}
            socials={previewSocials}
            lang={previewLang}
            onToggleLang={() => setPreviewLang((prev) => (prev === "es" ? "en" : "es"))}
          />
        </div>
      )}

      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#1a1a2e] text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-[fadeIn_0.2s_ease-out]">
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
