// Schedule.jsx — Admin day agenda (staff rows x horizontal 30-minute timeline)
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { useAuth } from "../../../../CustomHooks/AuthContext";
import { fetchBranchData, toDateParam } from "../../../services/api";
import { fetchBranchSchedule } from "../../../services/appointmentService";
import ScheduleGrid from "./ScheduleComponents/ScheduleGrid";

const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="size-8 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
  </div>
);

const EmptyCard = ({ children }) => (
  <div className="bg-white rounded-2xl border border-[#e2ddd8] py-16 text-center text-sm text-[#9a9a9a]">
    {children}
  </div>
);

const isAdmin = (role) => role === "Admin";

const Schedule = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const admin = isAdmin(user?.role);

  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(admin ? "" : user?.branchId || "");
  const [selectedDate, setSelectedDate] = useState(() => toDateParam(new Date()));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!admin) return;
    fetchBranchData().then((list) => {
      setBranches(list);
      if (list.length > 0) {
        const defaultId = list.find((b) => (b.id || b.branchId) === user?.branchId)
          ? user.branchId
          : (list[0].id || list[0].branchId);
        setSelectedBranchId((prev) => prev || defaultId);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  const loadSchedule = useCallback(() => {
    if (!selectedBranchId || !selectedDate) return;
    setLoading(true);
    setError(null);
    fetchBranchSchedule(selectedBranchId, selectedDate)
      .then(setData)
      .catch((err) => setError(err?.message || "apiError"))
      .finally(() => setLoading(false));
  }, [selectedBranchId, selectedDate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSchedule();
  }, [loadSchedule]);

  return (
    <div className="pt-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">{t("Schedule") || "Schedule"}</h1>

        <div className="flex items-center gap-3 flex-wrap">
          {admin && branches.length > 1 && (
            <select
              value={selectedBranchId || ""}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="text-sm bg-[#f9f8f6] border border-[#e2ddd8] rounded-xl px-3 py-2 text-[#1a1a2e] outline-none focus:border-[#1a1a2e] transition-colors"
            >
              {branches.map((b) => (
                <option key={b.id || b.branchId} value={b.id || b.branchId}>
                  {b.name || b.branchName}
                </option>
              ))}
            </select>
          )}

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm bg-[#f9f8f6] border border-[#e2ddd8] rounded-xl px-3 py-2 text-[#1a1a2e] outline-none focus:border-[#1a1a2e] transition-colors"
          />

          <button
            onClick={() => setSelectedDate(toDateParam(new Date()))}
            className="text-sm font-semibold bg-[#1a1a2e] text-white rounded-xl px-4 py-2 hover:bg-[#2d2d44] transition-colors"
          >
            {t("Today") || "Today"}
          </button>
        </div>
      </div>

      {loading && <Spinner />}

      {!loading && error && (
        <div className="bg-[#fee2e2] text-[#b91c1c] rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <span className="text-sm font-medium">{t("Could not load the schedule") || "Could not load the schedule."}</span>
          <button
            onClick={loadSchedule}
            className="text-sm font-semibold bg-white text-[#b91c1c] rounded-lg px-3 py-1.5 hover:bg-[#fecaca] transition-colors shrink-0"
          >
            {t("Retry") || "Retry"}
          </button>
        </div>
      )}

      {!loading && !error && data && !data.schedule && (
        <EmptyCard>{t("No schedule configured for this date") || "This branch has no schedule configured for this date."}</EmptyCard>
      )}

      {!loading && !error && data?.schedule && (!data.staff || data.staff.length === 0) && (
        <EmptyCard>{t("No staff assigned to this branch") || "No staff assigned to this branch."}</EmptyCard>
      )}

      {!loading && !error && data?.schedule && data.staff && data.staff.length > 0 && (
        <ScheduleGrid staff={data.staff} schedule={data.schedule} />
      )}

      {!loading && !error && !data && !selectedBranchId && (
        <EmptyCard>{t("Select a branch") || "Select a branch to view its schedule."}</EmptyCard>
      )}
    </div>
  );
};

export default Schedule;
