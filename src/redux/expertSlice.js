// redux/expertSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 1,
  personalDetails: {
    name: '',
      dob: '',
    profilePic: null,
    language: '',
    status: '',
  },
  professionalDetails: {
    experience: '',
    expertise: [''],
    qualifications: '',
    achievements: '',
    publications: '',
  },
};

const expertSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      state.step -= 1;
    },
    updatePersonalDetails: (state, action) => {
      state.personalDetails = { ...state.personalDetails, ...action.payload };
    },
    updateProfessionalDetails: (state, action) => {
      state.professionalDetails = {
        ...state.professionalDetails,
        ...action.payload,
      };
    },
    addExpertiseField: (state) => {
      state.professionalDetails.expertise.push('');
    },
    updateExpertiseField: (state, action) => {
      const { index, value } = action.payload;
      state.professionalDetails.expertise[index] = value;
    },
    removeExpertiseField: (state, action) => {
  state.professionalDetails.expertise.splice(action.payload, 1);
},

  },
});

export const {
  nextStep,
  prevStep,
  updatePersonalDetails,
  updateProfessionalDetails,
  addExpertiseField,
  updateExpertiseField,
  removeExpertiseField,
} = expertSlice.actions;

export default expertSlice.reducer;
