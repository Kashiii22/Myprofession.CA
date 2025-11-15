'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  getNewMentorRegistrations, 
  approveMentorRegistration, 
  rejectMentorRegistration 
} from '@/lib/api/mentorRegistration';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt,
  FaGraduationCap,
  FaBriefcase,
  FaFileAlt,
  FaSortUp,
  FaSortDown,
  FaDownload
} from 'react-icons/fa';

export default function MentorRequestList({ limit = 10, onViewDetails }) {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'all', qualification: 'all', experience: 'all' });
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [expandedRequest, setExpandedRequest] = useState(null);

  const fetchData = async () => {
    setStatus('loading');
    try {
      const response = await getNewMentorRegistrations();
      const transformedData = response.data.map(mentor => ({
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
      }));
      setRequests(transformedData);
      setStatus('succeeded');
    } catch (err) {
      setError(err.message);
      setStatus('failed');
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (registrationId) => {
    try {
      await approveMentorRegistration(registrationId);
      toast.success('Mentor approved successfully!');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to approve mentor');
    }
  };

  const handleReject = async (registrationId) => {
    try {
      await rejectMentorRegistration(registrationId);
      toast.success('Mentor request rejected!');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to reject mentor');
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleExpandRequest = (requestId) => {
    setExpandedRequest(prev => prev === requestId ? null : requestId);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500 text-black',
      approved: 'bg-green-600 text-white',
      rejected: 'bg-red-600 text-white'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const exportToCSV = () => {
    const csvContent = [
      [
        'Name', 'Email', 'Phone', 'Qualifications', 'Experience', 'Specializations', 
        'Status', 'Applied At', 'KYC Status', 'Achievements', 'Publications'
      ],
      ...filteredRequests.map(req => [
        req.name,
        req.email,
        req.phone,
        (req.qualification || []).join(' | '),
        req.experience,
        (req.specializations || []).join(' | '),
        req.status,
        req.appliedAt,
        req.kycProofType || 'N/A',
        (req.achievements || []).length || '0',
        (req.publications || []).length || '0'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mentor-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Data exported successfully!');
  };

  const filteredRequests = useMemo(() => {
    let filtered = requests.filter((request) => {
      // Status filter
      if (filters.status !== 'all' && request.status !== filters.status) return false;
      
      // Qualification filter
      if (filters.qualification !== 'all') {
        const qualStr = (request.qualification || []).join(' ').toLowerCase();
        if (!qualStr.includes(filters.qualification.toLowerCase())) return false;
      }
      
      // Experience filter
      if (filters.experience !== 'all') {
        if (filters.experience === '0-5' && request.experience > 5) return false;
        if (filters.experience === '5-10' && (request.experience < 5 || request.experience > 10)) return false;
        if (filters.experience === '10+' && request.experience < 10) return false;
      }
      
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const inName = request.name.toLowerCase().includes(search);
        const inEmail = request.email.toLowerCase().includes(search);
        const inQual = (request.qualification || []).join(' ').toLowerCase().includes(search);
        const inSpecs = (request.specializations || []).some((spec) => spec.toLowerCase().includes(search));
        const inBio = request.bio?.toLowerCase().includes(search);
        
        if (!inName && !inEmail && !inQual && !inSpecs && !inBio) return false;
      }
      
      return true;
    });
    
    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle arrays for sorting
      if (Array.isArray(aValue)) {
        aValue = aValue.join(', ');
        bValue = (bValue || []).join(', ');
      }
      
      // Handle strings
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue || '').toLowerCase();
      }
      
      // Handle dates
      if (aValue.includes('-') || aValue.includes('/')) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [requests, filters, sortConfig]);

  const displayRequests = limit ? filteredRequests.slice(0, limit) : filteredRequests;

  if (status === 'loading' && limit) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-400">Loading mentor requests...</div>
      </div>
    );
  }

  if (limit) {
    // Preview mode - show simplified list
    if (displayRequests.length === 0) {
      return (
        <div className="text-center py-4">
          <div className="text-gray-400">No pending mentor requests</div>
        </div>
      );
    }

    return (
      <>
        <Toaster position="top-center" />
        <div className="space-y-3">
          {displayRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <img src={request.avatar} alt={request.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-white font-medium">{request.name}</p>
                  <p className="text-gray-400 text-sm">{request.qualification}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  request.status === 'pending' ? 'bg-yellow-500 text-black' : 
                  request.status === 'approved' ? 'bg-green-600 text-white' : 
                  'bg-red-600 text-white'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
                {onViewDetails && (
                  <button
                    onClick={() => onViewDetails(request.registrationId)}
                    className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded"
                  >
                    View Details
                  </button>
                )}
                {request.status === 'pending' && (
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleApprove(request.registrationId)}
                      className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(request.registrationId)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  // Full list mode - Comprehensive table
  return (
    <div>
      <Toaster position="top-center" />
      
      {/* Filters and Actions */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, email, qualifications, specializations, bio..."
                className="w-full bg-gray-700 text-gray-100 placeholder-gray-400 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <select
              className="bg-gray-700 text-gray-100 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              className="bg-gray-700 text-gray-100 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.experience}
              onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
            >
              <option value="all">All Experience</option>
              <option value="0-5">0-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <FaDownload />
              Export CSV
            </button>
          </div>
        </div>

        {/* Selection Actions */}
        {selectedRequests.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg mb-4">
            <span className="text-gray-300">Selected: {selectedRequests.length} requests</span>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  try {
                    await Promise.all(selectedRequests.map(id => handleApprove(id)));
                    setSelectedRequests([]);
                    toast.success('Bulk approval completed!');
                    fetchData();
                  } catch (err) {
                    toast.error('Failed to complete bulk approval');
                  }
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Approve All ({selectedRequests.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: requests.length, color: 'bg-gray-600' },
          { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, color: 'bg-yellow-600' },
          { label: 'Approved', value: requests.filter(r => r.status === 'approved').length, color: 'bg-green-600' },
          { label: 'Rejected', value: requests.filter(r => r.status === 'rejected').length, color: 'bg-red-600' }
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} p-4 rounded-lg text-white text-center`}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Comprehensive Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="p-3 text-left">
                  <input type="checkbox" onChange={(e) => {
                    setSelectedRequests(e.target.checked ? displayRequests.map(r => r.registrationId) : []);
                  }} />
                </th>
                <th 
                  className="p-3 text-left text-gray-300 cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
                  </div>
                </th>
                <th 
                  className="p-3 text-left text-gray-300 cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Applied
                    {sortConfig.key === 'createdAt' && (
                      sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
                  </div>
                </th>
                <th className="p-3 text-left text-gray-300">Contact</th>
                <th className="p-3 text-left text-gray-300">Qualifications</th>
                <th className="p-3 text-left text-gray-300">Experience</th>
                <th className="p-3 text-left text-gray-300">Specializations</th>
                <th className="p-3 text-left text-gray-300">Status</th>
                <th className="p-3 text-left text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {displayRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <tr className="hover:bg-gray-700 transition-colors">
                    <td className="p-3">
                      <input 
                        type="checkbox" 
                        checked={selectedRequests.includes(request.registrationId)}
                        onChange={() => {
                          setSelectedRequests(prev => 
                            prev.includes(request.registrationId) 
                              ? prev.filter(id => id !== request.registrationId)
                              : [...prev, request.registrationId]
                          );
                        }}
                        disabled={request.status !== 'pending'}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={request.avatar} 
                          alt={request.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-white">{request.name}</div>
                          <div className="text-sm text-gray-400">{request.registrationId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-gray-300">
                        <div>{request.appliedAt}</div>
                        <div className="text-xs text-gray-500">{request.createdAt}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-gray-300">
                        <div className="flex items-center gap-1 text-sm">
                          <FaEnvelope className="text-gray-500" />
                          {request.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm mt-1">
                          <FaPhone className="text-gray-500" />
                          {request.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="text-gray-300 text-sm">
                        {(request.qualification || []).slice(0, 2).map((qual, i) => (
                          <span key={i} className="inline-block px-2 py-1 bg-gray-600 rounded m-1">
                            {qual}
                          </span>
                        ))}
                        {(request.qualification || []).length > 2 && (
                          <span className="text-xs text-gray-400">+{(request.qualification || []).length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-gray-300">
                        <span className="text-white font-medium">{request.experience}</span>
                        <span className="text-gray-400 ml-1">years</span>
                      </div>
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="text-gray-300 text-sm">
                        {(request.specializations || []).slice(0, 2).map((spec, i) => (
                          <span key={i} className="inline-block px-2 py-1 bg-blue-600 rounded m-1">
                            {spec}
                          </span>
                        ))}
                        {(request.specializations || []).length > 2 && (
                          <span className="text-xs text-gray-400">+{(request.specializations || []).length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpandRequest(request.id)}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Quick View"
                        >
                          <FaEye />
                        </button>
                        {onViewDetails && (
                          <button
                            onClick={() => onViewDetails(request.registrationId)}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                          >
                            View Details
                          </button>
                        )}
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.registrationId)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.registrationId)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Details Row */}
                  {expandedRequest === request.id && (
                    <tr className="bg-gray-900">
                      <td colSpan="9" className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Personal Info */}
                          <div>
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <FaUser /> Personal Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div><span className="text-gray-400">Full Name:</span> <span className="text-white">{request.name}</span></div>
                              <div><span className="text-gray-400">Email:</span> <span className="text-white">{request.email}</span></div>
                              <div><span className="text-gray-400">Phone:</span> <span className="text-white">{request.phone}</span></div>
                              <div><span className="text-gray-400">Registration ID:</span> <span className="text-white">{request.registrationId}</span></div>
                            </div>
                          </div>

                          {/* Professional Info */}
                          <div>
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <FaGraduationCap /> Professional Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-gray-400">Qualifications:</span>
                                <div className="mt-1">
                                  {(request.qualification || []).map((qual, i) => (
                                    <span key={i} className="inline-block px-2 py-1 bg-gray-700 rounded m-1 text-white">
                                      {qual}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div><span className="text-gray-400">Experience:</span> <span className="text-white">{request.experience} years</span></div>
                              <div>
                                <span className="text-gray-400">Specializations:</span>
                                <div className="mt-1">
                                  {(request.specializations || []).map((spec, i) => (
                                    <span key={i} className="inline-block px-2 py-1 bg-blue-700 rounded m-1 text-white">
                                      {spec}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div>
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <FaFileAlt /> Additional Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div><span className="text-gray-400">Applied:</span> <span className="text-white">{request.appliedAt}</span></div>
                              <div><span className="text-gray-400">KYC Proof:</span> <span className="text-white">{request.kycProofType || 'N/A'}</span></div>
                              <div><span className="text-gray-400">Achievements:</span> <span className="text-white">{(request.achievements || []).length || '0'}</span></div>
                              <div><span className="text-gray-400">Publications:</span> <span className="text-white">{(request.publications || []).length || '0'}</span></div>
                              {request.bio && (
                                <div>
                                  <span className="text-gray-400">Bio:</span>
                                  <p className="text-white mt-1">{request.bio}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Documents Section */}
                        {(request.kycProofDocument || request.achievements?.length > 0 || request.publications?.length > 0) && (
                          <div className="mt-6 pt-6 border-t border-gray-700">
                            <h4 className="text-white font-semibold mb-3">Documents & Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {request.kycProofDocument && (
                                <div>
                                  <h5 className="text-gray-300 mb-2">KYC Document</h5>
                                  <a 
                                    href={request.kycProofDocument}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-sm underline"
                                  >
                                    View KYC Document
                                  </a>
                                </div>
                              )}
                              
                              {request.achievements && request.achievements.length > 0 && (
                                <div>
                                  <h5 className="text-gray-300 mb-2">Achievements ({request.achievements.length})</h5>
                                  <ul className="text-sm text-white space-y-1">
                                    {request.achievements.map((achievement, i) => (
                                      <li key={i}>
                                        <span className="text-yellow-400">•</span> {achievement}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {request.publications && request.publications.length > 0 && (
                                <div>
                                  <h5 className="text-gray-300 mb-2">Publications ({request.publications.length})</h5>
                                  <ul className="text-sm text-white space-y-1">
                                    {request.publications.map((pub, i) => (
                                      <li key={i}>
                                        <span className="text-blue-400">•</span> {pub}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {displayRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No mentor requests found matching your criteria</div>
          <div className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms</div>
        </div>
      )}
    </div>
  );
}
