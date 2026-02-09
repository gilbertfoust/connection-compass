import { useNavigate } from 'react-router-dom';
import { MessageCircle, Gamepad2, CalendarHeart, ClipboardList, Compass, Eye, Calendar, Link2, DollarSign, HeartHandshake, ShieldAlert, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const actions = [
  { icon: MessageCircle, label: 'Talk', path: '/engagement', color: 'bg-primary/10 text-primary', requiresPartner: false },
  { icon: Gamepad2, label: 'Play', path: '/activities', color: 'bg-chart-1/10 text-chart-1', requiresPartner: false },
  { icon: CalendarHeart, label: 'Date', path: '/date-night', color: 'bg-chart-2/10 text-chart-2', requiresPartner: true },
  { icon: Calendar, label: 'Calendar', path: '/calendar', color: 'bg-chart-3/10 text-chart-3', requiresPartner: true },
  { icon: ClipboardList, label: 'Plan', path: '/plan', color: 'bg-chart-5/10 text-chart-5', requiresPartner: true },
  { icon: DollarSign, label: 'Budget', path: '/budget', color: 'bg-chart-2/10 text-chart-2', requiresPartner: true },
  { icon: HeartHandshake, label: 'Love', path: '/love-languages', color: 'bg-chart-4/10 text-chart-4', requiresPartner: true },
  { icon: ShieldAlert, label: 'Triggers', path: '/triggers', color: 'bg-chart-1/10 text-chart-1', requiresPartner: true },
  { icon: Eye, label: 'Vision', path: '/vision', color: 'bg-chart-4/10 text-chart-4', requiresPartner: true },
  { icon: Link2, label: 'Partner', path: '/partner', color: 'bg-accent text-accent-foreground', requiresPartner: false },
  { icon: Compass, label: 'Insights', path: '/insights', color: 'bg-muted text-muted-foreground', requiresPartner: false },
];

const QuickActions = () => {
  const navigate = useNavigate();
  const { coupleId } = useAuth();
  const isLinked = !!coupleId;

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        const isLocked = action.requiresPartner && !isLinked;

        return (
          <Tooltip key={action.label}>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-1.5 group relative"
              >
                <div className={`relative p-3 rounded-2xl ${action.color} transition-all duration-200 group-hover:scale-105 ${isLocked ? 'opacity-60' : ''}`}>
                  <Icon className="h-5 w-5" />
                  {isLocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-muted-foreground/80 flex items-center justify-center">
                      <Lock className="h-2.5 w-2.5 text-background" />
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium ${isLocked ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
                  {action.label}
                </span>
              </button>
            </TooltipTrigger>
            {isLocked && (
              <TooltipContent side="bottom" className="text-xs">
                Requires partner link
              </TooltipContent>
            )}
          </Tooltip>
        );
      })}
    </div>
  );
};

export default QuickActions;