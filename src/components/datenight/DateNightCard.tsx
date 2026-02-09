import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, DollarSign, MapPin, Zap, Heart } from 'lucide-react';

interface DateNightIdea {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  whyItFits: string;
  budget: string;
  setting: string;
  energy: string;
  mood: string;
  conversationPrompts?: string[];
}

interface DateNightCardProps {
  idea: DateNightIdea;
  index: number;
}

const budgetIcons: Record<string, string> = {
  free: '🆓',
  low: '💵',
  medium: '💰',
  high: '💎',
};

const DateNightCard = ({ idea, index }: DateNightCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className="border-0 shadow-card overflow-hidden cursor-pointer hover:shadow-glow transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-card-foreground">{idea.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{idea.description}</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
          )}
        </div>

        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            <DollarSign className="h-3 w-3" />
            {idea.budget}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            <MapPin className="h-3 w-3" />
            {idea.setting}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            <Zap className="h-3 w-3" />
            {idea.energy}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            <Heart className="h-3 w-3" />
            {idea.mood}
          </span>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-fade-in-up">
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                Steps
              </h4>
              <ol className="space-y-2">
                {idea.instructions.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-accent rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Heart className="h-3 w-3 text-accent-foreground" />
                <span className="text-[10px] font-semibold text-accent-foreground uppercase tracking-wider">
                  Why This Fits
                </span>
              </div>
              <p className="text-xs text-accent-foreground/80">{idea.whyItFits}</p>
            </div>

            {idea.conversationPrompts && idea.conversationPrompts.length > 0 && (
              <div className="bg-primary/5 rounded-xl p-3">
                <h4 className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-2">
                  💬 Questions to Ask During This Date
                </h4>
                <ul className="space-y-1.5">
                  {idea.conversationPrompts.map((q, i) => (
                    <li key={i} className="text-xs text-foreground/70 italic">"{q}"</li>
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

export default DateNightCard;
