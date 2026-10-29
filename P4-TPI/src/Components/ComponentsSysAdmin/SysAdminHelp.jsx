import { useEffect, useState } from "react";
import {
  fetchHelpContent,
  updateHelpContact,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../../services/helpContentService";
import { useTranslation } from "../../../CustomHooks/TraslateHook";

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const inputCls =
  "w-full rounded-xl border border-[var(--border-subtle)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand)]";
const labelCls = "text-xs font-semibold text-[var(--text-tertiary)]";

const Field = ({ label, value, onChange, textarea }) => (
  <div className="flex flex-col gap-1.5">
    <label className={labelCls}>{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
    ) : (
      <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    )}
  </div>
);

const emptyFaqDraft = { order: 0, questionEs: "", questionEn: "", answerEs: "", answerEn: "" };

const FaqRow = ({ faq, onSaved, onDeleted, t, showError }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(faq);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const startEdit = () => {
    setDraft(faq);
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const saved = await updateFaq(faq.id, {
        order: Number(draft.order) || 0,
        questionEs: draft.questionEs,
        questionEn: draft.questionEn,
        answerEs: draft.answerEs,
        answerEn: draft.answerEn,
      });
      onSaved(saved);
      setEditing(false);
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await deleteFaq(faq.id);
      onDeleted(faq.id);
    } catch (err) {
      showError(err.message);
      setDeleting(false);
    }
  };

  if (editing) {
    return (
      <div className="border border-[var(--border-accent)] bg-[var(--surface-faint-2)] rounded-xl p-4 flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={t("Question (ES)") || "Question (ES)"} value={draft.questionEs} onChange={(v) => setDraft((p) => ({ ...p, questionEs: v }))} />
          <Field label={t("Question (EN)") || "Question (EN)"} value={draft.questionEn} onChange={(v) => setDraft((p) => ({ ...p, questionEn: v }))} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={t("Answer (ES)") || "Answer (ES)"} value={draft.answerEs} onChange={(v) => setDraft((p) => ({ ...p, answerEs: v }))} textarea />
          <Field label={t("Answer (EN)") || "Answer (EN)"} value={draft.answerEn} onChange={(v) => setDraft((p) => ({ ...p, answerEn: v }))} textarea />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24">
            <Field label={t("Order") || "Order"} value={draft.order} onChange={(v) => setDraft((p) => ({ ...p, order: v }))} />
          </div>
          <div className="flex-1" />
          <button type="button" onClick={() => setEditing(false)} className="px-3 py-2 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors">
            {t("Cancel") || "Cancel"}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] disabled:opacity-60 transition-colors"
          >
            <IconCheck />
            {saving ? (t("Saving...") || "Saving...") : (t("Save changes") || "Save changes")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[var(--border-subtle)] rounded-xl p-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{faq.questionEs}</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{faq.answerEs}</p>
        <p className="text-[11px] text-[var(--text-faint)] mt-1">EN: {faq.questionEn}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button type="button" onClick={startEdit} className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors">
          <IconEdit />
        </button>
        <button type="button" onClick={remove} disabled={deleting} className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[#b91c1c] hover:bg-[var(--surface-muted)] transition-colors disabled:opacity-50">
          <IconTrash />
        </button>
      </div>
    </div>
  );
};

const SysAdminHelp = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [contact, setContact] = useState({ whatsappNumber: "", supportEmail: "", scheduleTextEs: "", scheduleTextEn: "" });
  const [faqs, setFaqs] = useState([]);
  const [addingFaq, setAddingFaq] = useState(false);
  const [newFaq, setNewFaq] = useState(emptyFaqDraft);
  const [creatingFaq, setCreatingFaq] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  const showError = (message) => showToast(message || (t("Something went wrong. Please try again.") || "Something went wrong. Please try again."), "error");

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchHelpContent();
      if (!data) throw new Error("no content");
      setContact({
        whatsappNumber: data.whatsappNumber || "",
        supportEmail: data.supportEmail || "",
        scheduleTextEs: data.scheduleTextEs || "",
        scheduleTextEn: data.scheduleTextEn || "",
      });
      setFaqs(Array.isArray(data.faqs) ? [...data.faqs].sort((a, b) => a.order - b.order) : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveContact = async () => {
    setSaving(true);
    try {
      const saved = await updateHelpContact(contact);
      setContact({
        whatsappNumber: saved.whatsappNumber || "",
        supportEmail: saved.supportEmail || "",
        scheduleTextEs: saved.scheduleTextEs || "",
        scheduleTextEn: saved.scheduleTextEn || "",
      });
      showToast(t("Help content updated") || "Help content updated");
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFaq = async () => {
    setCreatingFaq(true);
    try {
      const saved = await createFaq({
        order: Number(newFaq.order) || faqs.length + 1,
        questionEs: newFaq.questionEs,
        questionEn: newFaq.questionEn,
        answerEs: newFaq.answerEs,
        answerEn: newFaq.answerEn,
      });
      setFaqs((prev) => [...prev, saved].sort((a, b) => a.order - b.order));
      setNewFaq(emptyFaqDraft);
      setAddingFaq(false);
      showToast(t("FAQ added") || "FAQ added");
    } catch (err) {
      showError(err.message);
    } finally {
      setCreatingFaq(false);
    }
  };

  return (
    <div className="pt-8 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{t("helpTitle") || "Help & Support"}</h2>
        <p className="text-sm text-[var(--text-muted)]">
          {t("sysAdminHelpSubtitle") || "Edit the FAQs and contact info shown in the business Help section."}
        </p>
      </div>

      {error ? (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-8 text-center">
          <p className="text-sm text-[var(--text-muted)] mb-4">{t("Couldn't load the help content") || "Couldn't load the help content"}</p>
          <button onClick={load} className="bg-[var(--brand)] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[var(--brand-hover)] transition-colors cursor-pointer">
            {t("Retry") || "Retry"}
          </button>
        </div>
      ) : loading ? (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-6 animate-pulse flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-full rounded-xl bg-[var(--surface-muted)]" />
          ))}
        </div>
      ) : (
        <>
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-6 flex flex-col gap-5">
            <p className="text-xs font-semibold text-[var(--text-tertiary)]">{t("Contact us") || "Contact us"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={t("WhatsApp number") || "WhatsApp number"} value={contact.whatsappNumber} onChange={(v) => setContact((p) => ({ ...p, whatsappNumber: v }))} />
              <Field label={t("Support email") || "Support email"} value={contact.supportEmail} onChange={(v) => setContact((p) => ({ ...p, supportEmail: v }))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label={t("Business hours (ES)") || "Business hours (ES)"} value={contact.scheduleTextEs} onChange={(v) => setContact((p) => ({ ...p, scheduleTextEs: v }))} />
              <Field label={t("Business hours (EN)") || "Business hours (EN)"} value={contact.scheduleTextEn} onChange={(v) => setContact((p) => ({ ...p, scheduleTextEn: v }))} />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveContact}
                disabled={saving}
                className="bg-[var(--brand)] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-60 cursor-pointer"
              >
                {saving ? (t("Saving...") || "Saving...") : (t("Save changes") || "Save changes")}
              </button>
            </div>
          </section>

          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[var(--text-tertiary)]">{t("faqTitle") || "Frequently asked questions"}</p>
              <button
                type="button"
                onClick={() => setAddingFaq((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-tertiary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 hover:bg-[var(--surface-muted)] transition-colors"
              >
                {addingFaq ? <IconX /> : <IconPlus />}
                {addingFaq ? (t("Cancel") || "Cancel") : (t("Add FAQ") || "Add FAQ")}
              </button>
            </div>

            {addingFaq && (
              <div className="border border-[var(--border-accent)] bg-[var(--surface-faint-2)] rounded-xl p-4 flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label={t("Question (ES)") || "Question (ES)"} value={newFaq.questionEs} onChange={(v) => setNewFaq((p) => ({ ...p, questionEs: v }))} />
                  <Field label={t("Question (EN)") || "Question (EN)"} value={newFaq.questionEn} onChange={(v) => setNewFaq((p) => ({ ...p, questionEn: v }))} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label={t("Answer (ES)") || "Answer (ES)"} value={newFaq.answerEs} onChange={(v) => setNewFaq((p) => ({ ...p, answerEs: v }))} textarea />
                  <Field label={t("Answer (EN)") || "Answer (EN)"} value={newFaq.answerEn} onChange={(v) => setNewFaq((p) => ({ ...p, answerEn: v }))} textarea />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <Field label={t("Order") || "Order"} value={newFaq.order} onChange={(v) => setNewFaq((p) => ({ ...p, order: v }))} />
                  </div>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={handleCreateFaq}
                    disabled={creatingFaq || !newFaq.questionEs || !newFaq.answerEs}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] disabled:opacity-60 transition-colors"
                  >
                    <IconCheck />
                    {creatingFaq ? (t("Creating") || "Creating...") : (t("Create") || "Create")}
                  </button>
                </div>
              </div>
            )}

            {faqs.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-6">{t("No FAQs yet") || "No FAQs yet"}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {faqs.map((faq) => (
                  <FaqRow
                    key={faq.id}
                    faq={faq}
                    t={t}
                    showError={showError}
                    onSaved={(saved) => setFaqs((prev) => prev.map((f) => (f.id === saved.id ? saved : f)).sort((a, b) => a.order - b.order))}
                    onDeleted={(id) => setFaqs((prev) => prev.filter((f) => f.id !== id))}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-[fadeIn_0.2s_ease-out] ${toast.type === "error" ? "bg-[#b91c1c]" : "bg-[var(--brand)]"}`}>
          <IconCheck />
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default SysAdminHelp;
