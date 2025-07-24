"use client";

import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const Calendar = ({ selected, onSelect, availableDates = [], bookedDates = [] }) => {
  const today = new Date();
  const available = availableDates.map((d) => new Date(d));
  const booked = bookedDates.map((d) => new Date(d));

  return (
    <div className="rounded-md border border-blue-700 bg-gray-900 p-4 text-white shadow-md">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        fromDate={today} // disables selection of past dates
        modifiers={{
          available,
          booked,
          disabled: { before: today }, // mark past dates as disabled
        }}
        modifiersStyles={{
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
            color: "#9ca3af", // Tailwind gray-400
            opacity: 0.4,
            filter: "blur(0.5px)", // add subtle blur
            cursor: "not-allowed",
          },
        }}
        styles={{
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
        }}
      />
    </div>
  );
};

export default Calendar;
