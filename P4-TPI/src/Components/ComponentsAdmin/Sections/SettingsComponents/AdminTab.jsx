import { useState, useEffect } from "react";
import { BASE_URL, authHeaders } from "../../../../services/api";
import { IconCamera, IconMail, IconPhone as IconPhoneIcon } from './SettingsIcons';

const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const AdminTab = () => {
  const [formData, setFormData] = useState({ staffName: "", staffEmail: "", staffLinkPhoto: "", staffPhone: "" });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoInputMode, setPhotoInputMode] = useState("url");
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${BASE_URL}/Staff/Business/Admin`, { headers: authHeaders });
        if (!res.ok) throw new Error("Failed to load admin data");
        const data = await res.json();
        const initial = {
          staffName: data.staffName || "",
          staffEmail: data.staffEmail || "",
          staffLinkPhoto: data.staffLinkPhoto || "",
          staffPhone: data.staffPhone || "",
        };
        setFormData(initial);
        setOriginalData(initial);
        setPhotoPreview(data.staffLinkPhoto || "");
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
    if (field === "staffLinkPhoto" && photoInputMode === "url") {
      setPhotoPreview(value);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === "string") {
        setPhotoPreview(dataUrl);
        setFormData((prev) => ({ ...prev, staffLinkPhoto: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setPhotoPreview(originalData?.staffLinkPhoto || "");
    setPhotoInputMode("url");
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/Staff/Business/Admin`, {
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
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      {/* Profile */}
      <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6">
        <h2 className="text-lg font-semibold text-[#1a1a2e]">Administrator Profile</h2>
        <p className="text-sm text-[#9a9a9a] mb-6 mt-1">Manage your personal account data.</p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {/* Photo */}
          <div className="col-span-2 grid grid-cols-[auto_1fr] gap-6 items-start pb-6 border-b border-[#e2ddd8]">
            <div className="w-20 h-20 rounded-full border border-[#e2ddd8] bg-[#fcfbf9] flex items-center justify-center overflow-hidden shrink-0">
              {photoPreview ? (
                <img src={photoPreview} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <div className="text-[#9a9a9a] flex flex-col items-center gap-1">
                  <IconCamera />
                  <span className="text-[10px] font-medium">No photo</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 min-w-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setPhotoInputMode("url"); setPhotoPreview(formData.staffLinkPhoto); }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${photoInputMode === "url" ? "bg-[#1a1a2e] text-white" : "bg-[#f0ede8] text-[#5a5a6e] hover:bg-[#e2ddd8]"}`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoInputMode("upload")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${photoInputMode === "upload" ? "bg-[#1a1a2e] text-white" : "bg-[#f0ede8] text-[#5a5a6e] hover:bg-[#e2ddd8]"}`}
                >
                  Upload
                </button>
              </div>
              {photoInputMode === "url" ? (
                <input
                  type="text"
                  value={formData.staffLinkPhoto}
                  onChange={handleChange("staffLinkPhoto")}
                  placeholder="https://example.com/photo.jpg"
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

          {/* Staff name */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">Full name</label>
            <input
              type="text"
              value={formData.staffName}
              onChange={handleChange("staffName")}
              className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a2e] mb-2">
              <IconMail /> Email
            </label>
            <input
              type="email"
              value={formData.staffEmail}
              onChange={handleChange("staffEmail")}
              className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors bg-transparent"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a2e] mb-2">
              <IconPhoneIcon /> Phone
            </label>
            <input
              type="text"
              value={formData.staffPhone}
              onChange={handleChange("staffPhone")}
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

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <h2 className="text-sm font-semibold text-red-600 mb-1">Danger Zone</h2>
        <p className="text-xs text-[#9a9a9a] mb-4">Irreversible actions for your account.</p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h4 className="text-sm font-semibold text-[#1a1a2e]">Delete account</h4>
            <p className="text-xs text-[#9a9a9a]">Permanently remove your account and all data.</p>
          </div>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTab;