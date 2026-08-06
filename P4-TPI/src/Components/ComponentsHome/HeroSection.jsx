const HeroSection = () => {
  return (
    <section className="text-center px-4 pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="inline-flex items-center gap-2 bg-white/60 border border-[#e2ddd8] px-4 py-1.5 rounded-full mb-6">
        <div className="bg-[#1a1a2e] p-1 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-[#1a1a2e]">FGSTurniFy</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-[#1a1a2e] leading-tight max-w-3xl mx-auto">
        Appointment management, made simple
      </h1>

      <p className="text-[#6b6b6b] text-base md:text-lg mt-6 max-w-xl mx-auto">
        A single platform where businesses organize their schedules and
        customers book appointments in just a few clicks.
      </p>
    </section>
  );
};

export default HeroSection;
