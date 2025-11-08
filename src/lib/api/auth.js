import api from '../axios'; // Import the configured axios instance

/**
 * A reusable helper function to wrap API calls.
 * It provides consistent success and error handling.
 * @param {Promise} apiCall - The axios call promise (e.g., api.post(...))
 * @returns {Promise<object>} The server response or a normalized error object.
 */
const handleApiCall = async (apiCall) => {
  try {
    const response = await apiCall;
    return response.data;
  } catch (error) {
    
    // ✅ THIS IS THE CHANGE:
    // Only log the error if it's *not* a 401.
    // A 401 is an expected failure, not a bug.
    if (error.response?.status !== 401) {
      console.error('API Call Failed:', error);
    }
    // ✅ END OF CHANGE

    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || 'A network or server error occurred.',
    };
  }
};
// --- All your API functions now use the helper ---

/**
 * Sends signup data to the server.
 * @param {object} userData - Contains user details like name, email, password.
 * @returns {Promise<object>} The server response.
 */
export const signup = (userData) => {
  return handleApiCall(api.post('/signup', userData));
};

/**
 * Verifies the OTP for account creation.
 * @param {object} otpData - Contains email and the OTP code.
 * @returns {Promise<object>} The server response.
 */
export const verifyOtpAndCreateUser = (otpData) => {
  return handleApiCall(api.post('/verify-otp', otpData));
};

/**
 * Logs a user in with their credentials.
 * @param {object} credentials - Contains email/password or other login info.
 * @returns {Promise<object>} The server response with a token.
 */
export const login = (credentials) => {
  return handleApiCall(api.post('/login', credentials));
};

/**
 * Initiates the forgot password process.
 * @param {object} emailData - Contains the user's email.
 * @returns {Promise<object>} The server response.
 */
export const initiateForgotPassword = (emailData) => {
  return handleApiCall(api.post('/forgot-password', emailData));
};

/**
 * Verifies OTP and resets the user's password.
 * @param {object} resetData - Contains email, new password, and OTP.
 * @returns {Promise<object>} The server response.
 */
export const verifyOtpAndResetPassword = (resetData) => {
  return handleApiCall(api.post('/reset-password', resetData));
};

/**
 * Requests a new OTP to be sent.
 * @param {object} emailData - Contains the user's email.
 * @returns {Promise<object>} The server response.
 */
export const resendOTP = (emailData) => {
  return handleApiCall(api.post('/resend-otp', emailData));
};

/**
 * Requests an OTP for logging in.
 * @param {object} loginData - Contains phone number or email.
 * @returns {Promise<object>} The server response.
 */
export const requestLoginOTP = (loginData) => {
  return handleApiCall(api.post('/login/request-otp', loginData));
};

/**
 * Verifies the OTP to complete the login process.
 * @param {object} otpData - Contains phone/email and the OTP code.
 * @returns {Promise<object>} The server response.
 */
export const verifyLoginOTP = (otpData) => {
  return handleApiCall(api.post('/login/verify-otp', otpData));
};

/**
 * ✅ --- THIS IS THE UPDATED FUNCTION ---
 * Gets the current logged-in user's profile from the server.
 * It relies on the 'token' cookie being sent.
 * @returns {Promise<object>} The server response.
 */
export const getMyProfile = () => {
  // This calls GET /api/v1/auth/me
  // It is now wrapped in the handleApiCall helper for
  // consistent success and error handling (e.g., 401 errors).
  return handleApiCall(api.get('/me'));
};
export const logout = () => {
  // This calls POST /api/v1/auth/logout
  return handleApiCall(api.post('/logout'));
};