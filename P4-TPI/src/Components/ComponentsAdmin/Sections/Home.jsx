import { useState, useEffect } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { fetchDashboardSummary } from "../../../services/dashboardService";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconTrendUp = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 17L9 11L13 15L21 7" /><path d="M14 7H21V14" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const money = (value) =>
  Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const shortMonth = (month) => {
  const [y, m] = (month || "").split("-").map(Number);
  if (!y || !m) return month || "";
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short" });
};

// ── Bar chart ─────────────────────────────────────────────────────────────────
const BarChart = ({ data }) => {
  const values = (data || []).map((d) => Number(d.revenue) || 0);
  const max = Math.max(...values, 1);

  return (
    <div className="flex items-end gap-2 h-24 mt-5">
      {(data || []).map(({ month, revenue }) => {
        const value = Number(revenue) || 0;
        return (
          <div key={month} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full rounded-md bg-[#1a1a2e] hover:bg-[#3b82f6] transition-colors"
              style={{ height: `${Math.max((value / max) * 100, 3)}%` }}
            />
            <span className="text-[10px] text-[#9a9a9a]">{shortMonth(month)}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── Donut chart ───────────────────────────────────────────────────────────────
const DonutChart = ({ pending = 0, confirmed = 0, cancelled = 0 }) => {
  const total = pending + confirmed + cancelled;
  const r = 38;
  const circ = 2 * Math.PI * r;
  const seg = (value) => (total ? (value / total) * circ : 0);
  const p = seg(pending);
  const c = seg(confirmed);
  const x = seg(cancelled);

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="48" cy="48" r={r} fill="none" stroke="#e2ddd8" strokeWidth="10" />
        {p > 0 && (
          <circle cx="48" cy="48" r={r} fill="none" stroke="#f59e0b" strokeWidth="10"
            strokeDasharray={`${p} ${circ}`} strokeLinecap="round" />
        )}
        {c > 0 && (
          <circle cx="48" cy="48" r={r} fill="none" stroke="#15803d" strokeWidth="10"
            strokeDasharray={`${c} ${circ}`} strokeDashoffset={-p} strokeLinecap="round" />
        )}
        {x > 0 && (
          <circle cx="48" cy="48" r={r} fill="none" stroke="#b91c1c" strokeWidth="10"
            strokeDasharray={`${x} ${circ}`} strokeDashoffset={-(p + c)} strokeLinecap="round" />
        )}
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-lg font-bold text-[#1a1a2e]">{total}</span>
      </div>
    </div>
  );
};

// ── Main Home ─────────────────────────────────────────────────────────────────
const Home = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchDashboardSummary();
      setData(res && res.currentMonth ? res : null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetchDashboardSummary();
        if (!cancelled) setData(res && res.currentMonth ? res : null);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="size-8 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2ddd8] p-8 text-center">
        <p className="text-sm text-[#9a9a9a] mb-4">{t("Load dashboard error") || "Couldn't load the dashboard"}</p>
        <button
          onClick={load}
          className="bg-[#1a1a2e] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#2d2d44] transition-colors cursor-pointer"
        >
          {t("retry") || "Retry"}
        </button>
      </div>
    );
  }

  const currentMonth = data?.currentMonth || {};
  const series = Array.isArray(data?.monthlyRevenue) ? data.monthlyRevenue : [];
  const branches = Array.isArray(data?.branches) ? data.branches : [];
  const pending = Number(currentMonth.pending) || 0;
  const confirmed = Number(currentMonth.confirmed) || 0;
  const cancelled = Number(currentMonth.cancelled) || 0;

  const statusItems = [
    { color: "#f59e0b", label: t("Pending") || "Pending", count: pending },
    { color: "#15803d", label: t("Accepted") || "Accepted", count: confirmed },
    { color: "#b91c1c", label: t("Cancelled") || "Cancelled", count: cancelled },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Top row: 3 cards */}
      <div className="grid grid-cols-3 gap-4 py-10">

        {/* Monthly revenue */}
        <div className="bg-white rounded-2xl p-5 border border-[#e2ddd8]">
          <p className="text-sm text-[#9a9a9a] font-medium">{t("Monthly revenue") || "Monthly revenue"}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold text-[#1a1a2e]">${money(currentMonth.revenue)}</span>
            <span className="text-sm text-[#9a9a9a]">{t("Total this month") || "Total this month"}</span>
          </div>
          <BarChart data={series} />
        </div>

        {/* Estimated earnings */}
        <div className="rounded-2xl p-5 flex flex-col justify-between" style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}>
          <p className="text-xs font-semibold tracking-widest text-blue-200 uppercase">{t("Estimated earnings") || "Estimated earnings"}</p>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-4xl font-bold text-white tracking-tight">${money(currentMonth.estimatedEarnings)}</span>
            <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <IconTrendUp />
            </span>
          </div>
          <p className="text-blue-200 text-sm mt-4">{t("Accrued to today") || "Accrued to today"}</p>
        </div>

        {/* Totals by status */}
        <div className="bg-white rounded-2xl p-5 border border-[#e2ddd8]">
          <p className="text-sm text-[#9a9a9a] font-medium">{t("Appointment Statistics") || "Appointment Statistics"}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col gap-2.5">
              {statusItems.map(({ color, label, count }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-xs text-[#6b7280]">{label}</span>
                  <span className="text-sm font-bold text-[#1a1a2e] ml-auto">{count}</span>
                </div>
              ))}
            </div>
            <DonutChart pending={pending} confirmed={confirmed} cancelled={cancelled} />
          </div>
        </div>
      </div>

      {/* Branches summary */}
      <div className="bg-white rounded-2xl border border-[#e2ddd8] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0ede8]">
          <p className="text-sm font-semibold text-[#1a1a2e]">{t("Branches") || "Branches"}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[#9a9a9a] uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold">{t("Branch") || "Branch"}</th>
                <th className="px-3 py-3 font-semibold text-center">{t("Pending") || "Pending"}</th>
                <th className="px-3 py-3 font-semibold text-center">{t("Accepted") || "Accepted"}</th>
                <th className="px-3 py-3 font-semibold text-center">{t("Cancelled") || "Cancelled"}</th>
                <th className="px-5 py-3 font-semibold text-right">{t("Month revenue") || "Month revenue"}</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr key={b.branchId} className="border-t border-[#f0ede8] hover:bg-[#f9f8f6] transition-colors">
                  <td className="px-5 py-3 font-semibold text-[#1a1a2e]">{b.name || "—"}</td>
                  <td className="px-3 py-3 text-center text-[#b45309] font-semibold">{Number(b.pending) || 0}</td>
                  <td className="px-3 py-3 text-center text-[#15803d] font-semibold">{Number(b.confirmed) || 0}</td>
                  <td className="px-3 py-3 text-center text-[#b91c1c] font-semibold">{Number(b.cancelled) || 0}</td>
                  <td className="px-5 py-3 text-right font-semibold text-[#1a1a2e]">${money(b.monthRevenue)}</td>
                </tr>
              ))}
              {branches.length === 0 && (
                <tr className="border-t border-[#f0ede8]">
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#9a9a9a]">{t("No branches found for this business.") || "No branches."}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Home;