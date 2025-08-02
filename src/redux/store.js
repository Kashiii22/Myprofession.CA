// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import expertReducer, {
  nextStep,
  prevStep,
  updatePersonalDetails,
  updateProfessionalDetails,
  addExpertiseField,
  updateExpertiseField,
  removeExpertiseField,
} from './expertSlice';

import dashboardReducer from './dashboardSlice'; // 👈 Import new reducer

export const store = configureStore({
  reducer: {
    profile: expertReducer,
    dashboard: dashboardReducer, // 👈 Add this line
  },
});

// Export expert actions explicitly
export {
  nextStep,
  prevStep,
  updatePersonalDetails,
  updateProfessionalDetails,
  addExpertiseField,
  updateExpertiseField,
  removeExpertiseField,
};

export default store;
