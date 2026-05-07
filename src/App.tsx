import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import BerandaForm from "./pages/dashboard/BerandaForm";
import ProfilForm from "./pages/dashboard/ProfilForm";
import ArtefakForm from "./pages/dashboard/ArtefakForm";
import AnalisisForm from "./pages/dashboard/AnalisisForm";
import RefleksiForm from "./pages/dashboard/RefleksiForm";
import { Navigate } from "react-router-dom";
import ModelGuruForm from "./pages/dashboard/ModelGuruForm";
import PreviewPage from "./pages/dashboard/PreviewPage";
import TemaPage from "./pages/dashboard/TemaPage";
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="beranda" element={<BerandaForm />} />
              <Route path="profil" element={<ProfilForm />} />
              <Route path="artefak" element={<ArtefakForm />} />
              <Route path="analisis" element={<AnalisisForm />} />
              <Route path="refleksi" element={<RefleksiForm />} />
              <Route path="model-guru" element={<ModelGuruForm />} />
              <Route path="lampiran" element={<Navigate to="/dashboard/artefak" replace />} />
              <Route path="tema" element={<TemaPage />} />
              <Route path="preview" element={<PreviewPage />} />
            </Route>
            <Route path="/portfolio/:identifier" element={<PublicPortfolio />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
