import { useState, useEffect } from "react";
import { BASE_URL, getAuthHeaders, fetchMyProfile, updateMyProfile, updateAdminBookable } from "../../../../services/api";
import { IconCamera, IconMail, IconPhone as IconPhoneIcon } from './SettingsIcons';
import { useTranslation } from "../../../../../CustomHooks/TraslateHook";

const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// /Staff/me responde con name/email/phone/linkPhoto; /Staff/Business/Admin con prefijo staff*.
const toFormData = (data) => ({
  staffName: data.name ?? data.staffName ?? "",
  staffEmail: data.email ?? data.staffEmail ?? "",
  staffLinkPhoto: data.linkPhoto ?? data.staffLinkPhoto ?? "",
  staffPhone: data.phone ?? data.staffPhone ?? "",
});

// self=true: el usuario logueado edita su propio perfil (/Staff/me), sin datos de empresa.
const AdminTab = ({ self = false }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ staffName: "", staffEmail: "", staffLinkPhoto: "", staffPhone: "" });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoInputMode, setPhotoInputMode] = useState("url");
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");
  const [isBookable, setIsBookable] = useState(true);
  const [showBookableModal, setShowBookableModal] = useState(false);
  const [togglingBookable, setTogglingBookable] = useState(false);
  const [bookableError, setBookableError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        let data;
        if (self) {
          data = await fetchMyProfile();
        } else {
          const res = await fetch(`${BASE_URL}/Staff/Business/Admin`, { headers: getAuthHeaders() });
          if (!res.ok) throw new Error("Failed to load admin data");
          data = await res.json();
        }
        const initial = toFormData(data || {});
        setFormData(initial);
        setOriginalData(initial);
        setPhotoPreview(initial.staffLinkPhoto);
        setIsBookable(data?.isBookable ?? true);
      } catch {
        // API not available yet
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [self]);

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
      if (self) {
        // El backend solo actualiza los campos que vienen con valor.
        const payload = {};
        if (formData.staffName.trim()) payload.name = formData.staffName.trim();
        if (formData.staffEmail.trim()) payload.email = formData.staffEmail.trim();
        if (formData.staffPhone.trim()) payload.phone = formData.staffPhone.trim();
        if (formData.staffLinkPhoto) payload.linkPhoto = formData.staffLinkPhoto;
        const saved = await updateMyProfile(payload);
        const updated = saved ? toFormData(saved) : { ...formData };
        setFormData(updated);
        setOriginalData(updated);
        setPhotoPreview(updated.staffLinkPhoto);
      } else {
        const res = await fetch(`${BASE_URL}/Staff/email`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Failed to save changes");
        const updated = { ...formData };
        setOriginalData(updated);
      }
    } catch {
      setError(t("Could not save changes. Please try again.") || "Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const closeBookableModal = () => {
    if (togglingBookable) return;
    setShowBookableModal(false);
    setBookableError("");
  };

  const handleConfirmBookable = async () => {
    setTogglingBookable(true);
    setBookableError("");
    try {
      const next = !isBookable;
      await updateAdminBookable(next);
      setIsBookable(next);
      setShowBookableModal(false);
    } catch {
      setBookableError(t("Could not update availability. Please try again.") || "No se pudo actualizar la disponibilidad. Intentá de nuevo.");
    } finally {
      setTogglingBookable(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      {/* Profile */}
      <div className="relative bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-6">
        {!self && (
          <button
            type="button"
            onClick={() => setShowBookableModal(true)}
            title={t("Change availability") || "Cambiar disponibilidad"}
            className={`absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition-colors ${isBookable ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"}`}
          >
            <span className={`size-1.5 rounded-full ${isBookable ? "bg-emerald-500" : "bg-amber-500"}`} />
            {isBookable ? (t("Available") || "Disponible") : (t("Not available") || "No disponible")}
          </button>
        )}
        <h2 className="text-lg font-semibold text-[var(--text-primary)] pr-32">{self ? (t("My Profile") || "My Profile") : (t("Administrator Profile") || "Administrator Profile")}</h2>
        <p className="text-sm text-[var(--text-muted)] mb-6 mt-1">{t("Manage your personal account data.") || "Manage your personal account data."}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {/* Photo */}
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-start pb-6 border-b border-[var(--border-subtle)]">
            <div className="w-20 h-20 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-faint-2)] flex items-center justify-center overflow-hidden shrink-0">
              {photoPreview ? (
                <img src={photoPreview} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <div className="text-[var(--text-muted)] flex flex-col items-center gap-1">
                  <IconCamera />
                  <span className="text-[10px] font-medium">{t("No photo") || "No photo"}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 min-w-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setPhotoInputMode("url"); setPhotoPreview(formData.staffLinkPhoto); }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${photoInputMode === "url" ? "bg-[var(--brand)] text-white" : "bg-[var(--surface-muted)] text-[var(--text-tertiary)] hover:bg-[var(--border-subtle)]"}`}
                >
                  URL
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoInputMode("upload")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${photoInputMode === "upload" ? "bg-[var(--brand)] text-white" : "bg-[var(--surface-muted)] text-[var(--text-tertiary)] hover:bg-[var(--border-subtle)]"}`}
                >
                  {t("Upload") || "Upload"}
                </button>
              </div>
              {photoInputMode === "url" ? (
                <input
                  type="text"
                  value={formData.staffLinkPhoto}
                  onChange={handleChange("staffLinkPhoto")}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full border-b border-[var(--border-subtle)] pb-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] transition-colors bg-transparent"
                />
              ) : (
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-primary)] font-medium bg-[var(--surface-muted)] hover:bg-[var(--border-subtle)] transition-colors rounded-xl px-4 py-2.5 self-start">
                  <IconUpload />
                  {t("Choose file") || "Choose file"}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Staff name */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">{t("Full name") || "Full name"}</label>
            <input
              type="text"
              value={formData.staffName}
              onChange={handleChange("staffName")}
              className="w-full border-b border-[var(--border-subtle)] pb-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] transition-colors bg-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] mb-2">
              <IconMail /> {t("Email") || "Email"}
            </label>
            <input
              type="email"
              value={formData.staffEmail}
              readOnly={!self}
              onChange={self ? handleChange("staffEmail") : undefined}
              className={`w-full border-b border-[var(--border-subtle)] pb-2 text-sm focus:outline-none bg-transparent ${self ? "text-[var(--text-primary)] focus:border-[var(--brand)] transition-colors" : "text-[var(--text-muted)] cursor-not-allowed"}`}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] mb-2">
              <IconPhoneIcon /> {t("Phone") || "Phone"}
            </label>
            <input
              type="text"
              value={formData.staffPhone}
              onChange={handleChange("staffPhone")}
              className="w-full border-b border-[var(--border-subtle)] pb-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)] transition-colors bg-transparent"
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
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${hasChanges ? "bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)]" : "bg-[var(--surface-muted)] text-[var(--text-faint)] cursor-not-allowed"}`}
          >
            {t("Cancel") || "Cancel"}
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${hasChanges && !saving ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]" : "bg-[#9a9a9a] text-[var(--text-faint)] cursor-not-allowed"}`}
          >
            {saving ? (t("Saving") || "Saving...") : (t("Save changes") || "Save changes")}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      {!self && (
      <div className="bg-[var(--surface)] rounded-2xl border border-red-200 p-6">
        <h2 className="text-sm font-semibold text-red-600 mb-1">{t("Danger Zone") || "Danger Zone"}</h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">{t("Irreversible actions for your account.") || "Irreversible actions for your account."}</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">{t("Delete account") || "Delete account"}</h4>
            <p className="text-xs text-[var(--text-muted)]">{t("Permanently remove your account and all data.") || "Permanently remove your account and all data."}</p>
          </div>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shrink-0">
            {t("Delete account") || "Delete account"}
          </button>
        </div>
      </div>
      )}

      {/* Bookable confirmation modal */}
      {showBookableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeBookableModal}>
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              {isBookable ? (t("Hide from bookings") || "Dejar de estar disponible") : (t("Show in bookings") || "Volver a estar disponible")}
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              {isBookable
                ? (t("Bookable off message") || "Esta acción cambiará tu disponibilidad: los clientes no podrán seleccionarte ni solicitar un turno con vos.")
                : (t("Bookable on message") || "Volverás a estar disponible: los clientes podrán seleccionarte y solicitar turnos con vos.")}
            </p>
            {bookableError && <p className="text-sm text-red-500 mt-3">{bookableError}</p>}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeBookableModal}
                disabled={togglingBookable}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-[var(--surface-muted)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors"
              >
                {t("Cancel") || "Cancel"}
              </button>
              <button
                onClick={handleConfirmBookable}
                disabled={togglingBookable}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${togglingBookable ? "bg-[#9a9a9a] text-[var(--text-faint)] cursor-not-allowed" : "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]"}`}
              >
                {togglingBookable ? (t("Saving") || "Saving...") : (t("Confirm") || "Confirmar")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTab;