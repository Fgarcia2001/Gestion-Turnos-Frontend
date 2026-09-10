// BusinessDetailModal.jsx — read-only SysAdmin business detail modal.
// Presentational: all fetch state (detail/loading/error) is owned by the parent.
import { useEffect, useState } from "react";
import { ModalOverlay } from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Shared";
import { IconX } from "../ComponentsAdmin/Sections/ManagmentBusinessComponents/Icons";
import { getBusinessInitials, statusStyle } from "./businessStatus";

const CSS_ANIMATIONS = `
  @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
`;

// Pick the first defined, non-empty value from a list of candidate keys.
const pick = (obj, ...keys) => {
  if (!obj) return null;
  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return null;
};

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
};

const Section = ({ title, children }) => (
  <div className="px-6 py-5 border-b border-[#f0ede8] last:border-b-0">
    <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wide mb-3">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, value }) => {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-[#f0ede8] last:border-b-0">
      <span className="text-xs font-semibold text-[#9a9a9a] uppercase tracking-wide shrink-0">{label}</span>
      <span className="text-sm text-[#1a1a2e] text-right break-all">{value}</span>
    </div>
  );
};

const StatTile = ({ label, value }) => (
  <div className="bg-[#f9f8f6] rounded-xl p-4 border border-[#e2ddd8] text-center">
    <p className="text-2xl font-bold text-[#1a1a2e] leading-tight">{value}</p>
    <p className="text-xs text-[#9a9a9a] mt-1">{label}</p>
  </div>
);

const BusinessDetailModal = ({ detail, loading, error, onClose, onRetry }) => {
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const name = detail?.name;
  const currentPlan = pick(detail, "currentPlan", "planName", "plan");
  const subscriptionStatus = pick(detail, "subscriptionStatus");
  const subscriptionStartDate = pick(detail, "subscriptionStartDate", "startDate", "startsAt");
  const subscriptionEndDate = pick(detail, "subscriptionEndDate", "endDate", "endsAt", "expiresAt");
  const hasSubscription = Boolean(
    currentPlan || subscriptionStatus || subscriptionStartDate || subscriptionEndDate
  );
  const branches = Array.isArray(detail?.branches) ? detail.branches : [];
  const website = pick(detail, "url", "website", "businessUrl", "webUrl");
  const email = pick(detail, "email", "contactEmail");
  const phone = pick(detail, "phone", "contactPhone", "phoneNumber");
  const urlLogo = detail?.urlLogo;
  const showLogo = Boolean(urlLogo) && !logoFailed;
  const st = statusStyle(detail?.status);

  return (
    <>
      <style>{CSS_ANIMATIONS}</style>
      <ModalOverlay onClose={onClose}>
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#e2ddd8] shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2ddd8] shrink-0">
            <h2 className="text-base font-bold text-[#1a1a2e]">{name || "Business details"}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors"
              aria-label="Close"
            >
              <IconX />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 py-20">
                <div className="size-8 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
                <p className="text-sm text-[#9a9a9a]">Loading business details…</p>
              </div>
            )}

            {!loading && error && (
              <div className="py-20 text-center px-6">
                <p className="text-sm text-[#9a9a9a] mb-4">Couldn't load the business details</p>
                <button
                  onClick={onRetry}
                  className="bg-[#1a1a2e] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#2d2d44] transition-colors cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && detail && (
              <>
                <Section title="General information">
                  <div className="flex items-center gap-4 mb-3">
                    {showLogo ? (
                      <img
                        src={urlLogo}
                        alt={name || "Business logo"}
                        onError={() => setLogoFailed(true)}
                        className="w-14 h-14 rounded-full object-cover border border-[#e2ddd8] shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#f0ede8] text-[#1a1a2e] flex items-center justify-center text-base font-bold shrink-0">
                        {getBusinessInitials(name)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a2e]">{name || "—"}</p>
                      <span className="flex items-center gap-1.5 text-xs font-semibold mt-0.5" style={{ color: st.text }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: st.dot }} />
                        {st.label}
                      </span>
                    </div>
                  </div>
                  <Field label="Type" value={detail.typeBusiness || "—"} />
                  <Field label="Status" value={detail.status || "—"} />
                  <Field label="URL" value={website} />
                  <Field label="Email" value={email} />
                  <Field label="Phone" value={phone} />
                </Section>

                <Section title="Subscription">
                  {hasSubscription ? (
                    <>
                      <Field label="Plan" value={currentPlan || "Not provided"} />
                      <Field label="Status" value={subscriptionStatus || "Not provided"} />
                      <Field label="Start date" value={formatDate(subscriptionStartDate) || "Not provided"} />
                      <Field label="End date" value={formatDate(subscriptionEndDate) || "Not provided"} />
                    </>
                  ) : (
                    <p className="text-sm text-[#9a9a9a]">No subscription information.</p>
                  )}
                </Section>

                <Section title="Statistics">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatTile label="Branches" value={detail.branchCount ?? 0} />
                    <StatTile label="Staff" value={detail.staffCount ?? 0} />
                    <StatTile label="Clients" value={detail.clientCount ?? 0} />
                    <StatTile label="Appointments" value={detail.appointmentCount ?? 0} />
                  </div>
                </Section>

                <Section title="Branches">
                  {branches.length === 0 ? (
                    <p className="text-sm text-[#9a9a9a]">No branches registered.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {branches.map((branch, i) => (
                        <div key={branch.id ?? i} className="border border-[#e2ddd8] rounded-xl px-4 py-3">
                          <p className="text-sm font-semibold text-[#1a1a2e]">{branch.name || "—"}</p>
                          {branch.address && <p className="text-xs text-[#5a5a6e] mt-0.5">{branch.address}</p>}
                          {branch.city && <p className="text-xs text-[#5a5a6e]">{branch.city}</p>}
                          {branch.phone && <p className="text-xs text-[#9a9a9a] mt-0.5">{branch.phone}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </Section>
              </>
            )}
          </div>

          <div className="px-6 py-4 border-t border-[#e2ddd8] flex justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold bg-[#1a1a2e] text-white rounded-xl px-4 py-2 hover:bg-[#2d2d44] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </ModalOverlay>
    </>
  );
};

export default BusinessDetailModal;
