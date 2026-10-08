import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBusinessEcosystemByUrl } from "../src/services/businessService";
import BookingWizard from "../src/Components/ComponentsBookingPage/BookingWizard";
import { IconAlert, IconBuilding, IconClock, IconMapPin, IconUser } from "../src/Components/ComponentsBookingPage/Icons";

const DAY_LABELS = {
  Sunday: "Domingo",
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
};

const CATEGORY_LABELS = {
  Barberia: "Barbería",
  Spa: "Spa",
};

const formatTime = (value) => (typeof value === "string" ? value.slice(0, 5) : "");

const BranchCard = ({ branch, onBook }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd8] p-6">
    <div className="flex items-start justify-between gap-4">
      <h3 className="text-lg font-bold text-[#1a1a2e]">{branch.name}</h3>
      <button
        onClick={() => onBook(branch)}
        className="shrink-0 px-4 py-2 rounded-lg bg-[#1a1a2e] text-white text-sm font-semibold hover:bg-[#2d2d44] transition-colors"
      >
        Reservar acá
      </button>
    </div>

    {(branch.address || branch.city) && (
      <span className="flex items-center gap-1.5 text-sm text-[#6b6b6b] mt-1">
        <IconMapPin />
        {[branch.address, branch.city].filter(Boolean).join(" - ")}
      </span>
    )}

    <div className="grid sm:grid-cols-2 gap-6 mt-5">
      <div>
        <h4 className="flex items-center gap-1.5 text-sm font-semibold text-[#1a1a2e] mb-2">
          <IconClock />
          Horarios
        </h4>
        {branch.schedules?.length ? (
          <ul className="space-y-1">
            {branch.schedules.map((schedule, idx) => (
              <li key={idx} className="flex items-center justify-between text-sm text-[#4a4a4a]">
                <span>{DAY_LABELS[schedule.day] || schedule.day}</span>
                <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#9a9a9a]">Sin horarios publicados.</p>
        )}
      </div>

      <div>
        <h4 className="flex items-center gap-1.5 text-sm font-semibold text-[#1a1a2e] mb-2">
          <IconUser />
          Profesionales
        </h4>
        {branch.staff?.length ? (
          <ul className="flex flex-wrap gap-2">
            {branch.staff.map((member) => (
              <li key={member.id} className="px-3 py-1 rounded-full bg-[#F8F5F0] border border-[#e2ddd8] text-sm text-[#1a1a2e]">
                {member.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#9a9a9a]">Sin profesionales publicados.</p>
        )}
      </div>
    </div>
  </div>
);

const BusinessPublicPage = () => {
  const { businessSlug } = useParams();
  const [business, setBusiness] = useState(null);
  const [status, setStatus] = useState("loading");
  const [bookingPrefill, setBookingPrefill] = useState(null);

  useEffect(() => {
    let active = true;
    setStatus("loading");

    fetchBusinessEcosystemByUrl(businessSlug)
      .then((data) => {
        if (active) {
          setBusiness(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [businessSlug]);

  const startBooking = (branch) => {
    setBookingPrefill({
      businessId: business?.id,
      businessName: business?.name,
      ...(branch && {
        branchId: branch.id,
        branchName: branch.name,
        branchAddress: branch.address,
      }),
    });
  };

  if (status === "loading") {
    return (
      <main className="flex min-h-screen w-full bg-[#F8F5F0] items-center justify-center">
        <p className="text-[#6b6b6b]">Cargando empresa...</p>
      </main>
    );
  }

  if (status === "error" || !business) {
    return (
      <main className="flex min-h-screen w-full bg-[#F8F5F0] items-center justify-center p-8">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#e2ddd8] mb-6 text-[#1a1a2e]">
            <IconAlert />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Empresa no encontrada</h1>
          <p className="text-[#9a9a9a] mt-2 text-sm">
            No encontramos ninguna empresa con esa URL, o no está disponible.
          </p>
          <Link
            to="/"
            className="mt-8 px-6 py-2.5 bg-[#1a1a2e] text-white rounded-xl text-sm font-semibold hover:bg-[#2d2d44] transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#F8F5F0]">
      {/* Header: stays on screen the whole time, through the booking flow too. */}
      <header className="bg-[#1a1a2e] text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              <IconBuilding />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">{business.name}</h1>
            <span className="inline-block mt-1 text-sm text-white/70">
              {CATEGORY_LABELS[business.category] || business.category}
            </span>
          </div>
          {bookingPrefill ? (
            <button
              onClick={() => setBookingPrefill(null)}
              className="px-6 py-2.5 bg-white/10 text-white border border-white/30 rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors text-center"
            >
              ← Ver sucursales
            </button>
          ) : (
            <button
              onClick={() => startBooking(null)}
              className="px-6 py-2.5 bg-white text-[#1a1a2e] rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors text-center"
            >
              Reservar turno
            </button>
          )}
        </div>
      </header>

      {/* Content: either the branch listing, or the booking wizard in its place. */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {bookingPrefill ? (
          <BookingWizard prefill={bookingPrefill} onExit={() => setBookingPrefill(null)} />
        ) : (
          <>
            <h2 className="text-lg font-bold text-[#1a1a2e] mb-4">Sucursales</h2>
            {business.branches?.length ? (
              <div className="grid gap-6">
                {business.branches.map((branch) => (
                  <BranchCard key={branch.id} branch={branch} onBook={startBooking} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#9a9a9a]">Esta empresa todavía no publicó sucursales.</p>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default BusinessPublicPage;
