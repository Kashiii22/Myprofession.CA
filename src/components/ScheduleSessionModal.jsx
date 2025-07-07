"use client";

import { FaComments, FaPhone, FaVideo } from "react-icons/fa";
import  Calendar  from "./Calendar";

export default function ScheduleSessionModal({
onClose,
selectedDate,
setSelectedDate,
selectedMode,
setSelectedMode,
selectedDuration,
setSelectedDuration,
pricePerMinute,
}) {
return (
<div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center px-4">
<div className="bg-gray-900 p-6 rounded-lg w-full max-w-4xl border border-blue-700 shadow-xl">
<div className="flex justify-between items-center mb-4">
<h2 className="text-xl font-semibold text-blue-400">Schedule a Session</h2>
<button onClick={onClose} className="text-gray-300 hover:text-white text-2xl font-bold" >
×
</button>
</div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Calendar */}
      <div>
        <Calendar selected={selectedDate} onSelect={setSelectedDate} />
      </div>

      {/* Options */}
      <div className="space-y-6">
        {/* Mode Selection */}
        <div>
          <p className="text-sm font-medium text-gray-300 mb-2">Select Mode</p>
          <div className="flex gap-3">
            {["chat", "voice", "video"].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                  selectedMode === mode
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                {mode === "chat" && <FaComments />}
                {mode === "voice" && <FaPhone />}
                {mode === "video" && <FaVideo />}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div>
          <p className="text-sm font-medium text-gray-300 mb-2">Choose Duration</p>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="w-full bg-gray-800 text-white border border-blue-600 p-2 rounded"
          >
            <option value="15">15 minutes - ₹{15 * pricePerMinute}</option>
            <option value="20">20 minutes - ₹{20 * pricePerMinute}</option>
            <option value="30">30 minutes - ₹{30 * pricePerMinute}</option>
          </select>
        </div>

        {/* Book Button */}
        <button className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg">
          Book Now
        </button>
      </div>
    </div>
  </div>
</div>
);
}