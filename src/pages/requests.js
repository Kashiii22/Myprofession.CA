'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/AdminSidebar'; 
import Header from '@/components/Header'; 
import { 
  getNewMentorRegistrations, 
  approveMentorRegistration, 
  rejectMentorRegistration 
} from '@/lib/api/mentorRegistration'; 
import toast, { Toaster } from 'react-hot-toast';

const PAGE_SIZE = 5;

export default function MentorRequestsPage() {
  // --- Local State Management ---
  const [allMentors, setAllMentors] = useState([]); // Master list of mentors from the API
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'succeeded' | 'failed'
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, action: '', mentorId: null });
  const [profileData, setProfileData] = useState(null);

  // --- Data Fetching ---
  const fetchData = async () => {
    setStatus('loading');
    try {
      const response = await getNewMentorRegistrations();
      // Transform backend data to match the format this component expects
      const transformedData = response.data.map(mentor => ({
        id: mentor._id,
        registrationId: mentor.registrationId,
        name: mentor.name,
        avatar: `https://ui-avatars.com/api/?name=${mentor.name.replace(/\s/g, '+')}&background=random`,
        qualification: mentor.qualification.join(', ') || 'N/A',
        experience: mentor.yearsOfExperience,
        specializations: mentor.expertise,
        status: mentor.isVerified ? 'approved' : 'pending',
        appliedAt: new Date(mentor.registeredAt).toLocaleDateString('en-IN'),
        contact: mentor.mobileNumber,
        email: mentor.email,
        bio: mentor.experienceInfo,
        achievements: mentor.achievements,
        publications: mentor.publications,
        kycProofType: mentor.kycProofType,
        kycProofDocument: mentor.kycProofDocument,
      }));
      setAllMentors(transformedData);
      setStatus('succeeded');
    } catch (err) {
      setError(err.message);
      setStatus('failed');
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty array ensures this runs only once on mount

  // --- Event Handlers ---
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
    setCurrentPage(1);
  };

  // --- Derived State for Display ---
  const filteredMentors = useMemo(() => {
    return allMentors.filter((m) => {
      if (filters.status !== 'all' && m.status !== filters.status) return false;
      const search = filters.search.toLowerCase();
      if (search) {
        const inName = m.name.toLowerCase().includes(search);
        const inQual = m.qualification.toLowerCase().includes(search);
        const inSpecs = Array.isArray(m.specializations) && m.specializations.some((spec) => spec.toLowerCase().includes(search));
        if (!inName && !inQual && !inSpecs) return false;
      }
      return true;
    });
  }, [allMentors, filters]);

  const totalPages = Math.ceil(filteredMentors.length / PAGE_SIZE);
  const pagedMentors = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredMentors.slice(start, start + PAGE_SIZE);
  }, [filteredMentors, currentPage]);
  
  // --- Bulk Selection ---
  const toggleSelectMentor = (registrationId) => {
    setSelectedMentors((prev) =>
      prev.includes(registrationId) ? prev.filter((x) => x !== registrationId) : [...prev, registrationId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMentors.length === pagedMentors.length) {
      setSelectedMentors([]);
    } else {
      setSelectedMentors(pagedMentors.map((m) => m.registrationId));
    }
  };

  // --- KPI Calculations ---
  const totalRequests = allMentors.length;
  const pendingCount = allMentors.filter((m) => m.status === 'pending').length;
  const approvedCount = allMentors.filter((m) => m.status === 'approved').length;
  const rejectedCount = allMentors.filter((m) => m.status === 'rejected').length;
  const avgExperiencePending =
    pendingCount === 0
      ? 0
      : (
          allMentors
            .filter((m) => m.status === 'pending')
            .reduce((acc, cur) => acc + cur.experience, 0) / pendingCount
        ).toFixed(1);

  // --- Modal and Action Logic ---
  const openModal = (action, mentorId = null) => {
    setModal({ isOpen: true, action, mentorId });
  };
  const closeModal = () => setModal({ isOpen: false, action: '', mentorId: null });
  
  const confirmAction = async () => {
    const action = modal.action;
    const mentorId = modal.mentorId; // This is the registrationId
    closeModal();
    
    try {
      if (action === 'approve' && mentorId) {
        await approveMentorRegistration(mentorId);
      } else if (action === 'reject' && mentorId) {
        await rejectMentorRegistration(mentorId);
      } else if (action === 'bulk-approve') {
        await Promise.all(selectedMentors.map(id => approveMentorRegistration(id)));
        setSelectedMentors([]);
      } else if (action === 'bulk-reject') {
        await Promise.all(selectedMentors.map(id => rejectMentorRegistration(id)));
        setSelectedMentors([]);
      }
      toast.success('Action completed successfully!');
      fetchData(); // Re-fetch data to show the updated list
    } catch (err) {
      toast.error(err.message || 'An error occurred.');
    }
  };
  
  const openProfileModal = (mentor) => {
    setProfileData(mentor);
    setModal({ isOpen: true, action: 'view-details', mentorId: mentor.registrationId });
  };

  // --- Render Logic ---
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-xl text-white">Loading Mentor Requests...</div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-gray-100 flex flex-col">
      <Toaster position="top-center" />
      <Header />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <Sidebar className="md:h-screen md:w-64 w-full shrink-0" />
        <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
          <h2 className="text-2xl font-bold mb-6">Mentor Requests</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-900 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{totalRequests}</div>
              <div className="text-gray-400 text-sm mt-1">Total Requests</div>
            </div>
            <div className="bg-yellow-600 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{pendingCount}</div>
              <div className="text-black text-sm mt-1">Pending</div>
            </div>
            <div className="bg-green-600 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{approvedCount}</div>
              <div className="text-black text-sm mt-1">Approved</div>
            </div>
            <div className="bg-red-600 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{rejectedCount}</div>
              <div className="text-black text-sm mt-1">Rejected</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{avgExperiencePending}</div>
              <div className="text-gray-400 text-sm mt-1">Avg Exp (Pending)</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 space-y-4 md:space-y-0">
            <input
              type="text"
              placeholder="Search by name, qualification, specialization..."
              className="flex-1 bg-gray-900 text-gray-100 placeholder-gray-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={filters.search}
              onChange={handleSearchChange}
              aria-label="Search mentors"
            />
            <select
              className="bg-gray-900 text-gray-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={filters.status}
              onChange={handleStatusFilterChange}
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => openModal('bulk-approve')}
              disabled={selectedMentors.length === 0}
              className={`px-4 py-2 rounded-md font-semibold text-white transition ${selectedMentors.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'}`}
              aria-label="Approve selected mentor requests"
            >
              Approve Selected
            </button>
            <button
              onClick={() => openModal('bulk-reject')}
              disabled={selectedMentors.length === 0}
              className={`px-4 py-2 rounded-md font-semibold text-white transition ${selectedMentors.length > 0 ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'}`}
              aria-label="Reject selected mentor requests"
            >
              Reject Selected
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">
                    <input type="checkbox" checked={selectedMentors.length > 0 && selectedMentors.length === pagedMentors.length} onChange={toggleSelectAll} aria-label="Select all mentors on this page" />
                  </th>
                  {['Avatar', 'Name', 'Qualification', 'Experience', 'Specializations', 'Status', 'Applied At', 'Actions'].map((head) => (
                    <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {pagedMentors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-400">No mentor requests found.</td>
                  </tr>
                ) : (
                  pagedMentors.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-700 transition-colors duration-150 cursor-pointer" onClick={() => openProfileModal(m)}>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={selectedMentors.includes(m.registrationId)} onChange={() => toggleSelectMentor(m.registrationId)} disabled={m.status !== 'pending'} aria-label={`Select mentor ${m.name}`} />
                      </td>
                      <td className="px-4 py-3"><img src={m.avatar} alt={`${m.name}'s avatar`} className="w-10 h-10 rounded-full object-cover" loading="lazy" /></td>
                      <td className="px-4 py-3 font-semibold">{m.name}</td>
                      <td className="px-4 py-3">{m.qualification}</td>
                      <td className="px-4 py-3">{m.experience} years</td>
                      <td className="px-4 py-3">{m.specializations.join(', ')}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${m.status === 'pending' ? 'bg-yellow-500 text-black' : m.status === 'approved' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                          {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{m.appliedAt}</td>
                      <td className="px-4 py-3 space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openModal('approve', m.registrationId)} disabled={m.status !== 'pending'} className={`px-3 py-1 rounded-md text-sm font-semibold ${m.status === 'pending' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 cursor-not-allowed'} transition-colors duration-150`}>Approve</button>
                        <button onClick={() => openModal('reject', m.registrationId)} disabled={m.status !== 'pending'} className={`px-3 py-1 rounded-md text-sm font-semibold ${m.status === 'pending' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-600 cursor-not-allowed'} transition-colors duration-150`}>Reject</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center space-x-2 mt-4">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-md bg-gray-900 hover:bg-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed">Previous</button>
            {[...Array(totalPages).keys()].map((i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-yellow-500 text-black font-bold' : 'bg-gray-900 hover:bg-gray-800'}`}>{i + 1}</button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md bg-gray-900 hover:bg-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed">Next</button>
          </div>
          
          {modal.isOpen && (
            <>
              {(modal.action.includes('approve') || modal.action.includes('reject')) && (
                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full shadow-lg">
                      <h3 className="text-lg font-semibold mb-4 text-white">Confirm {modal.action.includes('approve') ? 'Approval' : 'Rejection'}</h3>
                      <p className="mb-6 text-gray-300">Are you sure you want to {modal.action.includes('approve') ? 'approve' : 'reject'} {modal.action.startsWith('bulk') ? `${selectedMentors.length} requests` : `this request`}?</p>
                      <div className="flex justify-end space-x-4">
                        <button onClick={closeModal} className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition">Cancel</button>
                        <button onClick={confirmAction} className={`px-4 py-2 rounded-md text-white transition ${modal.action.includes('approve') ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>Confirm</button>
                      </div>
                    </div>
                 </div>
              )}

              {modal.action === 'view-details' && profileData && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 overflow-auto p-6" onClick={closeModal}>
                    <div className="bg-gray-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-lg relative" onClick={(e) => e.stopPropagation()}>
                       <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold">&times;</button>
                       <h3 className="text-2xl font-bold mb-4 text-white">Mentor Profile - {profileData.name}</h3>
                       {/* ... Profile Modal content JSX ... */}
                    </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}