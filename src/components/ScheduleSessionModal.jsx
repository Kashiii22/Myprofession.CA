"use client";

import { FaComments, FaPhone, FaVideo } from "react-icons/fa";
import Calendar from "./Calendar";
import { useEffect } from "react";

const MODES = [
  { type: "chat", icon: <FaComments /> },
  { type: "voice", icon: <FaPhone /> },
  { type: "video", icon: <FaVideo /> },
];

export default function ScheduleSessionModal({
  onClose,
  selectedDate,
  setSelectedDate,
  selectedMode,
  setSelectedMode,
  selectedDuration,
  setSelectedDuration,
  mentorPricing = [],
  minSessionDuration = 15,
  availableDates = [],
  bookedDates = [],
  DAY_WISE_AVAILABILITY = []
}) {
  const durations = [15, 20, 30];

  // Function to convert day-wise availability to calendar dates
  const generateAvailableDatesFromDayWise = (dayWiseAvailability) => {
    const today = new Date();
    const availableDates = [];
    const dayMap = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };

    // Generate dates for next 30 days
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      
      // Skip past dates
      if (currentDate < today) continue;
      
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      const dayIndex = dayMap[dayOfWeek];
      
      // Check if this day has available slots
      const dayAvailability = dayWiseAvailability.find(day => day.day === dayOfWeek);
      if (dayAvailability && dayAvailability.slots && dayAvailability.slots.length > 0) {
        const dateStr = currentDate.toISOString().split('T')[0];
        availableDates.push({
          date: dateStr,
          day: dayOfWeek,
          slots: dayAvailability.slots,
          originalData: dayAvailability
        });
      }
    }
    
    return availableDates;
  };

  // Generate all available dates from day-wise availability
  const dayWiseAvailableDates = generateAvailableDatesFromDayWise(DAY_WISE_AVAILABILITY);
  
  // Merge day-wise generated dates with any existing available dates
  const allAvailableDates = [...availableDates, ...dayWiseAvailableDates.map(d => d.date)];
  
  // Get unique dates
  const uniqueAvailableDates = [...new Set(allAvailableDates)];

  // Function to get price based on selected mode
  const getPriceForMode = (mode) => {
    const pricingItem = mentorPricing.find(p => p.type === mode);
    return pricingItem?.price || 30; // Fallback price
  };

  const getPriceForDuration = (duration, mode) => {
    const pricePerMinute = getPriceForMode(mode);
    return `₹${duration * pricePerMinute}`;
  };

  // CONSOLE LOGGING - Show modal data
  useEffect(() => {
    console.log('📅 SCHEDULE MODAL DATA:');
    console.log('Original Available Dates:', availableDates);
    console.log('Day Wise Availability:', DAY_WISE_AVAILABILITY);
    console.log('Generated Day Wise Dates:', dayWiseAvailableDates);
    console.log('All Available Dates (merged):', allAvailableDates);
    console.log('Unique Available Dates:', uniqueAvailableDates);
    console.log('Booked Dates:', bookedDates);
    console.log('Mentor Pricing Array:', mentorPricing);
    console.log('Min Session Duration:', minSessionDuration);
    console.log('Selected Mode:', selectedMode);
    console.log('Price For Selected Mode:', getPriceForMode(selectedMode));
    console.log('Has Generated Dates:', dayWiseAvailableDates.length);
  }, [availableDates, bookedDates, mentorPricing, minSessionDuration, selectedMode, DAY_WISE_AVAILABILITY]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center px-4">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-4xl border border-blue-700 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-400">Schedule a Session</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-2xl font-bold">
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div>
            {uniqueAvailableDates.length > 0 ? (
              <>
                <Calendar
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  availableDates={uniqueAvailableDates}
                  bookedDates={bookedDates}
                />
                <div className="mt-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Available dates from schedule ({uniqueAvailableDates.length})</span>
                  </div>
                  {dayWiseAvailableDates.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Generated from {DAY_WISE_AVAILABILITY?.length || 0} day{DAY_WISE_AVAILABILITY?.length !== 1 ? 's' : ''} with available slots
                    </p>
                  )}
                  {bookedDates.length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Booked ({bookedDates.length} dates)</span>
                    </div>
                  )}
                </div>

                {/* Selected Date Details */}
                {selectedDate && (() => {
                  const selectedDateInfo = dayWiseAvailableDates.find(d => d.date === selectedDate);
                  return selectedDateInfo ? (
                    <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-800">
                      <p className="text-blue-300 font-medium mb-2">
                        {selectedDateInfo.day} - {selectedDate}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-300">Available slots:</p>
                        {selectedDateInfo.slots.map((slot, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-200">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </>
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg text-center">
                <p className="text-gray-400 mb-2">No available dates currently</p>
                <p className="text-gray-500 text-sm">Please contact the mentor directly to schedule a session.</p>
                {DAY_WISE_AVAILABILITY.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Day-wise schedule found but no slots available in next 30 days
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Options Section */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">Select Mode</p>
              <div className="flex gap-3">
                {MODES.map(({ type, icon }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedMode(type)}
                    className={`p-3 rounded-lg flex items-center gap-2 text-sm transition-all ${
                      selectedMode === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {icon}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
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
                {durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} minutes - {getPriceForDuration(duration, selectedMode)}
                  </option>
                ))}
              </select>
            </div>

            {/* Book Now Button */}
            <button 
              className={`w-full mt-4 py-2 rounded-lg transition-all ${
                uniqueAvailableDates.length > 0 && selectedDate
                  ? "bg-blue-700 hover:bg-blue-800 text-white"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
              disabled={uniqueAvailableDates.length === 0 || !selectedDate}
            >
              {uniqueAvailableDates.length === 0 ? "No Available Dates" : selectedDate ? "Book Now" : "Select a Date"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
