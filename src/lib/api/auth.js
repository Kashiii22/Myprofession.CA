import api from '../axios'; // Import the configured axios instance

/**
 * Sends signup data to the server.
 * @param {object} userData - Contains user details like name, email, password.
 * @returns {Promise<object>} The server response.
 */
export const signup = async (userData) => {
  const response = await api.post('/signup', userData);
  return response.data;
};

/**
 * Verifies the OTP for account creation.
 * @param {object} otpData - Contains email and the OTP code.
 * @returns {Promise<object>} The server response.
 */
export const verifyOtpAndCreateUser = async (otpData) => {
  const response = await api.post('/verify-otp', otpData);
  return response.data;
};

/**
 * Logs a user in with their credentials.
 * @param {object} credentials - Contains email/password or other login info.
 * @returns {Promise<object>} The server response with a token.
 */
export const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

/**
 * Initiates the forgot password process.
 * @param {object} emailData - Contains the user's email.
 * @returns {Promise<object>} The server response.
 */
export const initiateForgotPassword = async (emailData) => {
  const response = await api.post('/forgot-password', emailData);
  return response.data;
};

/**
 * Verifies OTP and resets the user's password.
 * @param {object} resetData - Contains email, new password, and OTP.
 * @returns {Promise<object>} The server response.
 */
export const verifyOtpAndResetPassword = async (resetData) => {
  const response = await api.post('/reset-password', resetData);
  return response.data;
};

/**
 * Requests a new OTP to be sent.
 * @param {object} emailData - Contains the user's email.
 * @returns {Promise<object>} The server response.
 */
export const resendOTP = async (emailData) => {
  const response = await api.post('/resend-otp', emailData);
  return response.data;
};

/**
 * Requests an OTP for logging in.
 * @param {object} loginData - Contains phone number or email.
 * @returns {Promise<object>} The server response.
 */
export const requestLoginOTP = async (loginData) => {
  const response = await api.post('/login/request-otp', loginData);
  return response.data;
};

/**
 * Verifies the OTP to complete the login process.
 * @param {object} otpData - Contains phone/email and the OTP code.
 * @returns {Promise<object>} The server response.
 */
export const verifyLoginOTP = async (otpData) => {
  const response = await api.post('/login/verify-otp', otpData);
  return response.data;
};