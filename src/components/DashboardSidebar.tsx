import { Home, User, BookOpen, FileSearch, Heart, Star, Paperclip, Eye, LogOut, LayoutDashboard, Palette } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Beranda', url: '/dashboard/beranda', icon: Home },
  { title: 'Profil Mahasiswa', url: '/dashboard/profil', icon: User },
  { title: 'Artefak & Lampiran', url: '/dashboard/artefak', icon: BookOpen },
  { title: 'Analisis Artefak', url: '/dashboard/analisis', icon: FileSearch },
  { title: 'Refleksi Diri', url: '/dashboard/refleksi', icon: Heart },
  { title: 'Model Guru', url: '/dashboard/model-guru', icon: Star },
  { title: 'Tema Portfolio', url: '/dashboard/tema', icon: Palette },
  { title: 'Preview Portfolio', url: '/dashboard/preview', icon: Eye },
];

export const DashboardSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { signOut, user } = useAuth();
  const { completionPercent } = usePortfolio();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!collapsed && 'E-Portfolio PPG'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60">Kelengkapan Rubrik</SidebarGroupLabel>
            <SidebarGroupContent className="px-3">
              <Progress value={completionPercent} className="h-2" />
              <p className="text-xs text-sidebar-foreground/50 mt-1">{completionPercent}% selesai</p>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-3">
        {!collapsed && user && (
          <p className="text-xs text-sidebar-foreground/50 truncate mb-2">{user.email}</p>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && 'Keluar'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
