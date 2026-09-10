// Shared helpers for SysAdmin business card / detail views.

export const getBusinessInitials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("") || "?";

const ENABLED_STATUSES = ["enabled", "active", "habilitado", "activo"];

export const statusStyle = (status) => {
  const value = String(status || "").trim().toLowerCase();
  const isEnabled = ENABLED_STATUSES.includes(value);
  return {
    dot: isEnabled ? "#15803d" : "#9a9a9a",
    text: isEnabled ? "#15803d" : "#9a9a9a",
    label: status || "—",
  };
};
