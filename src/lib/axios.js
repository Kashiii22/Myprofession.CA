import axios from 'axios';

// Get the API URL from your environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create a new axios instance with a custom configuration
const api = axios.create({
  baseURL: `${API_URL}/api/v1`, // Assuming your auth routes are prefixed with /api/auth
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;