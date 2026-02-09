import { Card, CardContent } from '@/components/ui/card';
import { Check, MessageCircle, RotateCcw, Trash2 } from 'lucide-react';
import { EVENT_CATEGORIES } from '@/types/calendar';
import type { CalendarEvent } from '@/types/calendar';

interface EventCardProps {
  event: CalendarEvent;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const recurringLabels: Record<string, string> = {
  none: '',
  weekly: '🔁 Weekly',
  biweekly: '🔁 Bi-weekly',
  monthly: '🔁 Monthly',
};

const EventCard = ({ event, onToggleComplete, onDelete }: EventCardProps) => {
  const cat = EVENT_CATEGORIES[event.category];

  return (
    <Card className={`border-0 shadow-card overflow-hidden transition-all duration-200 ${event.completed ? 'opacity-60' : ''}`}>
      <CardContent className="p-3.5">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleComplete(event.id)}
            className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              event.completed
                ? 'bg-primary border-primary'
                : 'border-muted-foreground/30 hover:border-primary'
            }`}
          >
            {event.completed && <Check className="h-3 w-3 text-primary-foreground" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cat.color}`}>
                {cat.emoji} {cat.label}
              </span>
              {event.recurring && event.recurring !== 'none' && (
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  <RotateCcw className="h-2.5 w-2.5" />
                  {recurringLabels[event.recurring]}
                </span>
              )}
            </div>

            <h4 className={`text-sm font-medium ${event.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
              {event.title}
            </h4>

            {event.time && (
              <p className="text-xs text-muted-foreground mt-0.5">🕐 {event.time}</p>
            )}

            {event.description && (
              <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
            )}

            {event.conversationPrompt && !event.completed && (
              <div className="mt-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-[10px] text-primary font-medium flex items-center gap-1 mb-0.5">
                  <MessageCircle className="h-3 w-3" /> Conversation Prompt
                </p>
                <p className="text-xs text-card-foreground italic">"{event.conversationPrompt}"</p>
              </div>
            )}
          </div>

          <button
            onClick={() => onDelete(event.id)}
            className="p-1.5 rounded-full hover:bg-destructive/10 transition-colors shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
