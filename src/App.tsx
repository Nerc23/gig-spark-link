
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
