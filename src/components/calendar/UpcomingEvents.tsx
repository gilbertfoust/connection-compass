import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { EVENT_CATEGORIES } from '@/types/calendar';
import type { CalendarEvent } from '@/types/calendar';

interface UpcomingEventsProps {
  events: CalendarEvent[];
}

const UpcomingEvents = ({ events }: UpcomingEventsProps) => {
  if (events.length === 0) {
    return (
      <Card className="border-0 shadow-card">
        <CardContent className="p-5 text-center">
          <CalendarDays className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No upcoming events</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Add your first date night or check-in!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        <CalendarDays className="h-4 w-4 text-primary" /> Coming Up
      </h3>
      {events.map((event) => {
        const cat = EVENT_CATEGORIES[event.category];
        return (
          <div
            key={event.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-card shadow-card"
          >
            <div className="text-center shrink-0">
              <p className="text-[10px] uppercase font-medium text-muted-foreground">
                {format(parseISO(event.date), 'MMM')}
              </p>
              <p className="text-lg font-bold text-foreground leading-tight">
                {format(parseISO(event.date), 'd')}
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{event.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cat.color}`}>
                  {cat.emoji} {cat.label}
                </span>
                {event.time && <span className="text-[10px] text-muted-foreground">{event.time}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingEvents;
