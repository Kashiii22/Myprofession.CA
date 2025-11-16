// Path: pages/expert-profile.js

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import { FaFileUpload, FaTimes, FaCheck, FaPlus, FaBook, FaTrophy, FaPaperPlane, FaCheckCircle, FaLock, FaUserSecret, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link'; 
import { Toaster, toast } from 'react-hot-toast'; 
import api from '@/lib/axios';
import { checkApplicationStatus } from '@/lib/api/mentorRegistration';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Constants ---
const expertiseCategories = ['Income Tax', 'GST', 'Audit', 'Accounting', 'Investment', 'Exam Oriented', 'Law & MCA'];
const languages = ['English', 'Hindi', 'Punjabi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu'];
const genders = ['Male', 'Female', 'Other'];
const kycProofTypes = ['Aadhar', 'PAN', 'ICAI', 'Driving License', 'Passport'];

const stepTitles = ['Basic', 'Profile', 'Qualifications', 'Experience', 'Verify', 'Complete'];

// Application Status Components
const ApplicationStatusComponents = {
  loading: () => (
    <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center px-4 py-20">
      <div className="text-center">
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#111216] to-[#1b1f25] backdrop-blur-md rounded-2xl border border-gray-800 shadow-[0_0_60px_#1e3a8acc] overflow-hidden">
            <div className="relative p-8 md:p-12 text-center border-b border-gray-800/50">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-2xl shadow-blue-500/30 border-2 border-blue-500/20">
                <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 mt-8">
                Checking Your Application Status
              </h1>
              <p className="text-xl text-gray-300">Please wait while we verify your account...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),

  approved: ({ user }) => (
    <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center px-4 py-20">
      <div className="text-center">
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#111216] to-[#1b1f25] backdrop-blur-md rounded-2xl border border-gray-800 shadow-[0_0_60px_#1e3a8acc] overflow-hidden">
            <div className="relative p-8 md:p-12 text-center border-b border-gray-800/50">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl shadow-2xl shadow-green-500/30 border-2 border-green-500/20 mb-8">
                <FaCheckCircle className="text-white text-5xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Welcome Back, {user?.name?.split(' ')[0] || "Mentor"}!
              </h1>
              <p className="text-xl text-green-400 mb-8">You're already an approved mentor</p>
              <div className="bg-green-900/20 rounded-xl p-6 border border-green-700/50 max-w-2xl mx-auto">
                <p className="text-gray-300 mb-4">
                  Your mentor application was previously approved. You can now access your dashboard and manage your sessions.
                </p>
                <button
                  onClick={() => window.location.href = '/mentor/dashboard'}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition mx-auto"
                >
                  Go to Your Dashboard →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),

  pending: () => (
    <div className="bg-black text-gray-200 min-h-screen">
      <Header />
      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-20">
        <div className="text-center w-full max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#111216] to-[#1b1f25] backdrop-blur-md rounded-2xl border border-gray-800 shadow-[0_0_60px_#1e3a8acc] overflow-hidden">
            <div className="relative p-8 md:p-12 text-center border-b border-gray-800/50">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-3xl shadow-2xl shadow-yellow-500/30 border-2 border-yellow-500/20 mb-8">
                <FaClock className="text-white text-5xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Application Under Review
              </h1>
              <p className="text-xl text-yellow-400 mb-8">Your consultant application is being processed</p>
              <div className="bg-yellow-900/20 rounded-xl p-6 border border-yellow-700/50 max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-4">Review in Progress</h3>
                <p className="text-gray-300 mb-4">
                  Thank you for your interest in becoming a consultant. Your application is currently under review by our team.
                </p>
                <p className="text-gray-300 mb-6">
                  You'll receive an email notification once the review process is complete.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
            <div className="bg-gray-800/30 p-6 border-t border-gray-700">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <span>Application Status:</span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">PENDING</span>
              </div>
              <p className="text-center text-gray-500 text-sm mt-2">
                Submitted on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  ),

  rejected: ({ user, onReapply }) => (
    <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center px-4 py-20">
      <div className="text-center">
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#111216] to-[#1b1f25] backdrop-blur-md rounded-2xl border border-gray-800 shadow-[0_0_60px_#1e3a8acc] overflow-hidden">
            <div className="relative p-8 md:p-12 text-center border-b border-gray-800/50">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-600 to-pink-600 rounded-3xl shadow-2xl shadow-red-500/30 border-2 border-red-500/20 mb-8">
                <FaExclamationTriangle className="text-white text-5xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Application Review Complete
              </h1>
              <p className="text-xl text-red-400 mb-8">Your application was not approved at this time</p>
              <div className="bg-red-900/20 rounded-xl p-6 border border-red-700/50 max-w-2xl mx-auto">
                <p className="text-gray-300 mb-6">
                  Thank you for your interest. After careful review, we're unable to approve your application at this time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Back to Homepage
                  </button>
                  <button
                    onClick={onReapply}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Reapply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

// --- Reusable Components (No changes) ---
const LabeledInput = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-400 mb-2 block">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input {...props} />
  </div>
);

const LabeledSelect = ({ label, children, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-400 mb-2 block">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select {...props}>{children}</select>
  </div>
);

const LabeledTextarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-400 mb-2 block">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <textarea {...props} />
  </div>
);

const DynamicFieldArray = ({ title, fieldKey, icon, values, placeholder, onUpdate, onAdd, onRemove }) => {
  const IconComponent = icon;
  return (
    <div className="sm:col-span-2 space-y-3">
      <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
        <IconComponent /> {title}
      </label>
      {values.map((value, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onUpdate(fieldKey, index, e.target.value)}
            placeholder={`${placeholder} #${index + 1}`}
            className="bg-gray-800 text-gray-200 border border-gray-700 rounded-md px-3 py-2 flex-grow focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button type="button" onClick={() => onRemove(fieldKey, index)} className="text-red-500 hover:text-red-400 transition p-2">
            <FaTimes />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onAdd(fieldKey)} className="text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-2">
        <FaPlus /> Add {placeholder}
      </button>
    </div>
  );
};


// --- Main Registration Page Component ---
export default function ExpertProfile() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [kycPreview, setKycPreview] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('loading'); // loading | none | pending | approved | rejected
  
  const pageTopRef = useRef(null); 
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  // Check authentication status
  useEffect(() => {
    console.log('🔍 ExpertProfile - Auth Check:', { 
      isLoggedIn, 
      user: user?.name || 'null',
      userRole: user?.role || 'null'
    });
    
    if (!isLoggedIn) {
      // Redirect to unauthorized page if not logged in
      console.log('🔍 ExpertProfile - Not logged in, redirecting to unauthorized');
      router.push('/unauthorized');
      return;
    }
    setIsAuthorized(true);
  }, [isLoggedIn, router]);

  // Check application status
  useEffect(() => {
    if (!isLoggedIn) return;
    
    console.log('🔍 ExpertProfile - Checking application status for logged in user');
    
    const checkStatus = async () => {
      try {
        console.log('🔍 ExpertProfile - Calling checkApplicationStatus API');
        const response = await checkApplicationStatus();
        console.log('🔍 ExpertProfile - API response:', response);
        setApplicationStatus(response.status || 'none');
        console.log('🔍 ExpertProfile - Application status set to:', response.status || 'none');
      } catch (error) {
        console.error('🔍 ExpertProfile - Error checking application status:', error);
        // If endpoint doesn't exist yet, default to 'none' to show the form
        setApplicationStatus('none');
        console.log('🔍 ExpertProfile - Defaulted to NONE due to API error');
      }
    };

    checkStatus();
  }, [isLoggedIn]);

  const [personalDetails, setPersonalDetails] = useState({
    name: '', mobileNumber: '', email: '', languages: [], gender: '', dob: '',
  });
  const [professionalDetails, setProfessionalDetails] = useState({
    yearsOfExperience: '', status: '', expertise: [], experienceInfo: '', qualification: [''], achievements: [''], publications: [''],
  });
  const [verificationDetails, setVerificationDetails] = useState({
    kycProofType: '', kycProofNumber: '', kycProofDocument: null,
  });

  // Auto-fill from Redux (no change)
  useEffect(() => {
    if (user) {
      setPersonalDetails(prev => ({
        ...prev,
        name: user.name || '',
        mobileNumber: user.phone ? user.phone.replace('+91', '') : '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Auto-scroll-to-top (no change)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]); 
  
  // All your handler functions (no changes)
  const handleDetailsChange = (setter) => (e) => setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const toggleSelection = (setter, key, value) => {
    setter(prev => {
      const selectionArray = prev[key];
      const newSelection = selectionArray.includes(value)
        ? selectionArray.filter(item => item !== value)
        : [...selectionArray, value];
      return { ...prev, [key]: newSelection };
    });
  };
  const handleDynamicField = (setter, key, action, payload) => {
    setter(prev => {
      const newArr = [...prev[key]];
      if(action === 'ADD') newArr.push('');
      if(action === 'UPDATE') newArr[payload.index] = payload.value;
      if(action === 'REMOVE') newArr.splice(payload.index, 1);
      return { ...prev, [key]: newArr };
    });
  };
  const handleKycFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVerificationDetails(prev => ({ ...prev, kycProofDocument: file }));
      setKycPreview(file.name);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const file = verificationDetails.kycProofDocument;
    // Final check on submit
    if (!verificationDetails.kycProofType || !verificationDetails.kycProofNumber || !file) {
      toast.error("Please fill in all KYC details and upload a document.");
      return;
    }
    if (!acknowledged) {
      toast.error("Please acknowledge the terms to submit.");
      return;
    }

    setLoading(true);
    try {
      const sigResponse = await api.post('/uploads/generate-cloudinary-signature');
      const { signature, timestamp } = sigResponse.data;
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', file);
      cloudinaryFormData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      cloudinaryFormData.append('timestamp', timestamp);
      cloudinaryFormData.append('signature', signature);
      cloudinaryFormData.append('folder', 'kyc_documents');
      cloudinaryFormData.append('tags', 'kyc_temp_upload');
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`;
      const cloudinaryResponse = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: cloudinaryFormData,
      });
      const cloudinaryData = await cloudinaryResponse.json();
      if (!cloudinaryResponse.ok) {
        throw new Error(cloudinaryData.error.message || 'Cloudinary upload failed.');
      }
      const kycPublicId = cloudinaryData.public_id;

      // ✅ --- THE PAYLOAD IS CREATED HERE ---
      const mentorPayload = {
        ...personalDetails,     // mobileNumber IS IN THIS OBJECT
        ...professionalDetails,
        kycProofType: verificationDetails.kycProofType,
        kycProofNumber: verificationDetails.kycProofNumber,
        kycProofDocument: kycPublicId,
      };
      
      console.log("SENDING THIS TO BACKEND:", mentorPayload); // Check your browser console

      // ✅ --- THE PAYLOAD IS SENT HERE ---
      const registrationResponse = await api.post('/register', mentorPayload);
      
      toast.success(registrationResponse.data.message);
      setStep(6); // Set step to 6 (Complete)
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // ✅ --- START: ALL VALIDATION FUNCTIONS (THE FIX) ---

  const handleStep1to2 = () => {
    // THIS CHECK FIXES YOUR MOBILE NUMBER PROBLEM
    if (!personalDetails.name || !personalDetails.mobileNumber || !personalDetails.gender || !personalDetails.dob) {
        toast.error("Please fill in all required basic fields.");
        return; 
    }
    if (personalDetails.languages.length === 0) {
        toast.error("Please select at least one language.");
        return;
    }
    setStep(2);
  };
  
  const handleStep2to3 = () => {
    if (!professionalDetails.yearsOfExperience) {
        toast.error("Please enter your years of experience.");
        return;
    }
    if (professionalDetails.expertise.length === 0) {
        toast.error("Please select at least one area of expertise.");
        return;
    }
    setStep(3);
  };
  
  const handleStep3to4 = () => {
    if (professionalDetails.qualification.length === 0 || !professionalDetails.qualification[0]) {
        toast.error("Please add at least one qualification.");
        return;
    }
    setStep(4);
  };
  
  const handleStep4to5 = () => {
    if (!professionalDetails.experienceInfo) {
        toast.error("Please describe your experience.");
        return;
    }
    setStep(5);
  };

  // ✅ --- END: ALL VALIDATION FUNCTIONS ---

  
  // --- Styling classes (no change) ---
  const inputClass = 'bg-gray-800 border border-gray-700 rounded-md px-4 py-2 w-full text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed';
  const selectClass = 'bg-gray-800 border border-gray-700 rounded-md px-4 py-2 w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const textAreaClass = 'bg-gray-800 border border-gray-700 rounded-md px-4 py-3 w-full text-gray-200 placeholder-gray-500 resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  // Show loading state while checking authentication or application status
  if (!isAuthorized) {
    return (
      <div className="bg-black text-gray-200 min-h-screen" ref={pageTopRef}>
        <Toaster position="top-center" reverseOrder={false} />
        <Header />
        
        <main className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-20">
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Section number badge */}
            <div className="absolute top-4 left-4 px-2 py-1 bg-gray-800/50 text-gray-600 text-xs font-medium rounded-lg z-10 pointer-events-none border border-gray-700/30">
              restricted
            </div>
            
            <div className="bg-gradient-to-br from-[#111216] to-[#1b1f25] backdrop-blur-md rounded-2xl border border-gray-800 shadow-[0_0_60px_#1e3a8acc] overflow-hidden">
              {/* Header Section */}
              <div className="relative p-8 md:p-12 text-center border-b border-gray-800/50 bg-gradient-to-r from-amber-900/20 to-orange-900/20">
                {/* Icon Container */}
                <div className="relative mb-8">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl shadow-2xl shadow-amber-500/30 border-2 border-amber-500/20 transition-transform duration-300 hover:scale-105">
                    <FaLock className="text-white text-5xl" />
                  </div>
                  
                  {/* Security Icons */}
                  <div className="absolute -top-4 -right-4">
                    <div className="bg-gray-800 rounded-full p-3 border-2 border-gray-700/50">
                      <FaUserSecret className="text-amber-400 text-lg" />
                    </div>
                  </div>
                </div>
                
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Authentication <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Required</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
                  You must be logged in to access the expert profile setup
                </p>
              </div>
              
              {/* Content Section */}
              <div className="p-8 md:p-12 space-y-8">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-[#1a1a1e]/50 rounded-xl p-6 border border-gray-700/50">
                    <h2 className="text-2xl font-bold text-white mb-4">What This Means</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      The expert profile setup page is restricted to registered users only. Please log in to your account to proceed with your consultant registration.
                    </p>
                    <div className="space-y-2 text-sm text-gray-400">
                      <p>• Sign up or log in to access this page</p>
                      <p>• Complete your expert profile registration</p>
                      <p>• Join our community of experienced consultants</p>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => router.push('/register')}
                    className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                  >
                    <FaUserSecret className="group-hover:translate-y-1 transition-transform" />
                    <span>Sign In / Register</span>
                  </button>
                </div>
                
                {/* Alternative option */}
                <div className="text-center space-y-2">
                  <p className="text-gray-400 text-sm">
                    Already have an account?
                  </p>
                  <button
                    onClick={() => router.push('/')}
                    className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Show appropriate component based on application status
  console.log('🔍 ExpertProfile - Render Check:', { 
    applicationStatus, 
    isAuthorized,
    isLoggedIn,
    hasUser: !!user
  });

  if (applicationStatus !== 'none') {
    console.log('🔍 ExpertProfile - Showing status component for:', applicationStatus);
    const StatusComponent = ApplicationStatusComponents[applicationStatus];
    if (StatusComponent) {
      return (
        <StatusComponent 
          user={user} 
          onReapply={() => setApplicationStatus('none')} 
        />
      );
    }
  }

  return (
    <div className="bg-black text-gray-200 min-h-screen" ref={pageTopRef}>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">Become a Consultant</h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Share your expertise, guide professionals, and make a lasting impact in your field.</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full bg-gray-900/50 p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-800 relative overflow-hidden">
            
            {/* Confetti (no change) */}
            {step === 6 && (
              <Confetti
                width={window.innerWidth || 0}
                height={window.innerHeight || 0}
                recycle={false}
                numberOfPieces={500}
                tweenDuration={10000}
              />
            )}

            {/* Stepper UI (no change) */}
            <div className="relative mb-12">
              <div className="flex justify-between items-center relative z-10">
                {stepTitles.map((title, index) => {
                  const stepNum = index + 1;
                  const isCompleted = step > stepNum;
                  const isActive = step === stepNum;
                  return (
                    <React.Fragment key={title}>
                      <div className="flex flex-col items-center text-center w-16">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-2 ${isCompleted ? 'bg-green-600 border-green-500' : isActive ? 'bg-blue-600 border-blue-500 scale-110' : 'bg-gray-700 border-gray-600'} text-white`}>
                          {isCompleted ? <FaCheck /> : stepNum}
                        </div>
                        <div className={`text-xs mt-2 font-medium transition-colors ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>{title}</div>
                      </div>
                      {stepNum < stepTitles.length && <div className={`flex-1 h-1 transition-colors ${step > stepNum ? 'bg-green-600' : 'bg-gray-700'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* This wrapper provides the fade-in animation */}
            <div key={step} style={{ animation: 'fadeIn 0.5s ease-out' }}>
              
              {/* Step 1: Basic Details */}
              {step === 1 && (
                <section>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <h3 className="md:col-span-2 text-2xl font-semibold text-white border-b border-gray-700 pb-3 mb-4">Basic Information</h3>
                      <LabeledInput label="Full Name" name="name" type="text" value={personalDetails.name} onChange={handleDetailsChange(setPersonalDetails)} placeholder="Your full name" className={inputClass} required disabled={true} />
                      
                      {/* ✅ --- THIS IS YOUR MOBILE NUMBER INPUT --- */}
                      <LabeledInput label="Mobile Number" name="mobileNumber" type="tel" value={personalDetails.mobileNumber} onChange={handleDetailsChange(setPersonalDetails)} placeholder="10-digit mobile number" className={inputClass} required disabled={!!user?.phone} />
                      
                      <LabeledInput label="Email Address" name="email" type="email" value={personalDetails.email} onChange={handleDetailsChange(setPersonalDetails)} placeholder="your.email@example.com" className={inputClass} disabled={!!user?.email} />
                      <LabeledSelect label="Gender" name="gender" value={personalDetails.gender} onChange={handleDetailsChange(setPersonalDetails)} className={selectClass} required>
                          <option value="">Select gender</option>
                          {genders.map(g => <option key={g} value={g}>{g}</option>)}
                      </LabeledSelect>
                      <LabeledInput label="Date of Birth" name="dob" type="date" value={personalDetails.dob} onChange={handleDetailsChange(setPersonalDetails)} className={inputClass} required />
                      <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-400 mb-2 block">Languages Spoken <span className="text-red-500 ml-1">*</span></label>
                          <div className="flex flex-wrap gap-3">
                              {languages.map(lang => (
                                  <button type="button" key={lang} onClick={() => toggleSelection(setPersonalDetails, 'languages', lang)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${ personalDetails.languages.includes(lang) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}`}>
                                      {lang}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
                  <div className="mt-12 text-right">
                      {/* ✅ --- THIS BUTTON RUNS THE VALIDATION --- */}
                      <button type="button" onClick={handleStep1to2} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">
                          Save & Continue
                      </button>
                  </div>
                </section>
              )}

              {/* Step 2: Professional Intro */}
              {step === 2 && (
                  <section>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <h3 className="md:col-span-2 text-2xl font-semibold text-white border-b border-gray-700 pb-3 mb-4">Professional Profile</h3>
                      <LabeledInput label="Years of Experience" name="yearsOfExperience" type="number" value={professionalDetails.yearsOfExperience} onChange={handleDetailsChange(setProfessionalDetails)} className={inputClass} required />
                      <LabeledInput label="Current Status / Designation" name="status" type="text" value={professionalDetails.status} onChange={handleDetailsChange(setProfessionalDetails)} placeholder="e.g., Chartered Accountant" className={inputClass} />
                      <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-400 mb-2 block">Areas of Expertise <span className="text-red-500 ml-1">*</span></label>
                          <div className="flex flex-wrap gap-3">
                              {expertiseCategories.map(cat => (
                                  <button type="button" key={cat} onClick={() => toggleSelection(setProfessionalDetails, 'expertise', cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${ professionalDetails.expertise.includes(cat) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}`}>
                                      {cat}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
                  <div className="mt-12 flex justify-between">
                      <button type="button" onClick={() => setStep(1)} className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition">Back</button>
                      {/* ✅ --- UPDATED THIS onClick --- */}
                      <button type="button" onClick={handleStep2to3} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">Save & Continue</button>
                  </div>
                  </section>
              )}

              {/* Step 3: Qualifications */}
              {step === 3 && (
                <section>
                  <h3 className="text-2xl font-semibold text-white border-b border-gray-700 pb-3 mb-6">Your Qualifications</h3>
                  <DynamicFieldArray title="Qualifications" fieldKey="qualification" icon={FaBook} values={professionalDetails.qualification} placeholder="Qualification" onUpdate={(k, i, v) => handleDynamicField(setProfessionalDetails, k, 'UPDATE', {index: i, value: v})} onAdd={(k) => handleDynamicField(setProfessionalDetails, k, 'ADD')} onRemove={(k, i) => handleDynamicField(setProfessionalDetails, k, 'REMOVE', {index: i})} />
                  <div className="mt-12 flex justify-between">
                      <button type="button" onClick={() => setStep(2)} className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition">Back</button>
                      {/* ✅ --- UPDATED THIS onClick --- */}
                      <button type="button" onClick={handleStep3to4} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">Save & Continue</button>
                  </div>
                </section>
              )}
              
              {/* Step 4: Experience & Work */}
              {step === 4 && (
                <section>
                  <h3 className="text-2xl font-semibold text-white border-b border-gray-700 pb-3 mb-6">Your Experience & Work</h3>
                  <div className="space-y-6">
                    <div>
                        <LabeledTextarea label="Describe Your Experience" name="experienceInfo" value={professionalDetails.experienceInfo} onChange={handleDetailsChange(setProfessionalDetails)} placeholder="Detail your professional journey, key roles, and responsibilities..." className={textAreaClass} required />
                    </div>
                    <DynamicFieldArray title="Achievements" fieldKey="achievements" icon={FaTrophy} values={professionalDetails.achievements} placeholder="Achievement" onUpdate={(k, i, v) => handleDynamicField(setProfessionalDetails, k, 'UPDATE', {index: i, value: v})} onAdd={(k) => handleDynamicField(setProfessionalDetails, k, 'ADD')} onRemove={(k, i) => handleDynamicField(setProfessionalDetails, k, 'REMOVE', {index: i})} />
                    <DynamicFieldArray title="Publications" fieldKey="publications" icon={FaPaperPlane} values={professionalDetails.publications} placeholder="Publication" onUpdate={(k, i, v) => handleDynamicField(setProfessionalDetails, k, 'UPDATE', {index: i, value: v})} onAdd={(k) => handleDynamicField(setProfessionalDetails, k, 'ADD')} onRemove={(k, i) => handleDynamicField(setProfessionalDetails, k, 'REMOVE', {index: i})} />
                  </div>
                  <div className="mt-12 flex justify-between">
                      <button type="button" onClick={() => setStep(3)} className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition">Back</button>
                      {/* ✅ --- UPDATED THIS onClick --- */}
                      <button type="button" onClick={handleStep4to5} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">Save & Continue</button>
                  </div>
                </section>
              )}

              {/* Step 5: Verification (no change) */}
              {step === 5 && (
                <section>
                  <h2 className="text-3xl font-semibold text-white text-center mb-8">Identity Verification (KYC)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    <LabeledSelect label="Proof Type" name="kycProofType" value={verificationDetails.kycProofType} onChange={handleDetailsChange(setVerificationDetails)} className={selectClass} required>
                      <option value="">Select Document Type</option>
                      {kycProofTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </LabeledSelect>
                    <LabeledInput label="Proof Document Number" name="kycProofNumber" type="text" value={verificationDetails.kycProofNumber} onChange={handleDetailsChange(setVerificationDetails)} placeholder="Enter document number" className={inputClass} required />
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-400 mb-2 block">Upload Document <span className="text-red-500 ml-1">*</span></label>
                      <label htmlFor="kyc-upload" className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800/50 transition">
                        <FaFileUpload className="text-4xl text-gray-500 mb-2" />
                        <span className="text-blue-400 font-semibold">{kycPreview || "Click to upload a file"}</span>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, or PDF (MAX. 5MB)</p>
                      </label>
                      <input id="kyc-upload" name="kycProofDocument" type="file" onChange={handleKycFile} className="hidden" required />
                    </div>
                    
                    <div className="md:col-span-2 mt-4 flex items-start">
                      <input
                        id="acknowledgement"
                        name="acknowledgement"
                        type="checkbox"
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                        className="h-4 w-4 mt-1 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        required
                      />
                      <div className="ml-3 text-sm">
                        <label htmlFor="acknowledgement" className="text-gray-300">
                          I acknowledge that the details shared are accurate and I agree to the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-400 hover:underline">Terms of Service and Privacy Policy</a>.
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 flex justify-between">
                    <button type="button" onClick={() => setStep(4)} className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition">Back</button>
                    <button type="submit" disabled={loading || !acknowledged} className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? 'Submitting...' : 'Submit for Verification'}
                    </button>
                  </div>
                </section>
              )}

              {/* Step 6: Completion (no change) */}
              {step === 6 && (
                <div className="text-center py-20">
                  <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
                  <h2 className="text-4xl font-extrabold text-white mb-4">Thank You!</h2>
                  <p className="text-lg text-gray-300 mb-3">Your application has been submitted successfully.</p>
                  <p className="text-gray-400">You will be notified via email once the verification process is complete.</p>
                  <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 max-w-xl mx-auto mt-8">
                    <p className="text-gray-300 text-md italic">
                      “Your knowledge has the power to change lives. Get ready to impact the world—one conversation at a time.”
                    </p>
                  </div>
                  
                </div>
              )}
            </div>

          </form>
      </main>
      
      <Footer />
    </div>
  );
}