import React, { useState } from "react";
import { useTranslation } from "../../../CustomHooks/TraslateHook";

export default function CalendarCustomDays() {
  const today = new Date();
  const { t } = useTranslation();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startDayOfWeek = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isWeekend = (date) => {
    const d = date.getDay();
    return d === 0 || d === 6;
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const isSameDay = (a, b) => {
    return (
      a &&
      b &&
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    );
  };

  const renderDays = () => {
    const totalDays = daysInMonth(currentMonth);
    const startOffset = startDayOfWeek(currentMonth);

    const days = [];

    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i
      );

      const selected = isSameDay(date, selectedDate);

      days.push(
        <div
          key={i}
          onClick={() => handleDayClick(date)}
          style={{
            padding: 10,
            cursor: "pointer",
            borderRadius: 8,
            background: selected ? "#2563eb" : "transparent",
            color: selected ? "white" : "black",
            textAlign: "center",
          }}
        >
          <div>{i}</div>
        </div>
      );
    }

    return days;
  };

  const changeMonth = (offset) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + offset,
        1
      )
    );
  };

  return (
    <div style={{ width: 300, margin: "0 auto", fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <button onClick={() => changeMonth(-1)}>←</button>
        <strong>
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </strong>
        <button onClick={() => changeMonth(1)}>→</button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 5,
        }}
      >
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontWeight: "bold" }}>
            {d}
          </div>
        ))}

        {renderDays()}
      </div>
    </div>
  );
}