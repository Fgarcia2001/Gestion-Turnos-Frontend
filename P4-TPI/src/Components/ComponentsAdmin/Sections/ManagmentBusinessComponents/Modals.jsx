import { useState, useEffect } from 'react';
import { ModalOverlay, inputClass, labelClass, Avatar } from './Shared';
import { IconPhoto, IconX, IconWarning, IconClock } from './Icons';
import { fetchBranchWeeklySchedule, updateBranchWeeklySchedule } from '../../../../services/scheduleService';

// ── Role label ↔ id mapping ────────────────────────────────────────────────────
// The staff list endpoint returns rol as a text label (e.g. "Recepcionista"),
// but the create/update payload expects the numeric id used by the <select> options.
const ROLE_NAME_TO_ID = { Recepcionista: 1, Profesional: 2 };

// ── Edit Modal ────────────────────────────────────────────────────────────────
export const EditModal = ({ row, tab, branches = [], onClose, onSave }) => {
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
    return { ...row };
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const tabLabel = tab === "staff" ? "Staff" : tab === "client" ? "Client" : tab === "branch" ? "Branch" : "Service";

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-5 w-full">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a2e]">
              Edit <span className="text-[#9a9a9a] font-semibold">{tabLabel}</span>
            </h2>
            <p className="text-xs text-[#9a9a9a] mt-0.5">Update the information below</p>
          </div>
          <button onClick={onClose} className="text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors p-1.5 rounded-lg hover:bg-[#f0ede8]">
            <IconX />
          </button>
        </div>

        {/* Preview card */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-[#faf9f7] rounded-xl border border-[#f0ede8]">
          <Avatar initials={form.initials || form.staffName?.charAt(0) || form.name?.charAt(0) || "U"} color={form.color} photo={form.photo || form.staffLinkPhoto || null} />
          <div>
            <p className="font-semibold text-sm text-[#1a1a2e]">{form.name || form.staffName || "—"}</p>
            <p className="text-xs text-[#9a9a9a]">{form.email || form.staffEmail || "—"}</p>
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
                <label className={labelClass}>Staff Name</label>
                <input name="staffName" value={form.staffName || ""} onChange={handleChange} className={inputClass} required placeholder="Full name" />
              </div>
              <div>
                <label className={labelClass}>Staff Email</label>
                <input name="staffEmail" type="email" value={form.staffEmail || ""} onChange={handleChange} className={inputClass} required placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input name="password" type="password" value={form.password || ""} onChange={handleChange} className={inputClass} required minLength={6} placeholder="••••••••" autoComplete="new-password" />
              </div>
              <div>
                <label className={labelClass}>Staff Phone</label>
                <input name="staffPhone" value={form.staffPhone || ""} onChange={handleChange} className={inputClass} placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className={labelClass}>Photo URL</label>
                <div className="relative">
                  <input name="staffLinkPhoto" value={form.staffLinkPhoto || ""} onChange={handleChange} className={inputClass + " pl-9"} placeholder="https://..." />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9a9a]"><IconPhoto /></span>
                </div>
                {form.staffLinkPhoto && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={form.staffLinkPhoto} alt="preview" className="w-10 h-10 rounded-full object-cover border border-[#e2ddd8]"
                      onError={(e) => e.target.style.display = "none"} />
                    <span className="text-xs text-[#9a9a9a]">Photo preview</span>
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <select name="rol" value={form.rol || ""} onChange={handleChange} className={inputClass}>
                  <option value={1}>Recepcionista</option>
                  <option value={2}>Profesional</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Branch</label>
                <select name="branchId" value={form.branchId || ""} onChange={handleChange} className={inputClass} required>
                  <option value="" disabled>Select a branch</option>
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
                <label className={labelClass}>Name</label>
                <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} required placeholder="Full name" />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input name="email" type="email" value={form.email || ""} onChange={handleChange} className={inputClass} required placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input name="phone" value={form.phone || ""} onChange={handleChange} className={inputClass} placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className={labelClass}>Birthday</label>
                <input name="birthday" type="date" value={form.birthday || ""} onChange={handleChange} className={inputClass} />
              </div>
            </>
          )}

          {/* ── BRANCH fields ── */}
          {tab === "branch" && (
            <>
              <div>
                <label className={labelClass}>Branch Name</label>
                <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} required placeholder="Branch name" />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input name="address" value={form.address || ""} onChange={handleChange} className={inputClass} placeholder="Street address" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input name="phone" value={form.phone || ""} onChange={handleChange} className={inputClass} placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input name="city" value={form.city || ""} onChange={handleChange} className={inputClass} placeholder="City" />
              </div>
            </>
          )}

          {/* ── SERVICE fields ── */}
          {tab === "service" && (
            <>
              <div>
                <label className={labelClass}>Service Name</label>
                <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} required placeholder="Service name" />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <input name="categoria" value={form.categoria || ""} onChange={handleChange} className={inputClass} placeholder="Category" />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input name="description" value={form.description || ""} onChange={handleChange} className={inputClass} placeholder="Short description" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Duration</label>
                  <input name="duration" value={form.duration || ""} onChange={handleChange} className={inputClass} placeholder="e.g. 30 min" />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>Price</label>
                  <input name="price" value={form.price || ""} onChange={handleChange} className={inputClass} placeholder="$0.00" />
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#e2ddd8] text-sm font-semibold text-[#6b7280] hover:bg-[#f0ede8] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d44] transition-colors disabled:opacity-50">
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

// ── Create Modal ──────────────────────────────────────────────────────────────
export const CreateModal = ({ tab, branches = [], onClose, onSave }) => {
  const [form, setForm] = useState(() => (tab === "staff" ? { rol: 1 } : {}));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const tabLabel = tab === "staff" ? "Staff" : tab === "client" ? "Client" : tab === "branch" ? "Branch" : "Service";

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5 w-full">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a2e]">
              Create <span className="text-[#9a9a9a] font-semibold">{tabLabel}</span>
            </h2>
            <p className="text-xs text-[#9a9a9a] mt-0.5">Fill in the details below</p>
          </div>
          <button type="button" onClick={onClose} className="text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors p-1.5 rounded-lg hover:bg-[#f0ede8]">
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
                <label className={labelClass}>Staff Name</label>
                <input name="staffName" value={form.staffName || ""} onChange={handleChange} className={inputClass} required placeholder="Full name" />
              </div>
              <div>
                <label className={labelClass}>Staff Email</label>
                <input name="staffEmail" type="email" value={form.staffEmail || ""} onChange={handleChange} className={inputClass} required placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input name="password" type="password" value={form.password || ""} onChange={handleChange} className={inputClass} required minLength={6} placeholder="••••••••" autoComplete="new-password" />
              </div>
              <div>
                <label className={labelClass}>Staff Phone</label>
                <input name="staffPhone" value={form.staffPhone || ""} onChange={handleChange} className={inputClass} placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className={labelClass}>Photo URL</label>
                <div className="relative">
                  <input name="staffLinkPhoto" value={form.staffLinkPhoto || ""} onChange={handleChange} className={inputClass + " pl-9"} placeholder="https://..." />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9a9a]"><IconPhoto /></span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <select name="rol" value={form.rol} onChange={handleChange} className={inputClass}>
                  <option value={1}>Recepcionista</option>
                  <option value={2}>Profesional</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Branch</label>
                <select name="branchId" value={form.branchId || ""} onChange={handleChange} className={inputClass} required>
                  <option value="" disabled>Select a branch</option>
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
                <label className={labelClass}>Name</label>
                <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} required placeholder="Full name" />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input name="email" type="email" value={form.email || ""} onChange={handleChange} className={inputClass} required placeholder="email@example.com" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input name="phone" value={form.phone || ""} onChange={handleChange} className={inputClass} placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className={labelClass}>Birthday</label>
                <input name="birthday" type="date" value={form.birthday || ""} onChange={handleChange} className={inputClass} />
              </div>
            </>
          )}

          {/* ── BRANCH fields ── */}
          {tab === "branch" && (
            <>
              <div>
                <label className={labelClass}>Branch Name</label>
                <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} required placeholder="Branch name" />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input name="address" value={form.address || ""} onChange={handleChange} className={inputClass} placeholder="Street address" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input name="phone" value={form.phone || ""} onChange={handleChange} className={inputClass} placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input name="city" value={form.city || ""} onChange={handleChange} className={inputClass} placeholder="City" />
              </div>
            </>
          )}

          {/* ── SERVICE fields ── */}
          {tab === "service" && (
            <>
              <div>
                <label className={labelClass}>Service Name</label>
                <input name="name" value={form.name || ""} onChange={handleChange} className={inputClass} required placeholder="Service name" />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <input name="categoria" value={form.categoria || ""} onChange={handleChange} className={inputClass} placeholder="Category" />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input name="description" value={form.description || ""} onChange={handleChange} className={inputClass} placeholder="Short description" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={labelClass}>Duration</label>
                  <input name="duration" value={form.duration || ""} onChange={handleChange} className={inputClass} placeholder="e.g. 30 min" />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>Price</label>
                  <input name="price" value={form.price || ""} onChange={handleChange} className={inputClass} placeholder="$0.00" />
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#e2ddd8] text-sm font-semibold text-[#6b7280] hover:bg-[#f0ede8] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d44] transition-colors disabled:opacity-50">
              {submitting ? "Creating..." : "Create"}
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

export const SchedulesModal = ({ row, onClose, onSave }) => {
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
        if (active) setError("No se pudo cargar el horario actual.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [branchId]);

  const toggle = (i) =>
    setSchedules((prev) => prev.map((s, idx) => (idx === i ? { ...s, isActive: !s.isActive } : s)));

  const setField = (i, field, val) =>
    setSchedules((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));

  const handleSave = async () => {
    setError("");

    for (const s of schedules) {
      if (!s.isActive) continue;
      if (!s.startTime || !s.endTime || s.startTime >= s.endTime) {
        setError(`${s.day}: la hora de inicio debe ser anterior a la hora de fin.`);
        return;
      }
      if (!s.slotDurationMinutes || Number(s.slotDurationMinutes) <= 0) {
        setError(`${s.day}: la duración del turno debe ser mayor a 0.`);
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
      setError(err.message || "No se pudo guardar el horario.");
    } finally {
      setSaving(false);
    }
  };

  const timeInput = "border border-[#e2ddd8] rounded-lg px-2.5 py-1.5 text-sm text-[#1a1a2e] bg-[#faf9f7] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition-all";

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative" style={{ maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a2e]">
              Horarios <span className="text-[#9a9a9a] font-semibold">— {row.name}</span>
            </h2>
            <p className="text-xs text-[#9a9a9a] mt-0.5">Activá los días y definí el horario de atención</p>
          </div>
          <button onClick={onClose} className="text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors p-1.5 rounded-lg hover:bg-[#f0ede8]">
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
            <div className="size-7 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {schedules.map((s, i) => (
              <div key={s.day}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${s.isActive ? "border-[#1a1a2e]/20 bg-[#faf9f7]" : "border-[#f0ede8] bg-white opacity-60"}`}>

                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${s.isActive ? "bg-[#1a1a2e]" : "bg-[#e2ddd8]"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${s.isActive ? "translate-x-5" : "translate-x-0"}`} />
                </button>

                {/* Day name */}
                <span className="text-sm font-semibold text-[#1a1a2e] w-24 shrink-0">{s.day}</span>

                {s.isActive ? (
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <input type="time" value={s.startTime} onChange={(e) => setField(i, "startTime", e.target.value)} className={timeInput} />
                    <span className="text-xs text-[#9a9a9a] font-medium">a</span>
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
                      <span className="text-xs text-[#9a9a9a]">min</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-[#9a9a9a] italic flex-1">Cerrado</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} disabled={saving}
            className="flex-1 py-2.5 rounded-xl border border-[#e2ddd8] text-sm font-semibold text-[#6b7280] hover:bg-[#f0ede8] transition-colors disabled:opacity-50">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={loading || saving}
            className="flex-1 py-2.5 rounded-xl bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d44] transition-colors disabled:opacity-50">
            {saving ? "Guardando..." : "Guardar horario"}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
export const DeleteModal = ({ row, onClose, onConfirm }) => (
  <ModalOverlay onClose={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center">
      <button onClick={onClose}
        className="absolute top-4 right-4 text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors p-1.5 rounded-lg hover:bg-[#f0ede8]">
        <IconX />
      </button>

      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
        <IconWarning />
      </div>

      <h2 className="text-lg font-bold text-[#1a1a2e] mb-1">Delete record?</h2>
      <p className="text-sm text-[#6b7280] mb-2">You are about to permanently delete</p>
      <p className="text-sm font-semibold text-[#1a1a2e] mb-2">"{row.name || row.staffName}"</p>
      <p className="text-xs text-[#9a9a9a] mb-6">This action cannot be undone.</p>

      <div className="flex items-center gap-3 p-3 bg-[#faf9f7] rounded-xl border border-[#f0ede8] mb-6 text-left">
        <Avatar initials={row.initials || row.staffName?.charAt(0) || row.name?.charAt(0) || "U"} color={row.color} photo={row.photo || row.staffLinkPhoto || null} />
        <div>
          <p className="font-semibold text-sm text-[#1a1a2e]">{row.name || row.staffName}</p>
          <p className="text-xs text-[#9a9a9a]">{row.email || row.staffEmail}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-[#e2ddd8] text-sm font-semibold text-[#6b7280] hover:bg-[#f0ede8] transition-colors">
          Cancel
        </button>
        <button onClick={() => { onConfirm(row); onClose(); }}
          className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
          Delete
        </button>
      </div>
    </div>
  </ModalOverlay>
);
