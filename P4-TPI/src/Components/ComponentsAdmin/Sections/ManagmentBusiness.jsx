import { useState, useEffect } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { 
  IconUsers, IconCalendar, IconTrendUp, IconBuilding, IconActivity, IconPlus 
} from "./ManagmentBusinessComponents/Icons";
import { StatCard } from "./ManagmentBusinessComponents/Shared";
import { 
  fetchStaffData, fetchClientData, fetchBranchData, fetchServiceData, TABS 
} from "./ManagmentBusinessComponents/Data";
import { EditModal, CreateModal, SchedulesModal, DeleteModal } from "./ManagmentBusinessComponents/Modals";
import { TableRow } from "./ManagmentBusinessComponents/TableComponents";

// ── Constants ─────────────────────────────────────────────────────────────────
const STATS_CONFIG = {
  staff: (data, t) => [
    { icon: IconUsers,    iconBg: "#eef2ff", iconColor: "#3b82f6", label: t("Total Staff"),        value: data.staff.length },
    { icon: IconCalendar, iconBg: "#dbeafe", iconColor: "#2563eb", label: t("Total Appointments"), value: 92 },
    { icon: IconTrendUp,  iconBg: "#dcfce7", iconColor: "#16a34a", label: t("Avg. Appointments"),  value: "11.5" },
  ],
  client: (data, t) => [
    { icon: IconUsers,    iconBg: "#fce7f3", iconColor: "#db2777", label: t("Total Clients"),      value: data.clients.length },
    { icon: IconCalendar, iconBg: "#dbeafe", iconColor: "#2563eb", label: t("Total Appointments"), value: 92 },
    { icon: IconTrendUp,  iconBg: "#dcfce7", iconColor: "#16a34a", label: t("Avg. Appointments"),  value: "11.5" },
  ],
  service: (data, t) => [
    { icon: IconActivity, iconBg: "#fce7f3", iconColor: "#db2777", label: t("Total Services"),     value: data.services.length },
    { icon: IconCalendar, iconBg: "#dbeafe", iconColor: "#2563eb", label: t("Total Appointments"), value: 450 },
    { icon: IconUsers,    iconBg: "#dcfce7", iconColor: "#16a34a", label: t("Active Clients"),     value: "120" },
  ],
  branch: (data, t) => [
    { icon: IconBuilding, iconBg: "#fef3c7", iconColor: "#d97706", label: t("Total Branches"),     value: data.branches.length },
    { icon: IconUsers,    iconBg: "#eef2ff", iconColor: "#3b82f6", label: t("Total Staff"),        value: data.staff.length },
    { icon: IconTrendUp,  iconBg: "#dcfce7", iconColor: "#16a34a", label: t("Avg. Appointments"),  value: "11.5" },
  ],
};

const TAB_HEADERS = {
  staff:   ["Name", "Email", "Phone", "Role", "Branch"],
  client:  ["Name", "Email", "Phone", "Birthday"],
  branch:  ["Name", "Address", "Phone", "City"],
  service: ["Name", "Category", "Description", "Duration", "Price"],
};

const ADD_LABELS = {
  staff:   "Add Staff",
  client:  "Add Client",
  branch:  "Add Branch",
  service: "Add Service",
};

// ── CSS Animations ────────────────────────────────────────────────────────────
const CSS_ANIMATIONS = `
  @keyframes fadeIn      { from { opacity: 0 } to { opacity: 1 } }
  @keyframes scaleIn     { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
  @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: translateY(0) } }
`;

// ── Sub-components ────────────────────────────────────────────────────────────
const TabSelector = ({ tabs, activeTab, onTabChange, t }) => (
  <div className="flex items-center gap-1 bg-[#f0ede8] rounded-xl p-1">
    {tabs.map(({ id, labelKey }) => (
      <button
        key={id}
        onClick={() => onTabChange(id)}
        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
          activeTab === id
            ? "bg-[#1a1a2e] text-white shadow-sm"
            : "text-[#9a9a9a] hover:text-[#1a1a2e]"
        }`}
      >
        {t(labelKey)}
      </button>
    ))}
  </div>
);

const TableHeader = ({ tab, t }) => (
  <thead>
    <tr className="border-b border-[#e2ddd8]">
      {TAB_HEADERS[tab]?.map((header) => (
        <th
          key={header}
          className="text-left text-xs font-semibold text-[#9a9a9a] uppercase tracking-wide pb-3 pr-6"
        >
          {t(header)}
        </th>
      ))}
      <th />
    </tr>
  </thead>
);

const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center gap-3">
      <div className="size-8 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
      <span className="text-sm text-[#9a9a9a]">Loading...</span>
    </div>
  </div>
);

const EmptyState = ({ tab, t }) => (
  <tr>
    <td
      colSpan={TAB_HEADERS[tab]?.length + 1}
      className="py-12 text-center text-sm text-[#9a9a9a]"
    >
      {t(`No ${tab} found`)}
    </td>
  </tr>
);

// ── Main component ────────────────────────────────────────────────────────────
const ManagmentBusiness = () => {
  const { t } = useTranslation();

  // ── State ──────────────────────────────────────────────────────────────────
  const [tab, setTab]                     = useState("staff");
  const [isLoading, setIsLoading]         = useState(true);
  const [createTarget, setCreateTarget]   = useState(false);
  const [editTarget, setEditTarget]       = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [schedulesTarget, setSchedulesTarget] = useState(null);
  const [data, setData] = useState({
    staff:    [],
    clients:  [],
    branches: [],
    services: [],
  });

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [staff, clients, branches, services] = await Promise.all([
          fetchStaffData(),
          fetchClientData(),
          fetchBranchData(),
          fetchServiceData(),
        ]);
        setData({ staff, clients, branches, services });
      } catch (e) {
        console.error("Error loading data:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────────
  const tableData = {
    staff:   data.staff,
    client:  data.clients,
    branch:  data.branches,
    service: data.services,
  }[tab] ?? [];

  const stats   = STATS_CONFIG[tab]?.(data, t) ?? [];
  const addLabel = t(ADD_LABELS[tab]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCreate = (newRecord) => {
    console.log("Created:", newRecord);
    // TODO: wire to API + update local state
  };

  const handleEdit = (updated) => {
    console.log("Saved:", updated);
    // TODO: wire to API + update local state
  };

  const handleDelete = (row) => {
    console.log("Deleted:", row);
    // TODO: wire to API + update local state
  };

  const handleSchedulesSave = (updated) => {
    console.log("Schedules saved:", updated);
    // TODO: wire to API + update local state
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS_ANIMATIONS}</style>

      <div className="flex flex-col gap-6">

        {/* Stat cards */}
        <div className="flex gap-4">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-[#e2ddd8] overflow-hidden">

          {/* Card header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-0">
            <TabSelector
              tabs={TABS}
              activeTab={tab}
              onTabChange={setTab}
              t={t}
            />
            <button
              onClick={() => setCreateTarget(true)}
              className="flex items-center gap-2 bg-[#1a1a2e] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#2d2d44] transition-colors"
            >
              <IconPlus />
              {addLabel}
            </button>
          </div>

          {/* Table */}
          <div className="px-6 pb-4 mt-4 overflow-x-auto">
            {isLoading ? (
              <LoadingState />
            ) : (
              <table className="w-full">
                <TableHeader tab={tab} t={t} />
                <tbody>
                  {tableData.length === 0 ? (
                    <EmptyState tab={tab} t={t} />
                  ) : (
                    tableData.map((row) => (
                      <TableRow
                        key={row.id ?? row.name}
                        row={row}
                        tab={tab}
                        t={t}
                        onEdit={()      => setEditTarget(row)}
                        onDelete={()    => setDeleteTarget(row)}
                        onSchedules={() => setSchedulesTarget(row)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {createTarget && (
        <CreateModal
          tab={tab}
          onClose={() => setCreateTarget(false)}
          onSave={handleCreate}
        />
      )}

      {editTarget && (
        <EditModal
          row={editTarget}
          tab={tab}
          onClose={() => setEditTarget(null)}
          onSave={handleEdit}
        />
      )}

      {schedulesTarget && (
        <SchedulesModal
          row={schedulesTarget}
          onClose={() => setSchedulesTarget(null)}
          onSave={handleSchedulesSave}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          row={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default ManagmentBusiness;