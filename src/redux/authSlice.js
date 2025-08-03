// store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  isLogin: true,
  phone: "",
  showOtpModal: false,
  closing: false,
  loginMethod: "otp", // "otp" or "password"
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleTab: (state) => {
      state.isLogin = !state.isLogin;
      state.phone = "";
      state.loginMethod = "otp";
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
  },
});

export const {
  toggleTab,
  setPhone,
  toggleOtpModal,
  setClosing,
  setLoginMethod,
} = authSlice.actions;

export default authSlice.reducer;
