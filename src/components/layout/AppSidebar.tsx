import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, Home, MessageCircle, ClipboardList, Lightbulb, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

const navItems = [
  { path: '/', icon: Home, label: 'Today' },
  { path: '/engage', icon: MessageCircle, label: 'Engage' },
  { path: '/plan', icon: ClipboardList, label: 'Plan' },
  { path: '/insight', icon: Lightbulb, label: 'Insight' },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary fill-primary" />
          <span className="text-lg font-semibold text-foreground tracking-tight">TheLoveMoreApp</span>
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => navigate(item.path)}
                      tooltip={item.label}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={location.pathname === '/settings'}
              onClick={() => navigate('/settings')}
              tooltip="Settings"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
