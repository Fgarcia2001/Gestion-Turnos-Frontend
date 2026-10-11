import { useEffect, useState } from "react";
import { fetchBusinessTypes } from "../../services/businessService";
import { ModalOverlay, inputClass, labelClass } from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Shared";
import { IconX } from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Icons";

const STATUS_OPTIONS = ["Habilitado", "Deshabilitado"];

// Edicion completa de un negocio por parte de SysAdmin: nombre, categoria,
// url, logo, telefono y estado habilitado/deshabilitado — los mismos campos
// que BusinessUpdateRequest acepta en el backend.
const EditBusinessModal = ({ business, onClose, onSave }) => {
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
      setError(err.message || "Failed to update the business. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between mb-5 w-full">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a2e]">Edit business</h2>
            <p className="text-xs text-[#9a9a9a] mt-0.5">Update any information for this business</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors p-1.5 rounded-lg hover:bg-[#f0ede8]"
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
            <label className={labelClass}>Business name</label>
            <input value={form.name} onChange={handleChange("name")} className={inputClass} required />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={handleChange("category")} className={inputClass}>
                {!types.some((t) => t.name === form.category) && form.category && (
                  <option value={form.category}>{form.category}</option>
                )}
                {types.map((t) => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>Status</label>
              <select value={form.isActive} onChange={handleChange("isActive")} className={inputClass}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Website slug (URL)</label>
            <input value={form.url} onChange={handleChange("url")} className={inputClass} placeholder="mi-negocio" />
          </div>

          <div>
            <label className={labelClass}>Logo URL</label>
            <input value={form.logoUrl} onChange={handleChange("logoUrl")} className={inputClass} placeholder="https://example.com/logo.png" />
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input value={form.phone} onChange={handleChange("phone")} className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#e2ddd8] text-sm font-semibold text-[#6b7280] hover:bg-[#f0ede8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d44] transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

export default EditBusinessModal;
