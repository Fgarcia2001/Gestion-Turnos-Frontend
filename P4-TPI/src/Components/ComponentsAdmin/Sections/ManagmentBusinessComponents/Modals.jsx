import { useState, useEffect } from 'react';
import { ModalOverlay, inputClass, labelClass, Avatar } from './Shared';
import { IconPhoto, IconX, IconWarning, IconClock } from './Icons';
import { fetchBranchWeeklySchedule, updateBranchWeeklySchedule } from '../../../../services/scheduleService';
import PhoneField from '../../../Shared/PhoneField';
import AddressAutocomplete from '../../../Shared/AddressAutocomplete';
import CityAutocomplete from '../../../Shared/CityAutocomplete';

// ── Role label ↔ id mapping ────────────────────────────────────────────────────
// The staff list endpoint returns rol as a text label (e.g. "Recepcionista"),
// but the create/update payload expects the numeric id used by the <select> options.
const ROLE_NAME_TO_ID = { Recepcionista: 1, Profesional: 2 };

// ── Demote confirmation ───────────────────────────────────────────────────────
// Se muestra al pasar un Profesional a Recepcionista: un recepcionista no atiende
// clientes, así que sus turnos pasan a pendiente de reasignar.
const DemoteConfirmModal = ({ row, t, submitting, onCancel, onConfirm }) => (
  <ModalOverlay onClose={onCancel}>
    <div className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center">
      <button type="button" onClick={onCancel}
        className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-muted)]">
        <IconX />
      </button>

      <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-500">
        <IconWarning />
      </div>

      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">{t("demoteModalTitle") || "Change role to Receptionist?"}</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        {t("demoteWarningPre") || "Receptionists can't attend clients. Any upcoming appointments assigned to"}{" "}
        <span className="font-semibold text-[var(--text-primary)]">{row.staffName}</span> {t("demoteWarningPost") || "will be marked as pending reassignment."}
      </p>

      <div className="flex items-center gap-3 p-3 bg-[var(--surface-faint)] rounded-xl border border-[var(--border-faint)] mb-6 text-left">
        <Avatar initials={row.staffName?.charAt(0) || "U"} color={row.color} photo={row.staffLinkPhoto || null} />
        <div>
          <p className="font-semibold text-sm text-[var(--text-primary)]">{row.staffName}</p>
          <p className="text-xs text-[var(--text-muted)]">{row.staffEmail}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} disabled={submitting}
          className="flex-1 py-2.5 rounded-xl border border-[var(--border-subtle)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors disabled:opacity-50">
          {t("Cancel") || "Cancel"}
        </button>
        <button type="button" onClick={onConfirm} disabled={submitting}
          className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50">
          {submitting ? (t("Saving") || "Saving...") : (t("Confirm") || "Confirm")}
        </button>
      </div>
    </div>
  </ModalOverlay>
);

// ── Status switch (staff / service) ───────────────────────────────────────────
const StatusToggle = ({ active, t, onChange }) => (
  <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-faint)] bg-[var(--surface-faint)]">
    <div>
      <p className="text-sm font-semibold text-[var(--text-primary)]">{t("Status") || "Status"}</p>
      <p className="text-xs text-[var(--text-muted)]">{active ? (t("Active") || "Active") : (t("Inactive") || "Inactive")}</p>
    </div>
    <button type="button" role="switch" aria-checked={active} onClick={() => onChange(!active)}
      className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${active ? "bg-[var(--brand)]" : "bg-[var(--border-subtle)]"}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-[var(--surface)] rounded-full shadow transition-transform ${active ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  </div>
);

// ── Edit Modal ────────────────────────────────────────────────────────────────
export const EditModal = ({ row, tab, t, branches = [], onClose, onSave }) => {
  const [form, setForm] = useState(() => {
    if (tab === "staff") {
      const matchedBranch = branches.find(
        (b) => (b.name ?? b.branchName) === row.branchName
      );
      const rol = typeof row.rol === "number" ? row.rol : (ROLE_NAME_TO_ID[row.rol] ?? "");
      return {
        ...row,
        rol,
        branchId: row.branchId ?? matchedBranch?.id ?? matchedBranch?.branchId ?? "",
      };
    }
    return {
      ...row,
      // <input type="date"> only accepts yyyy-MM-dd; the backend sends "2006-02-11T00:00:00"
      ...(row.birthday ? { birthday: String(row.birthday).slice(0, 10) } : {}),
    };
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmDemote, setConfirmDemote] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  // Profesional (2) → Recepcionista (1): sus turnos pasan a pendiente de reasignar.
  const originalRol = typeof row.rol === "number" ? row.rol : ROLE_NAME_TO_ID[row.rol];
  const demoting = tab === "staff" && originalRol === 2 && Number(form.rol) === 1;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Al elegir una sugerencia de Nominatim se completan direccion y ciudad
  // juntas (la ciudad se puede seguir editando a mano si hace falta).
  const handleAddressSelect = ({ address, city }) =>
    setForm((prev) => ({
      ...prev,
      address: address || prev.address,
      city: city || prev.city,
    }));

  const doSave = async () => {
    setError("");
    setSubmitting(true);
    try {
      await onSave({ ...form, password: tab === "staff" && changePassword ? form.password : undefined });
      onClose();
    } catch (err) {
      setConfirmDemote(false);
      setError(err.message || t("errorGeneric") || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (demoting) {
      setConfirmDemote(true);
      return;
    }
    doSave();
  };

  const tabLabel = tab === "staff" ? t("Staff") : tab === "client" ? t("Client") : tab === "branch" ? t("Branch") : t("Service");

  if (confirmDemote) {
    return (
      <DemoteConfirmModal
        row={form}
        t={t}
        submitting={submitting}
        onCancel={() => setConfirmDemote(false)}
        onConfirm={doSave}
      />
    );
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-5 w-full">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              {t("Edit") || "Edit"} <span className="text-[var(--text-muted)] font-semibold">{tabLabel}</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{t("editModalSubtitle") || "Update the information below"}</p>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-muted)]">
            <IconX />
          </button>
        </div>

        {/* Preview card */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-[var(--surface-faint)] rounded-xl border border-[var(--border-faint)]">
          <Avatar initials={form.initials || form.staffName?.charAt(0) || form.name?.charAt(0) || "U"} color={form.color} photo={form.photo || form.staffLinkPhoto || null} />
          <div>
            <p className="font-semibold text-sm text-[var(--text-primary)]">{form.name || form.staffName || "—"}</p>
            <p className="text-xs text-[var(--text-muted)]">{form.email || form.staffEmail || "—"}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* ── STAFF fields ── */}
          {tab === "staff" && (
            <>
              <div>
                <label className={labelClass}>{t("Staff Name") || "Staff Name"}</label>
                <input name="staffName" value={form.staffName || ""} onChange={handleChange} className={inputClass} required placeholder={t("Full name") || "Full name"} />
              </div>
              <div>
                <label className={labelClass}>{t("Staff Email") || "Staff Email"}</label>
                <input name="staffEmail" type="email" value={form.staffEmail || ""} onChange={handleChange} className={inputClass} required placeholder="email@example.com" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] cursor-pointer select-none">
                  <input type="checkbox" checked={changePassword}
                    onChange={(e) => { setChangePassword(e.target.checked); if (!e.target.checked) setForm((prev) => ({ ...prev, password: "" })); }}
                    className="w-4 h-4 accent-[var(--brand)]" />
                  {t("Change password") || "Change password"}
                </label>
                {changePassword && (
                  <div className="mt-2">
                    <label className={labelClass}>{t("New password") || "New password"}</label>
                    <input name="password" type="password" value={form.password || ""} onChange={handleChange} className={inputClass} required minLength={6} placeholder="••••••••" autoComplete="new-password" />
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>{t("Staff Phone") || "Staff Phone"}</label>
                <PhoneField name="staffPhone" value={form.staffPhone} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>{t("Photo URL") || "Photo URL"}</label>
                <div className="relative">
                  <input name="staffLinkPhoto" value={form.staffLinkPhoto || ""} onChange={handleChange} className={inputClass + " pl-9"} placeholder="https://..." />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><IconPhoto /></span>
                </div>
                {form.staffLinkPhoto && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={form.staffLinkPhoto} alt="preview" className="w-10 h-10 rounded-full object-cover border border-[var(--border-subtle)]"
                      onError={(e) => e.target.style.display = "none"} />
                    <span className="text-xs text-[var(--text-muted)]">{t("Photo preview") || "Photo preview"}</span>
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>{t("Role") || "Role"}</label>
                <select name="rol" value={form.rol || ""} onChange={handleChange} className={inputClass}>
                  <option value={1}>{t("Receptionist") || "Receptionist"}</option>
                  <option value={2}>{t("Professional") || "Professional"}</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>{t("Branch") || "Branch"}</label>
                <select name="branchId" value={form.branchId || ""} onChange={handleChange} className={inputClass} required>
                  <option value="" disabled>{t("selectBranchPlaceholder") || "Select a branch"}</option>
                  {branches.map((b) => (
                    <option key={b.id ?? b.branchId} value={b.id ?? b.branchId}>
                      {b.name ?? b.branchName}
                    </option>
                  ))}
                </select>
              </div>
              <StatusToggle active={form.isActive !== false} t={t} onChange={(v) => setForm((prev) => ({ ...prev, isActive: v }))} />
            </>
          )}

          {/* ── CLIENT fields ── */}
          {tab === "client" && (
            <>
              <div>
                <label className={labelClass}>{t("Name") || "Name"}</label>
                <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} required placeholder={t("Full name") || "Full name"} />
              </div>
              <div>
                <label className={labelClass}>{t("Email") || "Email"}</label>
                <input name="email" type="email" value={form.email || ""} onChange={handleChange} className={inputClass} required placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelClass}>{t("Phone") || "Phone"}</label>
                <PhoneField name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>{t("Birthday") || "Birthday"}</label>
                <input name="birthday" type="date" value={form.birthday || ""} onChange={handleChange} className={inputClass} />
              </div>
            </>
          )}

          {/* ── BRANCH fields ── */}
          {tab === "branch" && (
            <>
              <div>
                <label className={labelClass}>{t("Branch Name") || "Branch Name"}</label>
                <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} required placeholder={t("Branch Name") || "Branch name"} />
              </div>
              <div className="relative">
                <label className={labelClass}>{t("Address") || "Address"}</label>
                <AddressAutocomplete name="address" value={form.address || ""} onChange={handleChange} onSelect={handleAddressSelect} className={inputClass} placeholder={t("Address") || "Street address"} />
              </div>
              <div>
                <label className={labelClass}>{t("Phone") || "Phone"}</label>
                <PhoneField name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="relative">
                <label className={labelClass}>{t("City") || "City"}</label>
                <CityAutocomplete name="city" value={form.city || ""} onChange={handleChange} onSelect={(city) => setForm((prev) => ({ ...prev, city }))} className={inputClass} placeholder={t("City") || "City"} />
              </div>
            </>
          )}

          {/* ── SERVICE fields ── */}
          {tab === "service" && (
            <>
              <div>
                <label className={labelClass}>{t("Service Name") || "Service Name"}</label>
                <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} required placeholder={t("Service Name") || "Service name"} />
              </div>
              <div>
                <label className={labelClass}>{t("Category") || "Category"}</label>
                <input name="categoria" value={form.categoria || ""} onChange={handleChange} className={inputClass} placeholder={t("Category") || "Category"} />
              </div>
              <div>
                <label className={labelClass}>{t("Description") || "Description"}</label>
                <input name="description" value={form.description || ""} onChange={handleChange} className={inputClass} placeholder={t("shortDescriptionPlaceholder") || "Short description"} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>{t("Duration") || "Duration"}</label>
                  <input name="duration" value={form.duration || ""} onChange={handleChange} className={inputClass} placeholder="e.g. 30 min" />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>{t("Price") || "Price"}</label>
                  <input name="price" value={form.price || ""} onChange={handleChange} className={inputClass} placeholder="$0.00" />
                </div>
              </div>
              <StatusToggle active={form.isActive !== false} t={t} onChange={(v) => setForm((prev) => ({ ...prev, isActive: v }))} />
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border-subtle)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors">
              {t("Cancel") || "Cancel"}
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50">
              {submitting ? (t("Saving") || "Saving...") : (t("Save changes") || "Save changes")}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

// ── Create Modal ──────────────────────────────────────────────────────────────
export const CreateModal = ({ tab, t, branches = [], onClose, onSave }) => {
  const [form, setForm] = useState(() => (tab === "staff" ? { rol: 1 } : {}));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Al elegir una sugerencia de Nominatim se completan direccion y ciudad
  // juntas (la ciudad se puede seguir editando a mano si hace falta).
  const handleAddressSelect = ({ address, city }) =>
    setForm((prev) => ({
      ...prev,
      address: address || prev.address,
      city: city || prev.city,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || t("errorGeneric") || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const tabLabel = tab === "staff" ? t("Staff") : tab === "client" ? t("Client") : tab === "branch" ? t("Branch") : t("Service");

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5 w-full">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              {t("Create") || "Create"} <span className="text-[var(--text-muted)] font-semibold">{tabLabel}</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{t("createModalSubtitle") || "Fill in the details below"}</p>
          </div>
          <button type="button" onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-muted)]">
            <IconX />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* ── STAFF fields ── */}
          {tab === "staff" && (
            <>
              <div>
                <label className={labelClass}>{t("Staff Name") || "Staff Name"}</label>
                <input name="staffName" value={form.staffName || ""} onChange={handleChange} className={inputClass} required placeholder={t("Full name") || "Full name"} />
              </div>
              <div>
                <label className={labelClass}>{t("Staff Email") || "Staff Email"}</label>
                <input name="staffEmail" type="email" value={form.staffEmail || ""} onChange={handleChange} className={inputClass} required placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelClass}>{t("Password") || "Password"}</label>
                <input name="password" type="password" value={form.password || ""} onChange={handleChange} className={inputClass} required minLength={6} placeholder="••••••••" autoComplete="new-password" />
              </div>
              <div>
                <label className={labelClass}>{t("Staff Phone") || "Staff Phone"}</label>
                <PhoneField name="staffPhone" value={form.staffPhone} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>{t("Photo URL") || "Photo URL"}</label>
                <div className="relative">
                  <input name="staffLinkPhoto" value={form.staffLinkPhoto || ""} onChange={handleChange} className={inputClass + " pl-9"} placeholder="https://..." />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><IconPhoto /></span>
                </div>
              </div>
              <div>
                <label className={labelClass}>{t("Role") || "Role"}</label>
                <select name="rol" value={form.rol} onChange={handleChange} className={inputClass}>
                  <option value={1}>{t("Receptionist") || "Receptionist"}</option>
                  <option value={2}>{t("Professional") || "Professional"}</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>{t("Branch") || "Branch"}</label>
                <select name="branchId" value={form.branchId || ""} onChange={handleChange} className={inputClass} required>
                  <option value="" disabled>{t("selectBranchPlaceholder") || "Select a branch"}</option>
                  {branches.map((b) => (
                    <option key={b.id ?? b.branchId} value={b.id ?? b.branchId}>
                      {b.name ?? b.branchName}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* ── CLIENT fields ── */}
          {tab === "client" && (
            <>
              <div>
                <label className={labelClass}>{t("Name") || "Name"}</label>
                <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} required placeholder={t("Full name") || "Full name"} />
              </div>
              <div>
                <label className={labelClass}>{t("Email") || "Email"}</label>
                <input name="email" type="email" value={form.email || ""} onChange={handleChange} className={inputClass} required placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelClass}>{t("Phone") || "Phone"}</label>
                <PhoneField name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>{t("Birthday") || "Birthday"}</label>
                <input name="birthday" type="date" value={form.birthday || ""} onChange={handleChange} className={inputClass} />
              </div>
            </>
          )}

          {/* ── BRANCH fields ── */}
          {tab === "branch" && (
            <>
              <div>
                <label className={labelClass}>{t("Branch Name") || "Branch Name"}</label>
                <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} required placeholder={t("Branch Name") || "Branch name"} />
              </div>
              <div className="relative">
                <label className={labelClass}>{t("Address") || "Address"}</label>
                <AddressAutocomplete name="address" value={form.address || ""} onChange={handleChange} onSelect={handleAddressSelect} className={inputClass} placeholder={t("Address") || "Street address"} />
              </div>
              <div>
                <label className={labelClass}>{t("Phone") || "Phone"}</label>
                <PhoneField name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="relative">
                <label className={labelClass}>{t("City") || "City"}</label>
                <CityAutocomplete name="city" value={form.city || ""} onChange={handleChange} onSelect={(city) => setForm((prev) => ({ ...prev, city }))} className={inputClass} placeholder={t("City") || "City"} />
              </div>
            </>
          )}

          {/* ── SERVICE fields ── */}
          {tab === "service" && (
            <>
              <div>
                <label className={labelClass}>{t("Service Name") || "Service Name"}</label>
                <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} required placeholder={t("Service Name") || "Service name"} />
              </div>
              <div>
                <label className={labelClass}>{t("Category") || "Category"}</label>
                <input name="categoria" value={form.categoria || ""} onChange={handleChange} className={inputClass} placeholder={t("Category") || "Category"} />
              </div>
              <div>
                <label className={labelClass}>{t("Description") || "Description"}</label>
                <input name="description" value={form.description || ""} onChange={handleChange} className={inputClass} placeholder={t("shortDescriptionPlaceholder") || "Short description"} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>{t("Duration") || "Duration"}</label>
                  <input name="duration" value={form.duration || ""} onChange={handleChange} className={inputClass} placeholder="e.g. 30 min" />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>{t("Price") || "Price"}</label>
                  <input name="price" value={form.price || ""} onChange={handleChange} className={inputClass} placeholder="$0.00" />
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border-subtle)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors">
              {t("Cancel") || "Cancel"}
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50">
              {submitting ? (t("Creating") || "Creating...") : (t("Create") || "Create")}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

// ── Schedules Modal (branch only) ─────────────────────────────────────────────
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_SLOT_MINUTES = 30;

const emptyDay = (day) => ({ day, isActive: false, startTime: "09:00", endTime: "18:00", slotDurationMinutes: DEFAULT_SLOT_MINUTES });

// El backend devuelve/espera TimeSpan como "HH:mm:ss"; <input type="time"> solo entiende "HH:mm".
const toHm = (value) => (typeof value === "string" ? value.slice(0, 5) : value);
const toHms = (value) => (value && value.length === 5 ? `${value}:00` : value);

export const SchedulesModal = ({ row, t, onClose, onSave }) => {
  const branchId = row.id ?? row.branchId;
  const [schedules, setSchedules] = useState(DAYS.map(emptyDay));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchBranchWeeklySchedule(branchId)
      .then((data) => {
        if (!active) return;
        const byDay = new Map((Array.isArray(data) ? data : []).map((s) => [s.day, s]));
        setSchedules(
          DAYS.map((day) => {
            const existing = byDay.get(day);
            if (!existing) return emptyDay(day);
            return {
              day,
              isActive: existing.isActive,
              startTime: toHm(existing.startTime) || "09:00",
              endTime: toHm(existing.endTime) || "18:00",
              slotDurationMinutes: existing.slotDurationMinutes || DEFAULT_SLOT_MINUTES,
            };
          })
        );
      })
      .catch(() => {
        if (active) setError(t("scheduleLoadError") || "Could not load the current schedule.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [branchId, t]);

  const toggle = (i) =>
    setSchedules((prev) => prev.map((s, idx) => (idx === i ? { ...s, isActive: !s.isActive } : s)));

  const setField = (i, field, val) =>
    setSchedules((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));

  const handleSave = async () => {
    setError("");

    for (const s of schedules) {
      if (!s.isActive) continue;
      if (!s.startTime || !s.endTime || s.startTime >= s.endTime) {
        setError((t("scheduleStartBeforeEnd") || "{day}: the start time must be before the end time.").replace("{day}", t(s.day) || s.day));
        return;
      }
      if (!s.slotDurationMinutes || Number(s.slotDurationMinutes) <= 0) {
        setError((t("scheduleDurationPositive") || "{day}: the slot duration must be greater than 0.").replace("{day}", t(s.day) || s.day));
        return;
      }
    }

    setSaving(true);
    try {
      await updateBranchWeeklySchedule(
        branchId,
        schedules.map((s) => ({
          day: s.day,
          startTime: toHms(s.startTime),
          endTime: toHms(s.endTime),
          slotDurationMinutes: Number(s.slotDurationMinutes),
          isActive: s.isActive,
        }))
      );
      onSave({ ...row, schedules });
      onClose();
    } catch (err) {
      setError(err.message || t("scheduleSaveError") || "Could not save the schedule.");
    } finally {
      setSaving(false);
    }
  };

  const timeInput = "border border-[var(--border-subtle)] rounded-lg px-2.5 py-1.5 text-sm text-[var(--text-primary)] bg-[var(--surface-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-all";

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" style={{ maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              {t("Schedules") || "Schedules"} <span className="text-[var(--text-muted)] font-semibold">— {row.name}</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{t("scheduleModalSubtitle") || "Turn on the days and set the opening hours"}</p>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-muted)]">
            <IconX />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="size-7 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {schedules.map((s, i) => (
              <div key={s.day}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${s.isActive ? "border-[var(--brand)]/20 bg-[var(--surface-faint)]" : "border-[var(--border-faint)] bg-[var(--surface)] opacity-60"}`}>

                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${s.isActive ? "bg-[var(--brand)]" : "bg-[var(--border-subtle)]"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-[var(--surface)] rounded-full shadow transition-transform ${s.isActive ? "translate-x-5" : "translate-x-0"}`} />
                </button>

                {/* Day name */}
                <span className="text-sm font-semibold text-[var(--text-primary)] w-24 shrink-0">{t(s.day) || s.day}</span>

                {s.isActive ? (
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <input type="time" value={s.startTime} onChange={(e) => setField(i, "startTime", e.target.value)} className={timeInput} />
                    <span className="text-xs text-[var(--text-muted)] font-medium">{t("to") || "to"}</span>
                    <input type="time" value={s.endTime} onChange={(e) => setField(i, "endTime", e.target.value)} className={timeInput} />
                    <div className="flex items-center gap-1.5 ml-auto">
                      <IconClock />
                      <input
                        type="number"
                        min="5"
                        step="5"
                        value={s.slotDurationMinutes}
                        onChange={(e) => setField(i, "slotDurationMinutes", e.target.value)}
                        className={timeInput + " w-16"}
                      />
                      <span className="text-xs text-[var(--text-muted)]">{t("minutesAbbrev") || "min"}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-[var(--text-muted)] italic flex-1">{t("Closed") || "Closed"}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} disabled={saving}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border-subtle)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors disabled:opacity-50">
            {t("Cancel") || "Cancel"}
          </button>
          <button onClick={handleSave} disabled={loading || saving}
            className="flex-1 py-2.5 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50">
            {saving ? (t("Saving") || "Saving...") : (t("Save schedule") || "Save schedule")}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
export const DeleteModal = ({ row, t, onClose, onConfirm }) => (
  <ModalOverlay onClose={onClose}>
    <div className="bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center">
      <button onClick={onClose}
        className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--surface-muted)]">
        <IconX />
      </button>

      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
        <IconWarning />
      </div>

      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">{t("deleteRecordTitle") || "Delete record?"}</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-2">{t("deleteRecordWarning") || "You are about to permanently delete"}</p>
      <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">"{row.name || row.staffName}"</p>
      <p className="text-xs text-[var(--text-muted)] mb-6">{t("actionCannotBeUndone") || "This action cannot be undone."}</p>

      <div className="flex items-center gap-3 p-3 bg-[var(--surface-faint)] rounded-xl border border-[var(--border-faint)] mb-6 text-left">
        <Avatar initials={row.initials || row.staffName?.charAt(0) || row.name?.charAt(0) || "U"} color={row.color} photo={row.photo || row.staffLinkPhoto || null} />
        <div>
          <p className="font-semibold text-sm text-[var(--text-primary)]">{row.name || row.staffName}</p>
          <p className="text-xs text-[var(--text-muted)]">{row.email || row.staffEmail}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-[var(--border-subtle)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors">
          {t("Cancel") || "Cancel"}
        </button>
        <button onClick={() => { onConfirm(row); onClose(); }}
          className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
          {t("Delete") || "Delete"}
        </button>
      </div>
    </div>
  </ModalOverlay>
);
