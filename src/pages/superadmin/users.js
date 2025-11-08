'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

import SuperAdminSidebar from '@/components/SuperAdminSidebar';
import SuperAdminMobileHeader from '@/components/SuperAdminMobileHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaUser, 
  FaUsers, 
  FaSearch, 
  FaUserShield,
  FaToggleOn,
  FaToggleOff,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt
} from 'react-icons/fa';

// Mock data - replace with actual API call
const mockUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1234567890',
    registrationDate: '2024-01-15',
    status: 'active',
    role: 'user',
    sessionsBooked: 8,
    totalSpent: 1200
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike@example.com',
    phone: '+1234567891',
    registrationDate: '2024-02-20',
    status: 'inactive',
    role: 'user',
    sessionsBooked: 3,
    totalSpent: 450
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1234567892',
    registrationDate: '2024-03-10',
    status: 'active',
    role: 'mentor',
    sessionsConducted: 15,
    totalEarned: 3000
  },
  {
    id: 4,
    name: 'Alex Thompson',
    email: 'alex@example.com',
    phone: '+1234567893',
    registrationDate: '2024-01-28',
    status: 'active',
    role: 'user',
    sessionsBooked: 12,
    totalSpent: 1800
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    phone: '+1234567894',
    registrationDate: '2024-04-05',
    status: 'suspended',
    role: 'mentor',
    sessionsConducted: 8,
    totalEarned: 1600
  }
];

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Simulate data loading
  useEffect(() => {
    setStatus('loading');
    setTimeout(() => {
      setUsers(mockUsers);
      setStatus('succeeded');
    }, 1000);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' }
          : user
      ));
      toast.success(`User status updated successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  if (status === 'loading') {
    return (
      <div className="bg-black min-h-screen text-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <ProtectedRoute>
        <div className="bg-black min-h-screen text-gray-100 flex">
        <Toaster position="top-center" />
        <SuperAdminSidebar />

        <main className="flex-1 overflow-hidden flex flex-col">
          <SuperAdminMobileHeader pageTitle="User Management" />
          
          <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaUsers className="text-blue-400 text-2xl" />
                <h1 className="text-3xl font-bold text-white">User Management</h1>
              </div>
              <div className="text-gray-400">
                Total Users: {users.length}
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full bg-gray-800 text-gray-100 placeholder-gray-400 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="bg-gray-800 text-gray-100 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="mentor">Mentors</option>
                <option value="admin">Admins</option>
              </select>
              <select
                className="bg-gray-800 text-gray-100 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900">
                    <tr className="text-left">
                      <th className="p-4 text-gray-400 font-medium">User</th>
                      <th className="p-4 text-gray-400 font-medium">Contact</th>
                      <th className="p-4 text-gray-400 font-medium">Role</th>
                      <th className="p-4 text-gray-400 font-medium">Registration Date</th>
                      <th className="p-4 text-gray-400 font-medium">Status</th>
                      <th className="p-4 text-gray-400 font-medium">Summary</th>
                      <th className="p-4 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-white">{user.name}</div>
                              <div className="text-sm text-gray-400">ID: #{user.id.toString().padStart(4, '0')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-300">
                              <FaEnvelope className="text-sm text-gray-500" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <FaPhone className="text-sm text-gray-500" />
                              <span className="text-sm">{user.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-600 text-white' :
                            user.role === 'mentor' ? 'bg-blue-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-300">
                            <FaCalendarAlt className="text-gray-500" />
                            <span>{user.registrationDate}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-600 text-white' :
                            user.status === 'inactive' ? 'bg-gray-600 text-white' :
                            'bg-red-600 text-white'
                          }`}>
                            {user.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1 text-sm text-gray-300">
                            {user.role === 'mentor' ? (
                              <>
                                <div>Sessions: {user.sessionsConducted}</div>
                                <div>Earned: ${user.totalEarned}</div>
                              </>
                            ) : (
                              <>
                                <div>Sessions: {user.sessionsBooked}</div>
                                <div>Spent: ${user.totalSpent}</div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.status)}
                            className={`p-2 rounded transition-colors ${
                              user.status === 'active' || user.status === 'suspended' ?
                              'text-red-400 hover:bg-gray-700' :
                              'text-green-400 hover:bg-gray-700'
                            }`}
                            title={user.status === 'active' || user.status === 'suspended' ? 'Deactivate' : 'Activate'}
                          >
                            {user.status === 'active' || user.status === 'suspended' ?
                              <FaToggleOff className="text-xl" /> :
                              <FaToggleOn className="text-xl" />
                            }
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No users found matching your criteria
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      </ProtectedRoute>
    </Provider>
  );
}
