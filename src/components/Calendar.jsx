"use client";

import React, { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const Calendar = ({ selected, onSelect, availableDates = [], bookedDates = [] }) => {
  const today = new Date();

  // Memoize date arrays
  const available = useMemo(() => availableDates.map(date => new Date(date)), [availableDates]);
  const booked = useMemo(() => bookedDates.map(date => new Date(date)), [bookedDates]);

  const modifiers = useMemo(() => ({
    available,
    booked,
    disabled: { before: today },
  }), [available, booked, today]);

  const modifiersStyles = useMemo(() => ({
    available: {
      backgroundColor: "#16A34A", // green-600
      color: "#fff",
      borderRadius: "50%",
    },
    booked: {
      backgroundColor: "#F1F5F9", // slate-100
      color: "#000",
      border: "1px solid #cbd5e1", // slate-300
      borderRadius: "50%",
    },
    disabled: {
      color: "#9ca3af", // gray-400
      opacity: 0.5,
      filter: "blur(0.5px)",
      cursor: "not-allowed",
    },
  }), []);

  const styles = useMemo(() => ({
    caption: { color: "#60A5FA" }, // blue-400
    nav_button: { color: "#60A5FA" },
    day_selected: {
      backgroundColor: "#3B82F6", // blue-500
      color: "#fff",
      borderRadius: "50%",
    },
    day_today: {
      border: "1px solid #3B82F6",
      borderRadius: "50%",
    },
  }), []);

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto p-4 sm:p-6 bg-gray-900 text-white border border-blue-700 rounded-md shadow-md">
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
