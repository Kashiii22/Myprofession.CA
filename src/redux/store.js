// redux/store.js
import { configureStore } from '@reduxjs/toolkit';

// Slice reducers
import expertReducer, {
  nextStep,
  prevStep,
  updatePersonalDetails,
  updateProfessionalDetails,
  addExpertiseField,
  updateExpertiseField,
  removeExpertiseField,
} from './expertSlice';

import dashboardReducer from './dashboardSlice';
import classReducer from './classSlice';
import availabilityReducer from './availabilitySlice';
import authReducer, {
  toggleTab,
  setPhone,
  toggleOtpModal,
  setClosing,
} from './authSlice'; // ✅ Import authSlice + actions

// Configure store
export const store = configureStore({
  reducer: {
    profile: expertReducer,
    dashboard: dashboardReducer,
    classes: classReducer,
    availability: availabilityReducer,
    auth: authReducer,
  },
});

// Export expert actions
export {
  nextStep,
  prevStep,
  updatePersonalDetails,
  updateProfessionalDetails,
  addExpertiseField,
  updateExpertiseField,
  removeExpertiseField,
};

// Export auth actions
export {
  toggleTab,
  setPhone,
  toggleOtpModal,
  setClosing,
  setLoginMethod,
};

export default store;
