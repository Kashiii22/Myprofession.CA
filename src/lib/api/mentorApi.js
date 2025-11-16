import api from '../axios'; // Import the configured axios instance

/**
 * Fetches all active and approved mentors.
 * @returns {Promise<object>} The server response with mentor data.
 */
export const getActiveMentors = async () => {
  // Use GET for fetching data
  const response = await api.get('/mentor/all-active');
  return response.data;
};

/**
 * Fetches a single mentor by their ID.
 * @param {string} mentorId - The ID of the mentor to fetch.
 * @returns {Promise<object>} The server response with mentor data.
 */
export const getMentorById = async (mentorId) => {
  const response = await api.get(`/mentor/${mentorId}`);
  return response.data;
};

/**
 * Submits the mentor application form.
 * (This route requires authentication)
 * @param {object} applicationData - The mentor registration form data.
 * @returns {Promise<object>} The server response.
 */
/**
 * Fetches the mentor's dashboard profile data.
 * This route sends cookies automatically for authentication.
 * @returns {Promise<object>} The server response with dashboard profile data.
 */
export const getDashboardProfile = async () => {
  const response = await api.get('/mentor/dashboard/profile');
  return response.data;
};

/**
 * Updates the mentor's pricing information.
 * This route sends cookies automatically for authentication.
 * @param {Array} pricingData - Array of pricing objects with type and price (per minute)
 * @param {number} minDuration - Minimum session duration in minutes
 * @returns {Promise<object>} The server response.
 */
export const updatePricing = async (pricingData, minDuration) => {
  const response = await api.put('/mentor/dashboard/pricing', {
    pricing: pricingData,
    minSessionDuration: minDuration
  });
  return response.data;
};

/**
 * Updates the mentor's availability schedule.
 * This route sends cookies automatically for authentication.
 * @param {Array} availabilityData - Array of day objects with day and slots
 * @returns {Promise<object>} The server response.
 */
export const updateAvailability = async (availabilityData) => {
  const response = await api.put('/mentor/dashboard/availability', {
    availability: availabilityData
  });
  return response.data;
};

/**
 * Submits the mentor's completed profile (availability, pricing, etc.).
 * (This route requires token authentication)
 * @param {FormData} profileData - A FormData object containing the file and JSON strings.
 * @param {string} token - The access token from URL query parameter.
 * @returns {Promise<object>} The server response.
 */
export const completeMentorProfile = async (profileData, token) => {
  // Create a new axios instance without the default Content-Type header for FormData
  const formDataApi = require('axios').create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v1',
    withCredentials: true,
  });

  const response = await formDataApi.post('/mentor/complete-profile', profileData, {
    // Let axios set the Content-Type header automatically for FormData
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
