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
 * Submits the mentor's completed profile (availability, pricing, etc.).
 * (This route requires authentication)
 * @param {FormData} profileData - A FormData object containing the file and JSON strings.
 * @returns {Promise<object>} The server response.
 */
export const completeMentorProfile = async (profileData) => {
  const response = await api.post('/mentor/complete-profile', profileData, {
    // Axios will automatically set the 'Content-Type: multipart/form-data'
    // header for you when you pass a FormData object.
  });
  return response.data;
};