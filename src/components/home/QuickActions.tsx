import { useNavigate } from 'react-router-dom';
import { MessageCircle, ClipboardList, Sprout, Link2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const actions = [
  { icon: MessageCircle, label: 'Engage', path: '/engage', color: 'bg-primary/10 text-primary' },
  { icon: ClipboardList, label: 'Plan', path: '/plan', color: 'bg-chart-3/10 text-chart-3' },
  { icon: Sprout, label: 'Grow', path: '/grow', color: 'bg-chart-4/10 text-chart-4' },
  { icon: Link2, label: 'Partner', path: '/partner', color: 'bg-accent text-accent-foreground' },
];

const QuickActions = () => {
  const navigate = useNavigate();
  const { coupleId } = useAuth();

  // Only show partner link if not connected
  const visibleActions = coupleId
    ? actions.filter((a) => a.path !== '/partner')
    : actions;

  return (
    <div className={`grid gap-2 ${visibleActions.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
      {visibleActions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className={`p-3 rounded-2xl ${action.color} transition-all duration-200 group-hover:scale-105`}>
              <Icon className="h-5 w-5" />
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
