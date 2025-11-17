import axios from "axios";
import BASE_URL from "../config/urlConfig";

// Create axios instance for Projects API
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, 
  withCredentials: false,
});

// 🔹 Add token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Project API Object ---
const projectApi = {
  // CREATE Project
  createProject: async (data) => {
    try {
      const response = await api.post("/api/projects", data);
      return response.data;
    } catch (error) {
      console.error(" Error creating project:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create project"
      );
    }
  },

  //  GET All Projects
  getAllProjects: async (params = {}) => {
    try {
      const response = await api.get("/api/projects", { params });
      return response.data;
    } catch (error) {
      console.error(" Error fetching projects:", error);
      throw new Error("Failed to fetch projects");
    }
  },

  //  GET Project By ID
  getProjectById: async (id) => {
    try {
      const response = await api.get(`/api/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(" Error fetching project by ID:", error);
      throw new Error("Failed to fetch project by ID");
    }
  },

  //  UPDATE Project By ID
  updateProjectById: async (id, updatedData) => {
    try {
      const response = await api.put(`/api/projects/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(" Error updating project:", error);
      throw new Error("Failed to update project");
    }
  },

  //  DELETE Project By ID
  deleteProjectById: async (id) => {
    try {
      const response = await api.delete(`/api/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(" Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  },
};

export default projectApi;