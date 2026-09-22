import { useState } from "react";
import { ModalOverlay, inputClass, labelClass } from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Shared";
import { IconX, IconWarning } from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Icons";

const CSS_ANIMATIONS = `
  @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
`;

const DEFAULT_FORM = {
  name: "",
  description: "",
  price: "",
  durationDays: "",
  isActive: true,
  maxStaffAllowed: -1,
  maxBranchesAllowed: -1,
  maxServicesAllowed: -1,
};

// A limit field is valid when it's -1 ("unlimited") or a non-negative integer.
const isValidLimit = (value) => {
  if (value === "" || value === null || value === undefined) return false;
  const n = Number(value);
  return Number.isInteger(n) && (n === -1 || n >= 0);
};

const validate = (form) => {
  if (!form.name || !form.name.trim()) return "Plan name is required.";
  if (form.price === "" || form.price === null || Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
    return "Price must be a non-negative number.";
  }
  if (
    form.durationDays === "" ||
    form.durationDays === null ||
    !Number.isInteger(Number(form.durationDays)) ||
    Number(form.durationDays) < 0
  ) {
    return "Duration (days) must be a non-negative whole number.";
  }
  if (!isValidLimit(form.maxStaffAllowed)) return "Max staff allowed must be -1 (unlimited) or a non-negative whole number.";
  if (!isValidLimit(form.maxBranchesAllowed)) return "Max branches allowed must be -1 (unlimited) or a non-negative whole number.";
  if (!isValidLimit(form.maxServicesAllowed)) return "Max services allowed must be -1 (unlimited) or a non-negative whole number.";
  return "";
};

const buildPayload = (form) => ({
  name: form.name.trim(),
  description: form.description?.trim() || "",
  price: Number(form.price),
  durationDays: Number(form.durationDays),
  isActive: !!form.isActive,
  maxStaffAllowed: Number(form.maxStaffAllowed),
  maxBranchesAllowed: Number(form.maxBranchesAllowed),
  maxServicesAllowed: Number(form.maxServicesAllowed),
});

// ── Create / Edit Modal ─────────────────────────────────────────────────────
export const PlanFormModal = ({ mode, plan, onClose, onSave }) => {
  const [form, setForm] = useState(() =>
    mode === "edit" && plan
      ? {
          name: plan.name ?? "",
          description: plan.description ?? "",
          price: plan.price ?? "",
          durationDays: plan.durationDays ?? "",
          isActive: plan.isActive ?? true,
          maxStaffAllowed: plan.maxStaffAllowed ?? -1,
          maxBranchesAllowed: plan.maxBranchesAllowed ?? -1,
          maxServicesAllowed: plan.maxServicesAllowed ?? -1,
        }
      : DEFAULT_FORM
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSave(buildPayload(form));
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{CSS_ANIMATIONS}</style>
      <ModalOverlay onClose={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between mb-5 w-full">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a2e]">
              {mode === "edit" ? "Edit" : "Create"} <span className="text-[#9a9a9a] font-semibold">Plan</span>
            </h2>
            <p className="text-xs text-[#9a9a9a] mt-0.5">
              {mode === "edit" ? "Update the plan details below" : "Fill in the details below"}
            </p>
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
            <label className={labelClass}>Plan Name</label>
            <input name="name" value={form.name} onChange={handleChange} className={inputClass} required placeholder="e.g. Pro" />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={inputClass}
              rows={3}
              placeholder="Short description of the plan"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className={labelClass}>Price</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
                required
                placeholder="0.00"
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Duration (days)</label>
              <input
                name="durationDays"
                type="number"
                min="0"
                step="1"
                value={form.durationDays}
                onChange={handleChange}
                className={inputClass}
                required
                placeholder="30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Max Staff</label>
              <input
                name="maxStaffAllowed"
                type="number"
                step="1"
                value={form.maxStaffAllowed}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-[11px] text-[#9a9a9a] mt-1">Use -1 for unlimited.</p>
            </div>
            <div>
              <label className={labelClass}>Max Branches</label>
              <input
                name="maxBranchesAllowed"
                type="number"
                step="1"
                value={form.maxBranchesAllowed}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-[11px] text-[#9a9a9a] mt-1">Use -1 for unlimited.</p>
            </div>
            <div>
              <label className={labelClass}>Max Services</label>
              <input
                name="maxServicesAllowed"
                type="number"
                step="1"
                value={form.maxServicesAllowed}
                onChange={handleChange}
                className={inputClass}
              />
              <p className="text-[11px] text-[#9a9a9a] mt-1">Use -1 for unlimited.</p>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              name="isActive"
              type="checkbox"
              checked={!!form.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded border-[#e2ddd8] accent-[#1a1a2e]"
            />
            <span className="text-sm font-medium text-[#1a1a2e]">Active</span>
          </label>

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
              {submitting ? "Saving..." : mode === "edit" ? "Save changes" : "Create plan"}
            </button>
          </div>
        </form>
      </div>
      </ModalOverlay>
    </>
  );
};

// ── Delete Confirmation Modal ────────────────────────────────────────────────
export const DeletePlanModal = ({ plan, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");
    setDeleting(true);
    try {
      await onConfirm(plan);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to delete plan. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <>
      <style>{CSS_ANIMATIONS}</style>
      <ModalOverlay onClose={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors p-1.5 rounded-lg hover:bg-[#f0ede8]"
          >
            <IconX />
          </button>

          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
            <IconWarning />
          </div>

          <h2 className="text-lg font-bold text-[#1a1a2e] mb-1">Delete plan?</h2>
          <p className="text-sm text-[#6b7280] mb-2">You are about to delete</p>
          <p className="text-sm font-semibold text-[#1a1a2e] mb-2">"{plan?.name}"</p>
          <p className="text-xs text-[#9a9a9a] mb-6">This action cannot be undone.</p>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-left">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-xl border border-[#e2ddd8] text-sm font-semibold text-[#6b7280] hover:bg-[#f0ede8] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </ModalOverlay>
    </>
  );
};
