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
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
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
                className={`text-left p-4 rounded-xl border transition-all ${
                  selected
                    ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
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
