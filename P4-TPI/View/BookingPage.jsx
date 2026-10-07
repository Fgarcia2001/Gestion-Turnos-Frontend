import { useLocation } from "react-router-dom";
import { useTranslation } from "../CustomHooks/TraslateHook";
import BookingWizard from "../src/Components/ComponentsBookingPage/BookingWizard";

const BookingPage = () => {
  const location = useLocation();
  const { toggleLanguage, language } = useTranslation();

  return (
    <main className="min-h-screen bg-[#F8F5F0] flex flex-col">
      <nav className="w-full p-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-2">
          <div className="bg-[#1a1a2e] p-1.5 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-[#1a1a2e]">FGSTurniFy</span>
        </div>
        <button
          onClick={toggleLanguage}
          className="absolute top-6 right-6 z-10 bg-white border border-[#e2ddd8] px-4 py-2 rounded-full shadow-sm hover:bg-[#F8F5F0] transition-all font-medium text-sm flex items-center gap-2"
        >
          <span className={language === "es" ? "font-bold text-[#1a1a2e]" : "text-[#b3aca3]"}>ES</span>
          <span className="text-[#e2ddd8]">|</span>
          <span className={language === "en" ? "font-bold text-[#1a1a2e]" : "text-[#b3aca3]"}>EN</span>
        </button>
      </nav>

      <section className="flex-grow px-4 pb-20">
        <BookingWizard prefill={location.state} />
      </section>
    </main>
  );
};

export default BookingPage;
