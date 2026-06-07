import React, { useState } from "react";
import { useTranslation } from "../CustomHooks/TraslateHook";
import CalendarCustomDays from "../src/Components/ComponentsBookingPage/Calendar";


const BookingPage = () => {
  const { t, toggleLanguage, language } = useTranslation();
  // Estado para el día seleccionado
  const [selectedDay, setSelectedDay] = useState(null);


  return (
    <main className="min-h-screen bg-[#F8F5F0] flex flex-col">
     {/* 1. NAV BAR */}
      <nav className="w-full p-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-2">
          <div className="bg-[#1A1A1A] p-1.5 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
          </div>
          <span className="text-xl font-bold">FGSTurniFy</span>
        </div>
              <button
        onClick={toggleLanguage}
        className="absolute top-6 right-6 z-10 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-all font-medium text-sm flex items-center gap-2"
      >
        <span
          className={
            language === "es" ? "font-bold text-black" : "text-gray-400"
          }
        >
          ES
        </span>
        <span className="text-gray-300">|</span>
        <span
          className={
            language === "en" ? "font-bold text-black" : "text-gray-400"
          }
        >
          EN
        </span>
      </button>
      </nav>

      {/* 2. STEPS INDICATOR (Con traducciones) */}
      <section id="steps-booking" className="flex items-center justify-center py-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-[#1A1A1A] text-white p-3 rounded-full shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <p className="text-sm font-bold border-b-2 border-black pb-1">{t('selectDate')}</p>
          </div>

          <div className="w-16 h-[1px] bg-gray-300 mb-6"></div>

          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="bg-white border border-gray-200 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <p className="text-sm font-medium">{t('chooseProfessional')}</p>
          </div>

          <div className="w-16 h-[1px] bg-gray-300 mb-6"></div>

          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="bg-white border border-gray-200 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <p className="text-sm font-medium">{t('yourInformation')}</p>
          </div>
        </div>
      </section>
      <section className="flex-grow flex items-start justify-center px-4 pb-20">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-10 flex flex-col items-center">
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{t('selectDateTime')}</h2>
              <p className="text-gray-500 mt-1">{t('bookingSubtitle')}</p>
            </div>

            {/* CONTENEDOR DEL CALENDARIO */}
            <div className="w-full max-w-sm border border-gray-200 rounded-xl p-6 mb-10 shadow-sm">
                <CalendarCustomDays />
            </div>

            {/* BOTONES DE NAVEGACIÓN */}
            <div className="w-full flex justify-between pt-6 border-t border-gray-100">
              <button className="px-8 py-2.5 rounded-lg border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                {t('back')}
              </button>
              <button 
                disabled={!selectedDay}
                className={`px-10 py-2.5 rounded-lg font-semibold transition-all
                  ${selectedDay 
                    ? 'bg-black text-white hover:opacity-90' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                `}
              >
                {t('continue')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;