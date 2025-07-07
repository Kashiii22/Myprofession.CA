"use client";

import React from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const Calendar = ({ selected, onSelect }) => {
return (
<div className="rounded-md border border-blue-700 bg-gray-900 p-4 text-white shadow-md">
<DayPicker
mode="single"
selected={selected}
onSelect={onSelect}
className="text-white"
styles={{
caption: { color: "#60A5FA" },
nav_button: { color: "#60A5FA" },
day_selected: { backgroundColor: "#3B82F6", color: "#fff" },
day_today: { border: "1px solid #3B82F6" },
}}
/>
</div>
);
};

export default Calendar;