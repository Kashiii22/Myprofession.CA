'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import {
  updatePersonalDetails,
  updateProfessionalDetails,
} from '../../redux/expertSlice';
import { toast } from 'react-hot-toast';
import { getDashboardProfile, updatePricing, updateProfilePhoto, updateBio, updatePricingNew, updateProfile, updateExpertise } from '../../lib/api/mentorApi';

import {
  FaEdit, FaCamera, FaBriefcase, FaUserTie, FaEnvelope, FaUser,
  FaCalendarAlt, FaLanguage,
  FaCertificate, FaClock, FaStar, FaBook, FaCheckCircle, FaUniversity, FaBuilding, FaMoneyBillWave,
  FaExclamationTriangle,
} from 'react-icons/fa';

import Sidebar from '@/components/Sidebar';

const MyProfile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { personalDetails, professionalDetails } = useSelector((state) => state.profile);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
  
  // Expertise categories from expert-profile.js
  const expertiseCategories = ['Income Tax', 'GST', 'Audit', 'Accounting', 'Investment', 'Exam Oriented', 'Law & MCA'];
  
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
  const [profileImage, setProfileImage] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [status, setStatus] = useState('Actively Consulting');
  const [experience, setExperience] = useState(7);
  const [qualifications, setQualifications] = useState('CA, B.Com');
  const [editingProfessional, setEditingProfessional] = useState(false);
  const [expertise, setExpertise] = useState('Income Tax, GST');
  const [editingExpertise, setEditingExpertise] = useState(false);
  
  // Pricing state
  const [editingPricing, setEditingPricing] = useState(false);
  const [pricing, setPricing] = useState([
    { type: 'chat', price: '' }, // Empty price for initial setup
    { type: 'video', price: '' } // Empty price for initial setup
  ]);
  const [minSessionDuration, setMinSessionDuration] = useState(15);

  // useRef must also be declared before any conditional returns
  const profileRef = useRef(null);

  // Update states when profileData is loaded
  useEffect(() => {
    if (profileData) {
      setBio(profileData?.registrationRef?.experienceInfo || bio);
      setProfileImage(profileData?.userRef?.avatar || null);
      setStatus(profileData?.registrationRef?.status || status);
      setExperience(profileData?.registrationRef?.yearsOfExperience || experience);
      setQualifications(profileData?.registrationRef?.qualification?.join(', ') || qualifications);
      setExpertise((profileData?.registrationRef?.expertise || ['Income Tax', 'GST']).join(', '));
      
      // Update pricing data (filter out voice entries)
      if (profileData?.pricing) {
        const filteredPricing = profileData.pricing.filter(item => item.type !== 'voice');
        // Pricing should already be in 15-minute format from backend
        setPricing(filteredPricing);
      }
      if (profileData?.minSessionDuration) {
        setMinSessionDuration(profileData.minSessionDuration);
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

  // Handle profile photo upload
  const handlePhotoUpload = async (file) => {
    if (!file) {
      toast.error('Please select a photo first');
      return null;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return null;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return null;
    }

    setIsUploadingPhoto(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await updateProfilePhoto(formData);
      
      if (response.success) {
        toast.success('Profile photo updated successfully!');
        
        // Return the new photo URL if available
        return response.data?.profilePhoto || URL.createObjectURL(file);
      } else {
        throw new Error(response.message || 'Failed to update profile photo');
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast.error(error.message || 'Failed to update profile photo');
      return null;
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Create state to track auth initialization
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authCheckDelay, setAuthCheckDelay] = useState(true);
  const loadingMessages = [
    "Loading your profile... 📋",
    "Preparing mentor space... 👤",
    "Gathering your data... 📊",
    "Almost there... 🎯",
    "Ready to manage profile! 🎉"
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
      toast.error("Please login to access mentor profile.");
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

  // Return loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-blue-400 mb-2">{loadingMessages[currentMessageIndex]}</p>
          <p className="text-sm text-gray-400">Your mentor profile is just moments away</p>
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show loading state
      setImagePreview(URL.createObjectURL(file));
      
      // Upload the photo
      const uploadedUrl = await handlePhotoUpload(file);
      
      if (uploadedUrl) {
        setProfileImage(uploadedUrl);
        dispatch(updatePersonalDetails({ image: uploadedUrl }));
        
        // Refresh profile data to get updated photo
        const profileResponse = await getDashboardProfile();
        if (profileResponse.success) {
          setProfileData(profileResponse.data);
        }
      } else {
        // Reset preview if upload failed
        setImagePreview(null);
      }
      
      // Clear the file input
      e.target.value = '';
    }
  };
  

  const handleBioSave = async () => {
    try {
      const formData = new FormData();
      formData.append('experienceInfo', bio);
      
      // Include existing name if available
      if (profileData?.userRef?.name) {
        formData.append('name', profileData.userRef.name);
      }
      
      const response = await updateProfile(formData);
      
      if (response.success) {
        toast.success('Bio updated successfully!');
        setEditingBio(false);
        // Refresh profile data
        const profileResponse = await getDashboardProfile();
        if (profileResponse.success) {
          setProfileData(profileResponse.data);
        }
      } else {
        throw new Error(response.message || 'Failed to update bio');
      }
    } catch (error) {
      console.error('Error updating bio:', error);
      toast.error('Failed to update bio: ' + error.message);
    }
  };

  const handleProfessionalSave = async () => {
    try {
      const formData = new FormData();
      
      // Include existing name if available
      if (profileData?.userRef?.name) {
        formData.append('name', profileData.userRef.name);
      }
      
      // Include bio if available
      if (bio) {
        formData.append('experienceInfo', bio);
      }
      
      // Add status (if backend expects this field)
      formData.append('status', status);
      
      // Add years of experience
      formData.append('yearsOfExperience', experience.toString());
      
      // Add qualifications as JSON string
      const qualificationsArray = qualifications.split(',').map(q => q.trim()).filter(q => q);
      formData.append('qualification', JSON.stringify(qualificationsArray));
      
      const response = await updateProfile(formData);
      
      if (response.success) {
        toast.success('Professional details updated successfully!');
        setEditingProfessional(false);
        // Refresh profile data
        const profileResponse = await getDashboardProfile();
        if (profileResponse.success) {
          setProfileData(profileResponse.data);
        }
      } else {
        throw new Error(response.message || 'Failed to update professional details');
      }
    } catch (error) {
      console.error('Error updating professional details:', error);
      toast.error('Failed to update professional details: ' + error.message);
    }
  };

  const handleExpertiseUpdate = async (newExpertise) => {
    try {
      // Convert expertise string to array with empty string check
      const expertiseArray = newExpertise ? newExpertise.split(',').map(e => e.trim()).filter(e => e) : [];
      
      const response = await updateExpertise(expertiseArray);
      
      if (response.success) {
        toast.success('Expertise updated successfully!');
        setEditingExpertise(false);
        // Refresh profile data
        const profileResponse = await getDashboardProfile();
        if (profileResponse.success) {
          setProfileData(profileResponse.data);
        }
      } else {
        throw new Error(response.message || 'Failed to update expertise');
      }
    } catch (error) {
      console.error('Error updating expertise:', error);
      toast.error('Failed to update expertise: ' + error.message);
    }
  };

  const handlePricingSave = async () => {
    try {
      // Validate that both prices are filled when setting up new pricing
      if (!profileData?.pricing || profileData.pricing.length === 0) {
        const hasEmptyPrices = pricing.some(item => !item.price || item.price === '');
        if (hasEmptyPrices) {
          toast.error('Please fill in pricing for both chat and video sessions');
          return;
        }
      }
      
      console.log('Saving pricing data (15-minute format):', pricing);
      
      // Backend expects 15-minute pricing format, no conversion needed
      const pricingToSend = pricing.map(item => ({
        type: item.type,
        price: Number(item.price) // Send as 15-minute total price
      }));
      
      console.log('Sending to API:', pricingToSend);
      
      // Use the new updatePricing API function that sends 15-minute pricing
      const response = await updatePricingNew(pricingToSend);
      
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
      console.error('Error details:', error.response?.data);
      toast.error('Failed to update pricing: ' + error.message);
    }
  };

  const handlePriceChange = (index, field, value) => {
    const newPricing = [...pricing];
    if (field === 'price') {
      // Allow empty string or valid numbers
      if (value === '' || (!isNaN(value) && !isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
        newPricing[index][field] = value;
      }
    } else {
      newPricing[index][field] = value;
    }
    setPricing(newPricing);
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

        {/* Profile Completion Warning */}
        {profileData && !profileData.isActive && (
          <div className="bg-yellow-900/50 border border-yellow-600 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="text-yellow-400 text-2xl mt-1">
                <FaExclamationTriangle />
              </div>
              <div className="flex-1">
                <h3 className="text-yellow-300 text-lg font-bold mb-2">Complete Your Profile</h3>
                <p className="text-yellow-100 text-sm leading-relaxed">
                  Your mentor profile is not yet active. To start receiving consultation requests, please complete all required profile sections including personal information, professional details, and pricing.
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => router.push('/expert-profile')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                  >
                    Complete Profile Now
                  </button>
                  <button
                    onClick={() => toast.info('Contact support for assistance with profile completion')}
                    className="bg-transparent border border-yellow-600 text-yellow-400 hover:bg-yellow-600/20 px-4 py-2 rounded-lg transition text-sm font-medium"
                  >
                    Need Help?
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={profileRef} className="space-y-10">
          {/* Personal Info */}
          <div className="bg-[#1a1a1d] border border-blue-600 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col lg:flex-row gap-6 lg:gap-10">
            <div className="relative group self-center sm:self-start w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44">
              {(imagePreview || profileImage || user?.avatar) ? (
                <div className="relative w-full h-full">
                  <img
                    src={imagePreview || profileImage || user?.avatar}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-lg"
                  />
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-blue-500 shadow-lg flex items-center justify-center">
                  <FaUser className="text-white text-4xl sm:text-5xl" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full text-white flex items-center justify-center cursor-pointer hover:bg-blue-700 hover:bg-opacity-90 transition-all">
                {isUploadingPhoto ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaCamera className="text-sm sm:text-base" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                  disabled={isUploadingPhoto}
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
              </div>
            )}
          </Section>

          {/* Expertise */}
          <Section title="Areas of Expertise">
            {editingExpertise ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-400 mb-4">Select your areas of expertise or enter custom ones separated by commas</p>
                
                {/* Expertise Categories - Using exact same categories as expert-profile.js */}
                <div>
                  <p className="text-sm text-gray-400 font-semibold mb-3">Available Categories:</p>
                  <div className="flex flex-wrap gap-3">
                    {expertiseCategories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          const currentExpertise = expertise ? expertise.split(',').map(e => e.trim()).filter(e => e) : [];
                          if (!currentExpertise.includes(cat)) {
                            setExpertise([...currentExpertise, cat].join(', '));
                          } else {
                            // Remove if already selected
                            const newList = currentExpertise.filter(item => item !== cat);
                            setExpertise(newList.join(', '));
                          }
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                          expertise && expertise.split(',').map(e => e.trim()).includes(cat)
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Custom Input */}
                <div>
                  <p className="text-sm text-gray-400 font-semibold mb-2">Or enter custom areas:</p>
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    className="w-full bg-[#2c2c2e] text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., GST, Income Tax, Financial Planning"
                  />
                </div>
                
                {/* Preview Selected Expertise */}
                {expertise && (
                  <div>
                    <p className="text-sm text-gray-400 font-semibold mb-2">Selected Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {expertise.split(',').map((e, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-900/30 border border-blue-600/50 rounded-full text-blue-300 flex items-center gap-2">
                          {e.trim()}
                          <button
                            type="button"
                            onClick={() => {
                              const currentList = expertise.split(',').map(item => item.trim()).filter(item => item);
                              const newList = currentList.filter(item => item !== e.trim());
                              setExpertise(newList.join(', '));
                            }}
                            className="text-blue-400 hover:text-red-400 transition text-xs"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      handleExpertiseUpdate(expertise);
                      setEditingExpertise(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition"
                  >
                    Save Expertise
                  </button>
                  <button
                    onClick={() => {
                      setExpertise((profileData?.registrationRef?.expertise || ['Income Tax', 'GST']).join(', '));
                      setEditingExpertise(false);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400 font-semibold mb-2">Specialization Areas</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData?.registrationRef?.expertise?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-900/30 border border-blue-600/50 rounded-full text-blue-300">
                      {skill}
                    </span>
                  )) || <span className="text-gray-400">{expertise}</span>}
                </div>
                <div className="flex justify-end">
                  <FaEdit className="text-blue-400 cursor-pointer text-sm sm:text-base" onClick={() => setEditingExpertise(true)} />
                </div>
              </div>
            )}
          </Section>

          {/* Pricing */}
          <Section title="Session Pricing (15 minute sessions)">
            {editingPricing ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Set your pricing for 15-minute chat and video sessions
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pricing.map((price, idx) => (
                    <div key={idx} className="space-y-2">
                      <label className="text-sm text-gray-400 font-semibold">
                        {price.type.charAt(0).toUpperCase() + price.type.slice(1)} Session
                      </label>
                      <div className="flex gap-2 items-center">
                        <span className="text-gray-300">₹</span>
                        <input
                          type="text"
                          value={price.price || ''}
                          onChange={(e) => handlePriceChange(idx, 'price', e.target.value)}
                          className="flex-1 bg-[#2c2c2e] text-white p-2 rounded"
                          placeholder="Price for 15 minutes"
                        />
                        <span className="text-gray-400 text-sm">/15 min</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handlePricingSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition"
                  >
                    Save Pricing
                  </button>
                  <button
                    onClick={() => setEditingPricing(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400 font-semibold mb-4">Current Pricing</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {[
                    { type: 'chat', price: pricing[0]?.price || 'Not set' },
                    { type: 'video', price: pricing[1]?.price || 'Not set' }
                  ].map((price, idx) => (
                    <div key={idx} className="bg-[#2c2c2e] rounded-lg p-4 border border-gray-600">
                      <p className="text-sm text-gray-400 mb-2">
                        {price.type.charAt(0).toUpperCase() + price.type.slice(1)} Session
                      </p>
                      <p className="text-xl font-semibold text-white">
                        {price.price === 'Not set' ? 'Not set' : `₹${price.price}`}
                        <span className="text-sm text-gray-400 ml-2">/15 min</span>
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <FaEdit className="text-blue-400 cursor-pointer text-sm sm:text-base" onClick={() => setEditingPricing(true)} />
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
