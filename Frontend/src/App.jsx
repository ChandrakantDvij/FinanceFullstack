import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Profile from "@/components/dashboard/Profile";

// Auth pages
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Accountant pages
import AccountantDashboard from "./pages/accountant/AccountantDashboard";
import Employees from "./pages/accountant/Employees";
import Expense from "./pages/accountant/Expense";
import Investor from "./pages/accountant/Investor";
import SuperAdminUsers from "./pages/superadmin/User";
import ReviewerUsers from "./pages/reviewer/Users";
import AccountantUsers from "./pages/accountant/Users";

// Reviewer pages
import ReviewerDashboard from "./pages/reviewer/ReviewerDashboard";

// Super Admin pages
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";

import NotFound from "./pages/NotFound";
import Project from "./pages/accountant/Project";
import ProjectAnalytics from "./pages/accountant/ProjectAnalytics";
import ProjectDetail from "./pages/accountant/ProjectDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
             <Route path="/profile" element={<Profile />} />
            

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Accountant routes */}
            <Route
              path="/accountant/dashboard"
              element={
                <ProtectedRoute allowedRoles={['accountant']}>
                  <AccountantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant/employees"
              element={
                <ProtectedRoute allowedRoles={['accountant']}>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant/projects"
              element={
                <ProtectedRoute allowedRoles={['accountant']}>
                  <Project />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant/projects/:projectId"
              element={
                <ProtectedRoute allowedRoles={['accountant']}>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant/projects/:projectId/analytics"
              element={
                <ProtectedRoute allowedRoles={['accountant','reviewer','superadmin']}>
                  <ProjectAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant/investors"
              element={
                <ProtectedRoute allowedRoles={['accountant']}>
                  <Investor/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant/expenses"
              element={
                <ProtectedRoute allowedRoles={['accountant']}>
                  <Expense />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant/users"
              element={
                <ProtectedRoute allowedRoles={['accountant']}>
                  <AccountantUsers />
                </ProtectedRoute>
              }
            />

            {/* Reviewer routes */}
            <Route
              path="/reviewer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['reviewer']}>
                  <ReviewerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviewer/employees"
              element={
                <ProtectedRoute allowedRoles={['reviewer']}>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviewer/projects"
              element={
                <ProtectedRoute allowedRoles={['reviewer']}>
                  <Project />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviewer/projects/:projectId"
              element={
                <ProtectedRoute allowedRoles={['reviewer']}>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviewer/projects/:projectId/analytics"
              element={
                <ProtectedRoute allowedRoles={['reviewer','accountant','superadmin']}>
                  <ProjectAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviewer/investors"
              element={
                <ProtectedRoute allowedRoles={['reviewer']}>
                  <Investor/>
                </ProtectedRoute>
              }
            />
             <Route
              path="/reviewer/users"
              element={
                <ProtectedRoute allowedRoles={['reviewer']}>
                  <ReviewerUsers/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviewer/expenses"
              element={
                <ProtectedRoute allowedRoles={['reviewer']}>
                  <Expense />
                </ProtectedRoute>
              }
            />

            {/* Super Admin routes */}
            <Route
              path="/superadmin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/superadmin/users"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <SuperAdminUsers/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/employees"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/projects"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <Project />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/projects/:projectId"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/projects/:projectId/analytics"
              element={
                <ProtectedRoute allowedRoles={['superadmin','accountant','reviewer']}>
                  <ProjectAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/investors"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <Investor/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/expenses"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <Expense />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App; 
