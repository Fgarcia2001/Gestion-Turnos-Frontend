// BusinessCard.jsx — presentational, clickable card for a single business in the SysAdmin businesses grid.
import { useState } from "react";
import { getBusinessInitials, statusStyle } from "./businessStatus";
import { useTranslation } from "../../../CustomHooks/TraslateHook";

const BusinessCard = ({ business, onClick }) => {
  const { t } = useTranslation();
  const {
    name,
    urlLogo,
    typeBusiness,
    status,
    branchCount,
    staffCount,
    clientCount,
  } = business || {};

  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(urlLogo) && !logoFailed;
  const st = statusStyle(status);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)] p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-200 hover:shadow-md hover:border-[var(--brand)]/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
    >
      {showLogo ? (
        <img
          src={urlLogo}
          alt={name || "Business logo"}
          onError={() => setLogoFailed(true)}
          className="w-16 h-16 rounded-full object-cover border border-[var(--border-subtle)]"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-[var(--surface-muted)] text-[var(--text-primary)] flex items-center justify-center text-lg font-bold">
          {getBusinessInitials(name)}
        </div>
      )}

      <h3 className="text-sm font-semibold text-[var(--text-primary)] mt-4">{name || "—"}</h3>

      {typeBusiness && (
        <span className="text-[10px] font-semibold bg-[var(--surface-muted)] text-[var(--text-tertiary)] px-2.5 py-1 rounded-full uppercase tracking-wide mt-2">
          {typeBusiness}
        </span>
      )}

      <span className="flex items-center gap-1.5 text-xs font-semibold mt-2" style={{ color: st.text }}>
        <span className="w-2 h-2 rounded-full" style={{ background: st.dot }} />
        {st.label}
      </span>

      <div className="flex flex-col gap-1 mt-4 text-xs text-[var(--text-tertiary)]">
        <span><span className="font-bold text-[var(--text-primary)]">{branchCount ?? 0}</span> {t("Branches") || "Branches"}</span>
        <span><span className="font-bold text-[var(--text-primary)]">{staffCount ?? 0}</span> {t("Staff") || "Staff"}</span>
        <span><span className="font-bold text-[var(--text-primary)]">{clientCount ?? 0}</span> {t("Clients") || "Clients"}</span>
      </div>

      <span className="mt-4 text-xs font-semibold text-[var(--text-primary)] bg-[var(--surface-muted)] px-4 py-2 rounded-xl">
        {t("View details") || "View details"}
      </span>
    </div>
  );
};

export default BusinessCard;
