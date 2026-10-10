import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { fetchAvailableSlots } from "../../../services/appointmentService";
import BookingCalendar from "../Calendar";
import { addMonthsClamped } from "../dateUtils";
import StatusPanel from "../StatusPanel";

const today = new Date();
today.setHours(0, 0, 0, 0);

// Mismo límite que el backend (AppointmentService.MaxAppointmentMonthsAhead).
const maxBookingDate = addMonthsClamped(today, 2);

const PERIODS = [
  { key: "morning", label: "Mañana", test: (h) => h < 12 },
  { key: "afternoon", label: "Tarde", test: (h) => h >= 12 && h < 19 },
  { key: "evening", label: "Noche", test: (h) => h >= 19 },
];

const groupByPeriod = (slots) => {
  const groups = { morning: [], afternoon: [], evening: [] };
  slots.forEach((slot) => {
    const hour = parseInt(slot.startTime.split(":")[0], 10);
    const period = PERIODS.find((p) => p.test(hour)) || PERIODS[0];
    groups[period.key].push(slot);
  });
  return groups;
};

const DateTimeStep = ({ booking, onSelectDay, onSelectSlot }) => {
  const { t } = useTranslation();
  const initialViewDate = booking.day || today;
  const [viewDate, setViewDate] = useState(
    new Date(initialViewDate.getFullYear(), initialViewDate.getMonth(), 1)
  );
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSlots = useCallback(() => {
    if (!booking.day) return;
    setLoading(true);
    setError(null);
    fetchAvailableSlots({
      branchId: booking.branchId,
      staffId: booking.staffId,
      serviceId: booking.serviceId,
      date: booking.day,
    })
      .then((data) => setSlots(Array.isArray(data) ? data : []))
      .catch(() => {
        setSlots([]);
        setError(t("loadSlotsError") || "Couldn't load available time slots.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.branchId, booking.staffId, booking.serviceId, booking.day]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const groups = groupByPeriod(slots);

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a1a2e]">{t("selectDateTime") || "Select a Date & Time"}</h2>
        <p className="text-[#6b6b6b] mt-1">{t("bookingSubtitle") || "Choose your preferred appointment date and time slot"}</p>
      </div>

      <div className="w-full max-w-sm mx-auto border border-[#e2ddd8] rounded-2xl p-6 mb-8 shadow-sm bg-white">
        <BookingCalendar
          selected={booking.day}
          onSelect={onSelectDay}
          viewDate={viewDate}
          onViewDateChange={setViewDate}
          minDate={today}
          maxDate={maxBookingDate}
        />
      </div>

      {booking.day && (
        <StatusPanel
          loading={loading}
          error={error}
          isEmpty={!loading && !error && slots.length === 0}
          emptyMessage={t("noSlotsAvailable") || "No available time slots for this day. Try another day."}
          onRetry={loadSlots}
        >
          <div className="max-w-xl mx-auto flex flex-col gap-5">
            {PERIODS.map(({ key, label }) =>
              groups[key].length ? (
                <div key={key}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#b3aca3] mb-2">{label}</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {groups[key].map((slot) => {
                      const selected = booking.startTime === slot.startTime;
                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          onClick={() => onSelectSlot(slot.startTime, slot.endTime)}
                          className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                            selected
                              ? "border-[#1a1a2e] bg-[#1a1a2e] text-white shadow-sm"
                              : "border-[#e2ddd8] text-[#1a1a2e] hover:border-[#b3aca3] bg-white"
                          }`}
                        >
                          {slot.startTime}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </StatusPanel>
      )}
    </div>
  );
};

export default DateTimeStep;
