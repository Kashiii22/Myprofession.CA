'use client';

import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updatePersonalDetails,
  updateProfessionalDetails,
} from '../redux/expertSlice';

import {
  FaEdit, FaCamera, FaBriefcase, FaUserTie, FaEnvelope, FaUser,
  FaCalendarAlt, FaLanguage, FaMapMarkerAlt, FaGlobe, FaLinkedin,
  FaCertificate, FaClock, FaStar, FaBook, FaCheckCircle, FaUniversity, FaBuilding,
} from 'react-icons/fa';

import Header from '@/components/Header';

const MyProfile = () => {
  const dispatch = useDispatch();
  const { personalDetails, professionalDetails } = useSelector((state) => state.profile);

  const [bio, setBio] = useState(
    personalDetails.bio ||
    'Chartered Accountant with over 7 years of experience in taxation, auditing, and financial planning. Passionate about leveraging financial knowledge for strategic business growth.'
  );
  const [editingBio, setEditingBio] = useState(false);
  const [profileImage, setProfileImage] = useState(
    personalDetails.image || 'https://randomuser.me/api/portraits/women/65.jpg'
  );

  const [status, setStatus] = useState(personalDetails.status || 'Actively Consulting');
  const [experience, setExperience] = useState(professionalDetails.experience || 7);
  const [qualifications, setQualifications] = useState(professionalDetails.qualifications || 'CA, B.Com');
  const [editingProfessional, setEditingProfessional] = useState(false);

  const [expertise, setExpertise] = useState((professionalDetails.expertise || ['Audit', 'Tax', 'Budgeting']).join(', '));
  const [softSkills, setSoftSkills] = useState('Analytical Thinking, Integrity, Communication');
  const [interests, setInterests] = useState('Startup Consulting, Financial Education');
  const [editingSkills, setEditingSkills] = useState(false);

  const profileRef = useRef(null);

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

  const handleSkillsSave = () => {
    dispatch(updateProfessionalDetails({ expertise: expertise.split(',').map((e) => e.trim()) }));
    setEditingSkills(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0e0e10] text-gray-200 p-6 sm:p-10 space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">My Profile</h1>
        </div>

        <div ref={profileRef} className="space-y-10">
          {/* Personal Info */}
          <div className="bg-[#1a1a1d] border border-blue-600 rounded-2xl shadow-lg p-6 flex flex-col lg:flex-row gap-6">
            <div className="relative group self-start">
              <img
                src={profileImage}
                alt="Profile"
                className="w-44 h-44 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center cursor-pointer hover:bg-blue-700">
                <FaCamera />
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
                  <Detail label="Full Name" value={personalDetails.name || 'Ritika Gupta'} icon={<FaUser />} />
                  <Detail label="Email" value={personalDetails.email || 'ritika.ca@domain.com'} icon={<FaEnvelope />} />
                  <Detail label="Gender" value={personalDetails.gender || 'Female'} icon={<FaUserTie />} />
                  <Detail label="Date of Birth" value={personalDetails.dob || '1992-11-12'} icon={<FaCalendarAlt />} />
                  <Detail label="Language" value={personalDetails.languagePrimary || 'English, Hindi'} icon={<FaLanguage />} />
                  {/* <Detail label="Location" value={personalDetails.location || 'Mumbai, India'} icon={<FaMapMarkerAlt />} /> */}
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
                    {bio} <FaEdit className="text-blue-400 cursor-pointer ml-2" onClick={() => setEditingBio(true)} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail label="Current Status" value={status} icon={<FaBuilding />} />
                <Detail label="Experience" value={`${experience} years`} icon={<FaClock />} />
                <Detail label="Qualifications" value={qualifications} icon={<FaUniversity />} />
                <Detail label="Certifications" value="IFRS, GST Specialist, Taxation Pro" icon={<FaCertificate />} />
                <Detail label="Publications" value="5 articles in CA Club India, 2 in ICAI Journal" icon={<FaBook />} />
                <FaEdit className="text-blue-400 cursor-pointer mt-2" onClick={() => setEditingProfessional(true)} />
              </div>
            )}
          </Section>

          {/* Skills & Expertise */}
          <Section title="Skills & Expertise">
            {editingSkills ? (
              <div className="space-y-4">
                <textarea
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  className="w-full p-2 rounded bg-[#2c2c2e] text-white"
                  rows={2}
                  placeholder="Expertise (comma-separated)"
                />
                <input
                  type="text"
                  value={softSkills}
                  onChange={(e) => setSoftSkills(e.target.value)}
                  className="w-full bg-[#2c2c2e] text-white p-2 rounded"
                  placeholder="Soft Skills"
                />
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full bg-[#2c2c2e] text-white p-2 rounded"
                  placeholder="Interests"
                />
                <button
                  onClick={handleSkillsSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Detail label="Expertise" value={expertise} icon={<FaStar />} />
                <Detail label="Soft Skills" value={softSkills} icon={<FaCheckCircle />} />
                <Detail label="Interests" value={interests} icon={<FaCheckCircle />} />
                <FaEdit className="text-blue-400 cursor-pointer mt-2" onClick={() => setEditingSkills(true)} />
              </div>
            )}
          </Section>

          {/* Online Links */}
          <Section title="Online Presence">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Portfolio" value="www.ritikaca.dev" icon={<FaGlobe />} />
              <Detail label="LinkedIn" value="linkedin.com/in/ritika-ca" icon={<FaLinkedin />} />
            </div>
          </Section>
        </div>
      </div>
    </>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-[#1a1a1d] border border-blue-600 rounded-2xl shadow-md p-6 space-y-4">
    <h2 className="text-2xl font-bold text-white flex items-center gap-2">{title}</h2>
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
      {icon && <span className="text-blue-400 mt-1">{icon}</span>}
      <div>
        <p className="text-sm text-gray-400 font-semibold">{label}</p>
        <p className="text-white">{displayValue}</p>
      </div>
    </div>
  );
};

export default MyProfile;
