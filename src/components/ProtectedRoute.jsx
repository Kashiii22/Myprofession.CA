'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { canAccessSuperAdmin, isAuthenticated } from '../lib/authUtils';
import AuthModal from './AuthModal';
import { setLoginSuccess } from '../redux/authSlice';
import toast from 'react-hot-toast';

/**
 * ProtectedRoute component that restricts access to SUPERADMIN role users only
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.redirectPath - Path to redirect to if not authorized (default: '/')
 * @param {boolean} props.showToast - Whether to show toast notification on unauthorized access
 */
export default function ProtectedRoute({ 
  children, 
  redirectPath = '/login', 
  showToast = true 
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoggedIn, authLoading } = useSelector(state => state.auth);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // For debugging - remove later
  useEffect(() => {
    console.log('🔒 ProtectedRoute initial state:', { 
      isLoggedIn, 
      authLoading, 
      user: user ? { name: user.name, email: user.email, role: user.role } : 'null' 
    });
  }, [isLoggedIn, authLoading, user]);

  useEffect(() => {
    // Wait for auth state to be determined
    if (authLoading) {
      console.log('🔒 Still loading auth state...');
      return;
    }

    console.log('🔒 Auth state determined, checking access...');
    console.log('🔒 User object:', user);
    console.log('🔒 isLoggedIn:', isLoggedIn);

    // Check if user is not authenticated
    if (!isLoggedIn || !user) {
      console.log('🔒 User not authenticated, showing auth modal');
      if (showToast) {
        toast.error('Please log in to access this area');
      }
      setShowAuthModal(true);
      return;
    }

    // Check if user has SUPERADMIN role
    const canAccess = canAccessSuperAdmin(user);
    console.log('🔒 canAccessSuperAdmin result:', canAccess);
    
    if (!canAccess) {
      console.log('🔒 User not superadmin, redirecting to unauthorized');
      console.log('🔒 User role:', user.role);
      console.log('🔒 User object fields:', Object.keys(user));
      
      if (showToast) {
        toast.error(`Access denied! Your role is: ${user.role || 'undefined'}. SUPERADMIN privileges required.`);
      }
      router.push('/unauthorized');
      return;
    }

    console.log('🔒 ✅ Access granted for SUPERADMIN!');
  }, [user, isLoggedIn, authLoading, router, redirectPath, showToast]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Verifying access...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <div className="text-gray-400 text-sm mt-4">Checking your authentication...</div>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth modal with loading state
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-black text-gray-100">
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={(user) => {
              dispatch(setLoginSuccess(user));
              setShowAuthModal(false);
            }}
          />
        )}
        {/* Background content shown while modal is open */}
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700 shadow-[0_0_60px_#1e3a8acc] p-8 max-w-md">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Authentication Required</h1>
              <p className="text-gray-300 mb-6">Please log in to access the Super Admin Dashboard</p>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Sign In / Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show redirecting state if not superadmin
  if (!canAccessSuperAdmin(user)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl">Access denied, redirecting...</div>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
}

/**
 * Higher-order component for page-level protection
 * @param {React.ComponentType} WrappedComponent - Component to wrap
 * @param {Object} options - Protection options
 */
export const withSuperAdminProtection = (WrappedComponent, options = {}) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
};

/**
 * Hook for checking superadmin access
 * @returns {Object} - Access status and user info
 */
export const useSuperAdminAuth = () => {
  const { user, isLoggedIn, authLoading } = useSelector(state => state.auth);
  
  return {
    isSuperAdmin: canAccessSuperAdmin(user),
    isLoggedIn,
    authLoading,
    user,
    canAccess: canAccessSuperAdmin(user),
    displayName: user?.name || user?.firstName || 'Admin',
  };
};
