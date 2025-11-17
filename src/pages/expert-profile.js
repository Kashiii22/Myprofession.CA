// Path: pages/expert-profile.js

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import { FaFileUpload, FaTimes, FaCheck, FaPlus, FaBook, FaTrophy, FaPaperPlane, FaCheckCircle, FaLock, FaUserSecret, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast'; 
import api from '@/lib/axios';
import { checkApplicationStatus } from '@/lib/api/mentorRegistration';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Constants (No Changes) ---
const expertiseCategories = ['Income Tax', 'GST', 'Audit', 'Accounting', 'Investment', 'Exam Oriented', 'Law & MCA'];
const languages = ['English', 'Hindi', 'Punjabi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu'];
const genders = ['Male', 'Female', 'Other'];
const kycProofTypes = ['Aadhar', 'PAN', 'ICAI', 'Driving License', 'Passport'];

const stepTitles = ['Basic', 'Profile', 'Qualifications', 'Experience', 'Verify', 'Complete'];

// Application Status Components (No Changes)
const ApplicationStatusComponents = {
  loading: () => (
    <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center px-4 py-20">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-white">Checking Status...</h1>
      </div>
    </div>
  ),
  approved: ({ user }) => (
    <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-2xl">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Welcome Back, {user?.name?.split(' ')[0] || "Mentor"}!</h1>
        <p className="text-xl text-green-400 mb-8">You are already an approved mentor.</p>
        <button onClick={() => window.location.href = '/mentor/dashboard'} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition">Go to Dashboard</button>
      </div>
    </div>
  ),
  pending: () => (
    <div className="bg-black text-gray-200 min-h-screen">
      <Header />
      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl">
            <FaClock className="text-yellow-500 text-6xl mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-6">Application Under Review</h1>
            <p className="text-gray-300 mb-6">Your consultant application is currently being processed. You will be notified via email.</p>
            <button onClick={() => window.location.href = '/'} className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition">Return to Homepage</button>
        </div>
      </main>
      <Footer />
    </div>
  ),
  rejected: ({ user, onReapply }) => (
    <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-2xl">
        <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-6">Application Update</h1>
        <p className="text-gray-300 mb-6">We are unable to approve your application at this time.</p>
        <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.href = '/'} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition">Home</button>
            <button onClick={onReapply} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition">Reapply</button>
        </div>
      </div>
    </div>
  )
};

// --- Reusable Components (No Changes) ---
const LabeledInput = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-400 mb-2 block">{label} {props.required && <span className="text-red-500 ml-1">*</span>}</label>
    <input {...props} />
  </div>
);

const LabeledSelect = ({ label, children, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-400 mb-2 block">{label} {props.required && <span className="text-red-500 ml-1">*</span>}</label>
    <select {...props}>{children}</select>
  </div>
);

const LabeledTextarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-400 mb-2 block">{label} {props.required && <span className="text-red-500 ml-1">*</span>}</label>
    <textarea {...props} />
  </div>
);

const DynamicFieldArray = ({ title, fieldKey, icon, values, placeholder, onUpdate, onAdd, onRemove }) => {
  const IconComponent = icon;
  return (
    <div className="sm:col-span-2 space-y-3">
      <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><IconComponent /> {title}</label>
      {values.map((value, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input type="text" value={value} onChange={(e) => onUpdate(fieldKey, index, e.target.value)} placeholder={`${placeholder} #${index + 1}`} className="bg-gray-800 text-gray-200 border border-gray-700 rounded-md px-3 py-2 flex-grow focus:outline-none focus:ring-1 focus:ring-blue-500" />
          <button type="button" onClick={() => onRemove(fieldKey, index)} className="text-red-500 hover:text-red-400 transition p-2"><FaTimes /></button>
        </div>
      ))}
      <button type="button" onClick={() => onAdd(fieldKey)} className="text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-2"><FaPlus /> Add {placeholder}</button>
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
  const [applicationStatus, setApplicationStatus] = useState('loading');
  
  const pageTopRef = useRef(null); 
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/unauthorized');
      return;
    }
    setIsAuthorized(true);
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;
    const checkStatus = async () => {
      try {
        const response = await checkApplicationStatus();
        setApplicationStatus(response.status || 'none');
      } catch (error) {
        setApplicationStatus('none');
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // ✅ FIX: Force loading to false when entering Step 5
  useEffect(() => {
    if (step === 5) {
      console.log("Step 5 mounted, forcing loading to false");
      setLoading(false);
    }
  }, [step]); 
  
  const handleDetailsChange = (setter) => (e) => setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const toggleSelection = (setter, key, value) => {
    setter(prev => {
      const selectionArray = prev[key];
      return { ...prev, [key]: selectionArray.includes(value) ? selectionArray.filter(item => item !== value) : [...selectionArray, value] };
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
      setLoading(false); 
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const file = verificationDetails.kycProofDocument;
    
    // Validation
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
      const cloudinaryResponse = await fetch(cloudinaryUrl, { method: 'POST', body: cloudinaryFormData });
      const cloudinaryData = await cloudinaryResponse.json();
      
      if (!cloudinaryResponse.ok) throw new Error(cloudinaryData.error.message || 'Cloudinary upload failed.');
      
      const mentorPayload = {
        ...personalDetails,
        ...professionalDetails,
        kycProofType: verificationDetails.kycProofType,
        kycProofNumber: verificationDetails.kycProofNumber,
        kycProofDocument: cloudinaryData.public_id,
      };
      
      const registrationResponse = await api.post('/register', mentorPayload);
      
      toast.success(registrationResponse.data.message);
      setStep(6);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Navigation & Validation
  const handleStep1to2 = () => {
    if (!personalDetails.name || !personalDetails.mobileNumber || !personalDetails.gender || !personalDetails.dob) {
        toast.error("Please fill in all required basic fields.");
        return; 
    }
    if (personalDetails.languages.length === 0) {
        toast.error("Please select at least one language.");
        return;
    }
    setLoading(false);
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
    setLoading(false);
    setStep(3);
  };
  
  const handleStep3to4 = () => {
    if (professionalDetails.qualification.length === 0 || !professionalDetails.qualification[0]) {
        toast.error("Please add at least one qualification.");
        return;
    }
    setLoading(false);
    setStep(4);
  };
  
  const handleStep4to5 = () => {
    if (!professionalDetails.experienceInfo) {
        toast.error("Please describe your experience.");
        return;
    }
    setLoading(false);
    setStep(5);
  };

  // Styles
  const inputClass = 'bg-gray-800 border border-gray-700 rounded-md px-4 py-2 w-full text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-700 disabled:opacity-70 disabled:cursor-not-allowed';
  const selectClass = 'bg-gray-800 border border-gray-700 rounded-md px-4 py-2 w-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const textAreaClass = 'bg-gray-800 border border-gray-700 rounded-md px-4 py-3 w-full text-gray-200 placeholder-gray-500 resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  // Render
  if (!isAuthorized) return null; // Handled by redirect/auth component

  if (applicationStatus !== 'none') {
    const StatusComponent = ApplicationStatusComponents[applicationStatus];
    if (StatusComponent) return <StatusComponent user={user} onReapply={() => setApplicationStatus('none')} />;
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
            
            {step === 6 && (
              <Confetti width={typeof window !== 'undefined' ? window.innerWidth : 0} height={typeof window !== 'undefined' ? window.innerHeight : 0} recycle={false} numberOfPieces={500} tweenDuration={10000} />
            )}

            {/* Stepper */}
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

            <div key={step} style={{ animation: 'fadeIn 0.5s ease-out' }}>
              
              {/* Step 1 */}
              {step === 1 && (
                <section>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <h3 className="md:col-span-2 text-2xl font-semibold text-white border-b border-gray-700 pb-3 mb-4">Basic Information</h3>
                      <LabeledInput label="Full Name" name="name" type="text" value={personalDetails.name} onChange={handleDetailsChange(setPersonalDetails)} className={inputClass} required disabled={true} />
                      <LabeledInput label="Mobile Number" name="mobileNumber" type="tel" value={personalDetails.mobileNumber} onChange={handleDetailsChange(setPersonalDetails)} placeholder="10-digit mobile number" className={inputClass} required disabled={!!user?.phone} />
                      <LabeledInput label="Email Address" name="email" type="email" value={personalDetails.email} onChange={handleDetailsChange(setPersonalDetails)} className={inputClass} disabled={!!user?.email} />
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
                      <button type="button" onClick={handleStep1to2} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">Save & Continue</button>
                  </div>
                </section>
              )}

              {/* Step 2 */}
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
                      <button type="button" onClick={() => {setLoading(false); setStep(1);}} className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition">Back</button>
                      <button type="button" onClick={handleStep2to3} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">Save & Continue</button>
                  </div>
                  </section>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <section>
                  <h3 className="text-2xl font-semibold text-white border-b border-gray-700 pb-3 mb-6">Your Qualifications</h3>
                  <DynamicFieldArray title="Qualifications" fieldKey="qualification" icon={FaBook} values={professionalDetails.qualification} placeholder="Qualification" onUpdate={(k, i, v) => handleDynamicField(setProfessionalDetails, k, 'UPDATE', {index: i, value: v})} onAdd={(k) => handleDynamicField(setProfessionalDetails, k, 'ADD')} onRemove={(k, i) => handleDynamicField(setProfessionalDetails, k, 'REMOVE', {index: i})} />
                  <div className="mt-12 flex justify-between">
                      <button type="button" onClick={() => {setLoading(false); setStep(2);}} className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition">Back</button>
                      <button type="button" onClick={handleStep3to4} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">Save & Continue</button>
                  </div>
                </section>
              )}
              
              {/* Step 4 */}
              {step === 4 && (
                <section>
                  <h3 className="text-2xl font-semibold text-white border-b border-gray-700 pb-3 mb-6">Your Experience & Work</h3>
                  <div className="space-y-6">
                    <div>
                        <LabeledTextarea label="Describe Your Experience" name="experienceInfo" value={professionalDetails.experienceInfo} onChange={handleDetailsChange(setProfessionalDetails)} placeholder="Detail your professional journey, key roles, and responsibilities..." className={textAreaClass} required />
                    </div>
                    <DynamicFieldArray title="Achievements" fieldKey="achievements" icon={FaTrophy} values={professionalDetails.achievements} placeholder="Achievement" onUpdate={(k, i, v) => handleDynamicField(setProfessionalDetails, k, 'UPDATE', {index: i, value: v})} onAdd={(k) => handleDynamicField(setProfessionalDetails, k, 'ADD')} onRemove={(k, i) => handleDynamicField(setProfessionalDetails, k, 'REMOVE', {index: i})} />
                    <DynamicFieldArray title="Publications" fieldKey="publications" fieldKey="publications" icon={FaPaperPlane} values={professionalDetails.publications} placeholder="Publication" onUpdate={(k, i, v) => handleDynamicField(setProfessionalDetails, k, 'UPDATE', {index: i, value: v})} onAdd={(k) => handleDynamicField(setProfessionalDetails, k, 'ADD')} onRemove={(k, i) => handleDynamicField(setProfessionalDetails, k, 'REMOVE', {index: i})} />
                  </div>
                  <div className="mt-12 flex justify-between">
                      <button type="button" onClick={() => {setLoading(false); setStep(3);}} className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition">Back</button>
                      <button type="button" onClick={handleStep4to5} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">Save & Continue</button>
                  </div>
                </section>
              )}

              {/* Step 5: Verification - FIXED */}
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
                        {/* Display the file name if it exists in state, even if the input is technically empty due to navigation */}
                        <span className="text-blue-400 font-semibold">{kycPreview || (verificationDetails.kycProofDocument ? verificationDetails.kycProofDocument.name : "Click to upload a file")}</span>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, or PDF (MAX. 5MB)</p>
                      </label>
                      <input id="kyc-upload" name="kycProofDocument" type="file" onChange={handleKycFile} className="hidden" />
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
                    {/* Cleaned up Back Button */}
                    <button type="button" onClick={() => {setLoading(false); setStep(4);}} className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition">Back</button>
                    
                    {/* Cleaned up Submit Button: Removed onClick, relies on Form onSubmit */}
                    <button 
                      type="submit" 
                      disabled={loading || !acknowledged} 
                      className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit for Verification'}
                    </button>
                  </div>
                </section>
              )}

              {/* Step 6 */}
              {step === 6 && (
                <div className="text-center py-20">
                  <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
                  <h2 className="text-4xl font-extrabold text-white mb-4">Thank You!</h2>
                  <p className="text-lg text-gray-300 mb-3">Your application has been submitted successfully.</p>
                  <p className="text-gray-400">You will be notified via email once the verification process is complete.</p>
                  <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 max-w-xl mx-auto mt-8">
                    <p className="text-gray-300 text-md italic">“Your knowledge has the power to change lives. Get ready to impact the world—one conversation at a time.”</p>
                  </div>
                  <button onClick={() => window.location.href = '/'} className="mt-8 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition">Return Home</button>
                </div>
              )}
            </div>

          </form>
      </main>
      
      <Footer />
    </div>
  );
}