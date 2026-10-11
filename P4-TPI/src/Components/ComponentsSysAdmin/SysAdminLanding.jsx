import { useEffect, useState } from "react";
import { fetchLandingContent, updateLandingContent } from "../../services/landingContentService";

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

const Field = ({ label, value, onChange, textarea }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-[#5a5a6e]">{label}</label>
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

const SysAdminLanding = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    heroTitleEs: "",
    heroTitleEn: "",
    heroDescriptionEs: "",
    heroDescriptionEn: "",
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
      setForm({
        heroTitleEs: data.heroTitleEs || "",
        heroTitleEn: data.heroTitleEn || "",
        heroDescriptionEs: data.heroDescriptionEs || "",
        heroDescriptionEn: data.heroDescriptionEn || "",
      });
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
        if (!cancelled) {
          setForm({
            heroTitleEs: data.heroTitleEs || "",
            heroTitleEn: data.heroTitleEn || "",
            heroDescriptionEs: data.heroDescriptionEs || "",
            heroDescriptionEn: data.heroDescriptionEn || "",
          });
        }
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

  const handleChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

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

  return (
    <div className="pt-8 flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Landing Page</h2>
        <p className="text-sm text-[#9a9a9a]">
          Edit the hero title and description shown on the public landing page, in both languages.
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
        <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label="Hero title (ES)"
              value={form.heroTitleEs}
              onChange={handleChange("heroTitleEs")}
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
              textarea
            />
            <Field
              label="Hero description (EN)"
              value={form.heroDescriptionEn}
              onChange={handleChange("heroDescriptionEn")}
              textarea
            />
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
