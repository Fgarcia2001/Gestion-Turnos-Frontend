// ── Avatar ───────────────────────────────────────────────────────────────────
export const Avatar = ({ initials, color = "#e2ddd8", photo }) => {
  if (photo) {
    return (
      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#e2ddd8]">
        <img src={photo} alt={initials} className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = "none"; }} />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
      style={{ background: color, color: "#1a1a2e" }}>
      {initials}
    </div>
  );
};

// ── Stat card ────────────────────────────────────────────────────────────────
export const StatCard = ({ icon: Icon, iconBg, iconColor, label, value }) => (
  <div className="flex-1 bg-white rounded-2xl p-5 border border-[#e2ddd8] flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: iconBg, color: iconColor }}>
      <Icon />
    </div>
    <div>
      <p className="text-sm text-[#9a9a9a]">{label}</p>
      <p className="text-3xl font-bold text-[#1a1a2e] leading-tight">{value}</p>
    </div>
  </div>
);

// ── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ value }) => (
  <div className="w-8 h-8 rounded-full bg-[#f0ede8] flex items-center justify-center text-xs font-semibold text-[#1a1a2e]">
    {value}
  </div>
);

// ── Modal Overlay (shared backdrop) ──────────────────────────────────────────
export const ModalOverlay = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 "
    style={{ backgroundColor: "rgba(26,26,46,0.45)", backdropFilter: "blur(4px)", animation: "fadeIn 0.15s ease" }}
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
   <div className="w-full flex justify-center" style={{ animation: "scaleIn 0.18s ease" }}>
      {children}
    </div>
  </div>
);

// ── Shared input/label styles ─────────────────────────────────────────────────
export const inputClass =
  "w-full border border-[#e2ddd8] rounded-xl px-4 py-2.5 text-sm text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]/20 focus:border-[#1a1a2e] transition-all bg-[#faf9f7]";
export const labelClass =
  "block text-xs font-semibold text-[#9a9a9a] uppercase tracking-wide mb-1.5";

