// DashboardCharts.jsx — small presentational chart primitives for the SysAdmin dashboard.
const shortMonth = (month) => {
  const [y, m] = (month || "").split("-").map(Number);
  if (!y || !m) return month || "";
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short" });
};

const STATUS_COLORS = {
  pending: "#f59e0b",
  confirmed: "#15803d",
  cancelled: "#b91c1c",
};

// Generic single-series bar chart, e.g. { month, revenue }[] or { month, count }[].
export const BarChart = ({ data, valueKey, formatValue = (v) => v, emptyLabel = "No data" }) => {
  const items = data || [];
  const values = items.map((d) => Number(d[valueKey]) || 0);
  const max = Math.max(...values, 1);

  if (items.length === 0) {
    return <p className="text-xs text-[#9a9a9a] mt-5 text-center">{emptyLabel}</p>;
  }

  return (
    <div className="flex items-end gap-2 h-24 mt-5">
      {items.map((item) => {
        const value = Number(item[valueKey]) || 0;
        const barHeight = Math.max(Math.round((value / max) * 60), 3);
        return (
          <div
            key={item.month}
            className="h-full flex-1 min-w-0 flex flex-col items-center justify-end gap-1"
            title={formatValue(value)}
          >
            <div className="flex items-end w-full h-16">
              <div
                className="w-full max-w-8 mx-auto rounded-md bg-[#1a1a2e] hover:bg-[#3b82f6] transition-colors"
                style={{ height: `${barHeight}px` }}
              />
            </div>
            <span className="text-[10px] text-[#9a9a9a]">{shortMonth(item.month)}</span>
          </div>
        );
      })}
    </div>
  );
};

// Stacked bar per month for pending/confirmed/cancelled appointment counts.
export const AppointmentTrendChart = ({ data, emptyLabel = "No data" }) => {
  const items = data || [];
  const totals = items.map((d) => (Number(d.pending) || 0) + (Number(d.confirmed) || 0) + (Number(d.cancelled) || 0));
  const max = Math.max(...totals, 1);

  if (items.length === 0) {
    return <p className="text-xs text-[#9a9a9a] mt-5 text-center">{emptyLabel}</p>;
  }

  return (
    <div>
      <div className="flex items-end gap-2 h-24 mt-5">
        {items.map((item) => {
          const pending = Number(item.pending) || 0;
          const confirmed = Number(item.confirmed) || 0;
          const cancelled = Number(item.cancelled) || 0;
          const total = pending + confirmed + cancelled;
          const scale = 60 / max;
          return (
            <div
              key={item.month}
              className="h-full flex-1 min-w-0 flex flex-col items-center justify-end gap-1"
              title={`${shortMonth(item.month)}: ${pending} pending, ${confirmed} confirmed, ${cancelled} cancelled`}
            >
              <div className="flex flex-col-reverse items-center w-full h-16 justify-start">
                {total === 0 ? (
                  <div className="w-full max-w-8 mx-auto rounded-md bg-[#f0ede8]" style={{ height: "3px" }} />
                ) : (
                  <div className="w-full max-w-8 mx-auto rounded-md overflow-hidden flex flex-col-reverse" style={{ height: `${Math.max(Math.round(total * scale), 3)}px` }}>
                    {pending > 0 && <div style={{ height: `${(pending / total) * 100}%`, background: STATUS_COLORS.pending }} />}
                    {confirmed > 0 && <div style={{ height: `${(confirmed / total) * 100}%`, background: STATUS_COLORS.confirmed }} />}
                    {cancelled > 0 && <div style={{ height: `${(cancelled / total) * 100}%`, background: STATUS_COLORS.cancelled }} />}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#9a9a9a]">{shortMonth(item.month)}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4">
        {[
          { label: "Pending", color: STATUS_COLORS.pending },
          { label: "Confirmed", color: STATUS_COLORS.confirmed },
          { label: "Cancelled", color: STATUS_COLORS.cancelled },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-xs text-[#6b7280]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
