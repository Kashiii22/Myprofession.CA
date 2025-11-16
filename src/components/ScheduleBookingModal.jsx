"use client";

import { useEffect, useState } from "react";
import { FaLightbulb, FaCalendarAlt, FaClock, FaVideo, FaPhone, FaLaptop, FaShieldAlt, FaArrowLeft, FaCheckCircle, FaMoneyBillWave, FaUserTie, FaMedal, FaAward, FaBook, FaBriefcase, FaFacebook, FaInstagram } from "react-icons/fa";
import Calendar from "./Calendar";
import { getMentorById } from '@/lib/api/mentorApi';

const MODES = [
  { type: "video", icon: <FaVideo />, label: "Video Call", description: "Face-to-face video session" },
  { type: "voice", icon: <FaPhone />, label: "Audio Call", description: "Voice-only call session" },
  { type: "chat", label: "Text Chat", icon: <FaLaptop />, description: "Text messaging session" }
];

const ModalOverlay = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4">
    <div className="bg-gray-900 max-w-6xl w-full rounded-3xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-bold z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        ×
      </button>
      {children}
    </div>
  </div>
);

const BookingSuccessState = ({ bookingData, mentor, onClose }) => (
  <div className="p-12 text-center">
    <div className="text-green-300 text-8xl mb-6">
      <FaCheckCircle />
    </div>
    <h3 className="text-4xl font-bold text-white mb-4">Session Booked Successfully! 🎉</h3>
    <p className="text-gray-100 text-xl mb-8">
      Your mentorship session with <span className="font-bold text-green-400">{mentor.name}</span> has been confirmed
    </p>
    <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      <div className="text-left">
        <p className="text-gray-300 text-sm">Date & Time:</p>
        <p className="text-xl font-semibold text-white">{bookingData?.date || 'TBD'}</p>
        <p className="text-lg font-bold text-blue-400">{bookingData?.timeSlot || 'TBD'}</p>
      </div>
      <div className="text-right">
        <p className="text-gray-300 text-sm">Session Type:</p>
        <p className="text-xl font-semibold text-white capitalize">{bookingData?.mode || 'TBD'}</p>
        <p className="text-lg text-blue-400">{bookingData?.duration} minutes</p>
      </div>
    </div>
    <p className="text-xl font-bold text-green-400 mt-4">Price: {bookingData?.price || 'TBD'}</p>
    <div className="bg-green-800/30 rounded-2xl p-6 mt-4 border border-green-700">
      <p className="text-green-100 text-sm">
        <span className="inline-block">📋</span> Confirmation email sent with meeting details
      </p>
      <p className="text-green-100 text-sm mt-2">
        <span className="inline-block">📋</span> Session link available 15 minutes before start time
      </p>
    </div>
    <button
      onClick={onClose}
      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl text-xl font-bold transition-all transform hover:scale-105"
    >
      View Booking Details
    </button>
  </div>
);

export default function ScheduleBookingModal({
  mentorId,
  onClose
}) {
  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Form state
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMode, setSelectedMode] = useState("video");
  const [description, setDescription] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [backendMentorData, setBackendMentorData] = useState(null);
  
  // Session state  
  const [timeSlots, setTimeSlots] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfiram, setBookingConfiram] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  
  // Character limit for description
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  
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
        setBackendMentorData(mentorData)
        
        const transformedMentor = {
          id: mentorData._id,
          name: mentorData.userRef.name,
          image: mentorData.userRef.avatar || "https://i.pravatar.cc/150?img=12",
          email: mentorData.userRef.email,
          yearsOfExperience: mentorData.registrationRef?.yearsOfExperience || 0,
          experience: mentorData.registrationRef?.experienceInfo || "", 
          expertise: mentorData.registrationRef?.expertise || [],
          isActive: mentorData.isActive || false,
          isVerified: mentorData.userRef?.isVerified || false,
        };
        
        // Store availability data for the calendar
        if (mentorData.availability) {
          mentorData.availabilitySchedule = mentorData.availability?.map(day => ({
            ...day,
            availableSlots: day.slots || []
          }));
        }
        
        setMentor(transformedMentor);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorDetails();
  }, [mentorId]);

  // Generate available dates from backend availability
  const generateAvailableDates = () => {
    if (!backendMentorData?.availabilitySchedule) return [];
    
    const today = new Date();
    const available = [];
    
    // Generate dates for next 60 days
    for (let i = 0; i < 60; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      
      // Skip past dates
      if (currentDate < today) continue;
      
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      const dayAvailability = backendMentorData.availabilitySchedule.find(
        schedule => schedule.day === dayOfWeek
      );
      
      if (dayAvailability && dayAvailability.slots && dayAvailability.slots.length > 0) {
        available.push({
          date: currentDate.toISOString().split('T')[0],
          day: dayOfWeek,
          dayData: dayAvailability,
          availableSlots: dayAvailability.slots.length, // For UI display
        });
      }
    }
    
    return available;
  };

  // Update available dates when mentor data changes
  useEffect(() => {
    if (backendMentorData?.availabilitySchedule) {
      const availableDates = generateAvailableDates();
      // Store available dates in calendar format
      const calendarDates = availableDates.map(dateObj => ({
        date: dateObj.date,
        day: dateObj.day,
        dayData: dateObj.dayData
      }));
      // Here you would set calendarDates in the calendar component
      // For now, we'll work with the dayWise dates structure
    }
  }, [backendMentorData]); 
  
  // Update time slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    
    const selectedDateData = backendMentorData?.availabilitySchedule?.find(day => 
      day.day === selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
    );
    
    if (selectedDateData) {
      const slots = selectedDateData.slots.map(slot => ({
        value: `${slot.startTime} - ${slot.endTime}`,
        startTime: slot.startTime,
        endTime: slot.endTime,
        dayData: selectedDateData
      }));
      
      setTimeSlots(slots);
    } else {
      setTimeSlots([]);
    }
  }, [selectedDate, backendMentorData]);

  // Get pricing for selected duration and mode
  const calculateSessionPrice = () => {
    if (!backendMentorData?.pricing) return 415; // fallback
    
    const pricing = backendMentorData.pricing.find(
      option => option.type === selectedMode
    );
    
    if (!pricing) return 415; // fallback
    
    // Pricing is in USD, convert to INR
    const priceUSD = pricing.price;
    return Math.round(priceUSD * 83); // Convert to INR
  };

  const handleBookSession = async () => {
    // Validation
    if (!selectedDate || !selectedTimeSlot || !description.trim()) {
      alert("Please fill in all fields to continue");
      return;
    }
    
    setIsBooking(true);
    
    try {
      // API call to book session would go here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Prepare booking data
      const bookingPayload = {
        mentorId: mentorId,
        date: selectedDate,
        timeSlot: selectedTimeSlot.value,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        mode: selectedMode,
        description: description.trim(),
        price: calculateSessionPrice()
      };
      
      console.log("🚀 Booking Session:", bookingPayload);
      
      setBookingData(bookingPayload);
      setBookingConfiram(true);
      
      // Close modal and return success
      onClose();
      
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to book session. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  // Character limit for description
  const maxDescriptionChars = 500;

  if (bookingConfiram) {
    return <BookingSuccessState bookingData={bookingData} mentor={mentor} onClose={onClose} />;
  }

  if (isLoading) {
    return (
      <ModalOverlay onClose={onClose}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <p className="text-gray-400 text-xl">Loading mentor details...</p>
          </div>
        </div>
      </ModalOverlay>
    );
  }

  if (error || !mentor) {
    return (
      <ModalOverlay onClose={onClose}>
        <div className="text-center p-8">
          <div className="text-red-400 text-6xl mb-6">⚠️</div>
          <h2 className="text-xl font-semibold text-red-400 mb-4">Unable to Load Mentor</h2>
          <p className="text-red-300 text-lg mb-6">{error || 'Mentor not found'}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full transition-colors"
          >
            Go Back
          </button>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="p-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors"
        >
          <FaArrowLeft />
          Back to Profile
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Mentor Profile */}
            <div className="flex-1 flex-col items-center text-center">
              <div className="relative inline-block mb-6">
                <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl">
                  <img 
                    src={mentor.image} 
                    alt={mentor.name} 
                    className="w-full h-full object-cover" 
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{mentor.name}</h1>
                <div className="flex items-center justify-center gap-4">
                  <span className="bg-blue-600 px-3 py-1 text-sm rounded-full text-white">
                    {mentor.isActive ? 'Available' : 'Busy'}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">{mentor.yearsOfExperience} years experience</span>
                </div>
                
                <div className="flex justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">⭐ 4.9 Rating</span>
                  </div>
                  <span className="text-gray-400 text-sm">|</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">👥 2,000+</span>
                    <span className="text-gray-400 text-sm">Sessions</span>
                  </div>
                  <span className="text-gray-400 text-sm">|</span>
                  <span className="text-green-400">🔒 100% Private</span>
                </div>
              </div>
            </div>

            {/* Marketing Message */}
            <div className="flex-1">
              <div className="bg-gray-800/50 p-8 rounded-3xl border border-gray-700">
                <h2 className="text-3xl font-bold mb-6 text-center">Book Your Mentorship Session 🚀</h2>
                <p className="text-gray-300 mb-8 text-center lg:text-xl">
                  Get personalized guidance from industry experts in a confidential setting
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl mb-3">⭐</div>
                    <div className="text-gray-300 font-bold">Expert Guidance</div>
                    <div className="text-gray-400 text-sm">Professional advice</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-3">⏰</div>
                    <div className="text-gray-300 font-bold">Flexible Schedule</div>
                    <div className="text-gray-400 text-sm">Choose your time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-3">🔒</div>
                    <div className="text-gray-300 font-bold">100% Private</div>
                    <div className="text-gray-400 text-sm">Your privacy matters</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Meeting Description */}
            <div className="space-y-6">
              {/* Description Form */}
              <div className="bg-gray-800/50 p-8 rounded-3xl backdrop-blur">
                <h4 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <FaLightbulb className="text-yellow-400" />
                  Tell Your Mentor What This Is About 📋
                </h4>
                <p className="text-gray-300 mb-4">Help your mentor prepare by sharing details about:</p>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                    <span className="text-gray-400">Your specific goals and challenges</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                    <span className="text-gray-400">Areas needing guidance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                    <span className="text-gray-400">Expected outcomes</span>
                  </div>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={maxDescriptionChars}
                  placeholder="Example: I'm looking for help with GST compliance for my new e-commerce business. Need guidance on registration process, tax planning, and filing GST returns...  
                  Your mentor will help you understand GST regulations step-by-step and ensure compliance with all legal requirements."
                  className="w-full p-6 text-lg bg-gray-900/80 text-white rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-500"
                  rows={6}
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-gray-400 text-sm">
                    {description.length}/{maxDescriptionChars} characters
                  </p>
                  <p className="text-blue-400 text-sm flex items-center gap-1">
                    <FaShieldAlt className="text-blue-400 text-xs" />
                    <span>Confidential</span>
                  </p>
                </div>
              </div>

              {/* Session Type Selection */}
              <div className="bg-gray-800/50 rounded-3xl p-8 backdrop-blur">
                <h4 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <FaUserTie className="text-blue-400" />
                  Choose Session Type 📞
                </h4>
                <div className="space-y-3">
                  {MODES.map((modeInfo) => {
                    const isSelected = selectedMode === modeInfo.type;
                    const priceForMode = calculateSessionPrice();
                    const pricePerMin = Math.round(priceForMode / 15);
                    
                    return (
                      <button
                        key={modeInfo.type}
                        onClick={() => setSelectedMode(modeInfo.type)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500 text-blue-300 shadow-xl shadow-blue-500/25 transform scale-[1.02]'
                            : 'bg-gray-900/80 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
                        }`}
                      >
                        <div className={`p-3 rounded-xl transition-all ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                        }`}>
                          {modeInfo.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-lg capitalize">{modeInfo.label}</div>
                          <div className="text-sm text-gray-400">
                            {modeInfo.description}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-400">
                            ₹{priceForMin}
                            <span className="text-xs text-gray-400">/min</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {priceForMode}/₹{600
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Calendar and Time Selection */}
            <div className="space-y-6">
              {/* Calendar */}
              <div className="bg-gray-800/50 rounded-3xl p-8 backdrop-blur">
                <h4 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <FaCalendarAlt className="text-green-400" />
                  Select a Date 📅
                </h4>
                
                {/* Availability Summary */}
                <div className="mb-6 bg-gray-900/30 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Available Days</p>
                      <p className="text-white font-semibold">
                        {backendMentorData?.availabilitySchedule?.filter(day => day.slots && day.slots.length > 0)?.length || 0} days this month
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">Total Slots</p>
                      <p className="text-white font-semibold">
                        {backendMentorData?.availabilitySchedule?.reduce((total, day) => total + (day.slots?.length || 0), 0)} time slots
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="text-white/70 hover:text-white p-3 hover:bg-gray-700 rounded-xl transition-all"
                  >
                    ◀
                  </button>
                  <h5 className="text-xl font-semibold text-white">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h5>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="text-white/70 hover:text-white p-3 hover:bg-gray-700 rounded-xl transition-all"
                  >
                    ▶
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="text-center text-sm text-gray-400 py-2 font-bold">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }, (_, i) => (
                    <div key={`empty-${i}`} className="p-3"></div>
                  ))}
                  {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }, (_, i) => {
                    const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                    const dateStr = currentDate.toISOString().split('T')[0];
                    const dayAvailability = backendMentorData?.availabilitySchedule?.find(day => 
                      day.day === currentDate.toLocaleDateString('en-US', { weekday: 'full' })
                    );
                    const isAvailable = dayAvailability && dayAvailability.slots && dayAvailability.slots.length > 0;
                    const isSelected = selectedDate === dateStr;
                    const isPast = currentDate < new Date().setHours(0,0,0,0);
                    
                    return (
                      <button
                        key={i + 1}
                        disabled={!isAvailable || isPast}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`h-14 w-full rounded-xl text-sm font-medium transition-all relative ${
                          isPast || !isAvailable
                            ? 'bg-gray-900 text-gray-600 cursor-not-allowed border border-gray-800'
                            : isSelected
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl font-bold border-0 transform scale-[1.05]'
                            : 'bg-gray-800 text-white hover:bg-gray-700 cursor-pointer border border-gray-700'
                        }`}
                      >
                        {i + 1}
                        {isAvailable && !isPast && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            {dayAvailability?.slots?.length > 1 && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            )}
                          </div>
                        )}
                        {!isPast && isAvailable && (
                          <div className="absolute top-2 right-2 text-xs px-1 py-0.5 bg-blue-600 rounded text-white">
                            {dayAvailability?.slots?.length || 0}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-4 text-sm space-x-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400">Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-400">Multiple Slots</span>
                    <span className="text-xs text-gray-500 text-gray-400">({getAvailableTimeSlots().length} available)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white text-gray-600 rounded-full"></div>
                    <span className="text-gray-500">Unavailable</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-purple-400">Selected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div className="bg-gray-800/50 rounded-3xl p-8 backdrop-blur">
                <h4 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <FaClock className="text-purple-400" />
                  Available Time Slots ⏰
                </h4>

                {/* Selected Date Info */}
                <div className="mb-4 bg-gray-900/30 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Selected Date</p>
                      <div className="text-white font-semibold">
                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">Total Slots</p>
                      <div className="text-white font-semibold">{timeSlots.length} available</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          selectedTimeSlot === slot.value 
                            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500 text-blue-300 transform scale-[1.05]'
                            : 'bg-gray-900/80 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
                        }`}
                      >
                        <div className="font-bold text-lg">{slot.value}</div>
                        <div className="text-xs text-green-400 flex items-center gap-1 mt-1">
                          <FaCalendarAlt className="text-xs" />
                          <span>{backendMentorData?.minSessionDuration || 15} minutes</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Click to select this time slot</div>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-2">
                      <div className="bg-gray-900/50 rounded-2xl p-8 text-center border border-gray-700">
                        <div className="text-gray-400 text-4xl mb-3">😔</div>
                        <p className="text-gray-500 text-lg">No time slots available</p>
                        <p className="text-gray-400 text-sm mt-2">Try selecting a different date</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-12">
            {selectedTimeSlot && selectedDate && description.trim() && (
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-4 mb-8 border border-green-700/50 backdrop-blur">
                <div className="flex justify-between text-lg">
                  <div>
                    <div className="text-green-400 font-bold mb-1">🎉 Perfect! All Set!</div>
                    <div className="text-gray-300">
                      Ready to book your session with {mentor.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">
                      ₹{calculateSessionPrice()}
                    </div>
                    <div className="text-xs text-gray-400">Total Investment</div>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handleBookSession}
              disabled={!selectedTimeSlot || !selectedDate || !description.trim() || isBooking}
              className={`w-full py-4 px-8 py-4 rounded-2xl font-bold text-2xl transition-all transform ${
                !selectedTimeSlot || !selectedDate || !description.trim() || isBooking
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isBooking ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white inline-block mr-3"></div>
                  <span>Booking...</span>
                </>
              ) : (
                <>
                  <FaMoneyBillWave className="inline-block mr-3" />
                  🚀 Book {selectedMode?.charAt(0).toUpperCase() + selectedMode?.slice(1)} Session with {mentor.name}
                  <span className="mx-2">- ₹{calculateSessionPrice()}</span>
                </>
              )}
            </button>

            {!selectedTimeSlot || !selectedDate || !description.trim() ? (
              <p className="text-center text-gray-400">
                Please select date, time slot, and provide description to continue
              </p>
            ) : (
              <p className="text-center text-green-400">
                ✨ Ready to transform your career! Click above to confirm your booking
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
