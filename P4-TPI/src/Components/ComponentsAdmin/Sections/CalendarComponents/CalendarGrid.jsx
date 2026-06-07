// CalendarGrid.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const HEADER_HEIGHT = 40;
const SLOT_HEIGHT   = 64;

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconClock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

const padTwo = (n) => n.toString().padStart(2, '0');

const generateHours = (start, end) => {
  const hours = [];
  for (let i = start; i <= end; i++) {
    hours.push(`${padTwo(i)}:00`);
  }
  return hours;
};

const isDateToday = (date) =>
  new Date().toDateString() === date.toDateString();

// ── Sub-components ────────────────────────────────────────────────────────────
const StaffHeaders = ({ staffMembers }) => (
  <div className="flex ml-16 bg-white border-b border-[#e2ddd8] z-30 relative shadow-sm">
    {staffMembers.map((staff) => (
      <div
        key={staff.id}
        className="flex-1 flex flex-col items-center justify-center py-4 border-r border-[#e2ddd8] last:border-r-0"
      >
        <div className="w-9 h-9 rounded-full bg-[#f0ede8] text-[#1a1a2e] flex items-center justify-center text-[13px] font-bold mb-2">
          {staff.initials}
        </div>
        <span className="text-xs font-semibold text-[#1a1a2e]">{staff.name}</span>
      </div>
    ))}
  </div>
);

const TimeColumn = ({ hours }) => (
  <div className="w-16 flex flex-col border-r border-[#d4d4d4] bg-white sticky left-0 z-20 shrink-0">
    <div className="h-10 flex items-center justify-center border-b border-[#d4d4d4] bg-white">
      <div className="flex items-center justify-center w-7 h-7 rounded shadow-sm border border-[#e2ddd8] text-[#7b5cfa]">
        <IconClock />
      </div>
    </div>
    {hours.map((hour) => (
      <div key={hour} className="h-16 flex items-start justify-center pt-2 border-b border-[#d4d4d4] bg-white">
        <span className="text-[11px] font-semibold text-[#5a5a6e]">{hour}</span>
      </div>
    ))}
  </div>
);

const GridBackground = ({ staffMembers, hours }) => (
  <div className="absolute inset-0 flex pointer-events-none">
    {staffMembers.map((staff) => (
      <div key={`bg-${staff.id}`} className="flex-1 border-r border-[#d4d4d4]">
        <div className="h-10 border-b border-[#d4d4d4]" />
        {hours.map((_, i) => (
          <div key={i} className="h-16 border-b border-[#d4d4d4]" />
        ))}
      </div>
    ))}
  </div>
);

const InteractiveSlots = ({ staffMembers, hours, onSlotClick }) => (
  <div className="absolute inset-0 flex z-0">
    {staffMembers.map((staff) => (
      <div key={`interact-${staff.id}`} className="flex-1 flex flex-col relative">
        <div className="h-10 border-b border-transparent" />
        {hours.map((hour) => (
          <div
            key={`slot-${hour}`}
            className="h-16 border-b border-transparent cursor-pointer hover:bg-white/40 transition-colors"
            onClick={() => onSlotClick(staff.id, hour)}
          />
        ))}
      </div>
    ))}
  </div>
);

const AppointmentsLayer = ({ staffMembers, appointments, getStyle }) => (
  <div className="absolute inset-0 flex pointer-events-none z-10">
    {staffMembers.map((staff) => {
      const staffAppts = appointments.filter(a => a.staffId === staff.id);
      return (
        <div key={`appts-${staff.id}`} className="flex-1 relative border-r border-transparent">
          {staffAppts.map((appt) => (
            <div
              key={appt.id}
              style={{ ...getStyle(appt.startTime, appt.endTime), backgroundColor: appt.color || '#3b82f6' }}
              className="rounded-md p-2 text-white shadow-sm overflow-hidden pointer-events-auto cursor-pointer hover:brightness-110 transition-all border border-white/20"
            >
              <p className="text-xs font-bold truncate leading-tight">{appt.title}</p>
              <p className="text-[10px] opacity-90 truncate leading-tight mt-0.5">
                {appt.startTime} - {appt.endTime}
              </p>
            </div>
          ))}
        </div>
      );
    })}
  </div>
);

const TimeIndicator = ({ pos, hour, minute }) => (
  <div
    className="absolute left-0 right-0 pointer-events-none z-30 flex items-center"
    style={{ top: `${pos}px`, transform: 'translateY(-50%)', marginLeft: '-64px' }}
  >
    <div className="bg-[#ff4757] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-40 ml-1 shadow-sm">
      {`${padTwo(hour)}:${padTwo(minute)}`}
    </div>
    <div className="h-[1.5px] bg-[#ff4757] flex-1" />
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const CalendarGrid = ({ staffMembers, appointments, currentDate, timeRange, onSlotClick }) => {
  const [now, setNow] = useState(new Date());
  const gridScrollRef = useRef(null);
  
  const hours  = generateHours(timeRange.start, timeRange.end);
  const isToday = isDateToday(currentDate);

  // ── Time indicator position ─────────────────────────────────────────────────
  const calcIndicatorPos = useCallback(() => {
    if (!isToday) return null;

    const h = now.getHours();
    const m = now.getMinutes();

    if (h >= timeRange.start && h <= timeRange.end) {
      const offset = h - timeRange.start;
      return HEADER_HEIGHT + (offset * SLOT_HEIGHT) + (SLOT_HEIGHT * (m / 60));
    }
    if (h > timeRange.end) {
      return HEADER_HEIGHT + ((timeRange.end - timeRange.start + 1) * SLOT_HEIGHT);
    }
    return HEADER_HEIGHT;
  }, [now, isToday, timeRange]);

  const timeIndicatorPos = calcIndicatorPos();

  // ── Scroll to current time ──────────────────────────────────────────────────
  const scrollToCurrentTime = useCallback(() => {
    if (gridScrollRef.current && timeIndicatorPos !== null) {
      gridScrollRef.current.scrollTo({
        top: Math.max(0, timeIndicatorPos - 100),
        behavior: 'smooth',
      });
    }
  }, [timeIndicatorPos]);

  // ── Effects ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.addEventListener('scrollToCurrentTime', scrollToCurrentTime);
    return () => window.removeEventListener('scrollToCurrentTime', scrollToCurrentTime);
  }, [scrollToCurrentTime]);

  useEffect(() => {
    if (isToday) setTimeout(scrollToCurrentTime, 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Appointment style ───────────────────────────────────────────────────────
  const getAppointmentStyle = useCallback((startTime, endTime) => {
    const startMins   = timeToMinutes(startTime);
    const endMins     = timeToMinutes(endTime);
    const dayStartMins = timeRange.start * 60;
    const topOffset   = Math.max(0, startMins - dayStartMins);
    const duration    = endMins - startMins;

    return {
      top:      `${HEADER_HEIGHT + (topOffset / 60) * SLOT_HEIGHT}px`,
      height:   `${(duration / 60) * SLOT_HEIGHT}px`,
      left:     '4px',
      right:    '4px',
      position: 'absolute',
      zIndex:   10,
    };
  }, [timeRange.start]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 bg-white overflow-hidden relative">
      <StaffHeaders staffMembers={staffMembers} />

      <div ref={gridScrollRef} className="flex flex-1 overflow-y-auto relative bg-[#e5e5e5]">
        <TimeColumn hours={hours} />

        <div className="flex-1 flex relative">
          <GridBackground staffMembers={staffMembers} hours={hours} />
          <InteractiveSlots staffMembers={staffMembers} hours={hours} onSlotClick={onSlotClick} />
          <AppointmentsLayer staffMembers={staffMembers} appointments={appointments} getStyle={getAppointmentStyle} />

          {timeIndicatorPos !== null && (
            <TimeIndicator
              pos={timeIndicatorPos}
              hour={now.getHours()}
              minute={now.getMinutes()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;