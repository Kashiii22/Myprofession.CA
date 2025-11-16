"use client";

import { useState, useEffect } from "react";
import { FaComments, FaPhone, FaVideo, FaCalendarAlt } from "react-icons/fa";
import Calendar from "./Calendar";

const MODES = [
  { type: "chat", icon: <FaComments /> },
  { type: "voice", icon: <FaPhone /> },
  { type: "video", icon: <FaVideo /> },
];

export default function ScheduleSessionModal({
  onClose,
  mentorId,
  mentorName,
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
  const durations = [15, 20, 30, 45, 60];
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [meetingTopic, setMeetingTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // Function to handle booking submission
  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedSlot || !meetingTopic.trim()) {
      alert("Please select a date, time slot, and provide a meeting topic");
      return;
    }

    setIsLoading(true);
    
    try {
      const bookingData = {
        mentorId,
        date: selectedDate,
        slot: selectedSlot,
        mode: selectedMode,
        duration: selectedDuration,
        topic: meetingTopic.trim(),
        totalPrice: getPriceForDuration(parseInt(selectedDuration), selectedMode).replace('₹', '')
      };

      // This would be your API call to submit the booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert('Session booked successfully! You will receive a confirmation email.');
        onClose();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to book session. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get available slots for selected date
  const getAvailableSlotsForDate = () => {
    const selectedDateInfo = dayWiseAvailableDates.find(d => d.date === selectedDate);
    return selectedDateInfo?.slots || [];
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
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-8 rounded-2xl w-full max-w-6xl border border-blue-700/50 shadow-2xl backdrop-blur-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-blue-400 flex items-center gap-3">
              <FaCalendarAlt />
              Schedule Session with {mentorName || "Mentor"}
            </h2>
            <p className="text-gray-400 mt-2">Select a convenient date and time slot</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-3xl font-bold transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2 space-y-6">
            {uniqueAvailableDates.length > 0 ? (
              <>
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-semibold text-blue-300 mb-4">Select Date</h3>
                  <Calendar
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date?.toISOString().split('T')[0]);
                      setSelectedSlot(null); // Reset slot when date changes
                    }}
                    availableDates={uniqueAvailableDates}
                    bookedDates={bookedDates}
                  />
                </div>

                {/* Time Slot Selection */}
                {selectedDate && (
                  <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-semibold text-blue-300 mb-4">Available Time Slots</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {getAvailableSlotsForDate().map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-4 rounded-lg border transition-all ${
                            selectedSlot?.startTime === slot.startTime
                              ? "bg-blue-600 border-blue-400 text-white"
                              : "bg-gray-800 border-gray-600 text-gray-300 hover:border-blue-500 hover:bg-blue-900/20"
                          }`}
                        >
                          <div className="text-sm font-medium">{slot.startTime}</div>
                          <div className="text-xs opacity-75">{slot.endTime}</div>
                        </button>
                      ))}
                    </div>
                    {getAvailableSlotsForDate().length === 0 && (
                      <p className="text-gray-400 text-center py-8">No available slots for this date</p>
                    )}
                  </div>
                )}

                <div className="text-sm text-gray-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Available dates ({uniqueAvailableDates.length})</span>
                  </div>
                  {bookedDates.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Booked ({bookedDates.length} dates)</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-gray-800 p-8 rounded-xl text-center">
                <p className="text-gray-400 text-lg mb-2">No available dates currently</p>
                <p className="text-gray-500">Please contact the mentor directly to schedule a session.</p>
              </div>
            )}
          </div>

          {/* Booking Options Section */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">Session Mode</h3>
              <div className="grid grid-cols-3 gap-3">
                {MODES.map(({ type, icon }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedMode(type)}
                    className={`p-3 rounded-lg flex flex-col items-center gap-2 text-sm transition-all ${
                      selectedMode === type
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <div className="text-xl">{icon}</div>
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">Session Duration</h3>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full bg-gray-800 text-white border border-blue-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration} minutes - {getPriceForDuration(duration, selectedMode)}
                  </option>
                ))}
              </select>
            </div>

            {/* Meeting Topic Description */}
            <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-300 mb-4">Meeting Topic</h3>
              <textarea
                value={meetingTopic}
                onChange={(e) => setMeetingTopic(e.target.value)}
                placeholder="Describe what you'd like to discuss in this session..."
                className="w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-right mt-2">
                <span className="text-xs text-gray-400">{meetingTopic.length}/500</span>
              </div>
            </div>

            {/* Booking Summary */}
            {(selectedDate || selectedSlot) && (
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-blue-600/50">
                <h3 className="text-lg font-semibold text-blue-300 mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white">{selectedDate}</span>
                    </div>
                  )}
                  {selectedSlot && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mode:</span>
                    <span className="text-white capitalize">{selectedMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{selectedDuration} minutes</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-600">
                    <span className="text-gray-400">Total Price:</span>
                    <span className="text-xl font-bold text-green-400">{getPriceForDuration(parseInt(selectedDuration), selectedMode)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleBookingSubmit}
              disabled={isLoading || !selectedDate || !selectedSlot || !meetingTopic.trim()}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isLoading || !selectedDate || !selectedSlot || !meetingTopic.trim()
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              }`}
            >
              {isLoading ? "Processing..." : "Request Booking"}
            </button>

            {!selectedDate && uniqueAvailableDates.length > 0 && (
              <p className="text-center text-gray-400 text-sm">Please select a date to continue</p>
            )}
            {selectedDate && !selectedSlot && getAvailableSlotsForDate().length > 0 && (
              <p className="text-center text-gray-400 text-sm">Please select a time slot</p>
            )}
            {selectedDate && selectedSlot && !meetingTopic.trim() && (
              <p className="text-center text-gray-400 text-sm">Please describe your meeting topic</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
