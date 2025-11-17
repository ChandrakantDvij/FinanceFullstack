import axios from 'axios';
import BASE_URL from '../config/urlConfig';

//  Helper function to get authorization headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
});

const investorApi = {
  //  Create Investor (POST)
  createInvestor: async (investorData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/investors`, investorData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to create investor');
    }
  },

  //  Get All Investors (GET)
  getAllInvestors: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/investors`, {
        headers: getAuthHeaders(),
      });
      const payload = response.data;

      // Normalize response (handle multiple backend response formats)
      if (Array.isArray(payload)) return payload;
      if (payload && Array.isArray(payload.data)) return payload.data;
      if (payload && Array.isArray(payload.investors)) return payload.investors;

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
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch investors');
    }
  },

  //  Get Investor by ID (GET)
  getInvestorById: async (investorId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/investors/${investorId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch investor details');
    }
  },

  //  Update Investor by ID (PUT)
  updateInvestorById: async (investorId, updatedData) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/investors/${investorId}`, updatedData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      // Surface server validation details for easier debugging
      const body = error.response?.data;
      const serverMessage =
        (typeof body === 'string' && body) ||
        body?.message ||
        body?.error ||
        (body?.errors ? JSON.stringify(body.errors) : null);
      const status = error.response?.status;
      throw new Error(serverMessage ? `(${status}) ${serverMessage}` : error.message || 'Failed to update investor');
    }
  },

  //  Delete Investor by ID (DELETE)
  deleteInvestorById: async (investorId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/investors/${investorId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete investor');
    }
  },
};

export default investorApi;
