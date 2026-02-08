import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { activities } from '@/data/activities';

const RecommendedCard = () => {
  const todayActivity = activities[Math.floor(Date.now() / 86400000) % activities.length];

  return (
    <Card className="border-0 shadow-card overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            Recommended for You
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{todayActivity.emoji}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground text-sm">{todayActivity.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{todayActivity.description}</p>
            <span className="inline-block text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5 mt-2">
              {todayActivity.duration}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedCard;
