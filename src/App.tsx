import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ProfilForm from "./pages/dashboard/ProfilForm";
import ArtefakForm from "./pages/dashboard/ArtefakForm";
import LampiranForm from "./pages/dashboard/LampiranForm";
import ModelGuruForm from "./pages/dashboard/ModelGuruForm";
import PreviewPage from "./pages/dashboard/PreviewPage";
import PublicPortfolio from "./pages/PublicPortfolio";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="profil" element={<ProfilForm />} />
              <Route path="artefak" element={<ArtefakForm />} />
              <Route path="lampiran" element={<LampiranForm />} />
              <Route path="model-guru" element={<ModelGuruForm />} />
              <Route path="preview" element={<PreviewPage />} />
            </Route>
            <Route path="/portfolio/:userId" element={<PublicPortfolio />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
