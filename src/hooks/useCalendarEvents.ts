import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { CalendarEvent, EventCategory } from '@/types/calendar';
import { toast } from '@/hooks/use-toast';

export const useCalendarEvents = () => {
  const { coupleId, user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);

  const mapDbEvent = (e: any): CalendarEvent => ({
    id: e.id,
    title: e.title,
    date: e.date,
    time: e.time || undefined,
    category: e.category as EventCategory,
    description: e.description || undefined,
    recurring: (e.recurring as CalendarEvent['recurring']) || 'none',
    conversationPrompt: e.conversation_prompt || undefined,
    completed: e.completed,
    createdAt: e.created_at,
  });

  const fetchEvents = useCallback(async () => {
    if (!coupleId) {
      setEvents([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('couple_id', coupleId)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents((data || []).map(mapDbEvent));
    }
    setLoading(false);
  }, [coupleId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Real-time subscription
  useEffect(() => {
    if (!coupleId) return;

    const channel = supabase
      .channel('calendar-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'calendar_events', filter: `couple_id=eq.${coupleId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEvents((prev) => {
              if (prev.some((e) => e.id === (payload.new as any).id)) return prev;
              return [...prev, mapDbEvent(payload.new)].sort((a, b) => a.date.localeCompare(b.date));
            });
          } else if (payload.eventType === 'UPDATE') {
            setEvents((prev) =>
              prev.map((e) => (e.id === (payload.new as any).id ? mapDbEvent(payload.new) : e))
            );
          } else if (payload.eventType === 'DELETE') {
            setEvents((prev) => prev.filter((e) => e.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const addEvent = useCallback(async (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'completed'>) => {
    if (!coupleId || !user) {
      toast({ title: 'Link a partner first', description: 'You need to link with a partner before adding shared items.', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('calendar_events').insert({
      couple_id: coupleId,
      title: event.title,
      date: event.date,
      time: event.time || null,
      category: event.category,
      description: event.description || null,
      recurring: event.recurring || 'none',
      conversation_prompt: event.conversationPrompt || null,
      created_by: user.id,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  }, [coupleId, user]);

  const updateEvent = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    const dbUpdates: Record<string, any> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.time !== undefined) dbUpdates.time = updates.time;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.recurring !== undefined) dbUpdates.recurring = updates.recurring;
    if (updates.conversationPrompt !== undefined) dbUpdates.conversation_prompt = updates.conversationPrompt;
    if (updates.completed !== undefined) dbUpdates.completed = updates.completed;

    const { error } = await supabase.from('calendar_events').update(dbUpdates).eq('id', id);
    if (error) console.error('Error updating event:', error);
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    const { error } = await supabase.from('calendar_events').delete().eq('id', id);
    if (error) console.error('Error deleting event:', error);
  }, []);

  const toggleComplete = useCallback(async (id: string) => {
    const event = events.find((e) => e.id === id);
    if (!event) return;
    await updateEvent(id, { completed: !event.completed });
  }, [events, updateEvent]);

  const getEventsForDate = useCallback((dateStr: string) => {
    return events.filter((e) => e.date === dateStr);
  }, [events]);

  const getUpcomingEvents = useCallback((count = 5) => {
    const today = new Date().toISOString().split('T')[0];
    return events
      .filter((e) => e.date >= today && !e.completed)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, count);
  }, [events]);

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter((e) => e.category === selectedCategory);

  const getDatesWithEvents = useCallback(() => {
    const dateMap = new Map<string, EventCategory[]>();
    events.forEach((e) => {
      const existing = dateMap.get(e.date) || [];
      if (!existing.includes(e.category)) {
        dateMap.set(e.date, [...existing, e.category]);
      }
    });
    return dateMap;
  }, [events]);

  return {
    events: filteredEvents,
    allEvents: events,
    selectedCategory,
    setSelectedCategory,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleComplete,
    getEventsForDate,
    getUpcomingEvents,
    getDatesWithEvents,
    loading,
  };
};
