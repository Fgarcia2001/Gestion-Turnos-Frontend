import React from 'react';

// ── Inline Icons ──────────────────────────────────────────────────────────────
const IconChevronLeft  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>;
const IconChevronRight = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>;
const IconChevronDown  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>;
const IconHome         = () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
const IconHelp         = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const IconRefresh      = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>;
const IconLayout       = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>;
const IconExpand       = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>;
const IconPrinter      = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>;

// ── Helper ────────────────────────────────────────────────────────────────────
const formatTitleDate = (date) => {
  if (!date) return "";
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
  const str = date.toLocaleDateString('es-ES', options);
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// ── Component ─────────────────────────────────────────────────────────────────
const CalendarHeader = ({ currentDate, onTodayClick, onPrevDay, onNextDay, businessName = "Mi Negocio" }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#e2ddd8]">
      
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onTodayClick}
          className="px-4 py-1.5 bg-transparent border border-[#e2ddd8] rounded-md text-sm font-semibold text-[#1a1a2e] hover:bg-[#f0ede8] transition-colors"
        >
          Hoy
        </button>

        <div className="flex items-center text-[#1a1a2e]">
          <button onClick={onPrevDay} className="p-1.5 hover:bg-[#f0ede8] rounded transition-colors">
            <IconChevronLeft />
          </button>
          <button onClick={onNextDay} className="p-1.5 hover:bg-[#f0ede8] rounded transition-colors">
            <IconChevronRight />
          </button>
        </div>

        <div className="flex flex-col ml-2">
          <h2 className="text-[15px] font-bold text-[#1a1a2e] leading-tight">
            {formatTitleDate(currentDate)}
          </h2>
          <div className="flex items-center gap-1.5 text-[#5a5a6e] text-[11px] mt-0.5">
            <IconHome />
            <span>{businessName}</span>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="text-[#5a5a6e] hover:text-[#1a1a2e] transition-colors p-1">
          <IconHelp />
        </button>

        <span className="text-[11px] text-[#9a9a9a] italic mr-2">
          Actualizado hace 0 min
        </span>
        
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white border border-[#e2ddd8] rounded-md text-[#7b5cfa] hover:bg-purple-50 transition-colors shadow-sm">
            <IconRefresh />
          </button>
          <button className="p-2 bg-white border border-[#e2ddd8] rounded-md text-[#7b5cfa] hover:bg-purple-50 transition-colors shadow-sm">
            <IconLayout />
          </button>
          <button className="p-2 bg-white border border-[#e2ddd8] rounded-md text-[#7b5cfa] hover:bg-purple-50 transition-colors shadow-sm">
            <IconExpand />
          </button>
          <button className="p-2 bg-white border border-[#e2ddd8] rounded-md text-[#7b5cfa] hover:bg-purple-50 transition-colors shadow-sm">
            <IconPrinter />
          </button>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-[#7b5cfa] text-white text-sm font-semibold rounded-md hover:bg-[#6a4de2] transition-colors shadow-sm ml-2">
          Nuevo <IconChevronDown />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;