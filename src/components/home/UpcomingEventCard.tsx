import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';

const UpcomingEventCard = () => {
  const { coupleId } = useAuth();
  const { getUpcomingEvents, loading } = useCalendarEvents();

  const nextEvent = useMemo(() => {
    if (!coupleId) return null;
    const upcoming = getUpcomingEvents(1);
    return upcoming[0] || null;
  }, [coupleId, getUpcomingEvents]);

  if (loading || !nextEvent) return null;

  const eventDate = parseISO(nextEvent.date);
  const dateLabel = isToday(eventDate)
    ? 'Today'
    : isTomorrow(eventDate)
    ? 'Tomorrow'
    : format(eventDate, 'EEE, MMM d');

  return (
    <Card className="border-0 shadow-card animate-fade-in-up">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary uppercase tracking-wider">
              Coming Up — {dateLabel}
            </p>
            <p className="text-sm text-foreground mt-0.5 truncate">{nextEvent.title}</p>
            {nextEvent.time && (
              <p className="text-xs text-muted-foreground">{nextEvent.time}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEventCard;
