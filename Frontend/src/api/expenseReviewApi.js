import axios from 'axios';
import BASE_URL from '../config/urlConfig';

// Helper function to get authorization headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
});

const expenseReviewApi = {
  // Create expense review (POST)
  createExpenseReview: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/expense-reviews`, data, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to create expense review');
    }
  },

  // Get all expense reviews (GET)
  getAllExpenseReviews: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/expense-reviews`, {
        headers: getAuthHeaders(),
      });
      const payload = response.data;
      if (Array.isArray(payload)) return payload;
      if (payload && Array.isArray(payload.data)) return payload.data;
      if (payload && Array.isArray(payload.expenseReviews)) return payload.expenseReviews;
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
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch expense reviews');
    }
  },


  
 

  
 
};

export default expenseReviewApi;
