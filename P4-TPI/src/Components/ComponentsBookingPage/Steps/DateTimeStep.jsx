import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "../../../../CustomHooks/TraslateHook";
import { fetchAvailableSlots } from "../../../services/appointmentService";
import BookingCalendar from "../Calendar";
import StatusPanel from "../StatusPanel";

const today = new Date();
today.setHours(0, 0, 0, 0);

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

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t("selectDateTime") || "Select a Date & Time"}</h2>
        <p className="text-gray-500 mt-1">{t("bookingSubtitle") || "Choose your preferred appointment date and time slot"}</p>
      </div>

      <div className="w-full max-w-sm mx-auto border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <BookingCalendar
          selected={booking.day}
          onSelect={onSelectDay}
          viewDate={viewDate}
          onViewDateChange={setViewDate}
          minDate={today}
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
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            {slots.map((slot) => {
              const selected = booking.startTime === slot.startTime;
              return (
                <button
                  key={slot.startTime}
                  type="button"
                  onClick={() => onSelectSlot(slot.startTime, slot.endTime)}
                  className={`py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                    selected
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {slot.startTime}
                </button>
              );
            })}
          </div>
        </StatusPanel>
      )}
    </div>
  );
};

export default DateTimeStep;
