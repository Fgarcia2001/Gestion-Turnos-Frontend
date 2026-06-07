// Calendar.jsx
import React, { useState, useCallback } from 'react';
import CalendarHeader from './CalendarComponents/CalendarHeader';
import CalendarGrid from './CalendarComponents/CalendarGrid';

// ── Constants ─────────────────────────────────────────────────────────────────
const TIME_RANGE = { start: 9, end: 19 };

const MOCK_STAFF = [
  { id: '1', name: 'cri sa',        initials: 'CS' },
  { id: '2', name: 'fra ga',        initials: 'FG' },
  { id: '3', name: 'martin ccirio', initials: 'MC' },
];

const MOCK_APPOINTMENTS = [
  { id: 'a1', staffId: '1', startTime: '10:00', endTime: '11:30', title: 'Haircut',      color: '#3b82f6' },
  { id: 'a2', staffId: '2', startTime: '14:00', endTime: '15:00', title: 'Beard Trim',   color: '#10b981' },
  { id: 'a3', staffId: '3', startTime: '16:30', endTime: '18:00', title: 'Hair Coloring', color: '#8b5cf6' },
];

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