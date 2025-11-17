import axios from "axios";
import BASE_URL from "../config/urlConfig";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 10000, // 10 second timeout
  withCredentials: false // Do not send cookies by default (avoid strict CORS credentials requirements)
});

// Add request interceptor for authentication
api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const authApi = {
  //  LOGIN
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', { email, url: `${BASE_URL}/api/auth/login` });
      
      const response = await api.post('/api/auth/login', { email, password });
      
      const resp = response?.data || response;

      
      const token = resp.token || resp.accessToken || resp.data?.token || resp.data?.accessToken || resp?.data?.access_token;
      const user = resp.user || resp.data?.user || resp.data || resp;

      if (!token) {
       
        throw new Error(resp.message || 'Login failed: no token in response');
      }

     
      try {
        localStorage.setItem('token', token);
        localStorage.setItem('userToken', token);
        if (user?.role) localStorage.setItem('userRole', user.role);
        if (user?.name) localStorage.setItem('userName', user.name);
        if (user?.email) localStorage.setItem('userEmail', user.email);
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
       
        console.warn('Could not persist auth data to localStorage', e);
      }

      return { user, token };
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Could not connect to server. Is it running?');
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Server might be down.');
      }
      
      const msg = error?.response?.data?.message || error?.message || 'Login failed';
      throw new Error(`Login failed: ${msg}`);
    }
  },

  //  LOGOUT (calls your backend)
  logout: async () => {
   
    const token = localStorage.getItem("userToken") || localStorage.getItem('token');
    try {
      if (token) {
        await api.post(
          '/api/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      
      console.error("Logout request failed:", error);
    } finally {
      
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
};

export default authApi;
