'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfile } from '../lib/api/auth';
import { setLoginSuccess, setLogout, setAuthLoading } from '../redux/authSlice';
import toast from 'react-hot-toast';

/**
 * AuthInitializer component that checks authentication status on app load
 * This should be included in your _app.js to handle initial auth state
 */
export default function AuthInitializer() {
  const dispatch = useDispatch();
  const { authLoading } = useSelector(state => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔐 Initializing authentication...');
      
      try {
        const response = await getMyProfile();
        console.log('📋 /me endpoint response:', response);
        
        if (response?.success) {
          const userData = response.data || response.user || response.data?.user;
          
          if (userData) {
            console.log('✅ User is authenticated:', userData);
            console.log('✅ User role:', userData.role);
            // User is authenticated - dispatch login success with user data
            dispatch(setLoginSuccess(userData));
          } else {
            console.log('❌ No user data in response:', response);
            // User is not authenticated or token is invalid
            dispatch(setLogout());
          }
        } else {
          console.log('❌ User not authenticated or invalid response:', response);
          // User is not authenticated or token is invalid
          dispatch(setLogout());
        }
      } catch (error) {
        console.log('❌ Auth initialization failed:', error.message);
        console.log('❌ This is normal for unauthenticated users');
        // Any error means user is not authenticated - this is normal!
        dispatch(setLogout());
      }
    };

    // Only run if authLoading is true (initial state)
    if (authLoading) {
      initializeAuth();
    }
  }, [dispatch, authLoading]);

  return null; // This component doesn't render anything
}
