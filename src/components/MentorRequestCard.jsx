'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  FaUser, 
  FaGraduationCap, 
  FaBriefcase, 
  FaEnvelope, 
  FaPhone, 
  FaEye, 
  FaCheck, 
  FaTimes,
  FaFileAlt,
  FaTrophy
} from 'react-icons/fa';

export default function MentorRequestCard({ request, onApprove, onReject }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApproveClick = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onApprove(request.registrationId);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onReject(request.registrationId);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500 text-black';
      case 'approved': return 'bg-green-600 text-white';
      case 'rejected': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Main Card Content */}
      <div className="p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <img 
              src={request.avatar} 
              alt={request.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
            />
            <div>
              <h3 className="text-xl font-semibold text-white">{request.name}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
                <span className="text-gray-400 text-sm">Applied: {request.appliedAt}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          {request.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={handleApproveClick}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-md font-medium transition-colors flex items-center gap-2"
              >
                {isProcessing ? 'Processing...' : <><FaCheck /> Approve</>}
              </button>
              <button
                onClick={handleRejectClick}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-md font-medium transition-colors flex items-center gap-2"
              >
                {isProcessing ? 'Processing...' : <><FaTimes /> Reject</>}
              </button>
            </div>
          )}
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <FaGraduationCap className="text-blue-400" />
            <span className="font-medium">Qualification:</span>
            <span className="text-sm">{request.qualification}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <FaBriefcase className="text-green-400" />
            <span className="font-medium">Experience:</span>
            <span className="text-sm">{request.experience} years</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <FaEnvelope className="text-purple-400" />
            <span className="font-medium">Email:</span>
            <span className="text-sm truncate">{request.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <FaPhone className="text-yellow-400" />
            <span className="font-medium">Contact:</span>
            <span className="text-sm">{request.contact}</span>
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-4">
          <div className="font-medium text-gray-300 mb-2">Specializations:</div>
          <div className="flex flex-wrap gap-2">
            {request.specializations.map((spec, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <FaEye />
          <span>{showDetails ? 'Hide' : 'Show'} Details</span>
        </button>
      </div>

      {/* Detailed Information (Expanded) */}
      {showDetails && (
        <div className="border-t border-gray-700 p-6 bg-gray-900">
          <div className="space-y-6">
            
            {/* Bio */}
            {request.bio && (
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <FaUser className="text-blue-400" />
                  Professional Bio
                </h4>
                <p className="text-gray-300 leading-relaxed">{request.bio}</p>
              </div>
            )}

            {/* Achievements */}
            {request.achievements && request.achievements.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <FaTrophy className="text-yellow-400" />
                  Achievements
                </h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {request.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Publications */}
            {request.publications && request.publications.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <FaFileAlt className="text-green-400" />
                  Publications
                </h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {request.publications.map((publication, index) => (
                    <li key={index}>{publication}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* KYC Information */}
            <div>
              <h4 className="font-semibold text-white mb-2">KYC Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Proof Type:</span>
                  <p className="text-gray-300">{
                    request.kycProofType ? 
                    request.kycProofType.charAt(0).toUpperCase() + request.kycProofType.slice(1) : 
                    'N/A'
                  }</p>
                </div>
                {request.kycProofDocument && (
                  <div>
                    <span className="text-gray-400 text-sm">Document:</span>
                    <button
                      onClick={() => window.open(request.kycProofDocument, '_blank')}
                      className="text-blue-400 hover:text-blue-300 ml-2"
                    >
                      View Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
