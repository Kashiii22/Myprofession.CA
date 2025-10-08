// Path: lib/api/mentor.js

import api from '../axios'; // Your pre-configured axios instance

/**
 * Gets a secure signature from the backend for a direct-to-Cloudinary upload.
 * @returns {Promise<object>} The server response containing the signature and timestamp.
 */
export const getCloudinarySignature = async () => {
  try {
    // This calls your new /api/uploads/generate-cloudinary-signature endpoint
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
    // ✅ The header override is removed. Axios will now use its default 'Content-Type': 'application/json'.
    // This sends the mentorPayload as a JSON object.
    const response = await api.post('/mentors/register', mentorPayload);
    return response.data;
  } catch (error) {
    // Axios wraps errors, so we can extract the server's response message
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'An error occurred during registration.');
    }
    throw error;
  }
};

export const getNewMentorRegistrations = async () => {
  try {
    // This calls your GET /api/v1/mentors/new-Registrations endpoint
    const response = await api.get('/new-Registrations');
    return response.data; // The API returns { success, count, data }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Could not fetch registrations.');
    }
    throw error;
  }
};
 /**
 * Rejects (deletes) a mentor registration.
 * NOTE: You will need to create this endpoint on your backend.
 * @param {string} registrationId - The unique registration ID of the mentor.
 * @returns {Promise<object>} The server response.
 */
export const rejectMentorRegistration = async (registrationId) => {
  try {
    // This assumes you will create a DELETE endpoint for rejection.
    const response = await api.delete(`/mentor/reject/${registrationId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
};
/**
 * Approves (verifies) a mentor registration.
 * @param {string} registrationId - The unique registration ID of the mentor.
 * @returns {Promise<object>} The server response.
 */
export const approveMentorRegistration = async (registrationId) => {
  try {
    // This makes a PUT request to your /api/v1/mentors/mentor/verify/:registrationId endpoint
    const response = await api.put(`/mentor/verify/${registrationId}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw error;
  }
};
