import { useState, useEffect } from "react";
import { BASE_URL, authHeaders } from "../../../../services/api";
import { IconGlobe, IconCamera } from './SettingsIcons';

const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const BusinessTab = () => {
  const [formData, setFormData] = useState({ name: "", category: "", url: "", logoUrl: "" });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoInputMode, setLogoInputMode] = useState("url");
  const [logoPreview, setLogoPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${BASE_URL}/Business/MyBusiness`, { headers: authHeaders });
        if (!res.ok) throw new Error("Failed to load business data");
        const data = await res.json();
        const initial = {
          name: data.name || "",
          category: data.category || "",
          url: data.url || "",
          logoUrl: data.logoUrl || "",
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
        headers: authHeaders,
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
    <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold text-[#1a1a2e]">Business Information</h2>
      <p className="text-sm text-[#9a9a9a] mb-6 mt-1">Edit all the data of your business profile.</p>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* Logo */}
        <div className="col-span-2 grid grid-cols-[auto_1fr] gap-6 items-start">
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

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={handleChange("category")}
            className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent"
          />
        </div>

        {/* Website */}
        <div className="col-span-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a2e] mb-2">
            <IconGlobe /> Website
          </label>
          <input
            type="text"
            value={formData.url}
            onChange={handleChange("url")}
            placeholder="https://example.com"
            className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent"
          />
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
  );
};

export default BusinessTab;