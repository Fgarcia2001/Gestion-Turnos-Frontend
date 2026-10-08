import { useState, useEffect } from "react";
import StatusPanel from "../StatusPanel";

// Generic fetch-a-list-and-pick-one step, shared by BusinessType/Business/Branch/Service/Staff
// steps since they're all structurally identical (fetch scoped to a parent selection, render
// selectable cards, report the chosen item back up).
const SelectionStep = ({
  title,
  subtitle,
  fetchFn,
  deps = [],
  getId,
  isSelected,
  onSelect,
  renderItem,
  emptyMessage,
  errorMessage,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFn()
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) {
          setItems([]);
          setError(errorMessage);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, retryToken]);

  const retry = () => setRetryToken((n) => n + 1);

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a1a2e]">{title}</h2>
        {subtitle && <p className="text-[#6b6b6b] mt-1">{subtitle}</p>}
      </div>
      <StatusPanel
        loading={loading}
        error={error}
        isEmpty={!loading && !error && items.length === 0}
        emptyMessage={emptyMessage}
        onRetry={retry}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => {
            const selected = isSelected(item);
            return (
              <button
                key={getId(item)}
                type="button"
                onClick={() => onSelect(item)}
                className={`relative text-left p-4 rounded-2xl border-2 bg-white transition-all duration-200 ${
                  selected
                    ? "border-[#1a1a2e] shadow-md shadow-[#1a1a2e]/10"
                    : "border-[#e2ddd8] hover:border-[#b3aca3] hover:shadow-sm"
                }`}
              >
                {selected && (
                  <span className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-[#1a1a2e] text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                )}
                {renderItem(item, selected)}
              </button>
            );
          })}
        </div>
      </StatusPanel>
    </div>
  );
};

export default SelectionStep;
