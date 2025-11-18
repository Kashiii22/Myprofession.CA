"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { 
  FaComments, FaVideo, FaArrowLeft, FaCalendarAlt, 
  FaClock, FaUser, FaMapMarkerAlt, FaStar, FaCheck, FaVideoSlash,
  FaBusinessTime, FaDollarSign
} from "react-icons/fa";
import Image from "next/image";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMentorById } from '@/lib/api/mentorApi';

const MODES = [
  { type: "chat", icon: <FaComments />, label: "Chat" },
  { type: "video", icon: <FaVideo />, label: "Video Call" },
];

// Custom Calendar with Event Visualization
const CustomCalendar = ({ selected, onSelect, dayWiseAvailableDates }) => {
  const today = new Date();
  const [hoveredDay, setHoveredDay] = useState(null);
  
  // Generate calendar days with events
  const renderDay = (day) => {
    const dateStr = day.toISOString().split('T')[0];
    const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
    const hasEvents = dayWiseAvailableDates.find(d => d.date === dateStr);
    const isSelected = selected === dateStr;
    const isPast = day < today;
    
    const getEventCount = () => {
      if (!hasEvents) return 0;
      return hasEvents.slots.length;
    };
    
    const getEventColor = () => {
      const count = getEventCount();
      if (count === 0) return 'bg-gray-700';
      if (count <= 2) return 'bg-green-600';
      if (count <= 4) return 'bg-blue-600';
      return 'bg-purple-600';
    };
    
    const getEventText = () => {
      const count = getEventCount();
      if (count === 0) return '';
      if (count === 1) return `${count} slot`;
      return `${count} slots`;
    };
    
    return (
      <div
        className={`
          relative h-20 p-1 border rounded-lg transition-all cursor-pointer
          ${isPast ? 'opacity-40 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-gray-800/50'}
          ${isSelected ? 'border-blue-500 bg-blue-900/30 ring-2 ring-blue-500/50' : 'border-gray-700'}
          ${!isPast && !hasEvents && 'opacity-60'}
        `}
        onClick={() => !isPast && onSelect(dateStr)}
        onMouseEnter={() => setHoveredDay(dateStr)}
        onMouseLeave={() => setHoveredDay(null)}
      >
        <div className="text-center">
          <div className={`text-sm font-medium ${isSelected ? 'text-blue-300' : isPast ? 'text-gray-500' : 'text-white'}`}>
            {day.getDate()}
          </div>
          <div className="text-xs text-gray-400">
            {day.toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
        </div>
        
        {getEventCount() > 0 && (
          <div className="absolute bottom-1 left-1 right-1">
            <div className={`${getEventColor()} text-white text-xs rounded py-0.5 px-1 text-center truncate`}>
              {getEventText()}
            </div>
          </div>
        )}
        
        {hoveredDay === dateStr && hasEvents && (
          <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
            <div className="text-white text-xs">
              <div className="font-semibold mb-1">{dayName}</div>
              <div className="space-y-1">
                {hasEvents.slots.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-xs">
                    <FaClock className="text-blue-400" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-px">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const generateCalendarDays = () => {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startPadding = firstDayOfMonth.getDay();
    const days = [];
    
    // Add padding days
    for (let i = 0; i < startPadding; i++) {
      days.push(<div key={`pad-${i}`} className="h-20"></div>);
    }
    
    // Add actual days
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      days.push(renderDay(new Date(year, month, day)));
    }
    
    return days;
  };
  
  return (
    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-blue-400">
          {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-gray-400">1-2 slots</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-gray-400">3-4 slots</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span className="text-gray-400">5+ slots</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays()}
      </div>
    </div>
  );
};

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const mentorId = params?.id;

  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking states
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedMode, setSelectedMode] = useState("video");
  const [meetingTopic, setMeetingTopic] = useState("");
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  

  useEffect(() => {
    if (!mentorId) {
      setIsLoading(false);
      setError("No mentor ID specified.");
      return;
    }

    const fetchMentorDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await getMentorById(mentorId);
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch mentor details');
        }

        const mentorData = result.data;

        const transformedMentor = {
          id: mentorData._id,
          name: mentorData.userRef.name,
          image: mentorData.userRef.avatar || "https://i.pravatar.cc/150?img=12",
          title: mentorData.registrationRef?.qualification?.[0] || 'Professional Mentor',
          rating: mentorData.rating || 4.5,
          pricing: mentorData.pricing || [
            { type: "chat", price: 10, duration: 1 },
            { type: "video", price: 30, duration: 1 }
          ],
          minSessionDuration: mentorData.minSessionDuration || 15,
          isActive: mentorData.isActive || false,
          isBanned: mentorData.isBanned || false,
          isAvailableNow: mentorData.isAvailableNow || false,
          availabilitySchedule: mentorData.availability || [],
          languages: mentorData.registrationRef?.languages || [],
          experience: mentorData.registrationRef?.experienceInfo || "Experienced professional",
          qualifications: mentorData.registrationRef?.qualification || [],
          expertise: mentorData.registrationRef?.expertise || [],
          location: mentorData.registrationRef?.languages?.join(", ") || "Location not specified",
          about: `${mentorData.registrationRef?.experienceInfo || "Experienced professional"} with expertise in ${mentorData.registrationRef?.expertise?.join(", ") || "multiple areas"}.`,
          socials: mentorData.socials || {},
        };

        setMentor(transformedMentor);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorDetails();
  }, [mentorId]);

  // Function to convert day-wise availability to calendar dates
  const generateAvailableDatesFromDayWise = (dayWiseAvailability) => {
    const today = new Date();
    const dates = [];
    const dayMap = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      
      if (currentDate < today) continue;
      
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      const dayIndex = dayMap[dayOfWeek];
      
      const dayAvailability = dayWiseAvailability.find(day => day.day === dayOfWeek);
      if (dayAvailability && dayAvailability.slots && dayAvailability.slots.length > 0) {
        const dateStr = currentDate.toISOString().split('T')[0];
        dates.push({
          date: dateStr,
          day: dayOfWeek,
          slots: dayAvailability.slots,
          originalData: dayAvailability
        });
      }
    }
    
    return dates;
  };

  // Generate all available dates from day-wise availability
  const dayWiseAvailableDates = generateAvailableDatesFromDayWise(mentor?.availabilitySchedule || []);
  
  // Get unique dates from day-wise availability
  const uniqueAvailableDates = dayWiseAvailableDates.map(d => d.date);

  // Function to get price per minute based on selected mode
  const getPricePerMinute = (mode) => {
    const pricingItem = mentor?.pricing?.find(p => p.type === mode);
    return pricingItem?.price || 30; // Price per minute
  };

  const getPriceForDuration = (duration, mode) => {
    const pricePerMinute = getPricePerMinute(mode);
    return `₹${duration * pricePerMinute}`;
  };

  

  // Function to handle booking submission
  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedSlot || !meetingTopic.trim()) {
      alert("Please select a date, time slot, and provide a meeting topic");
      return;
    }

    setIsBookingLoading(true);
    
    try {
      const sessionDuration = mentor?.minSessionDuration || 15;
      const bookingData = {
        mentorId: mentor.id,
        date: selectedDate,
        slot: selectedSlot,
        mode: selectedMode,
        duration: sessionDuration,
        topic: meetingTopic.trim(),
        totalPrice: getPriceForDuration(sessionDuration, selectedMode).replace('₹', '')
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
        router.push('/dashboard'); // Redirect to dashboard after successful booking
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to book session. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book session. Please try again.');
    } finally {
      setIsBookingLoading(false);
    }
  };

  // Function to get available slots for selected date
  const getAvailableSlotsForDate = () => {
    const selectedDateInfo = dayWiseAvailableDates.find(d => d.date === selectedDate);
    return selectedDateInfo?.slots || [];
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Header />
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading booking page...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error State
  if (error || !mentor) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Header />
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-2xl max-w-md">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-red-400 text-xl font-bold mb-3">Unable to Load Booking</h2>
            <p className="text-red-300 mb-4">{error || 'Mentor not found'}</p>
            <button
              onClick={() => router.push('/mentors')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors"
            >
              Go Back to Mentors
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen">
      <Header />
      
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all hover:gap-3"
          >
            <FaArrowLeft className="text-xl" />
            <span className="text-lg font-medium">Back to Profile</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Book Your Session
            </h1>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Mentor Compact Info Card */}
        <div className="bg-[#0f172a]/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-blue-500/50">
                <Image src={mentor.image} alt={mentor.name} fill className="object-cover" />
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{mentor.name}</h2>
                <p className="text-blue-300">{mentor.title}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <FaUser className="text-blue-400" />
                  <span>Experience: {mentor.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaStar className="text-yellow-400" />
                  <span>Rating: {mentor.rating}/5</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaClock className="text-green-400" />
                  <span>Min Session: {mentor.minSessionDuration} min</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaCalendarAlt className="text-purple-400" />
                  <span>{mentor.availabilitySchedule.filter(d => d.slots.length > 0).length} days available</span>
                </div>
              </div>
              {mentor.expertise.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-900/30 border border-blue-600/50 rounded-full text-xs text-blue-300">
                      {skill}
                    </span>
                  ))}
                  {mentor.expertise.length > 4 && (
                    <span className="px-2 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-400">
                      +{mentor.expertise.length - 4} more
                    </span>
                  )}
                </div>
              )}
              {mentor.languages.length > 0 && (
                <div className="text-xs text-gray-400">
                  Languages: {mentor.languages.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Booking Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Section - 7 columns */}
          <div className="lg:col-span-7">
            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <FaCalendarAlt />
                Select Date & Time
              </h3>
              
              {dayWiseAvailableDates.length > 0 ? (
                <div className="space-y-6">
                  {/* Enhanced Calendar with Events */}
                  <CustomCalendar
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    dayWiseAvailableDates={dayWiseAvailableDates}
                  />

                  {/* Time Slots Grid */}
                  {selectedDate && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-400">Available slots for {selectedDate}</p>
                        <p className="text-xs text-gray-500">
                          {getAvailableSlotsForDate().length} slot{getAvailableSlotsForDate().length !== 1 ? 's' : ''} available
                        </p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {getAvailableSlotsForDate().map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-3 rounded-lg text-xs sm:text-sm transition-all group ${
                              selectedSlot?.startTime === slot.startTime
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/30 transform scale-105"
                                : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 hover:border-blue-500"
                            }`}
                          >
                            <div className="font-semibold text-center">{slot.startTime}</div>
                            <div className="text-xs opacity-75 text-center">→ {slot.endTime}</div>
                            <div className="text-xs text-center mt-1 opacity-60">
                              {(() => {
                                const start = new Date(`1970-01-01T${slot.startTime}:00`);
                                const end = new Date(`1970-01-01T${slot.endTime}:00`);
                                const duration = (end - start) / (1000 * 60);
                                return `${duration} min`;
                              })()}
                            </div>
                          </button>
                        ))}
                      </div>
                      {getAvailableSlotsForDate().length === 0 && (
                        <div className="text-center py-8 bg-gray-800/30 rounded-lg">
                          <FaVideoSlash className="text-3xl text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-400">No available slots</p>
                          <p className="text-gray-500 text-sm">Please select another date</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Available Days Summary */}
                  {!selectedDate && (
                    <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
                      <p className="text-xs text-gray-400 font-medium mb-2">Mentor's Weekly Schedule:</p>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 text-xs">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                          const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][idx];
                          const daySchedule = mentor?.availabilitySchedule?.find(d => d.day === dayName);
                          const hasSlots = daySchedule?.slots && daySchedule.slots.length > 0;
                          return (
                            <div 
                              key={day}
                              className={`text-center p-2 rounded border ${
                                hasSlots 
                                  ? 'bg-green-900/20 border-green-700/50 text-green-400' 
                                  : 'bg-gray-800/50 border-gray-700 text-gray-500'
                              }`}
                            >
                              <div className="font-medium">{day}</div>
                              {hasSlots && (
                                <div className="text-xs mt-1">
                                  {daySchedule.slots.length} slot{daySchedule.slots.length !== 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-800/30 rounded-lg">
                  <FaCalendarAlt className="text-4xl text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 mb-2">No available dates currently</p>
                  <p className="text-gray-500 text-sm">Please contact the mentor directly</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - 5 columns */}
          <div className="lg:col-span-5 space-y-4">
            {/* Session Mode */}
            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-gray-800 rounded-xl p-4">
              <h3 className="text-base font-semibold text-blue-400 mb-3">Session Mode</h3>
              <div className="grid grid-cols-2 gap-2">
                {MODES.map(({ type, icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedMode(type)}
                    className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${
                      selectedMode === type
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    <div className="text-lg">{icon}</div>
                    <span className="text-xs font-medium">{label}</span>
                    <span className="text-xs text-gray-400">₹{getPricePerMinute(type)}/min</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Session Duration Info */}
            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-gray-800 rounded-xl p-4">
              <h3 className="text-base font-semibold text-blue-400 mb-3">Session Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaBusinessTime className="text-green-400" />
                    <span className="text-sm">Session Duration</span>
                  </div>
                  <span className="text-sm font-semibold">{mentor?.minSessionDuration || 15} minutes</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaDollarSign className="text-yellow-400" />
                    <span className="text-sm">Rate</span>
                  </div>
                  <span className="text-sm font-semibold">₹{getPricePerMinute(selectedMode)}/minute</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-600/50 rounded-lg">
                  <span className="text-sm font-medium">Total Session Cost</span>
                  <span className="text-lg font-bold text-green-400">
                    {getPriceForDuration(mentor?.minSessionDuration || 15, selectedMode)}
                  </span>
                </div>
              </div>
              <div className="mt-3 p-2 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-400">
                  💡 All sessions are {mentor?.minSessionDuration || 15} minutes minimum with transparent per-minute pricing
                </p>
              </div>
            </div>

            {/* Meeting Topic */}
            <div className="bg-[#0f172a]/50 backdrop-blur-md border border-gray-800 rounded-xl p-4">
              <h3 className="text-base font-semibold text-blue-400 mb-3">What would you like to discuss?</h3>
              <textarea
                value={meetingTopic}
                onChange={(e) => setMeetingTopic(e.target.value)}
                placeholder="I'd like to discuss..."
                className="w-full bg-gray-800/50 text-white border border-gray-700 p-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none resize-none text-sm"
                rows={3}
                maxLength={500}
              />
              <div className="text-right mt-1">
                <span className="text-xs text-gray-500">{meetingTopic.length}/500</span>
              </div>
            </div>

            {/* Summary */}
            {(selectedDate || selectedSlot) && (
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-600/50 rounded-xl p-4">
                <h3 className="text-base font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  <FaCheck className="text-green-400" />
                  Booking Summary
                </h3>
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
                    <span className="text-white">{mentor?.minSessionDuration || 15} min</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="text-gray-300 font-medium">Total:</span>
                    <span className="text-lg font-bold text-green-400">{getPriceForDuration(mentor?.minSessionDuration || 15, selectedMode)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBookingSubmit}
              disabled={isBookingLoading || !selectedDate || !selectedSlot || !meetingTopic.trim()}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                isBookingLoading || !selectedDate || !selectedSlot || !meetingTopic.trim()
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50"
              }`}
            >
              {isBookingLoading ? "Processing..." : "Book Session"}
            </button>

            {/* Helper Text */}
            {!selectedDate && uniqueAvailableDates.length > 0 && (
              <p className="text-center text-gray-500 text-xs">Select a date to continue</p>
            )}
            {selectedDate && !selectedSlot && getAvailableSlotsForDate().length > 0 && (
              <p className="text-center text-gray-500 text-xs">Choose a time slot</p>
            )}
            {selectedDate && selectedSlot && !meetingTopic.trim() && (
              <p className="text-center text-gray-500 text-xs">Describe your meeting topic</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
