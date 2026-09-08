import { useState, useEffect } from "react";
import { fetchSysAdminDashboard } from "../../services/sysAdminService";
import { BarChart, AppointmentTrendChart } from "./DashboardCharts";

const money = (value) =>
  Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-2xl p-5 border border-[#e2ddd8]">
    <p className="text-sm text-[#9a9a9a] font-medium">{label}</p>
    <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{value}</p>
  </div>
);

const PLAN_DOT_COLORS = ["#2563eb", "#f59e0b", "#15803d", "#b91c1c", "#7c3aed", "#0ea5e9"];

const SysAdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchSysAdminDashboard();
      setData(res || null);
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
        const res = await fetchSysAdminDashboard();
        if (!cancelled) setData(res || null);
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

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2ddd8] p-8 text-center mt-8">
        <p className="text-sm text-[#9a9a9a] mb-4">Couldn't load the dashboard</p>
        <button
          onClick={load}
          className="bg-[#1a1a2e] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#2d2d44] transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const overview = data.overview || {};
  const subscriptions = data.subscriptions || {};
  const revenue = data.revenue || {};
  const businessGrowth = Array.isArray(data.businessGrowth) ? data.businessGrowth : [];
  const appointmentTrend = Array.isArray(data.appointmentTrend) ? data.appointmentTrend : [];
  const planDistribution = Array.isArray(data.planDistribution) ? data.planDistribution : [];
  const topBusinesses = Array.isArray(data.topBusinesses) ? data.topBusinesses : [];

  return (
    <div className="pt-8 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Dashboard</h2>
        <p className="text-sm text-[#9a9a9a]">Platform-wide overview across all businesses.</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Businesses" value={overview.totalBusinesses ?? 0} />
        <StatCard label="Active Businesses" value={overview.activeBusinesses ?? 0} />
        <StatCard label="Total Users" value={overview.totalUsers ?? 0} />
        <StatCard label="Total Appointments" value={overview.totalAppointments ?? 0} />
      </div>

      {/* Revenue & subscriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Current Month Revenue" value={`$${money(revenue.currentMonth)}`} />
        <StatCard label="Active Subscriptions" value={subscriptions.active ?? 0} />
        <StatCard label="Expired Subscriptions" value={subscriptions.expired ?? 0} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#e2ddd8]">
          <p className="text-sm font-semibold text-[#1a1a2e]">Revenue Evolution</p>
          <BarChart data={revenue.evolution} valueKey="revenue" formatValue={(v) => `$${money(v)}`} emptyLabel="No revenue data" />
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#e2ddd8]">
          <p className="text-sm font-semibold text-[#1a1a2e]">Business Growth</p>
          <BarChart data={businessGrowth} valueKey="count" emptyLabel="No business growth data" />
        </div>
      </div>

      {/* Appointment trend */}
      <div className="bg-white rounded-2xl p-5 border border-[#e2ddd8]">
        <p className="text-sm font-semibold text-[#1a1a2e]">Appointment Trend</p>
        <AppointmentTrendChart data={appointmentTrend} emptyLabel="No appointment data" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Plan distribution */}
        <div className="bg-white rounded-2xl p-5 border border-[#e2ddd8]">
          <p className="text-sm font-semibold text-[#1a1a2e] mb-4">Plan Distribution</p>
          {planDistribution.length === 0 ? (
            <p className="text-xs text-[#9a9a9a] text-center py-4">No plan data</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {planDistribution.map((plan, i) => (
                <div key={plan.planName} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PLAN_DOT_COLORS[i % PLAN_DOT_COLORS.length] }} />
                  <span className="text-xs text-[#6b7280]">{plan.planName}</span>
                  <span className="text-sm font-bold text-[#1a1a2e] ml-auto">{plan.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top businesses */}
        <div className="bg-white rounded-2xl border border-[#e2ddd8] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0ede8]">
            <p className="text-sm font-semibold text-[#1a1a2e]">Top Businesses</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[#9a9a9a] uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold">Business</th>
                <th className="px-5 py-3 font-semibold text-right">Appointments</th>
              </tr>
            </thead>
            <tbody>
              {topBusinesses.map((b) => (
                <tr key={b.businessId} className="border-t border-[#f0ede8] hover:bg-[#f9f8f6] transition-colors">
                  <td className="px-5 py-3 font-semibold text-[#1a1a2e]">{b.businessName || "—"}</td>
                  <td className="px-5 py-3 text-right font-semibold text-[#1a1a2e]">{b.appointmentCount ?? 0}</td>
                </tr>
              ))}
              {topBusinesses.length === 0 && (
                <tr className="border-t border-[#f0ede8]">
                  <td colSpan={2} className="px-5 py-8 text-center text-sm text-[#9a9a9a]">No businesses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SysAdminDashboard;
