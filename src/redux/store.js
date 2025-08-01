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

export const store = configureStore({
  reducer: {
    profile: expertReducer, // Use `profile` to match your useSelector
  },
});

// Export actions explicitly
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
