
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Auth from "./components/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import FindWork from "./pages/FindWork";
import PostJobs from "./pages/PostJobs";
import Messages from "./pages/Messages";
import Subscription from "./pages/Subscription";
import BotHelp from "./pages/BotHelp";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading WorkFlow Bot...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/find-work" element={<FindWork />} />
        <Route path="/post-jobs" element={<PostJobs />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/bot-help" element={<BotHelp />} />
        
        {/* Placeholder routes for future implementation */}
        <Route path="/freelancer-projects" element={<FreelancerDashboard />} />
        <Route path="/freelancer-payments" element={<FreelancerDashboard />} />
        <Route path="/manage-projects" element={<ClientDashboard />} />
        <Route path="/applications" element={<ClientDashboard />} />
        <Route path="/client-payments" element={<ClientDashboard />} />
        <Route path="/ads" element={<ClientDashboard />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
