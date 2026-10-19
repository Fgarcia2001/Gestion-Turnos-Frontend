import { useState, useEffect } from "react";
import { fetchSysAdminProfile, updateSysAdminProfile } from "../../services/sysAdminService";
import { IconCamera, IconMail, IconPhone as IconPhoneIcon } from "../ComponentsAdmin/Sections/SettingsComponents/SettingsIcons";

const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const SysAdminProfile = () => {
  const [formData, setFormData] = useState({ name: "", email: "", linkPhoto: "", phone: "" });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoInputMode, setPhotoInputMode] = useState("url");
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchSysAdminProfile();
        if (cancelled) return;
        const initial = {
          name: data.name || "",
          email: data.email || "",
          linkPhoto: data.linkPhoto || "",
          phone: data.phone || "",
        };
        setFormData(initial);
        setOriginalData(initial);
        setPhotoPreview(data.linkPhoto || "");
        // Si la foto guardada es un archivo subido (data URL, miles de
        // caracteres), arrancar en modo "Upload" en vez de "URL".
        if (initial.linkPhoto.startsWith("data:")) setPhotoInputMode("upload");
      } catch {
        // API not available yet
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasChanges = originalData && JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "linkPhoto" && photoInputMode === "url") {
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
        setFormData((prev) => ({ ...prev, linkPhoto: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setPhotoPreview(originalData?.linkPhoto || "");
    setPhotoInputMode(originalData?.linkPhoto?.startsWith("data:") ? "upload" : "url");
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateSysAdminProfile({
        name: formData.name,
        phone: formData.phone,
        linkPhoto: formData.linkPhoto,
      });
      setOriginalData({ ...formData });
    } catch (err) {
      setError(err.message || "Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-8 flex justify-center py-12">
        <div className="size-8 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="pt-8 flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Profile</h2>
        <p className="text-sm text-[#9a9a9a]">Manage your personal SysAdmin account data.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {/* Photo */}
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-start pb-6 border-b border-[#e2ddd8]">
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
                  onClick={() => { setPhotoInputMode("url"); setPhotoPreview(formData.linkPhoto); }}
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
                  value={formData.linkPhoto.startsWith("data:") ? "" : formData.linkPhoto}
                  onChange={handleChange("linkPhoto")}
                  placeholder={
                    formData.linkPhoto.startsWith("data:")
                      ? "Imagen cargada desde archivo — escribe una URL para reemplazarla"
                      : "https://example.com/photo.jpg"
                  }
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
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-[#1a1a2e] mb-2">Full name</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
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
              value={formData.email}
              readOnly
              className="w-full border-b border-[#e2ddd8] pb-2 text-sm text-[#9a9a9a] focus:outline-none bg-transparent cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a2e] mb-2">
              <IconPhoneIcon /> Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={handleChange("phone")}
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
    </div>
  );
};

export default SysAdminProfile;
