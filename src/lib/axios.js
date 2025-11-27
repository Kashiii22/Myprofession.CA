import axios from 'axios';

// Get the API URL from your environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API_URL:", API_URL); 

// Create a new axios instance with a custom configuration
const api = axios.create({
  baseURL: `${API_URL}/api/v1`, // Assuming your auth routes are prefixed with /api/auth
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Add response interceptor to handle 403 errors globally
api.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx causes this function to trigger
    if (error.response && error.response.status === 403) {
      // Handle 403 Forbidden error - redirect to unauthorized page
      if (typeof window !== 'undefined') {
        console.log('403 error intercepted, redirecting to /unauthorized');
        window.location.href = '/unauthorized';
      }
      // Return a resolved promise to prevent error propagation
      return Promise.resolve({ data: { success: false, redirectHandled: true } });
    }
    // For other errors, proceed as normal
    return Promise.reject(error);
  }
);

export default api;