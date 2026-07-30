// Calendar.jsx
import React, { useState, useCallback } from 'react';
import CalendarHeader from './CalendarComponents/CalendarHeader';
import CalendarGrid from './CalendarComponents/CalendarGrid';

// ── Constants ─────────────────────────────────────────────────────────────────
const TIME_RANGE = { start: 9, end: 19 };

const MOCK_STAFF = [];

const MOCK_APPOINTMENTS = [];

// ── Helpers ───────────────────────────────────────────────────────────────────
const addDays = (date, days) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const dispatchScrollEvent = () =>
  window.dispatchEvent(new CustomEvent('scrollToCurrentTime'));

// ── Component ─────────────────────────────────────────────────────────────────
const Calendar = ({ 
  staffMembers  = MOCK_STAFF,
  appointments  = MOCK_APPOINTMENTS,
  timeRange     = TIME_RANGE,
  businessName  = "Mi Negocio",
  initialDate   = new Date(),
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const handleTodayClick = useCallback(() => {
    setCurrentDate(new Date());
    dispatchScrollEvent();
  }, []);

  const handlePrevDay = useCallback(() => {
    setCurrentDate(prev => addDays(prev, -1));
  }, []);

  const handleNextDay = useCallback(() => {
    setCurrentDate(prev => addDays(prev, 1));
  }, []);

  const handleSlotClick = useCallback((staffId, time) => {
    console.log(`Slot clicked → staffId: ${staffId} | time: ${time}`);
    // TODO: abrir modal de creación de turno
  }, []);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-8rem)] bg-white overflow-hidden rounded-xl border border-[#e2ddd8] shadow-sm">
      <CalendarHeader
        currentDate={currentDate}
        businessName={businessName}
        onTodayClick={handleTodayClick}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
      />
      <CalendarGrid
        staffMembers={staffMembers}
        appointments={appointments}
        currentDate={currentDate}
        timeRange={timeRange}
        onSlotClick={handleSlotClick}
      />
    </div>
  );
};

export default Calendar;