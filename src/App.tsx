import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import EngagementHub from "./pages/EngagementHub";
import ActivitiesPage from "./pages/ActivitiesPage";
import DateNightPage from "./pages/DateNightPage";
import InsightCenterPage from "./pages/InsightCenterPage";
import PlanPage from "./pages/PlanPage";
import VisionBoardPage from "./pages/VisionBoardPage";
import CalendarPage from "./pages/CalendarPage";
import AuthPage from "./pages/AuthPage";
import PartnerLinkPage from "./pages/PartnerLinkPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/engagement" element={<EngagementHub />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/date-night" element={<DateNightPage />} />
        <Route path="/insights" element={<InsightCenterPage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/vision" element={<VisionBoardPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/partner" element={<PartnerLinkPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
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
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
