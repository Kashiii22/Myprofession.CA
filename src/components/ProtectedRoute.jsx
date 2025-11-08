'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { canAccessSuperAdmin, isAuthenticated } from '../lib/authUtils';
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
  const { user, isLoggedIn, authLoading } = useSelector(state => state.auth);

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
      console.log('🔒 User not authenticated, redirecting to login');
      if (showToast) {
        toast.error('Please log in to access this area');
      }
      router.push(redirectPath);
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

  // If not authenticated, show redirecting state
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl">Redirecting to login...</div>
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
