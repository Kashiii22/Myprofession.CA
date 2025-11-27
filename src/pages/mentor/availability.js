"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { getDashboardProfile, updateAvailability } from '../../lib/api/mentorApi';
import { toast } from "react-hot-toast";
import {
  FaCalendarDay,
  FaClock,
  FaVideo,
  FaTrash,
  FaRupeeSign,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar";

export default function MentorAvailability() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
  const router = useRouter();
  const dispatch = useDispatch();

  // State for availability data
  const [availabilityData, setAvailabilityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAvailability, setEditingAvailability] = useState(false);
  const [availability, setAvailability] = useState([
    { day: 'Monday', slots: [] },
    { day: 'Tuesday', slots: [] },
    { day: 'Wednesday', slots: [] },
    { day: 'Thursday', slots: [] },
    { day: 'Friday', slots: [] },
    { day: 'Saturday', slots: [] },
    { day: 'Sunday', slots: [] }
  ]);

  // Create state to track auth initialization
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authCheckDelay, setAuthCheckDelay] = useState(true);
  const loadingMessages = [
    "Loading availability... 📅",
    "Preparing mentor space... 📊",
    "Gathering schedule data... ⏰",
    "Almost there... 🎯",
    "Ready to manage availability! 🎉"
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Give Redux 1 second to initialize on page refresh
    const timer = setTimeout(() => {
      setAuthCheckDelay(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Cycle through messages while loading
  useEffect(() => {
    if (!isAuthLoading) return;
    
    const messageTimer = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 800);

    return () => clearInterval(messageTimer);
  }, [isAuthLoading, loadingMessages.length]);

  useEffect(() => {
    // Don't check authentication until both Redux is ready and delay is over
    if (authCheckDelay) {
      console.log("Waiting for Redux to initialize...");
      setIsAuthLoading(true);
      return;
    }

    console.log("Auth State:", { isAuthenticated, user });
    console.log("User Role:", user?.role);
    
    // If Redux is still initializing (undefined), wait
    if (isAuthenticated === undefined) {
      setIsAuthLoading(true);
      return;
    }
    
    // Once Redux is loaded (true or false), set auth loading to false
    setIsAuthLoading(false);
    
    // User is definitely not logged in
    if (isAuthenticated === false) {
      toast.error("Please login to access availability page.");
      router.push("/");
      return;
    }
    
    // User is logged in but is not a mentor
    if (isAuthenticated && user && user.role !== "MENTOR") {
      toast.error("Access denied. Mentor access required.");
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, router, authCheckDelay]);

  // Update states when availabilityData is loaded
  useEffect(() => {
    if (availabilityData) {
      // Update availability data
      if (availabilityData?.availability) {
        setAvailability(availabilityData.availability);
      }
    }
  }, [availabilityData]);

  // Fetch availability data
  useEffect(() => {
    const fetchAvailabilityData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getDashboardProfile();
        
        if (response.success) {
          console.log('Availability data received:', response.data);
          setAvailabilityData(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch availability data');
        }
      } catch (err) {
        console.error('Error fetching availability data:', err);
        setError(err.message);
        toast.error('Failed to load availability data');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if authenticated
    if (!isAuthLoading && isAuthenticated && user && user.role === "MENTOR") {
      fetchAvailabilityData();
    }
  }, [isAuthLoading, isAuthenticated, user]);

  // Return loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-blue-400 mb-2">{loadingMessages[currentMessageIndex]}</p>
          <p className="text-sm text-gray-400">Your mentor schedule is just moments away</p>
        </div>
      </div>
    );
  }

  // Return loading while availability data is being fetched
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-black text-white font-sans">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading availability data...</p>
          </div>
        </main>
      </div>
    );
  }

  // Return error state if data fetch failed
  if (error) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-black text-white font-sans">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 flex items-center justify-center">
          <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-2xl max-w-md">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-red-400 text-xl font-bold mb-3">Unable to Load Availability</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Availability management functions
  const handleAvailabilitySave = async () => {
    try {
      const response = await updateAvailability(availability);
      if (response.success) {
        toast.success('Availability updated successfully!');
        setEditingAvailability(false);
        // Refresh availability data
        const availabilityResponse = await getDashboardProfile();
        if (availabilityResponse.success) {
          setAvailabilityData(availabilityResponse.data);
        }
      } else {
        throw new Error(response.message || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability: ' + error.message);
    }
  };

  const handleSlotChange = (dayIndex, slotIndex, field, value) => {
    const newAvailability = [...availability];
    if (field === 'startTime' || field === 'endTime') {
      // Round to nearest 15-minute interval
      const roundedValue = roundToNearest15Minutes(value);
      newAvailability[dayIndex].slots[slotIndex][field] = roundedValue;
      
      // Auto-set end time if only start time is changed and end time is empty
      if (field === 'startTime' && !newAvailability[dayIndex].slots[slotIndex].endTime) {
        const [hours, minutes] = roundedValue.split(':').map(Number);
        let endHours = hours;
        let endMinutes = minutes + 15;
        
        if (endMinutes >= 60) {
          endHours = (endHours + 1) % 24;
          endMinutes = endMinutes - 60;
        }
        
        const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
        newAvailability[dayIndex].slots[slotIndex].endTime = endTime;
      }
    }
    setAvailability(newAvailability);
  };

  // Function to round time to nearest 15-minute interval
  const roundToNearest15Minutes = (timeString) => {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const roundedMinutes = Math.round(minutes / 15) * 15;
    let finalHours = hours;
    let finalMinutes = roundedMinutes;
    
    if (roundedMinutes >= 60) {
      finalHours = (hours + 1) % 24;
      finalMinutes = 0;
    }
    
    return `${String(finalHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;
  };

  // Function to get recommended slots based on current time
  const getRecommendedSlots = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const recommended = [];
    
    // Generate common business hour slots
    const businessHours = [
      '09:00', '09:15', '09:30', '09:45',
      '10:00', '10:15', '10:30', '10:45',
      '11:00', '11:15', '11:30', '11:45',
      '14:00', '14:15', '14:30', '14:45',
      '15:00', '15:15', '15:30', '15:45',
      '16:00', '16:15', '16:30', '16:45',
      '17:00', '17:15', '17:30', '17:45'
    ];
    
    return businessHours;
  };

  const addSlot = (dayIndex) => {
    const newAvailability = [...availability];
    const recommendedSlots = getRecommendedSlots();
    const nextSlot = recommendedSlots[0]; // Start with 9:00 AM
    
    newAvailability[dayIndex].slots.push({
      startTime: nextSlot,
      endTime: getNext15MinuteTime(nextSlot)
    });
    setAvailability(newAvailability);
  };

  // Function to get next 15-minute time
  const getNext15MinuteTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    let nextHours = hours;
    let nextMinutes = minutes + 15;
    
    if (nextMinutes >= 60) {
      nextHours = (nextHours + 1) % 24;
      nextMinutes = nextMinutes - 60;
    }
    
    return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
  };

  const removeSlot = (dayIndex, slotIndex) => {
    const newAvailability = [...availability];
    if (newAvailability[dayIndex].slots.length > 0) {
      newAvailability[dayIndex].slots.splice(slotIndex, 1);
      setAvailability(newAvailability);
    }
  };

  return (
    <div className="relative bg-black text-white font-sans min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8 w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-900/40 via-blue-800/30 to-purple-900/40 border border-blue-700/50 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-300 flex items-center gap-2">
              <FaCalendarDay className="text-blue-400" />
              Manage Availability
            </h1>
            <p className="text-base sm:text-lg text-gray-400">
              Set your weekly availability sessions
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => router.push("/mentor/dashboard")}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Availability Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Your Availability Schedule</h2>
            <button
              onClick={() => setEditingAvailability(!editingAvailability)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
            >
              {editingAvailability ? 'Cancel' : 'Edit Schedule'}
            </button>
          </div>

          {editingAvailability ? (
            <div className="space-y-6">
              <p className="text-sm text-gray-400">Manage your weekly availability schedule. All slots are 15 minutes duration. Add time slots for each day when you're available.</p>
              
              {/* Quick recommendations */}
              <div className="bg-[#2c2c2e] p-4 rounded-xl border border-gray-600">
                <h4 className="text-sm font-medium text-blue-300 mb-3">Quick Add Common Time Slots:</h4>
                <div className="flex flex-wrap gap-2">
                  {getRecommendedSlots().slice(0, 8).map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        const newAvailability = [...availability];
                        newAvailability.forEach((day, dayIndex) => {
                          if (day.slots.length === 0 || !day.slots.some(slot => slot.startTime === time)) {
                            newAvailability[dayIndex].slots.push({
                              startTime: time,
                              endTime: getNext15MinuteTime(time)
                            });
                          }
                        });
                        setAvailability(newAvailability);
                        toast.success(`Added ${time} - ${getNext15MinuteTime(time)} slot to all days`);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {availability.map((day, dayIndex) => (
                  <div key={dayIndex} className="bg-[#2c2c2e] p-4 rounded-xl border border-gray-600">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-semibold text-blue-300">{day.day}</h4>
                      <button
                        onClick={() => addSlot(dayIndex)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm"
                      >
                        + Add Slot
                      </button>
                    </div>
                    
                    {day.slots.length > 0 ? (
                      <div className="space-y-2">
                        {day.slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex gap-2 items-center">
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => handleSlotChange(dayIndex, slotIndex, 'startTime', e.target.value)}
                              className="bg-[#1a1a1d] text-white p-2 rounded border border-gray-600"
                              placeholder="Start"
                              step="900"
                            />
                            <span className="text-gray-400">to</span>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => handleSlotChange(dayIndex, slotIndex, 'endTime', e.target.value)}
                              className="bg-[#1a1a1d] text-white p-2 rounded border border-gray-600"
                              placeholder="End"
                              step="900"
                            />
                            <button
                              onClick={() => removeSlot(dayIndex, slotIndex)}
                              className="text-red-400 hover:text-red-300"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No slots scheduled for {day.day}</p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleAvailabilitySave}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
                >
                  Save Schedule
                </button>
                <button
                  onClick={() => setEditingAvailability(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              {availability?.every(day => day.slots.length === 0) ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <FaCalendarDay className="text-5xl mx-auto" />
                  </div>
                  <p className="text-gray-400 mb-4">
                    You haven't added any availability slots yet.
                  </p>
                  <button
                    onClick={() => setEditingAvailability(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
                  >
                    Add Availability Slots
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {availability?.map((day, dayIndex) => (
                    day.slots.length > 0 && (
                      <motion.div
                        key={dayIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: dayIndex * 0.1 }}
                        className="relative bg-[#1f2937] p-6 rounded-2xl shadow-md border border-gray-700 hover:shadow-blue-500/20 transition-all"
                      >
                        {/* Day */}
                        <div className="flex items-center mb-3 gap-2 text-blue-400">
                          <FaCalendarDay />
                          <span className="text-lg font-semibold">{day.day}</span>
                        </div>

                        {/* Time Slots */}
                        <div className="space-y-2 mb-3">
                          {day.slots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="flex items-center gap-2 text-gray-300">
                              <FaClock className="text-sm" />
                              <span className="text-sm">{slot.startTime} - {slot.endTime}</span>
                            </div>
                          ))}
                          {day.slots.length === 0 && (
                            <p className="text-gray-500 text-sm">No slots</p>
                          )}
                        </div>

                        {/* Platform */}
                        <div className="flex items-center mb-3 gap-2 text-green-400">
                          <FaVideo />
                          <span className="text-md">Video Session</span>
                        </div>

                        {/* Pricing info from profile */}
                        {availabilityData?.pricing && availabilityData.pricing.length > 0 ? (
                          <div className="flex items-center mb-3 gap-2 text-gray-200">
                            <FaRupeeSign />
                            <span className="text-md">
                              ₹{availabilityData.pricing.find(p => p.type === 'video')?.price * 15 || 225}/slot (15 min)
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center mb-3 gap-2 text-gray-400">
                            <FaRupeeSign />
                            <span className="text-md">
                              Not Available
                            </span>
                          </div>
                        )}

                        {/* Status */}
                        <div className="flex items-center gap-2 text-blue-300">
                          <span className="text-md font-medium">Status:</span>
                          <span className="bg-green-900 px-2 py-1 rounded-full text-sm">
                            Available
                          </span>
                        </div>
                      </motion.div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
