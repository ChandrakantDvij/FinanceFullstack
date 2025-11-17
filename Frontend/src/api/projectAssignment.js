import axios from 'axios';
import BASE_URL from '../config/urlConfig';

// Helper function to get authorization headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
});

const projectAssignmentApi = {
  // Create project assignment (POST)
  createProjectAssignment: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/project-assignments`, data, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to assign employee to project');
    }
  },

  // Get all project assignments (GET)
  // getAllProjectAssignments: async () => {
  //   try {
  //     const response = await axios.get(`${BASE_URL}/api/project-assignments`, {
  //       headers: getAuthHeaders(),
  //     });
  //     const payload = response.data;
  //     if (Array.isArray(payload)) return payload;
  //     if (payload && Array.isArray(payload.data)) return payload.data;
  //     if (payload && Array.isArray(payload.projectAssignment)) return payload.projectAssignment;
  //     if (payload && typeof payload === 'object') {
  //       const firstArray = Object.values(payload).find((v) => Array.isArray(v));
  //       if (firstArray) return firstArray;
  //     }
  //     return [];
  //   } catch (error) {
  //     if (error.response?.status === 401) {
  //       localStorage.clear();
  //       throw new Error('Please login to continue');
  //     }
  //     throw new Error(error.response?.data?.message || error.message || 'Failed to fetch project assignments');
  //   }
  // },


  // Get project assignments by project ID
  getProjectAssignmentById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/project-assignments/project/${id}`, {
        headers: getAuthHeaders(),
      });
      const payload = response.data;
      // Handle different response formats
      if (Array.isArray(payload)) return payload;
      if (payload && Array.isArray(payload.data)) return payload.data;
      if (payload && typeof payload === 'object') {
        // If single object, wrap in array
        return [payload];
      }
      return [];
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      if (error.response?.status === 404) {
        // No assignments found for this project
        return [];
      }
      console.error("Error fetching project assignments by project ID:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to fetch project assignments by project ID");
    }
  },
 

  
 
};

export default projectAssignmentApi;
