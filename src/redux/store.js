import { configureStore } from '@reduxjs/toolkit';

// Existing slice reducers
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
  setLoginMethod
} from './authSlice';

// New Mentor Slice
import mentorsReducer, {
  approveRequest,
  rejectRequest
} from './mentorSlice';

// New Transactions Slice
import transactionsReducer, {
  setSearchFilter,
  setStatusFilter,
  setPaymentMethodFilter,
  setTypeFilter,
  setDateRangeFilter,
  toggleSelect,
  selectAll,
  clearSelection,
  updateStatusBulk,
} from './transactionsSlice';

export const store = configureStore({
  reducer: {
    profile: expertReducer,
    dashboard: dashboardReducer,
    classes: classReducer,
    availability: availabilityReducer,
    auth: authReducer,
    mentors: mentorsReducer,
    transactions: transactionsReducer,
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

// Export mentor actions
export {
  approveRequest,
  rejectRequest,
};

// Export transactions actions
export {
  setSearchFilter,
  setStatusFilter,
  setPaymentMethodFilter,
  setTypeFilter,
  setDateRangeFilter,
  toggleSelect,
  selectAll,
  clearSelection,
  updateStatusBulk,
};

export default store;
