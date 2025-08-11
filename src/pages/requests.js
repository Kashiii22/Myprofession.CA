'use client';

import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '@/components/AdminSidebar'; // Adjust import path as needed
import Header from '@/components/Header'; // Optional if you want header
import {
  approveMentor,
  rejectMentor,
  setSearchFilter,
  setStatusFilter,
} from '../redux/mentorSlice';

const PAGE_SIZE = 5; // adjust as needed

export default function MentorRequestsPage() {
  const { items, filters } = useSelector((state) => state.mentors);
  const dispatch = useDispatch();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk selection state
  const [selectedMentors, setSelectedMentors] = useState([]);

  // Modals
  // modal.action: 'approve' | 'reject' | 'bulk-approve' | 'bulk-reject' | 'view-details'
  // modal.mentorId for single actions or null for bulk
  const [modal, setModal] = useState({
    isOpen: false,
    action: '',
    mentorId: null,
  });

  // Detailed profile modal state data
  const [profileData, setProfileData] = useState(null);

  // Filters and Search handlers
  const handleSearchChange = (e) => {
    dispatch(setSearchFilter(e.target.value));
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    dispatch(setStatusFilter(e.target.value));
    setCurrentPage(1);
  };

  // Filter mentors based on Redux filters
  const filteredMentors = useMemo(() => {
    return items.filter((m) => {
      if (filters.status !== 'all' && m.status !== filters.status) return false;

      const search = filters.search.toLowerCase();
      if (search) {
        const inName = m.name.toLowerCase().includes(search);
        const inQual = m.qualification.toLowerCase().includes(search);
        const inSpecs = m.specializations.some((spec) =>
          spec.toLowerCase().includes(search)
        );
        if (!inName && !inQual && !inSpecs) return false;
      }

      return true;
    });
  }, [items, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredMentors.length / PAGE_SIZE);
  const pagedMentors = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredMentors.slice(start, start + PAGE_SIZE);
  }, [filteredMentors, currentPage]);

  // Bulk select toggle handlers
  const toggleSelectMentor = (id) => {
    setSelectedMentors((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMentors.length === pagedMentors.length) {
      setSelectedMentors([]);
    } else {
      setSelectedMentors(pagedMentors.map((m) => m.id));
    }
  };

  // KPI calculations
  const totalRequests = items.length;
  const pendingCount = items.filter((m) => m.status === 'pending').length;
  const approvedCount = items.filter((m) => m.status === 'approved').length;
  const rejectedCount = items.filter((m) => m.status === 'rejected').length;
  const avgExperiencePending =
    pendingCount === 0
      ? 0
      : (
          items
            .filter((m) => m.status === 'pending')
            .reduce((acc, cur) => acc + cur.experience, 0) / pendingCount
        ).toFixed(1);

  // Open confirmation modal for single or bulk action
  const openModal = (action, mentorId = null) => {
    setModal({ isOpen: true, action, mentorId });
  };

  // Confirm modal action handler
  const confirmAction = () => {
    if (modal.action === 'approve' && modal.mentorId) {
      dispatch(approveMentor(modal.mentorId));
    } else if (modal.action === 'reject' && modal.mentorId) {
      dispatch(rejectMentor(modal.mentorId));
    } else if (modal.action === 'bulk-approve') {
      selectedMentors.forEach((id) => dispatch(approveMentor(id)));
      setSelectedMentors([]);
    } else if (modal.action === 'bulk-reject') {
      selectedMentors.forEach((id) => dispatch(rejectMentor(id)));
      setSelectedMentors([]);
    }
    closeModal();
  };

  const closeModal = () =>
    setModal({ isOpen: false, action: '', mentorId: null });

  // Show mentor profile modal
  const openProfileModal = (mentor) => {
    setProfileData(mentor);
    setModal({ isOpen: true, action: 'view-details', mentorId: mentor.id });
  };

  return (
    <div className="bg-black min-h-screen text-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <Sidebar className="md:h-screen md:w-64 w-full shrink-0" />

        {/* Main content area */}
        <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
          <h2 className="text-2xl font-bold mb-6">Mentor Requests</h2>

          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-900 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{totalRequests}</div>
              <div className="text-gray-400 text-sm mt-1">Total Requests</div>
            </div>
            <div className="bg-yellow-600 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{pendingCount}</div>
              <div className="text-black text-sm mt-1">Pending Approvals</div>
            </div>
            <div className="bg-green-600 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{approvedCount}</div>
              <div className="text-black text-sm mt-1">Approved Mentors</div>
            </div>
            <div className="bg-red-600 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{rejectedCount}</div>
              <div className="text-black text-sm mt-1">Rejected Mentors</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold">{avgExperiencePending}</div>
              <div className="text-gray-400 text-sm mt-1">
                Avg Experience (Pending)
              </div>
            </div>
          </div>

          {/* Filters */}
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
              <option value="all">Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Bulk action buttons */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => openModal('bulk-approve')}
              disabled={selectedMentors.length === 0}
              className={`px-4 py-2 rounded-md font-semibold text-white transition ${
                selectedMentors.length > 0
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
              aria-label="Approve selected mentor requests"
            >
              Approve Selected
            </button>
            <button
              onClick={() => openModal('bulk-reject')}
              disabled={selectedMentors.length === 0}
              className={`px-4 py-2 rounded-md font-semibold text-white transition ${
                selectedMentors.length > 0
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
              aria-label="Reject selected mentor requests"
            >
              Reject Selected
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-300">
                    <input
                      type="checkbox"
                      checked={
                        selectedMentors.length === pagedMentors.length &&
                        pagedMentors.length > 0
                      }
                      onChange={toggleSelectAll}
                      aria-label="Select all mentors on this page"
                    />
                  </th>
                  {[
                    'Avatar',
                    'Name',
                    'Qualification',
                    'Experience',
                    'Specializations',
                    'Status',
                    'Applied At',
                    'Actions',
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-300"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 bg-gray-800">
                {pagedMentors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-6 text-gray-400">
                      No mentor requests found.
                    </td>
                  </tr>
                ) : (
                  pagedMentors.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
                      onClick={() => openProfileModal(m)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedMentors.includes(m.id)}
                          onChange={() => toggleSelectMentor(m.id)}
                          disabled={m.status !== 'pending'}
                          aria-label={`Select mentor ${m.name}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={m.avatar}
                          alt={`${m.name}'s avatar`}
                          className="w-10 h-10 rounded-full object-cover"
                          loading="lazy"
                        />
                      </td>
                      <td className="px-4 py-3 font-semibold">{m.name}</td>
                      <td className="px-4 py-3">{m.qualification}</td>
                      <td className="px-4 py-3">{m.experience} years</td>
                      <td className="px-4 py-3">{m.specializations.join(', ')}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold
                          ${
                            m.status === 'pending'
                              ? 'bg-yellow-500 text-black'
                              : m.status === 'approved'
                              ? 'bg-green-600 text-white'
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{m.appliedAt}</td>
                      <td
                        className="px-4 py-3 space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => openModal(m.id, 'approve')}
                          disabled={m.status !== 'pending'}
                          className={`px-3 py-1 rounded-md text-sm font-semibold ${
                            m.status === 'pending'
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-600 cursor-not-allowed'
                          } transition-colors duration-150`}
                          aria-label={`Approve mentor request for ${m.name}`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openModal(m.id, 'reject')}
                          disabled={m.status !== 'pending'}
                          className={`px-3 py-1 rounded-md text-sm font-semibold ${
                            m.status === 'pending'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-gray-600 cursor-not-allowed'
                          } transition-colors duration-150`}
                          aria-label={`Reject mentor request for ${m.name}`}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
              aria-label="Previous page"
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map((i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? 'bg-yellow-500 text-black font-bold'
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
                aria-label={`Page ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
              aria-label="Next page"
            >
              Next
            </button>
          </div>

          {/* Confirmation Modal for approve/reject */}
          {modal.isOpen &&
            (modal.action === 'approve' ||
            modal.action === 'reject' ||
            modal.action === 'bulk-approve' ||
            modal.action === 'bulk-reject' ? (
              <div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full shadow-lg">
                  <h3
                    id="modal-title"
                    className="text-lg font-semibold mb-4 text-white"
                  >
                    Confirm{' '}
                    {modal.action.includes('approve')
                      ? 'Approval'
                      : 'Rejection'}
                    {modal.action.startsWith('bulk') ? ' (Bulk)' : ''}
                  </h3>
                  <p id="modal-description" className="mb-6 text-gray-300">
                    {modal.action.startsWith('bulk')
                      ? `Are you sure you want to ${
                          modal.action.includes('approve')
                            ? 'approve'
                            : 'reject'
                        } ${selectedMentors.length} selected mentor request(s)?`
                      : `Are you sure you want to ${
                          modal.action === 'approve' ? 'approve' : 'reject'
                        } mentor request `}
                    {!modal.action.startsWith('bulk') && (
                      <strong>
                        {items.find((m) => m.id === modal.mentorId)?.name}
                      </strong>
                    )}
                    ?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmAction}
                      className={`px-4 py-2 rounded-md text-white transition ${
                        modal.action.includes('approve')
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            ) : null)}

          {/* Mentor Profile Modal */}
          {modal.isOpen && modal.action === 'view-details' && profileData && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 overflow-auto p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-modal-title"
              aria-describedby="profile-modal-description"
            >
              <div className="bg-gray-900 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-lg relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
                  aria-label="Close mentor profile"
                >
                  &times;
                </button>
                <h3
                  id="profile-modal-title"
                  className="text-2xl font-bold mb-4 text-white"
                >
                  Mentor Profile - {profileData.name}
                </h3>

                <div className="flex flex-col md:flex-row md:space-x-8">
                  <div className="flex-shrink-0 mb-6 md:mb-0">
                    <img
                      src={profileData.avatar}
                      alt={`${profileData.name} avatar`}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <div className="mt-4 text-gray-300">
                      <p>
                        <strong>Qualification:</strong> {profileData.qualification}
                      </p>
                      <p>
                        <strong>Experience:</strong> {profileData.experience} years
                      </p>
                      <p>
                        <strong>Specializations:</strong>{' '}
                        {profileData.specializations.join(', ')}
                      </p>
                      <p>
                        <strong>Contact:</strong> {profileData.contact || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 text-gray-300">
                    <h4 className="text-xl font-semibold mb-2">Bio / Resume</h4>
                    <p className="mb-4 whitespace-pre-wrap">
                      {profileData.bio ||
                        'No bio available for this mentor.'}
                    </p>

                    <h4 className="text-xl font-semibold mb-2">
                      Past Mentorship Feedback / Ratings
                    </h4>
                    {profileData.feedback && profileData.feedback.length > 0 ? (
                      <ul className="list-disc list-inside mb-4">
                        {profileData.feedback.map((f, i) => (
                          <li key={i}>
                            <strong>{f.reviewer}</strong>: {f.comment} (
                            {f.rating}/5)
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mb-4">No feedback available.</p>
                    )}

                    <h4 className="text-xl font-semibold mb-2">Uploaded Documents</h4>
                    {profileData.documents && profileData.documents.length > 0 ? (
                      <ul className="list-disc list-inside mb-4">
                        {profileData.documents.map((doc, i) => (
                          <li key={i}>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-400 hover:underline"
                            >
                              {doc.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mb-4">No documents uploaded.</p>
                    )}

                    <h4 className="text-xl font-semibold mb-2">Status Timeline</h4>
                    {profileData.timeline && profileData.timeline.length > 0 ? (
                      <ol className="list-decimal list-inside mb-4 text-gray-400">
                        {profileData.timeline.map((event, i) => (
                          <li key={i}>
                            <span className="font-semibold">{event.date}</span>: {event.status}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p>No status timeline available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
