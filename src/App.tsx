import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import { LoginForm } from "@/components/LoginForm";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: 'admin' | 'faculty' }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/faculty'} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? (
          <Navigate to={user?.role === 'admin' ? '/admin' : '/faculty'} replace />
        ) : (
          <LoginForm />
        )
      } />
      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/faculty" element={
        <ProtectedRoute allowedRole="faculty">
          <FacultyDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AttendanceProvider>
            <AppRoutes />
          </AttendanceProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
