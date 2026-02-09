import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CalendarHeart, DollarSign, Target, Sparkles, Eye } from 'lucide-react';
import { activities } from '@/data/activities';
import { useAuth } from '@/contexts/AuthContext';

interface SuggestedItem {
  icon: typeof CalendarHeart;
  label: string;
  text: string;
  path: string;
  color: string;
}

const useSuggestedAction = (): SuggestedItem => {
  const { coupleId } = useAuth();
  const dayIndex = Math.floor(Date.now() / 86400000);

  const suggestions: SuggestedItem[] = [
    {
      icon: Sparkles,
      label: 'Try an Activity',
      text: activities[dayIndex % activities.length].title,
      path: '/engage',
      color: 'text-chart-1',
    },
  ];

  if (coupleId) {
    suggestions.push(
      {
        icon: CalendarHeart,
        label: 'Plan a Date',
        text: 'Find the perfect date night for your mood',
        path: '/engage',
        color: 'text-chart-2',
      },
      {
        icon: DollarSign,
        label: 'Check Budget',
        text: 'Review your spending this month',
        path: '/plan',
        color: 'text-chart-3',
      },
      {
        icon: Target,
        label: 'Track a Goal',
        text: 'Make progress on a shared goal today',
        path: '/plan',
        color: 'text-chart-4',
      },
      {
        icon: Eye,
        label: 'Vision Board',
        text: 'Add to your shared dreams and aspirations',
        path: '/insight',
        color: 'text-chart-5',
      }
    );
  }

  return suggestions[dayIndex % suggestions.length];
};

const SuggestedAction = () => {
  const navigate = useNavigate();
  const action = useSuggestedAction();
  const Icon = action.icon;

  return (
    <Card
      className="border-0 shadow-card cursor-pointer hover:shadow-glow transition-all"
      onClick={() => navigate(action.path)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center shrink-0">
            <Icon className={`h-5 w-5 ${action.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary uppercase tracking-wider">
              {action.label}
            </p>
            <p className="text-sm text-foreground mt-0.5 truncate">{action.text}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestedAction;
