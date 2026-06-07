import { useTranslation } from "../../../../CustomHooks/TraslateHook";

// ── SVG Icons ──────────────────────────────────────────────────────────────
const IconTrendUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17L9 11L13 15L21 7" /><path d="M14 7H21V14" />
  </svg>
);
const IconDots = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
  </svg>
);
const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6L15 12L9 18" />
  </svg>
);
const IconStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

// ── Mini bar chart ──────────────────────────────────────────────────────────
const BarChart = () => {
  const bars = [
    { label: "Nov", h: 45 },
    { label: "Dec", h: 55 },
    { label: "Jan", h: 50 },
    { label: "Feb", h: 70 },
    { label: "Mar", h: 80 },
  ];
  return (
    <div className="flex items-end gap-2 h-20 mt-4">
      {bars.map(({ label, h }) => (
        <div key={label} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-md bg-[#d8d4ce]"
            style={{ height: `${h}%` }}
          />
          <span className="text-[10px] text-[#9a9a9a]">{label}</span>
        </div>
      ))}
    </div>
  );
};

// ── Donut chart (SVG) ────────────────────────────────────────────────────────
const DonutChart = ({ percent = 90 }) => {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const completed = (percent / 100) * circ;
  const inProgress = (6 / 100) * circ;
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: "rotate(-90deg)" }}>
        {/* bg */}
        <circle cx="48" cy="48" r={r} fill="none" stroke="#e2ddd8" strokeWidth="10" />
        {/* completed - dark */}
        <circle cx="48" cy="48" r={r} fill="none" stroke="#1a1a2e" strokeWidth="10"
          strokeDasharray={`${completed} ${circ}`} strokeLinecap="round" />
        {/* in progress - blue */}
        <circle cx="48" cy="48" r={r} fill="none" stroke="#3b82f6" strokeWidth="10"
          strokeDasharray={`${inProgress} ${circ}`} strokeDashoffset={-completed} strokeLinecap="round" />
        {/* pending - amber */}
        <circle cx="48" cy="48" r={r} fill="none" stroke="#f59e0b" strokeWidth="10"
          strokeDasharray={`${circ - completed - inProgress} ${circ}`}
          strokeDashoffset={-(completed + inProgress)} strokeLinecap="round" />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-lg font-bold text-[#1a1a2e]">{percent}%</span>
        <span className="text-[10px] text-[#9a9a9a]">Done</span>
      </div>
    </div>
  );
};

// ── Avatar placeholder ───────────────────────────────────────────────────────
const Avatar = ({ initials, color = "#d8d4ce", textColor = "#1a1a2e", src }) =>
  src ? (
    <img src={src} alt={initials} className="w-9 h-9 rounded-full object-cover shrink-0" />
  ) : (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
      style={{ background: color, color: textColor }}>
      {initials}
    </div>
  );

// ── Recent appointment row ───────────────────────────────────────────────────
const AppointmentRow = ({ client, date, doctor, amount, clientInitials, doctorInitials }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#f0ede8] last:border-0">
    <Avatar initials={clientInitials} color="#e2ddd8" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-[#1a1a2e] truncate">{client}</p>
      <p className="text-xs text-[#9a9a9a]">{date}</p>
    </div>
    <div className="flex items-center gap-1.5">
      <Avatar initials={doctorInitials} color="#dbeafe" textColor="#1e40af" />
      <span className="text-xs text-[#6b7280] hidden sm:block">{doctor}</span>
    </div>
    <span className="text-sm font-semibold text-[#22c55e] min-w-[60px] text-right">${amount}</span>
    <button className="text-[#9a9a9a] hover:text-[#1a1a2e] transition-colors"><IconDots /></button>
  </div>
);



// ── Main Home ────────────────────────────────────────────────────────────────
const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 ">

      {/* Top row: 3 cards */}
      <div className="grid grid-cols-3 gap-4 py-10">

        {/* Appointment Statistics */}
        <div className="bg-white rounded-2xl p-5 border border-[#e2ddd8]">
          <p className="text-sm text-[#9a9a9a] font-medium">{t("Appointment Statistics")}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-bold text-[#1a1a2e]">247</span>
            <span className="text-sm text-[#9a9a9a]">{t("Total this month")}</span>
          </div>
          <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-xs font-semibold">
            <IconTrendUp /> 14%
          </span>
          <BarChart />
          <p className="text-xs text-[#9a9a9a] mt-3">{t("Always see your booking updates")}</p>
        </div>

        {/* Next Appointment */}
        <div className="rounded-2xl p-5 flex flex-col justify-between" style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}>
          <div>
            <p className="text-xs font-semibold tracking-widest text-blue-200 uppercase">{t("Next Appointment")}</p>
            <div className="mt-3">
              <p className="text-3xl font-bold text-white tracking-tight">10:30 AM</p>
              <p className="text-blue-200 text-sm mt-1">April 10, 2024</p>
            </div>
          </div>
          <div className="flex items-end justify-between mt-6">
            <div>
              <p className="text-white font-semibold text-base">{t("Name of client")}</p>
              <p className="text-blue-200 text-sm">{t("Type of Service")}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              SJ
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-2xl p-5 border border-[#e2ddd8]">
          <p className="text-sm text-[#9a9a9a] font-medium">{t("Analytics")}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col gap-2">
              {[
                { color: "#1a1a2e", label: t("Completed") },
                { color: "#3b82f6", label: t("In progress") },
                { color: "#f59e0b", label: t("Pending") },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-xs text-[#6b7280]">{label}</span>
                </div>
              ))}
            </div>
            <DonutChart percent={90} />
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-5 gap-4">

        {/* Recent Appointments - 3/5 */}
        <div className="col-span-3 bg-white rounded-2xl p-5 border border-[#e2ddd8]">
          <p className="text-sm font-semibold text-[#1a1a2e] mb-1">{t("Recent Appointments")}</p>
          <AppointmentRow client="Sarah Johnson"  date="03 April, 2024 · 1h 30m" doctor="Dr. Emily White"   amount="150.00" clientInitials="SJ" doctorInitials="EW" />
          <AppointmentRow client="Michael Chen"   date="01 April, 2024 · 45m"    doctor="John Martinez"    amount="75.00"  clientInitials="MC" doctorInitials="JM" />
          <AppointmentRow client="Emily Davis"    date="27 March, 2024 · 2h"     doctor="Sarah Thompson"   amount="200.00" clientInitials="ED" doctorInitials="ST" />
        </div>

        {/* Right column - 2/5 */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Completed vs Cancelled */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2ddd8] flex-1">
            <p className="text-sm font-semibold text-[#1a1a2e] mb-4">{t("Completed vs Cancelled")}</p>
            <div className="flex items-center gap-6">
              {/* Completed toggle */}
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-14 bg-[#1a1a2e] rounded-full flex flex-col justify-end pb-1 items-center">
                  <div className="w-5 h-5 rounded-full bg-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1a1a2e]">60%</p>
                  <p className="text-xs text-[#9a9a9a]">{t("Completed")}</p>
                </div>
              </div>
              {/* Cancelled toggle */}
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-14 bg-[#e2ddd8] rounded-full flex flex-col justify-start pt-1 items-center">
                  <div className="w-5 h-5 rounded-full bg-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1a1a2e]">40%</p>
                  <p className="text-xs text-[#9a9a9a]">{t("Cancelled")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium banner */}
          <div className="bg-white rounded-2xl p-4 border border-[#e2ddd8] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#fef3c7] flex items-center justify-center text-[#f59e0b] shrink-0">
              <IconStar />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a1a2e]">{t("More features?")}</p>
              <p className="text-xs text-[#9a9a9a] leading-tight">{t("Update your account to premium")}</p>
            </div>
            <button className="shrink-0 bg-[#1a1a2e] text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#2d2d44] transition-colors whitespace-nowrap">
              {t("Go to premium")}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;