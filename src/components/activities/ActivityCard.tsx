import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import type { Activity } from '@/data/activities';

interface ActivityCardProps {
  activity: Activity;
  index: number;
}

const ActivityCard = ({ activity, index }: ActivityCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className="border-0 shadow-card overflow-hidden cursor-pointer hover:shadow-glow transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{activity.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-card-foreground text-sm">{activity.title}</h3>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {activity.duration}
              </span>
              <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                {activity.category}
              </span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in-up space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                How to Play
              </h4>
              <ol className="space-y-2">
                {activity.instructions.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {activity.bonusQuestions && activity.bonusQuestions.length > 0 && (
              <div className="bg-accent rounded-xl p-3">
                <h4 className="text-[10px] font-semibold text-accent-foreground uppercase tracking-wider mb-2">
                  💬 Bonus Questions to Ask
                </h4>
                <ul className="space-y-1.5">
                  {activity.bonusQuestions.map((q, i) => (
                    <li key={i} className="text-xs text-accent-foreground/80 italic">"{q}"</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
