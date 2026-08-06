import { useNavigate } from "react-router-dom";
import HeroSection from "../src/Components/ComponentsHome/HeroSection";
import OptionCard from "../src/Components/ComponentsHome/OptionCard";

const BuildingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1a1a2e"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18Z" />
    <path d="M6 12H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" />
    <path d="M18 9h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2" />
    <path d="M10 6h.01" />
    <path d="M14 6h.01" />
    <path d="M10 10h.01" />
    <path d="M14 10h.01" />
    <path d="M10 14h.01" />
    <path d="M14 14h.01" />
    <path d="M10 18h.01" />
    <path d="M14 18h.01" />
  </svg>
);

const CalendarCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1a1a2e"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="m9 16 2 2 4-4" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen w-full bg-[#F8F5F0]">
      <div className="max-w-5xl mx-auto px-4">
        <HeroSection />

        <section className="flex flex-col md:flex-row gap-6 pb-20">
          <OptionCard
            icon={<BuildingIcon />}
            title="I'm a Business"
            description="Register your company, set up your services and staff, and take full control of your appointment schedule."
            buttonLabel="Register Business"
            onAction={() => navigate("/login")}
          />

          <OptionCard
            icon={<CalendarCheckIcon />}
            title="Book an Appointment"
            description="Looking to schedule a visit with a business? Find availability and book your appointment in seconds."
            buttonLabel="Book Now"
            onAction={() => navigate("/appointments")}
          />
        </section>
      </div>
    </main>
  );
};

export default Home;
