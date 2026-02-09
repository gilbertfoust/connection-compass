import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, Home, MessageCircle, ClipboardList, Sprout, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { path: '/', icon: Home, label: 'Today' },
  { path: '/engage', icon: MessageCircle, label: 'Engage' },
  { path: '/plan', icon: ClipboardList, label: 'Plan' },
  { path: '/grow', icon: Sprout, label: 'Grow' },
];

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="w-8" />
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            <h1 className="text-lg font-semibold text-foreground tracking-tight">TheMoreLoveApp</h1>
          </div>
          <button
            onClick={signOut}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-t border-border/50">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary scale-105'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'fill-primary/20' : ''}`} />
                <span className="text-[11px] font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
