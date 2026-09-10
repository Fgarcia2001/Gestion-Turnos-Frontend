// BusinessCard.jsx — presentational, clickable card for a single business in the SysAdmin businesses grid.
import { useState } from "react";
import { getBusinessInitials, statusStyle } from "./businessStatus";

const BusinessCard = ({ business, onClick }) => {
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
      className="bg-white rounded-2xl border border-[#e2ddd8] p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-200 hover:shadow-md hover:border-[#1a1a2e]/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20"
    >
      {showLogo ? (
        <img
          src={urlLogo}
          alt={name || "Business logo"}
          onError={() => setLogoFailed(true)}
          className="w-16 h-16 rounded-full object-cover border border-[#e2ddd8]"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-[#f0ede8] text-[#1a1a2e] flex items-center justify-center text-lg font-bold">
          {getBusinessInitials(name)}
        </div>
      )}

      <h3 className="text-sm font-semibold text-[#1a1a2e] mt-4">{name || "—"}</h3>

      {typeBusiness && (
        <span className="text-[10px] font-semibold bg-[#f0ede8] text-[#5a5a6e] px-2.5 py-1 rounded-full uppercase tracking-wide mt-2">
          {typeBusiness}
        </span>
      )}

      <span className="flex items-center gap-1.5 text-xs font-semibold mt-2" style={{ color: st.text }}>
        <span className="w-2 h-2 rounded-full" style={{ background: st.dot }} />
        {st.label}
      </span>

      <div className="flex flex-col gap-1 mt-4 text-xs text-[#5a5a6e]">
        <span><span className="font-bold text-[#1a1a2e]">{branchCount ?? 0}</span> Sucursales</span>
        <span><span className="font-bold text-[#1a1a2e]">{staffCount ?? 0}</span> Profesionales</span>
        <span><span className="font-bold text-[#1a1a2e]">{clientCount ?? 0}</span> Clientes</span>
      </div>

      <span className="mt-4 text-xs font-semibold text-[#1a1a2e] bg-[#f0ede8] px-4 py-2 rounded-xl">
        Ver detalles
      </span>
    </div>
  );
};

export default BusinessCard;
