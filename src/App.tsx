import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import EngagementHub from "./pages/EngagementHub";
import ActivitiesPage from "./pages/ActivitiesPage";
import DateNightPage from "./pages/DateNightPage";
import InsightCenterPage from "./pages/InsightCenterPage";
import PlanPage from "./pages/PlanPage";
import VisionBoardPage from "./pages/VisionBoardPage";
import CalendarPage from "./pages/CalendarPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
