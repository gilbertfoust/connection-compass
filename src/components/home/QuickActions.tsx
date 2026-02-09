import { useNavigate } from 'react-router-dom';
import { MessageCircle, Gamepad2, CalendarHeart, ClipboardList, Compass, Eye } from 'lucide-react';

const actions = [
  { icon: MessageCircle, label: 'Talk', path: '/engagement', color: 'bg-primary/10 text-primary' },
  { icon: Gamepad2, label: 'Play', path: '/activities', color: 'bg-chart-1/10 text-chart-1' },
  { icon: CalendarHeart, label: 'Date', path: '/date-night', color: 'bg-chart-2/10 text-chart-2' },
  { icon: ClipboardList, label: 'Plan', path: '/plan', color: 'bg-chart-5/10 text-chart-5' },
  { icon: Eye, label: 'Vision', path: '/vision', color: 'bg-chart-4/10 text-chart-4' },
  { icon: Compass, label: 'Insights', path: '/insights', color: 'bg-chart-3/10 text-chart-3' },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-2">
      {actions.map((action) => {
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
            <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;
