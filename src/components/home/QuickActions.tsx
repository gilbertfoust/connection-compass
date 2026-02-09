import { useNavigate } from 'react-router-dom';
import { MessageCircle, ClipboardList, Lightbulb, Settings, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const actions = [
  { icon: MessageCircle, label: 'Engage', path: '/engage', requiresPartner: false },
  { icon: ClipboardList, label: 'Plan', path: '/plan', requiresPartner: true },
  { icon: Lightbulb, label: 'Insight', path: '/insight', requiresPartner: false },
  { icon: Settings, label: 'Settings', path: '/settings', requiresPartner: false },
];

const QuickActions = () => {
  const navigate = useNavigate();
  const { coupleId } = useAuth();

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        const locked = action.requiresPartner && !coupleId;
        return (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`flex flex-col items-center gap-1.5 group ${locked ? 'opacity-60' : ''}`}
          >
            <div className="p-3 rounded-2xl bg-primary/10 text-primary transition-all duration-200 group-hover:scale-105 relative">
              <Icon className="h-5 w-5" />
              {locked && (
                <Lock className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5 text-muted-foreground" />
              )}
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;
