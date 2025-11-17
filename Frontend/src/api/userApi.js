
import axios from 'axios';
import BASE_URL from '../config/urlConfig';

// Helper function to get auth headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
});

const userApi = {
  //  Get All Users (GET)
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users`, {
        headers: getAuthHeaders(),
      });

      // Handle possible backend response formats
      const payload = response.data;
      if (Array.isArray(payload)) return payload;
      if (payload?.data && Array.isArray(payload.data)) return payload.data;
      if (payload?.users && Array.isArray(payload.users)) return payload.users;

      // Try to detect the first array property in the response
      if (payload && typeof payload === 'object') {
        const firstArray = Object.values(payload).find((v) => Array.isArray(v));
        if (firstArray) return firstArray;
      }

      return [];
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch users');
    }
  },

  //  Get User by ID (GET)
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users/${userId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user details');
    }
  },

 
};

export default userApi;
