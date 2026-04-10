import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PortfolioProvider } from '@/contexts/PortfolioContext';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Save } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';

const DashboardInner = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-x-hidden">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-card px-4 gap-3">
            <SidebarTrigger />
            <h1 className="text-sm font-medium text-foreground">E-Portfolio PPG Prajabatan</h1>
            <SavingIndicator />
          </header>
          <main className="flex-1 p-3 sm:p-6 overflow-auto overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const SavingIndicator = () => {
  const { saving } = usePortfolio();
  if (!saving) return null;
  return (
    <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
      <Save className="w-3 h-3 animate-pulse" />
      Menyimpan...
    </div>
  );
};

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <PortfolioProvider>
      <DashboardInner />
    </PortfolioProvider>
  );
};

export default DashboardLayout;
