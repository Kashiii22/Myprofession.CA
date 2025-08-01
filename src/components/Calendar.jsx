"use client";

import React, { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const Calendar = ({ selected, onSelect, availableDates = [], bookedDates = [] }) => {
  const today = new Date();

  // Memoize date conversions to avoid recalculating on every render
  const available = useMemo(() => availableDates.map(date => new Date(date)), [availableDates]);
  const booked = useMemo(() => bookedDates.map(date => new Date(date)), [bookedDates]);

  const modifiers = useMemo(() => ({
    available,
    booked,
    disabled: { before: today },
  }), [available, booked, today]);

  const modifiersStyles = useMemo(() => ({
    available: {
      backgroundColor: "#16A34A",
      color: "white",
      borderRadius: "50%",
    },
    booked: {
      backgroundColor: "#F1F5F9",
      color: "#000",
      border: "1px solid #cbd5e1",
      borderRadius: "50%",
    },
    disabled: {
      color: "#9ca3af",
      opacity: 0.4,
      filter: "blur(0.5px)",
      cursor: "not-allowed",
    },
  }), []);

  const styles = useMemo(() => ({
    caption: { color: "#60A5FA" },
    nav_button: { color: "#60A5FA" },
    day_selected: {
      backgroundColor: "#3B82F6",
      color: "#fff",
      borderRadius: "50%",
    },
    day_today: {
      border: "1px solid #3B82F6",
      borderRadius: "50%",
    },
  }), []);

  return (
    <div className="rounded-md border border-blue-700 bg-gray-900 p-4 text-white shadow-md">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        fromDate={today}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        styles={styles}
      />
    </div>
  );
};

export default Calendar;
