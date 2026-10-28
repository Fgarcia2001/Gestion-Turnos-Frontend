import { useEffect, useState } from "react";
import { fetchBusinessTypes } from "../../services/businessService";
import { ModalOverlay, inputClass, labelClass } from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Shared";
import { IconX } from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Icons";
import PhoneField from "../Shared/PhoneField";
import { useTranslation } from "../../../CustomHooks/TraslateHook";

// Valores reales que espera el backend (BusinessUpdateRequest.status) — no
// traducir el value, solo la etiqueta visible (ver STATUS_LABEL_KEYS abajo).
const STATUS_OPTIONS = ["Habilitado", "Deshabilitado"];
const STATUS_LABEL_KEYS = { Habilitado: "Enabled", Deshabilitado: "Disabled" };

// Edicion completa de un negocio por parte de SysAdmin: nombre, categoria,
// url, logo, telefono y estado habilitado/deshabilitado — los mismos campos
// que BusinessUpdateRequest acepta en el backend.
const EditBusinessModal = ({ business, onClose, onSave }) => {
  const { t } = useTranslation();
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    name: business?.name || "",
    category: business?.typeBusiness || "",
    url: business?.url || "",
    logoUrl: business?.urlLogo || "",
    phone: business?.phone || "",
    isActive: business?.status || "Habilitado",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBusinessTypes().then((list) => setTypes(Array.isArray(list) ? list : []));
  }, []);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || (t("Failed to update the business. Please try again.") || "Failed to update the business. Please try again."));
      setSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between mb-5 w-full">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">{t("Edit business") || "Edit business"}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{t("Update any information for this business") || "Update any information for this business"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-muted)]"
          >
            <IconX />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>{t("Business name") || "Business name"}</label>
            <input value={form.name} onChange={handleChange("name")} className={inputClass} required />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className={labelClass}>{t("Category") || "Category"}</label>
              <select value={form.category} onChange={handleChange("category")} className={inputClass}>
                {!types.some((ty) => ty.name === form.category) && form.category && (
                  <option value={form.category}>{form.category}</option>
                )}
                {types.map((ty) => (
                  <option key={ty.id} value={ty.name}>{ty.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>{t("Status") || "Status"}</label>
              <select value={form.isActive} onChange={handleChange("isActive")} className={inputClass}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{t(STATUS_LABEL_KEYS[opt]) || opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>{t("Website slug (URL)") || "Website slug (URL)"}</label>
            <div className="flex items-center flex-1 min-w-0 border-b border-[var(--border-subtle)] focus-within:border-[var(--brand)] transition-colors">
              <span className="text-sm text-[var(--text-muted)] pb-2 whitespace-nowrap">{window.location.origin}/</span>
              <input
                value={form.url}
                onChange={handleChange("url")}
                placeholder="mi-negocio"
                className="w-full pb-2 text-sm text-[var(--text-primary)] focus:outline-none bg-transparent min-w-0"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>{t("Logo URL") || "Logo URL"}</label>
            <input value={form.logoUrl} onChange={handleChange("logoUrl")} className={inputClass} placeholder="https://example.com/logo.png" />
          </div>

          <div>
            <label className={labelClass}>{t("Phone") || "Phone"}</label>
            <PhoneField name="phone" value={form.phone} onChange={handleChange("phone")} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border-subtle)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors"
            >
              {t("Cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50"
            >
              {submitting ? (t("Saving...") || "Saving...") : (t("Save changes") || "Save changes")}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

export default EditBusinessModal;
