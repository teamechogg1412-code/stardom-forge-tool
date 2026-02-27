import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ArtistsPage from "./pages/ArtistsPage";
import ActorProfile from "./pages/ActorProfile";
import Admin from "./pages/Admin";
import AdminActorForm from "./pages/AdminActorForm";
import AdminStaff from "./pages/AdminStaff";
import AdminAccessLogs from "./pages/AdminAccessLogs";
import EchoPage from "./pages/EchoPage";
import TotalPage from "./pages/TotalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/actor/:slug" element={<ActorProfile />} />
          <Route path="/echo" element={<EchoPage />} />
          <Route path="/total" element={<TotalPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/actor/:id" element={<AdminActorForm />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/logs" element={<AdminAccessLogs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
