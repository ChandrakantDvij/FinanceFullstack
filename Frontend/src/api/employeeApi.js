import axios from 'axios';
import BASE_URL from '../config/urlConfig';

// Helper function to get authorization headers (supports both token keys)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};


const employeeApi = {
  //  Create Employee (POST)
  createEmployee: async (employeeData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/employees`, employeeData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to create employee');
    }
  },

  //  Get All Employees (GET)
  getAllEmployees: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/employees`, {
        headers: getAuthHeaders(),
      });
      // Normalize response: some backends return { data: [...] } or { employees: [...] }
      const payload = response.data;
      if (Array.isArray(payload)) return payload;
      if (payload && Array.isArray(payload.data)) return payload.data;
      if (payload && Array.isArray(payload.employees)) return payload.employees;
      // If payload contains an object with nested list under other keys, try to find the first array value
      if (payload && typeof payload === 'object') {
        const firstArray = Object.values(payload).find((v) => Array.isArray(v));
        if (firstArray) return firstArray;
      }
      // Fallback to empty array to avoid UI crashes
      return [];
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch employees');
    }
  },

  //  Get Employee by ID (GET)
  getEmployeeById: async (employeeId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/employees/${employeeId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch employee details');
    }
  },

  //  Update Employee by ID (PUT)
  updateEmployeeById: async (employeeId, updatedData) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/employees/${employeeId}`, updatedData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to update employee');
    }
  },

  //  Delete Employee by ID (DELETE)
  deleteEmployeeById: async (employeeId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/employees/${employeeId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete employee');
    }
  },
};

export default employeeApi;
