import axios from 'axios';
import BASE_URL from '../config/urlConfig';

// Helper function to get authorization headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
});

const expensesApi = {
  //  Create Expense (POST)
  createExpense: async (expenseData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/expenses`, expenseData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to create expense');
    }
  },

  //  Get All Expenses (GET)
  getAllExpenses: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/expenses`, {
        headers: getAuthHeaders(),
      });
      const payload = response.data;
      if (Array.isArray(payload)) return payload;
      if (payload && Array.isArray(payload.data)) return payload.data;
      if (payload && Array.isArray(payload.expenses)) return payload.expenses;
      const firstArray = payload && typeof payload === 'object'
        ? Object.values(payload).find((v) => Array.isArray(v))
        : null;
      return firstArray || [];
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch expenses');
    }
  },

  // 🔹 Get Expense by ID (GET)
  getExpenseById: async (expenseId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/expenses/${expenseId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch expense details');
    }
  },

  // 🔹 Update Expense by ID (PUT)
  updateExpenseById: async (expenseId, updatedData) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/expenses/${expenseId}`, updatedData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to update expense');
    }
  },

  // 🔹 Delete Expense by ID (DELETE)
  deleteExpenseById: async (expenseId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/expenses/${expenseId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete expense');
    }
  },
};

export default expensesApi;


