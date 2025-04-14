// api.js
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:5000';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      identifier: credentials.identifier,
      password: credentials.password
    });
    
    return {
      token: response.data.token,
      user: response.data.user
    };
    
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Login failed. Please try again.');
  }
};