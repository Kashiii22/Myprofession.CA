import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // --- Modal-Specific State ---
  showLoginTab: true, // ✅ RENAMED from 'isLogin' for clarity
  closing: false,
  showOtpModal: false,
  phone: "",
  loginMethod: "otp",
  
  // --- Global Application Auth State (FIXED) ---
  isLoggedIn: false, 
  user: null,        // ✅ BUG FIX 1: Added user object to store data
  authLoading: true, // To know when cookie check is done
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // --- Reducers for your AuthModal ---
    toggleTab: (state) => {
      state.showLoginTab = !state.showLoginTab; // Uses the new 'showLoginTab'
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    toggleOtpModal: (state, action) => {
      state.showOtpModal = action.payload;
    },
    setClosing: (state, action) => {
      state.closing = action.payload;
    },
    setLoginMethod: (state, action) => {
      state.loginMethod = action.payload;
    },
    
    // --- Reducers for Global Auth State (FIXED) ---
    
    /**
     * Call this when a user successfully logs in.
     * It now accepts the user data as 'action.payload'.
     */
    // ✅ BUG FIX 2: Reducer now accepts and stores the user payload
    setLoginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload; // <-- STORES THE USER DATA
      state.authLoading = false;
    },
    
    /**
     * Call this when a user logs out.
     */
    setLogout: (state) => {
      state.isLoggedIn = false;
      state.user = null; // <-- CLEARS THE USER DATA
      state.authLoading = false;
    },

    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
  },
});

export const {
  // Modal actions
  toggleTab,
  setPhone,
  toggleOtpModal,
  setClosing,
  setLoginMethod,
  
  // Global Auth actions
  setLoginSuccess,
  setLogout,
  setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;