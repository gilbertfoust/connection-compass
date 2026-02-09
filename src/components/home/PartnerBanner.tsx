import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Link2, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
      onClick={() => navigate('/partner')}
    >
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Link2 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-card-foreground">Link your partner</p>
          <p className="text-xs text-muted-foreground">Share goals, calendars, and more</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerBanner;
