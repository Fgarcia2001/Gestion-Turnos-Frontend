import { useEffect, useState } from "react";
import { fetchBugReports, updateBugReportStatus } from "../../services/bugReportService";
import { useTranslation } from "../../../CustomHooks/TraslateHook";

const STATUS_STYLES = {
  New: "bg-amber-50 text-amber-600",
  Resolved: "bg-green-50 text-green-600",
};

const TYPE_LABEL_KEYS = { Bug: "bugTypeBug", Suggestion: "bugTypeSuggestion", Other: "bugTypeOther" };

const IconChevron = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
};

const SkeletonList = () => (
  <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-6 animate-pulse flex flex-col gap-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-14 w-full rounded-xl bg-[var(--surface-muted)]" />
    ))}
  </div>
);

const BugReportRow = ({ report, t, onToggleStatus, updating }) => {
  const [open, setOpen] = useState(false);
  const isResolved = report.status === "Resolved";

  return (
    <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--surface-faint-2)] transition-colors cursor-pointer"
      >
        <span className={`text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 ${STATUS_STYLES[report.status] || STATUS_STYLES.New}`}>
          {t(report.status === "Resolved" ? "Resolved" : "New") || report.status}
        </span>
        <span className="text-xs font-semibold text-[var(--text-tertiary)] shrink-0">
          {t(TYPE_LABEL_KEYS[report.type]) || report.type}
        </span>
        <span className="text-xs font-semibold text-[var(--text-primary)] shrink-0 hidden md:inline max-w-[160px] truncate">
          {report.businessName || "SysAdmin"}
        </span>
        <span className="text-sm text-[var(--text-primary)] truncate flex-1 min-w-0">{report.description}</span>
        <span className="text-xs text-[var(--text-muted)] shrink-0 hidden sm:inline">{formatDate(report.createdAt)}</span>
        <IconChevron className={`shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-[var(--border-faint)] flex flex-col gap-2.5 bg-[var(--surface-faint-2)]">
          <div>
            <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">{t("bugDescriptionLabel") || "What happened?"}</p>
            <p className="text-sm text-[var(--text-primary)] mt-0.5 whitespace-pre-wrap">{report.description}</p>
          </div>
          {report.stepsToReproduce && (
            <div>
              <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">{t("bugStepsLabel") || "Steps to reproduce"}</p>
              <p className="text-sm text-[var(--text-primary)] mt-0.5 whitespace-pre-wrap">{report.stepsToReproduce}</p>
            </div>
          )}
          {report.businessName && (
            <div className="flex items-center gap-2.5 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2">
              {report.businessLogoUrl ? (
                <img src={report.businessLogoUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 border border-[var(--border-subtle)]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--surface-muted)] shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{report.businessName}</p>
                <p className="text-[11px] text-[var(--text-muted)] truncate">{report.businessCategory || "—"}</p>
              </div>
              {report.businessUrl && (
                <a
                  href={`${window.location.origin}/${report.businessUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto shrink-0 text-xs font-semibold text-[var(--brand)] hover:underline underline-offset-2"
                >
                  {t("View") || "View"}
                </a>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-[var(--text-muted)] mt-1">
            <p><span className="font-semibold text-[var(--text-secondary)]">{t("Reported by") || "Reported by"}:</span> {report.userName || "—"}</p>
            <p className="break-all"><span className="font-semibold text-[var(--text-secondary)]">{t("bugPageLabel") || "Page"}:</span> {report.pageUrl || "—"}</p>
            <p className="break-all"><span className="font-semibold text-[var(--text-secondary)]">{t("bugBrowserLabel") || "Browser"}:</span> {report.browser || "—"}</p>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => onToggleStatus(report)}
              disabled={updating}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-60 ${
                isResolved
                  ? "border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
                  : "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]"
              }`}
            >
              <IconCheck />
              {isResolved
                ? (t("Mark as new") || "Mark as new")
                : (t("Mark as resolved") || "Mark as resolved")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SysAdminBugReports = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchBugReports();
      setReports(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleStatus = async (report) => {
    const nextStatus = report.status === "Resolved" ? "New" : "Resolved";
    setUpdatingId(report.id);
    try {
      const updated = await updateBugReportStatus(report.id, nextStatus);
      setReports((prev) => prev.map((r) => (r.id === report.id ? updated : r)));
    } catch {
      // swallow — el usuario puede reintentar desde la fila
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = reports.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const newCount = reports.filter((r) => r.status !== "Resolved").length;

  return (
    <div className="pt-8 flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{t("Bug reports") || "Bug reports"}</h2>
          <p className="text-sm text-[var(--text-muted)]">
            {t("sysAdminBugsSubtitle") || "Reports sent by business users from the Help section."}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-[var(--surface-muted)] rounded-xl p-1">
          {[
            { id: "all", labelKey: null, label: t("All") || "All" },
            { id: "New", labelKey: "New", label: t("New") || "New" },
            { id: "Resolved", labelKey: "Resolved", label: t("Resolved") || "Resolved" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilter(opt.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filter === opt.id ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {opt.label}
              {opt.id === "New" && newCount > 0 && ` (${newCount})`}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-8 text-center">
          <p className="text-sm text-[var(--text-muted)] mb-4">{t("Couldn't load the bug reports") || "Couldn't load the bug reports"}</p>
          <button onClick={load} className="bg-[var(--brand)] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[var(--brand-hover)] transition-colors cursor-pointer">
            {t("Retry") || "Retry"}
          </button>
        </div>
      ) : loading ? (
        <SkeletonList />
      ) : filtered.length === 0 ? (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-10 text-center">
          <p className="text-sm text-[var(--text-muted)]">{t("No bug reports found.") || "No bug reports found."}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((report) => (
            <BugReportRow
              key={report.id}
              report={report}
              t={t}
              onToggleStatus={handleToggleStatus}
              updating={updatingId === report.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SysAdminBugReports;
