'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import {
  updatePersonalDetails,
  updateProfessionalDetails,
} from '../../redux/expertSlice';
import { toast } from 'react-hot-toast';
import { getDashboardProfile, updatePricing, updateAvailability } from '../../lib/api/mentorApi';

import {
  FaEdit, FaCamera, FaBriefcase, FaUserTie, FaEnvelope, FaUser,
  FaCalendarAlt, FaLanguage,
  FaCertificate, FaClock, FaStar, FaBook, FaCheckCircle, FaUniversity, FaBuilding, FaMoneyBillWave,
} from 'react-icons/fa';

import Sidebar from '@/components/Sidebar';

const MyProfile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { personalDetails, professionalDetails } = useSelector((state) => state.profile);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
  
  // State for profile data
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ALL useState hooks must be declared BEFORE any conditional returns
  // Initialize with default values, will update when profileData is loaded
  const [bio, setBio] = useState(
    'Chartered Accountant with over 7 years of experience in taxation, auditing, and financial planning. Passionate about leveraging financial knowledge for strategic business growth.'
  );
  const [editingBio, setEditingBio] = useState(false);
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/women/65.jpg');
  const [status, setStatus] = useState('Actively Consulting');
  const [experience, setExperience] = useState(7);
  const [qualifications, setQualifications] = useState('CA, B.Com');
  const [editingProfessional, setEditingProfessional] = useState(false);
  const [expertise, setExpertise] = useState('GST, Income Tax');
  
  // Pricing state
  const [editingPricing, setEditingPricing] = useState(false);
  const [pricing, setPricing] = useState([
    { type: 'chat', price: 5 }, // Price per minute
    { type: 'voice', price: 10 }, // Price per minute  
    { type: 'video', price: 15 } // Price per minute
  ]);
  const [minSessionDuration, setMinSessionDuration] = useState(15);

  // Availability state
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

  // useRef must also be declared before any conditional returns
  const profileRef = useRef(null);

  // Update states when profileData is loaded
  useEffect(() => {
    if (profileData) {
      setBio(profileData?.registrationRef?.experienceInfo || bio);
      setProfileImage(profileData?.userRef?.avatar || profileImage);
      setStatus(profileData?.registrationRef?.status || status);
      setExperience(profileData?.registrationRef?.yearsOfExperience || experience);
      setQualifications(profileData?.registrationRef?.qualification?.join(', ') || qualifications);
      setExpertise((profileData?.registrationRef?.expertise || ['GST', 'Income Tax']).join(', '));
      
      // Update pricing data
      if (profileData?.pricing) {
        setPricing(profileData.pricing);
      }
      if (profileData?.minSessionDuration) {
        setMinSessionDuration(profileData.minSessionDuration);
      }
      
      // Update availability data
      if (profileData?.availability) {
        setAvailability(profileData.availability);
      }
    }
  }, [profileData]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getDashboardProfile();
        
        if (response.success) {
          console.log('Profile data received:', response.data);
          setProfileData(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch profile data');
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err.message);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    // Check if user is authenticated and is a mentor
    if (!isAuthenticated || !user?.role || user.role !== "MENTOR") {
      toast.error("Access denied. Mentor access required.");
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, router]);

  // Return loading state while checking authentication
  if (!isAuthenticated || !user?.role || user.role !== "MENTOR") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Return loading while profile data is being fetched
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-black text-base text-gray-200">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading profile data...</p>
          </div>
        </main>
      </div>
    );
  }

  // Return error state if data fetch failed
  if (error) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-black text-base text-gray-200">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-10 flex items-center justify-center">
          <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-2xl max-w-md">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h2 className="text-red-400 text-xl font-bold mb-3">Unable to Load Profile</h2>
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      dispatch(updatePersonalDetails({ image: imageUrl }));
    }
  };

  const handleBioSave = () => {
    dispatch(updatePersonalDetails({ bio }));
    setEditingBio(false);
  };

  const handleProfessionalSave = () => {
    dispatch(updatePersonalDetails({ status }));
    dispatch(updateProfessionalDetails({ experience, qualifications }));
    setEditingProfessional(false);
  };

  const handlePricingSave = async () => {
    try {
      const response = await updatePricing(pricing, minSessionDuration);
      if (response.success) {
        toast.success('Pricing updated successfully!');
        setEditingPricing(false);
        // Refresh profile data to show updated pricing
        const profileResponse = await getDashboardProfile();
        if (profileResponse.success) {
          setProfileData(profileResponse.data);
        }
      } else {
        throw new Error(response.message || 'Failed to update pricing');
      }
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast.error('Failed to update pricing: ' + error.message);
    }
  };

  const handlePriceChange = (index, field, value) => {
    const newPricing = [...pricing];
    if (field === 'price') {
      newPricing[index][field] = Number(value);
    } else {
      newPricing[index][field] = value;
    }
    setPricing(newPricing);
  };

  const handleAvailabilitySave = async () => {
    try {
      const response = await updateAvailability(availability);
      if (response.success) {
        toast.success('Availability updated successfully!');
        setEditingAvailability(false);
        // Refresh profile data to show updated availability
        const profileResponse = await getDashboardProfile();
        if (profileResponse.success) {
          setProfileData(profileResponse.data);
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
      newAvailability[dayIndex].slots[slotIndex][field] = value;
    }
    setAvailability(newAvailability);
  };

  const addSlot = (dayIndex) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].slots.push({
      startTime: '',
      endTime: ''
    });
    setAvailability(newAvailability);
  };

  const removeSlot = (dayIndex, slotIndex) => {
    const newAvailability = [...availability];
    if (newAvailability[dayIndex].slots.length > 0) {
      newAvailability[dayIndex].slots.splice(slotIndex, 1);
      setAvailability(newAvailability);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-base text-gray-200">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">My Profile</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition text-sm"
          >
            ← Back to Website
          </button>
        </div>

        <div ref={profileRef} className="space-y-10">
          {/* Personal Info */}
          <div className="bg-[#1a1a1d] border border-blue-600 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col lg:flex-row gap-6 lg:gap-10">
            <div className="relative group self-center sm:self-start w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />
              <label className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full text-white flex items-center justify-center cursor-pointer hover:bg-blue-700">
                <FaCamera className="text-sm sm:text-base" />
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="flex-1 space-y-4">
              <Section title="Personal Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Detail label="Full Name" value={profileData?.userRef?.name || 'Ritika Gupta'} icon={<FaUser />} />
                  <Detail label="Email" value={profileData?.userRef?.email || 'ritika.ca@domain.com'} icon={<FaEnvelope />} />
                  <Detail label="Phone" value={profileData?.userRef?.phone || '9877727858'} icon={<FaEnvelope />} />
                  <Detail label="Gender" value={profileData?.registrationRef?.gender || 'Female'} icon={<FaUserTie />} />
                  <Detail label="Date of Birth" value={profileData?.registrationRef?.dob ? new Date(profileData.registrationRef.dob).toLocaleDateString() : '1992-11-12'} icon={<FaCalendarAlt />} />
                  <Detail label="Languages" value={profileData?.registrationRef?.languages?.join(', ') || 'English, Hindi'} icon={<FaLanguage />} />
                </div>
              </Section>

              <Section title="Bio">
                {editingBio ? (
                  <>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-2 rounded bg-[#2c2c2e] text-white mt-2"
                      rows={4}
                    />
                    <button
                      onClick={handleBioSave}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <p className="text-gray-300 mt-2 flex gap-2 items-start">
                    {bio}
                    <FaEdit className="text-blue-400 cursor-pointer text-sm sm:text-base ml-2" onClick={() => setEditingBio(true)} />
                  </p>
                )}
              </Section>
            </div>
          </div>

          {/* Professional Summary */}
          <Section title="Professional Summary">
            {editingProfessional ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#2c2c2e] text-white p-2 rounded"
                  placeholder="Status"
                />
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  className="w-full bg-[#2c2c2e] text-white p-2 rounded"
                  placeholder="Experience (in years)"
                />
                <input
                  type="text"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  className="w-full bg-[#2c2c2e] text-white p-2 rounded"
                  placeholder="Qualifications"
                />
                <button
                  onClick={handleProfessionalSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Detail label="Current Status" value={status} icon={<FaBuilding />} />
                <Detail label="Experience" value={`${experience} years`} icon={<FaClock />} />
                <Detail label="Qualifications" value={qualifications} icon={<FaUniversity />} />
                <Detail label="KYC Status" value={profileData?.registrationRef?.kycProofType ? `Verified (${profileData.registrationRef.kycProofType})` : 'Not Verified'} icon={<FaCertificate />} />
                <Detail label="Approval Status" value={profileData?.registrationRef?.approvalStatus || 'Pending'} icon={<FaCheckCircle />} />
                <Detail label="Member Since" value={profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : '2024-01-01'} icon={<FaCalendarAlt />} />
                <div className="flex justify-end col-span-full">
                  <FaEdit className="text-blue-400 cursor-pointer text-sm sm:text-base" onClick={() => setEditingProfessional(true)} />
                </div>
              </div>
            )}
          </Section>

          {/* Expertise */}
          <Section title="Areas of Expertise">
            <div className="text-gray-300">
              <p className="text-sm text-gray-400 font-semibold mb-2">Specialization Areas</p>
              <div className="flex flex-wrap gap-2">
                {profileData?.registrationRef?.expertise?.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-900/30 border border-blue-600/50 rounded-full text-blue-300">
                    {skill}
                  </span>
                )) || <span className="text-gray-400">{expertise}</span>}
              </div>
            </div>
          </Section>

          {/* Pricing */}
          <Section title="Session Pricing (Per Minute)">
            {editingPricing ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Set your pricing per minute for each session type</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pricing.map((price, idx) => (
                    <div key={idx} className="space-y-2">
                      <label className="text-sm text-gray-400 font-semibold">
                        {price.type.charAt(0).toUpperCase() + price.type.slice(1)} Session
                      </label>
                      <div className="flex gap-2 items-center">
                        <span className="text-gray-300">₹</span>
                        <input
                          type="number"
                          value={price.price}
                          onChange={(e) => handlePriceChange(idx, 'price', e.target.value)}
                          className="flex-1 bg-[#2c2c2e] text-white p-2 rounded"
                          placeholder="Price per minute"
                          step="0.01"
                          min="0"
                        />
                        <span className="text-gray-400 text-sm">/min</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-semibold">
                      Minimum Session Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={minSessionDuration}
                      onChange={(e) => setMinSessionDuration(Number(e.target.value))}
                      className="w-full bg-[#2c2c2e] text-white p-2 rounded"
                      placeholder="Minimum duration in minutes"
                      min="1"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handlePricingSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
                  >
                    Save Pricing
                  </button>
                  <button
                    onClick={() => setEditingPricing(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profileData?.pricing?.map((price, idx) => (
                    <Detail 
                      key={idx} 
                      label={`${price.type.charAt(0).toUpperCase() + price.type.slice(1)} Session`} 
                      value={`₹${price.price}/minute`} 
                      icon={<FaMoneyBillWave />} 
                    />
                  ))}
                  <Detail label="Minimum Session Duration" value={`${profileData?.minSessionDuration || 15} minutes`} icon={<FaClock />} />
                </div>
                <div className="flex justify-end mt-4">
                  <FaEdit className="text-blue-400 cursor-pointer text-sm sm:text-base" onClick={() => setEditingPricing(true)} />
                </div>
              </div>
            )}
          </Section>

          {/* Availability */}
          <Section title="Availability Schedule">
            {editingAvailability ? (
              <div className="space-y-6">
                <p className="text-sm text-gray-400">Manage your weekly availability schedule. Add time slots for each day when you're available.</p>
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
                              />
                              <span className="text-gray-400">to</span>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => handleSlotChange(dayIndex, slotIndex, 'endTime', e.target.value)}
                                className="bg-[#1a1a1d] text-white p-2 rounded border border-gray-600"
                                placeholder="End"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profileData?.availability?.map((day, idx) => (
                    <Detail key={idx} label={day.day} value={day.slots.length > 0 ? 
                      day.slots.map(slot => `${slot.startTime}-${slot.endTime}`).join(', ') : 
                      'Not Available'
                    } icon={<FaCalendarAlt />} />
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <FaEdit className="text-blue-400 cursor-pointer text-sm sm:text-base" onClick={() => setEditingAvailability(true)} />
                </div>
              </div>
            )}
          </Section>

          
        </div>
      </main>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-[#1a1a1d] border border-blue-600 rounded-2xl shadow-md p-4 sm:p-6 space-y-4">
    <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">{title}</h2>
    {children}
  </div>
);

const Detail = ({ label, value, icon }) => {
  const isLink = typeof value === 'string' && (value.startsWith('http') || value.startsWith('www'));
  const isEmail = typeof value === 'string' && value.includes('@');

  let displayValue = value;

  if (isLink) {
    const formatted = value.startsWith('http') ? value : `https://${value}`;
    displayValue = (
      <a href={formatted} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
        {value}
      </a>
    );
  } else if (isEmail) {
    displayValue = (
      <a href={`mailto:${value}`} className="text-blue-400 hover:underline">
        {value}
      </a>
    );
  }

  return (
    <div className="text-gray-300 flex gap-2 items-start">
      {icon && <span className="text-blue-400 mt-1 text-sm sm:text-base">{icon}</span>}
      <div>
        <p className="text-sm text-gray-400 font-semibold">{label}</p>
        <p className="text-white">{displayValue}</p>
      </div>
    </div>
  );
};

export default MyProfile;
