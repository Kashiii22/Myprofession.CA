'use client';

import React, { useState, useEffect } from 'react';
import { 
  approveMentorRegistration, 
  rejectMentorRegistration,
  getNewMentorRegistrations
} from '@/lib/api/mentorRegistration';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt,
  FaGraduationCap,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle, 
  FaTimesCircle,
  FaDownload,
  FaEye,
  FaShieldAlt,
  FaAward,
  FaBook,
  FaIdCard,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';

export default function MentorRequestDetail({ registrationId, onBack, onStatusUpdate }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    fetchRequestDetails();
  }, [registrationId]);

  const fetchRequestDetails = async () => {
    setLoading(true);
    try {
      const response = await getNewMentorRegistrations();
      const mentor = response.data.find(m => m._id === registrationId || m.registrationId === registrationId);
      
      if (!mentor) {
        throw new Error('Mentor request not found');
      }

      const transformedData = {
        // Core identifiers
        id: mentor._id,
        registrationId: mentor.registrationId,
        
        // Personal info
        name: mentor.name,
        email: mentor.email,
        phone: mentor.mobileNumber,
        avatar: mentor.avatar || `https://ui-avatars.com/api/?name=${mentor.name.replace(/\s/g, '+')}&background=random`,
        
        // Professional info
        qualification: mentor.qualification || [],
        experience: mentor.yearsOfExperience,
        specializations: mentor.expertise || [],
        bio: mentor.experienceInfo,
        
        // Additional details
        achievements: mentor.achievements || [],
        publications: mentor.publications || [],
        
        // Status and dates
        status: mentor.isVerified ? 'approved' : (mentor.status === 'rejected' ? 'rejected' : 'pending'),
        appliedAt: mentor.registeredAt,
        createdAt: new Date(mentor.createdAt).toLocaleString('en-IN'),
        updatedAt: new Date(mentor.updatedAt).toLocaleString('en-IN'),
        
        // KYC and verification
        kycProofType: mentor.kycProofType,
        kycProofDocument: mentor.kycProofDocument,
        isVerified: mentor.isVerified,
        
        // Keep all original backend data for reference
        raw: mentor
      };
      
      setRequest(transformedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await approveMentorRegistration(request.registrationId);
      toast.success('Mentor approved successfully!');
      onStatusUpdate && onStatusUpdate();
      fetchRequestDetails(); // Refresh data
    } catch (err) {
      toast.error(err.message || 'Failed to approve mentor');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setActionLoading(true);
    try {
      await rejectMentorRegistration(request.registrationId);
      toast.success('Mentor request rejected!');
      setShowRejectionModal(false);
      setRejectionReason('');
      onStatusUpdate && onStatusUpdate();
      fetchRequestDetails(); // Refresh data
    } catch (err) {
      toast.error(err.message || 'Failed to reject mentor');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500 text-black',
      approved: 'bg-green-600 text-white',
      rejected: 'bg-red-600 text-white'
    };
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-bold ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading mentor details...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Mentor request not found'}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      
      <div className="bg-black min-h-screen text-gray-100">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaArrowLeft />
                <span>Back to Requests</span>
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-white">Mentor Request Details</h1>
                <p className="text-gray-400">Registration ID: {request.registrationId}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {getStatusBadge(request.status)}
              
              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    <FaCheckCircle />
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setShowRejectionModal(true)}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    <FaTimesCircle />
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Personal & Professional Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Personal Information Card */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-400" />
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={request.avatar} 
                      alt={request.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">{request.name}</h3>
                      <p className="text-gray-400">Mentor Applicant</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-gray-500" />
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white">{request.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-gray-500" />
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="text-white">{request.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {request.bio && (
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <h4 className="text-white font-semibold mb-2">Professional Bio</h4>
                    <p className="text-gray-300 leading-relaxed">{request.bio}</p>
                  </div>
                )}
              </div>

              {/* Professional Information Card */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-green-400" />
                  Professional Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Qualifications</h4>
                    <div className="space-y-2">
                      {request.qualification && request.qualification.length > 0 ? (
                        request.qualification.map((qual, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-300">{qual}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No qualifications listed</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-3">Experience</h4>
                    <div className="flex items-center gap-2">
                      <FaBriefcase className="text-gray-500" />
                      <span className="text-2xl font-bold text-white">{request.experience}</span>
                      <span className="text-gray-400">years</span>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h4 className="text-white font-semibold mb-3">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.specializations && request.specializations.length > 0 ? (
                        request.specializations.map((spec, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                          >
                            {spec}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No specializations listed</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements & Publications */}
              {(request.achievements?.length > 0 || request.publications?.length > 0) && (
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaAward className="text-yellow-400" />
                    Achievements & Publications
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {request.achievements && request.achievements.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <FaAward className="text-yellow-500" />
                          Achievements ({request.achievements.length})
                        </h4>
                        <div className="space-y-2">
                          {request.achievements.map((achievement, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-yellow-400 mt-1">•</span>
                              <p className="text-gray-300 text-sm">{achievement}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {request.publications && request.publications.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <FaBook className="text-blue-400" />
                          Publications ({request.publications.length})
                        </h4>
                        <div className="space-y-2">
                          {request.publications.map((pub, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-blue-400 mt-1">•</span>
                              <p className="text-gray-300 text-sm">{pub}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* KYC Documents */}
              {request.kycProofDocument && (
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaIdCard className="text-purple-400" />
                    KYC Verification Documents
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Proof Type</h4>
                      <p className="text-gray-300 capitalize">{request.kycProofType || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-2">Document</h4>
                      <div className="flex gap-4">
                        <a
                          href={request.kycProofDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <FaEye />
                          View Document
                        </a>
                        <a
                          href={request.kycProofDocument}
                          download
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          <FaDownload />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Status & Timeline */}
            <div className="space-y-6">
              
              {/* Status Card */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaShieldAlt className="text-purple-400" />
                  Verification Status
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Current Status</span>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">KYC Verified</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.isVerified ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {request.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-800">
                    <h4 className="text-white font-semibold mb-3">Request Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <FaCalendarAlt className="text-gray-500 mt-1" />
                        <div>
                          <p className="text-gray-400 text-sm">Application Submitted</p>
                          <p className="text-white">{request.appliedAt}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <FaClock className="text-gray-500 mt-1" />
                        <div>
                          <p className="text-gray-400 text-sm">Last Updated</p>
                          <p className="text-white">{request.updatedAt}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {request.status === 'pending' && (
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      <FaCheckCircle />
                      {actionLoading ? 'Processing...' : 'Approve Application'}
                    </button>
                    
                    <button
                      onClick={() => setShowRejectionModal(true)}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      <FaTimesCircle />
                      {actionLoading ? 'Processing...' : 'Reject Application'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Reject Mentor Application</h3>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Reason for rejection</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-gray-800 text-gray-100 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 h-32 resize-none"
                placeholder="Please provide a reason for rejecting this application..."
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
