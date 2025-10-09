// Path: lib/api/mentor.js

import api from '../axios'; // Your pre-configured axios instance

/**
 * Gets a secure signature from the backend for a direct-to-Cloudinary upload.
 * @returns {Promise<object>} The server response containing the signature and timestamp.
 */
export const getCloudinarySignature = async () => {
  try {
    const response = await api.post('/uploads/generate-cloudinary-signature');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Could not get upload signature.');
    }
    throw error;
  }
};

/**
 * Submits the final mentor registration data (as JSON) after the file has been uploaded to Cloudinary.
 * @param {object} mentorPayload - A plain JavaScript object with all mentor details, including the Cloudinary public_id.
 * @returns {Promise<object>} The server response.
 */
export const registerMentor = async (mentorPayload) => {
  try {
    const response = await api.post('/register', mentorPayload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'An error occurred during registration.');
    }
    throw error;
  }
};

// --- NEW FUNCTION ---
/**
 * Sends a request to the backend to send an OTP to the mentor's phone.
 * @param {string} phone - The mentor's 10-digit phone number.
 * @returns {Promise<object>} The server response, including { success, message, phone, isProfileActive }.
 */
export const loginWithOTP = async (phone) => {
    try {
        const response = await api.post('/mentor/login/send-otp', { phone });
        console.log(response.data);
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) throw new Error(error.response.data.message);
        throw error;
    }
};

// --- NEW FUNCTION ---
/**
 * Verifies the OTP sent to the mentor's phone to complete the login.
 * @param {{phone: string, otp: string}} credentials - The phone number and OTP code.
 * @returns {Promise<object>} The server response, including the auth token on success.
 */
export const verifyLoginOTP = async ({ phone, otp }) => {
    try {
        const response = await api.post('/mentor/login/verify-otp', { phone, otp });
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) throw new Error(error.response.data.message);
        throw error;
    }
};


export const getNewMentorRegistrations = async () => {
  try {
    const response = await api.get('/new-Registrations');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Could not fetch registrations.');
    }
    throw error;
  }
};

export const rejectMentorRegistration = async (registrationId) => {
  try {
    const response = await api.delete(`/mentor/reject/${registrationId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
};

export const approveMentorRegistration = async (registrationId) => {
  try {
    const response = await api.put(`/mentor/verify/${registrationId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
};