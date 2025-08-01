import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updatePersonalDetails,
  updateProfessionalDetails,
  addExpertiseField,
  updateExpertiseField,
  removeExpertiseField,
  nextStep,
  prevStep,
} from '../redux/store';
import { FaCamera, FaTimes, FaCheck } from 'react-icons/fa';
import Header from '@/components/Header';
const languages = ['English', 'Hindi', 'Spanish', 'French', 'German'];
const genders = ['Male', 'Female', 'Prefer not to say'];
const stepTitles = ['Basic Details', 'Professional Details', 'Verification'];
import { FaCheckCircle } from 'react-icons/fa';
export default function ExpertProfile() {
  const dispatch = useDispatch();
  const { step, personalDetails, professionalDetails } = useSelector((state) => state.profile);
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(updatePersonalDetails({ profilePic: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleExpertiseChange = (index, value) => {
    dispatch(updateExpertiseField({ index, value }));
  };

  const handleRemoveExpertise = (index) => {
    dispatch(removeExpertiseField(index));
  };

  const inputClass = 'bg-blue-900/20 backdrop-blur border border-blue-700 rounded-md px-4 py-2 w-full text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500';
const selectClass = 'bg-blue-950 text-blue-100 border border-blue-700 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200';
  const textAreaClass = 'bg-blue-900/20 backdrop-blur border border-blue-700 rounded-md px-4 py-3 w-full text-blue-100 placeholder-blue-300 resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-[#0e1625]/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-blue-700 relative">

        {/* Stepper */}
        <div className="relative mb-12">
          {/* <div className="absolute top-5 left-0 right-0 h-0.5 bg-blue-700/40 z-0" /> */}
          <div className="flex justify-between items-center relative z-10 px-4">
            {stepTitles.map((title, index) => {
              const stepNum = index + 1;
              const isCompleted = step > stepNum;
              const isActive = step === stepNum;

              return (
                <div key={title} className="flex-1 text-center relative">
                  <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                    ${isCompleted ? 'bg-blue-600' : isActive ? 'bg-blue-500' : 'bg-blue-800'} text-white`}>
                    {isCompleted ? <FaCheck className="text-sm" /> : stepNum}
                  </div>
                  <div className="text-xs text-blue-200 mt-2">{title}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1 - Basic Details */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-semibold text-white text-center mb-6">Basic Details</h2>
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-28 h-28">
                <img
                  src={preview || 'https://via.placeholder.com/120x120.png?text=Profile'}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border border-blue-700"
                />
                <label className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-full shadow-md cursor-pointer hover:scale-105 transition">
  <FaCamera className="text-white text-sm" />
  <input
    type="file"
    accept="image/*"
    onChange={handleImage}
    className="hidden"
  />
</label>

              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-blue-200 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={personalDetails.name}
                  onChange={(e) => dispatch(updatePersonalDetails({ name: e.target.value }))}
                  placeholder="Enter full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm text-blue-200 mb-1 block">Gender</label>
                <select
                  value={personalDetails.gender || ''}
                  onChange={(e) => dispatch(updatePersonalDetails({ gender: e.target.value }))}
                  className={selectClass}
                >
                  <option value="">Select gender</option>
                  {genders.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm text-blue-200 mb-1 block">Primary Language</label>
                <select
                  value={personalDetails.languagePrimary || ''}
                  onChange={(e) => dispatch(updatePersonalDetails({ languagePrimary: e.target.value }))}
                  className={selectClass}
                >
                  <option value="">Select language</option>
                  {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm text-blue-200 mb-1 block">Date of Birth</label>
                <input
                  type="date"
                  value={personalDetails.dob}
                  onChange={(e) => dispatch(updatePersonalDetails({ dob: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => dispatch(nextStep())}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl text-lg shadow-md hover:bg-blue-700 transition"
              >
                Save & Continue
              </button>
            </div>
          </>
        )}

        {/* Step 2 - Professional Details */}
        {step === 2 && (
          <>
            <h2 className="text-3xl font-semibold text-white mb-6">Professional Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-blue-200">Experience (Years)</label>
                <input
                  type="number"
                  value={professionalDetails.experience}
                  onChange={(e) => dispatch(updateProfessionalDetails({ experience: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm text-blue-200">Current Status</label>
                <input
                  type="text"
                  value={personalDetails.status}
                  onChange={(e) => dispatch(updatePersonalDetails({ status: e.target.value }))}
                  placeholder="e.g., Chartered Accountant, Income Tax Officer, A"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-blue-200 mb-2">Expertise</label>
                <div className="flex flex-wrap gap-3">
                  {professionalDetails.expertise.map((exp, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={exp}
                        onChange={(e) => handleExpertiseChange(i, e.target.value)}
                        placeholder={`Skill ${i + 1}`}
                        className="bg-blue-900/20 text-blue-100 border border-blue-700 rounded-md px-3 py-2 w-40"
                      />
                   <button
  onClick={() => handleRemoveExpertise(i)}
  className="text-white hover:text-white-400 transition"
>
  <FaTimes />
</button>

                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => dispatch(addExpertiseField())}
                    className="text-sm text-blue-300 hover:text-blue-100 transition"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>

              {['qualifications', 'achievements', 'publications'].map((field) => (
                <div key={field} className="sm:col-span-2">
                  <label className="text-sm text-blue-200 capitalize">{field}</label>
                  <textarea
                    value={professionalDetails[field]}
                    onChange={(e) => dispatch(updateProfessionalDetails({ [field]: e.target.value }))}
                    placeholder={`Enter your ${field}`}
                    className={textAreaClass}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-between">
              <button
                onClick={() => dispatch(prevStep())}
                className="bg-blue-800 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Back
              </button>
              <button
                onClick={() => dispatch(nextStep())}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </>
        )}

        {/* Step 3 - Thank You */}
        {step === 3 && (
          <div className="text-center py-20">
            <h2 className="text-4xl font-extrabold text-blue-400 mb-4 flex items-center justify-center gap-3">
  <FaCheckCircle className="text-blue-500 text-4xl" />
  Thank You!
</h2>
            <p className="text-white text-xl font-medium mb-3">You will be verified shortly via mail. Stay Tuned!!!</p>
            <div className="bg-white/5 border border-blue-500 rounded-xl p-6 max-w-xl mx-auto mt-6">
              <p className="text-blue-300 text-md italic">
                “Your knowledge has the power to change lives. Get ready to impact the world—one conversation at a time.”
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
