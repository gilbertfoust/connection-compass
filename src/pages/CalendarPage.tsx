import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { LoadingState } from '@/components/ui/StateView';
import AddEventForm from '@/components/calendar/AddEventForm';
import EventCard from '@/components/calendar/EventCard';
import CalendarCategoryFilter from '@/components/calendar/CalendarCategoryFilter';
import UpcomingEvents from '@/components/calendar/UpcomingEvents';
import type { EventCategory } from '@/types/calendar';

const CalendarPage = () => {
  const {
    events,
    selectedCategory,
    setSelectedCategory,
    addEvent,
    toggleComplete,
    deleteEvent,
    getEventsForDate,
    getUpcomingEvents,
    getDatesWithEvents,
    loading,
  } = useCalendarEvents();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  if (loading) return <LoadingState message="Loading calendar..." />;

  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const dayEvents = getEventsForDate(selectedDateStr);
  const upcomingEvents = getUpcomingEvents(5);
  const datesWithEvents = getDatesWithEvents();

  const eventDates = Array.from(datesWithEvents.keys()).map((d) => parseISO(d));

  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => setShowAddForm(true)} className="rounded-full">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {showAddForm && (
        <AddEventForm
          onAdd={addEvent}
          onClose={() => setShowAddForm(false)}
          preselectedDate={selectedDateStr}
        />
      )}

      {/* View Toggle */}
      <div className="flex gap-1 bg-card p-1 rounded-full w-fit">
        <button
          onClick={() => setView('calendar')}
          className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all ${
            view === 'calendar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          Calendar
        </button>
        <button
          onClick={() => setView('list')}
          className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all ${
            view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          List
        </button>
      </div>

      {view === 'calendar' ? (
        <>
          <div className="bg-card rounded-2xl p-3 shadow-card">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{ hasEvent: eventDates }}
              modifiersClassNames={{ hasEvent: 'bg-primary/15 font-bold text-primary' }}
              className={cn('p-0 pointer-events-auto w-full')}
            />
          </div>

          {selectedDate && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                </span>
              </div>

              {dayEvents.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No events on this day</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddForm(true)}
                    className="mt-2 rounded-full"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onToggleComplete={toggleComplete}
                      onDelete={deleteEvent}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <UpcomingEvents events={upcomingEvents} />
        </>
      ) : (
        <>
          <CalendarCategoryFilter
            activeFilter={selectedCategory}
            onFilterChange={(f) => setSelectedCategory(f as EventCategory | 'all')}
          />

          {sortedEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No events yet. Add your first date night or check-in!
            </div>
          ) : (
            <div className="space-y-2">
              {sortedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteEvent}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CalendarPage;
