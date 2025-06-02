import axios from 'axios';

const API_URL = process.env.API_URL || 'https://echoo-backend.vercel.app';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      identifier: credentials.identifier,
      password: credentials.password,
    });

    const { token, user } = response.data;

    // Get current local time (ISO format)
    const savedAt = new Date().toISOString();

    // Save token, user, and save time in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token_saved_at', savedAt);

    console.log('[LOGIN] Token, user, and save time stored in localStorage at:', savedAt);

    return { token, user };

  } catch (err) {
    throw new Error(err.response?.data?.message || 'Login failed. Please try again.');
  }
};
