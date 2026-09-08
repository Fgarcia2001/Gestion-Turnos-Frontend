// BusinessCard.jsx — presentational card for a single business in the SysAdmin businesses grid.
const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase()).join("") || "?";

const BusinessCard = ({ business }) => {
  const { name, url, logoUrl, category } = business;

  return (
    <div className="bg-white rounded-2xl border border-[#e2ddd8] p-6 flex flex-col items-center text-center">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={name}
          className="w-16 h-16 rounded-full object-cover border border-[#e2ddd8]"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-[#f0ede8] text-[#1a1a2e] flex items-center justify-center text-lg font-bold">
          {getInitials(name)}
        </div>
      )}

      <h3 className="text-sm font-semibold text-[#1a1a2e] mt-4">{name || "—"}</h3>

      {category && (
        <span className="text-[10px] font-semibold bg-[#f0ede8] text-[#5a5a6e] px-2.5 py-1 rounded-full uppercase tracking-wide mt-2">
          {category}
        </span>
      )}

      {url && <p className="text-xs text-[#9a9a9a] mt-3 truncate w-full">{url}</p>}
    </div>
  );
};

export default BusinessCard;
