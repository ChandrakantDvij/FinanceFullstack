import axios from 'axios';
import BASE_URL from '../config/urlConfig';

// Consistent auth header helper (support both token keys)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const dashboardApi = {
  // GET /api/dashboard/overview
  getOverview: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/overview`, {
        headers: getAuthHeaders(),
        timeout: 10000,
        withCredentials: false,
      });

      const payload = response?.data;
      if (!payload || typeof payload !== 'object') {
        return {
          totalProjects: 0,
          totalEmployees: 0,
          totalInvestors: 0,
          totalExpenses: 0,
          totalAssignments: 0,
          expenseReviewStats: { approved: 0, pending: 0, rejected: 0 },
        };
      }

      return {
        totalProjects: Number(payload.totalProjects ?? 0),
        totalEmployees: Number(payload.totalEmployees ?? 0),
        totalInvestors: Number(payload.totalInvestors ?? 0),
        totalExpenses: Number(payload.totalExpenses ?? 0),
        totalAssignments: Number(payload.totalAssignments ?? 0),
        expenseReviewStats: {
          approved: Number(payload.expenseReviewStats?.approved ?? 0),
          pending: Number(payload.expenseReviewStats?.pending ?? 0),
          rejected: Number(payload.expenseReviewStats?.rejected ?? 0),
        },
      };
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch dashboard overview');
    }
  },

  // GET /api/dashboard/projects/all
  // Returns an array where each item contains: project, employees[], expenses, investors, balance
  getAllProjectsOverview: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/projects/all`, {
        headers: getAuthHeaders(),
        timeout: 15000,
        withCredentials: false,
      });

      const raw = response?.data?.data || response?.data || [];
      const list = Array.isArray(raw) ? raw : [];

      // Normalize each card payload for safer UI consumption
      return list.map((item) => {
        const project = item?.project || {};

        const employees = Array.isArray(item?.employees)
          ? item.employees.filter(Boolean).map((e) => ({
              employee_id: Number(e?.employee_id ?? e?.id ?? 0) || undefined,
              name: String(e?.name ?? '').trim(),
              email: e?.email || '',
              phone: e?.phone || '',
              role: e?.role || 'employee',
            }))
          : [];

        const expenses = {
          totalExpense: Number(item?.expenses?.totalExpense ?? 0),
          expenseCount: Number(item?.expenses?.expenseCount ?? 0),
          details: Array.isArray(item?.expenses?.details) ? item.expenses.details : [],
        };

        const investors = {
          totalInvestment: Number(item?.investors?.totalInvestment ?? 0),
          investorCount: Number(item?.investors?.investorCount ?? 0),
          details: Array.isArray(item?.investors?.details) ? item.investors.details : [],
        };

        const balance = {
          totalInvestment: Number(item?.balance?.totalInvestment ?? 0),
          totalExpense: Number(item?.balance?.totalExpense ?? 0),
          netBalance: Number(item?.balance?.netBalance ?? 0),
          profitOrLoss: String(item?.balance?.profitOrLoss ?? ''),
        };

        return { project, employees, expenses, investors, balance };
      });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(
        error.response?.data?.message || error.message || 'Failed to fetch all projects overview'
      );
    }
  },

  // GET /api/dashboard/project/:projectId
  getProjectAnalytics: async (projectId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/project/${projectId}`, {
        headers: getAuthHeaders(),
        timeout: 10000,
        withCredentials: false,
      });
      const payload = response?.data?.data || response?.data || {};

      const safe = {
        project: payload.project || {},
        employees: Array.isArray(payload.employees) ? payload.employees.filter(Boolean) : [],
        expenses: {
          totalExpense: Number(payload.expenses?.totalExpense ?? 0),
          expenseCount: Number(payload.expenses?.expenseCount ?? 0),
          details: Array.isArray(payload.expenses?.details) ? payload.expenses.details : [],
        },
        investors: {
          totalInvestment: Number(payload.investors?.totalInvestment ?? 0),
          investorCount: Number(payload.investors?.investorCount ?? 0),
          details: Array.isArray(payload.investors?.details) ? payload.investors.details : [],
        },
        balance: {
          totalInvestment: Number(payload.balance?.totalInvestment ?? 0),
          totalExpense: Number(payload.balance?.totalExpense ?? 0),
          netBalance: Number(payload.balance?.netBalance ?? 0),
          profitOrLoss: String(payload.balance?.profitOrLoss ?? ''),
        },
      };
      return safe;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        throw new Error('Please login to continue');
      }
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch project analytics');
    }
  },
};

export default dashboardApi;

