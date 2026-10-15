import { useState, useEffect } from "react";
import { BASE_URL, getAuthHeaders } from "../../../../services/api";
import { fetchBusinessTypes } from "../../../../services/businessService";
import { IconGlobe, IconCamera, IconCheck } from './SettingsIcons';

const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconCopy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const IconBuildingSmall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18Z" /><path d="M6 12H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" /><path d="M18 9h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2" /><path d="M10 6h.01" /><path d="M14 6h.01" /><path d="M10 10h.01" /><path d="M14 10h.01" /><path d="M10 14h.01" /><path d="M14 14h.01" />
  </svg>
);

// Mini mockup de la pagina publica del negocio (BusinessPublicPage.jsx), a
// escala reducida, reflejando en vivo lo que el admin esta tipeando en el form.
const BusinessPreview = ({ name, category, logoUrl, color, url }) => (
  <div className="lg:sticky lg:top-4 flex flex-col gap-3">
    <p className="text-xs font-semibold text-[#5a5a6e] uppercase tracking-wide">Public page preview</p>

    <div className="bg-[#F8F5F0] border border-[#e2ddd8] rounded-2xl overflow-hidden">
      <div className="h-8 bg-[#eee9e2] border-b border-[#e2ddd8] flex items-center gap-1.5 px-3">
        <span className="w-2 h-2 rounded-full bg-[#d8d2c9]" />
        <span className="w-2 h-2 rounded-full bg-[#d8d2c9]" />
        <span className="w-2 h-2 rounded-full bg-[#d8d2c9]" />
      </div>

      <div className="text-white px-4 py-5 flex items-center gap-3" style={{ backgroundColor: color }}>
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
          {logoUrl ? <img src={logoUrl} alt={name} className="w-full h-full object-cover" /> : <IconBuildingSmall />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">{name || "Business name"}</p>
          {category && <p className="text-[10px] text-white/70 truncate">{category}</p>}
        </div>
        <span className="hidden sm:inline-block text-[10px] font-semibold bg-white px-2.5 py-1.5 rounded-lg shrink-0" style={{ color }}>
          Reservar turno
        </span>
      </div>

      <div className="p-4">
        <div className="bg-white border border-[#e2ddd8] rounded-xl p-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#1a1a2e] truncate">Sucursal</p>
            <p className="text-[10px] text-[#9a9a9a] truncate">Dirección, Ciudad</p>
          </div>
          <span className="text-[10px] font-semibold text-white px-2.5 py-1.5 rounded-lg shrink-0" style={{ backgroundColor: color }}>
            Reservar acá
          </span>
        </div>
      </div>
    </div>

    <p className="text-[11px] text-[#9a9a9a] text-center truncate">
      {window.location.origin}/{url || "..."}
    </p>
  </div>
);

const BusinessTab = () => {
  const [formData, setFormData] = useState({ name: "", category: "", url: "", logoUrl: "", color: "#1a1a2e" });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoInputMode, setLogoInputMode] = useState("url");
  const [logoPreview, setLogoPreview] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [businessTypes, setBusinessTypes] = useState([]);

  useEffect(() => {
    fetchBusinessTypes().then(setBusinessTypes);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${BASE_URL}/Business/MyBusiness`, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error("Failed to load business data");
        const data = await res.json();
        const initial = {
          name: data.name || "",
          category: data.category || "",
          url: data.url || "",
          logoUrl: data.logoUrl || "",
          color: data.color || "#1a1a2e",
        };
        setFormData(initial);
        setOriginalData(initial);
        setLogoPreview(data.logoUrl || "");
      } catch {
        // API not available yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const hasChanges = originalData && JSON.stringify(formData) !== JSON.stringify(originalData);
  const fullUrl = `${window.location.origin}/${formData.url}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API no disponible/denegada: no hay fallback, el usuario puede copiar a mano.
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "logoUrl" && logoInputMode === "url") {
      setLogoPreview(value);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === "string") {
        setLogoPreview(dataUrl);
        setFormData((prev) => ({ ...prev, logoUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setLogoPreview(originalData?.logoUrl || "");
    setLogoInputMode("url");
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/Business/MyBusiness/Update`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      const updated = { ...formData };
      setOriginalData(updated);
    } catch {
      setError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="size-8 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start max-w-5xl mx-auto">
    <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6">
      <h2 className="text-lg font-semibold text-[#1a1a2e]">Business Information</h2>
      <p className="text-sm text-[#9a9a9a] mb-6 mt-1">Edit all the data of your business profile.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {/* Logo */}
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-start">
          <div className="w-32 h-32 rounded-xl border border-[#e2ddd8] bg-[#fcfbf9] flex items-center justify-center overflow-hidden shrink-0">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="text-[#9a9a9a] flex flex-col items-center gap-1">
                <IconCamera />
                <span className="text-[10px] font-medium">No logo</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 min-w-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setLogoInputMode("url"); setLogoPreview(formData.logoUrl); }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${logoInputMode === "url" ? "bg-[#1a1a2e] text-white" : "bg-[#f0ede8] text-[#5a5a6e] hover:bg-[#e2ddd8]"}`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => setLogoInputMode("upload")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${logoInputMode === "upload" ? "bg-[#1a1a2e] text-white" : "bg-[#f0ede8] text-[#5a5a6e] hover:bg-[#e2ddd8]"}`}
              >
                Upload
              </button>
            </div>
            {logoInputMode === "url" ? (
              <input
                type="text"
                value={formData.logoUrl}
                onChange={handleChange("logoUrl")}
                placeholder="https://example.com/logo.png"
                className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent"
              />
            ) : (
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#1a1a2e] font-medium bg-[#f0ede8] hover:bg-[#e2ddd8] transition-colors rounded-xl px-4 py-2.5 self-start">
                <IconUpload />
                Choose file
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">Business name</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent"
          />
        </div>

        {/* Brand color */}
        <div>
          <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">Brand color</label>
          <div className="flex items-center gap-2 border-b border-[#e2ddd8] pb-2">
            <input
              type="color"
              value={formData.color}
              onChange={handleChange("color")}
              className="w-8 h-8 rounded-lg cursor-pointer shrink-0"
            />
            <input
              type="text"
              value={formData.color}
              onChange={handleChange("color")}
              className="w-full text-sm text-[#1a1a2e] focus:outline-none bg-transparent"
            />
          </div>
          <p className="text-[11px] text-[#9a9a9a] mt-1.5">Shown on your public page at {window.location.origin}/{formData.url || "..."}</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">Category</label>
          <select
            value={formData.category}
            onChange={handleChange("category")}
            className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent"
          >
            {!businessTypes.some((type) => type.name === formData.category) && formData.category && (
              <option value={formData.category}>{formData.category}</option>
            )}
            {businessTypes.map((type) => (
              <option key={type.id} value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>

        {/* Website */}
        <div className="col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a2e] mb-2">
            <IconGlobe /> Website
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center flex-1 min-w-0 border-b border-[#e2ddd8] focus-within:border-[#1a1a2e] transition-colors">
              <span className="text-sm text-[#9a9a9a] pb-2 whitespace-nowrap">{window.location.origin}/</span>
              <input
                type="text"
                value={formData.url}
                onChange={handleChange("url")}
                placeholder="mi-negocio"
                className="w-full pb-2 text-sm text-[#1a1a2e] focus:outline-none bg-transparent min-w-0"
              />
            </div>
            <button
              type="button"
              onClick={handleCopyUrl}
              title="Copiar URL"
              className={`flex items-center gap-1.5 shrink-0 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${copied ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#f0ede8] text-[#1a1a2e] hover:bg-[#e2ddd8]"}`}
            >
              {copied ? <IconCheck /> : <IconCopy />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-4">{error}</p>
      )}

      <div className="flex justify-end gap-3 mt-10">
        <button
          onClick={handleCancel}
          disabled={!hasChanges}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${hasChanges ? "bg-[#f0ede8] text-[#1a1a2e] hover:bg-[#e2ddd8]" : "bg-[#f0ede8] text-[#c5c0b8] cursor-not-allowed"}`}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${hasChanges && !saving ? "bg-[#1a1a2e] text-white hover:bg-[#2d2d44]" : "bg-[#9a9a9a] text-[#d5d5d5] cursor-not-allowed"}`}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>

    <BusinessPreview
      name={formData.name}
      category={formData.category}
      logoUrl={logoPreview}
      color={formData.color}
      url={formData.url}
    />
    </div>
  );
};

export default BusinessTab;