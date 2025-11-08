'use client';

import { Provider } from 'react-redux';
import SuperAdminSidebar from '@/components/SuperAdminSidebar';
import SuperAdminMobileHeader from '@/components/SuperAdminMobileHeader';
import DashboardHeader from '@/components/DashboardHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getNewMentorRegistrations, approveMentorRegistration, rejectMentorRegistration } from '@/lib/api/mentorRegistration';
import toast, { Toaster } from 'react-hot-toast';
