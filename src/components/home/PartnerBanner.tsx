import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Link2, Heart, Lock, CalendarHeart, Calendar, ClipboardList, DollarSign, HeartHandshake, ShieldAlert, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LOCKED_FEATURES = [
  { icon: CalendarHeart, label: 'Date Night' },
  { icon: Calendar, label: 'Calendar' },
  { icon: ClipboardList, label: 'Goals & Todos' },
  { icon: DollarSign, label: 'Budget' },
  { icon: HeartHandshake, label: 'Love Languages' },
  { icon: ShieldAlert, label: 'Triggers' },
  { icon: Eye, label: 'Vision Board' },
];

const PartnerBanner = () => {
  const { coupleId } = useAuth();
  const navigate = useNavigate();

  if (coupleId) {
    return (
      <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-2xl px-4 py-2.5">
        <Heart className="h-4 w-4 text-primary fill-primary shrink-0" />
        <span className="text-xs text-foreground">You're connected with your partner — all data is shared! ✨</span>
      </div>
    );
  }

  return (
    <Card
      className="border-0 shadow-card cursor-pointer hover:shadow-glow transition-all"
      onClick={() => navigate('/settings')}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-card-foreground">Link your partner to unlock everything</p>
            <p className="text-xs text-muted-foreground">7 features require a partner connection</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {LOCKED_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.label}
                className="flex items-center gap-1 bg-muted/50 rounded-full px-2.5 py-1"
              >
                <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground font-medium">{feature.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerBanner;