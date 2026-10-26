import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { useAuth } from "../../../../CustomHooks/AuthContext";
import {
  IconUsers, IconBuilding, IconActivity, IconPlus, IconSearch
} from "./ManagmentBusinessComponents/Icons";
import { StatCard } from "./ManagmentBusinessComponents/Shared";
import {
  fetchStaffData, fetchClientData, fetchBranchData, fetchServiceData, TABS
} from "./ManagmentBusinessComponents/Data";
import { createStaff, updateStaff, deleteStaff } from "../../../services/staffService";
import { createBranch, updateBranch, deleteBranch } from "../../../services/branchService";
import { createService, updateService, deleteService } from "../../../services/servicesService";
import { EditModal, CreateModal, SchedulesModal, DeleteModal } from "./ManagmentBusinessComponents/Modals";
import { TableRow } from "./ManagmentBusinessComponents/TableComponents";

// ── Constants ─────────────────────────────────────────────────────────────────
// Resumen fijo de totales por entidad (no depende del tab activo).
const buildSummary = (data, t) => [
  { key: "staff", icon: IconUsers, iconBg: "#eef2ff", iconColor: "#3b82f6", label: t("Staff"), value: data.staff.length },
  { key: "client", icon: IconUsers, iconBg: "#fce7f3", iconColor: "#db2777", label: t("Clients"), value: data.clients.length },
  { key: "service", icon: IconActivity, iconBg: "#dcfce7", iconColor: "#16a34a", label: t("Services"), value: data.services.length },
  { key: "branch", icon: IconBuilding, iconBg: "#fef3c7", iconColor: "#d97706", label: t("Branches"), value: data.branches.length },
];

const TAB_HEADERS = {
  staff: ["Name", "Email", "Phone", "Role", "Branch"],
  client: ["Name", "Email", "Phone", "Birthday"],
  branch: ["Name", "Address", "Phone", "City", "Status"],
  service: ["Name", "Category", "Description", "Duration", "Price"],
};

const ADD_LABELS = {
  staff: "Add Staff",
  client: "Add Client",
  branch: "Add Branch",
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
  <div data-tour="business-tabs" className="flex items-center gap-1 bg-[var(--surface-muted)] rounded-xl p-1">
    {tabs.map(({ id, labelKey }) => (
      <button
        key={id}
        onClick={() => onTabChange(id)}
        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === id
          ? "bg-[var(--brand)] text-white shadow-sm"
          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
      >
        {t(labelKey)}
      </button>
    ))}
  </div>
);

const TableHeader = ({ tab, t }) => (
  <thead>
    <tr className="border-b border-[var(--border-subtle)]">
      {TAB_HEADERS[tab]?.map((header) => (
        <th
          key={header}
          className="text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide pb-3 pr-6"
        >
          {t(header)}
        </th>
      ))}
      <th />
    </tr>
  </thead>
);

const LoadingState = ({ t }) => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center gap-3">
      <div className="size-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" />
      <span className="text-sm text-[var(--text-muted)]">{t("Loading") || "Loading..."}</span>
    </div>
  </div>
);

const EmptyState = ({ tab, t }) => (
  <tr>
    <td
      colSpan={TAB_HEADERS[tab]?.length + 1}
      className="py-12 text-center text-sm text-[var(--text-muted)]"
    >
      {t(`No ${tab} found`)}
    </td>
  </tr>
);

// ── Main component ────────────────────────────────────────────────────────────
const isReceptionist = (role) => role === "Recepcionista" || role === "Receptionist";

const ManagmentBusiness = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const receptionist = isReceptionist(user?.role);

  // El recepcionista solo puede ver el listado de clientes.
  const visibleTabs = receptionist ? TABS.filter(({ id }) => id === "client") : TABS;

  // ── State ──────────────────────────────────────────────────────────────────
  const [tab, setTab] = useState(() => (receptionist ? "client" : "staff"));
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [createTarget, setCreateTarget] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [schedulesTarget, setSchedulesTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [data, setData] = useState({
    staff: [],
    clients: [],
    branches: [],
    services: [],
  });

  // ── Data fetching ──────────────────────────────────────────────────────────
  const loadCoreData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (receptionist) {
        const clients = await fetchClientData();
        setData((prev) => ({ ...prev, clients, staff: [], branches: [], services: [] }));
        return;
      }
      const [staff, clients, branches, services] = await Promise.all([
        fetchStaffData(),
        fetchClientData(),
        fetchBranchData(),
        fetchServiceData(),
      ]);
      setData((prev) => ({ ...prev, staff, clients, branches, services }));
    } catch (e) {
      console.error("Error loading data:", e);
    } finally {
      setIsLoading(false);
    }
  }, [receptionist]);

  useEffect(() => {
    loadCoreData();
  }, [loadCoreData]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const summaryCards = buildSummary(data, t).filter(({ key }) => !receptionist || key === "client");
  const addLabel = t(ADD_LABELS[tab]);

  const query = search.trim().toLowerCase();
  const filteredData = useMemo(() => {
    const rows = {
      staff: data.staff,
      client: data.clients,
      branch: data.branches,
      service: data.services,
    }[tab] ?? [];
    if (!query) return rows;
    return rows.filter((row) =>
      Object.values(row).some((v) => typeof v === "string" && v.toLowerCase().includes(query))
    );
  }, [data, tab, query]);

  const handleTabChange = (id) => {
    setTab(id);
    setSearch("");
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCreate = async (newRecord) => {
    if (tab === "staff") {
      const created = await createStaff({
        name: newRecord.staffName,
        email: newRecord.staffEmail,
        password: newRecord.password,
        linkPhoto: newRecord.staffLinkPhoto,
        phone: newRecord.staffPhone,
        rol: Number(newRecord.rol),
        branchId: newRecord.branchId,
      });
      setData((prev) => ({ ...prev, staff: [...prev.staff, created] }));
      showToast(t("Staff created successfully") || "Staff created successfully");
      return;
    }
    if (tab === "branch") {
      await createBranch({
        Name: newRecord.name,
        Address: newRecord.address,
        phone: newRecord.phone,
        City: newRecord.city,
      });
      await loadCoreData();
      showToast(t("Branch created successfully") || "Branch created successfully");
      return;
    }
    if (tab === "service") {
      await createService({
        name: newRecord.name,
        categoria: newRecord.categoria,
        description: newRecord.description,
        duration: Number(newRecord.duration),
        price: Number(newRecord.price),
      });
      await loadCoreData();
      showToast(t("Service created successfully") || "Service created successfully");
      return;
    }
    console.log("Created:", newRecord);
    // TODO: wire to API + update local state
  };

  const handleEdit = async (updated) => {
    if (tab === "staff") {
      const id = updated.id ?? updated.staffId;
      await updateStaff(id, {
        name: updated.staffName,
        email: updated.staffEmail,
        password: updated.password,
        linkPhoto: updated.staffLinkPhoto,
        phone: updated.staffPhone,
        rol: Number(updated.rol),
        branchId: updated.branchId,
      });
      await loadCoreData();
      showToast(t("Staff updated successfully") || "Staff updated successfully");
      return;
    }
    if (tab === "branch") {
      const id = updated.id ?? updated.branchId;
      const saved = await updateBranch(id, {
        Name: updated.name,
        Address: updated.address,
        phone: updated.phone,
        City: updated.city,
      });
      setData((prev) => ({
        ...prev,
        branches: prev.branches.map((b) => ((b.id ?? b.branchId) === id ? saved : b)),
      }));
      showToast(t("Branch updated successfully") || "Branch updated successfully");
      return;
    }
    if (tab === "service") {
      const id = updated.id ?? updated.serviceId;
      const saved = await updateService(id, {
        name: updated.name,
        categoria: updated.categoria,
        description: updated.description,
        duration: Number(updated.duration),
        price: Number(updated.price),
      });
      setData((prev) => ({
        ...prev,
        services: prev.services.map((s) => ((s.id ?? s.serviceId) === id ? (saved ?? { ...s, ...updated }) : s)),
      }));
      showToast(t("Service updated successfully") || "Service updated successfully");
      return;
    }
    console.log("Saved:", updated);
    // TODO: wire to API + update local state
  };

  const handleDelete = async (row) => {
    if (tab === "service") {
      const id = row.id ?? row.serviceId;
      await deleteService(id);
      setData((prev) => ({
        ...prev,
        services: prev.services.filter((s) => (s.id ?? s.serviceId) !== id),
      }));
      return;
    }
    if (tab === "staff") {
      const id = row.id ?? row.staffId;
      await deleteStaff(id);
      setData((prev) => ({
        ...prev,
        staff: prev.staff.filter((s) => (s.id ?? s.staffId) !== id),
      }));
      return;
    }
    if (tab === "branch") {
      const id = row.id ?? row.branchId;
      await deleteBranch(id);
      setData((prev) => ({
        ...prev,
        branches: prev.branches.filter((b) => (b.id ?? b.branchId) !== id),
      }));
      return;
    }
    console.log("Deleted:", row);
    // TODO: wire to API + update local state
  };

  const handleSchedulesSave = () => {
    showToast(t("scheduleUpdated") || "Schedule updated");
  };

  const handleToggleBranchActive = async (branch) => {
    const id = branch.id ?? branch.branchId;
    const nextActive = !branch.isActive;
    const saved = await updateBranch(id, {
      Name: branch.name,
      Address: branch.address,
      phone: branch.phone,
      City: branch.city,
      isActive: nextActive,
    });
    setData((prev) => ({
      ...prev,
      branches: prev.branches.map((b) => ((b.id ?? b.branchId) === id ? saved : b)),
    }));
    showToast(nextActive
      ? (t("branchNowPublic") || "Branch is now public")
      : (t("branchNowHidden") || "Branch hidden from the public page"));
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS_ANIMATIONS}</style>

      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[var(--brand)] text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-[fadeIn_0.2s_ease-out]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {toast}
        </div>
      )}

      <div className="flex flex-col gap-6">

        {/* Resumen de totales */}
        <div data-tour="business-stats" className="flex flex-col sm:flex-row gap-4">
          {summaryCards.map((s) => <StatCard key={s.key} {...s} />)}
        </div>

        {/* Table card */}
        <div data-tour="business-table" className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden">

          {/* Card header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 px-6 pt-5 pb-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"><IconSearch /></span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("searchPlaceholder") || "Search..."}
                  className="w-full sm:w-56 border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] bg-[var(--surface-faint)] outline-none focus:border-[var(--brand)] transition-colors"
                />
              </div>
              <TabSelector
                tabs={visibleTabs}
                activeTab={tab}
                onTabChange={handleTabChange}
                t={t}
              />
            </div>
            <button
              onClick={() => setCreateTarget(true)}
              className="flex items-center gap-2 bg-[var(--brand)] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[var(--brand-hover)] transition-colors"
            >
              <IconPlus />
              {addLabel}
            </button>
          </div>

          {/* Table */}
          <div className="px-6 pb-4 mt-4 overflow-x-auto">
            {isLoading ? (
              <LoadingState t={t} />
            ) : (
              <table className="w-full">
                <TableHeader tab={tab} t={t} />
                <tbody>
                  {filteredData.length === 0 ? (
                    <EmptyState tab={tab} t={t} />
                  ) : (
                    filteredData.map((row) => (
                      <TableRow
                        key={row.id ?? row.name}
                        row={row}
                        tab={tab}
                        t={t}
                        onEdit={() => setEditTarget(row)}
                        onDelete={() => setDeleteTarget(row)}
                        onSchedules={() => setSchedulesTarget(row)}
                        onToggleActive={handleToggleBranchActive}
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
          t={t}
          branches={data.branches}
          onClose={() => setCreateTarget(false)}
          onSave={handleCreate}
        />
      )}

      {editTarget && (
        <EditModal
          row={editTarget}
          tab={tab}
          t={t}
          branches={data.branches}
          onClose={() => setEditTarget(null)}
          onSave={handleEdit}
        />
      )}

      {schedulesTarget && (
        <SchedulesModal
          row={schedulesTarget}
          t={t}
          onClose={() => setSchedulesTarget(null)}
          onSave={handleSchedulesSave}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          row={deleteTarget}
          t={t}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default ManagmentBusiness;