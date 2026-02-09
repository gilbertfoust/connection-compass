import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { CalendarEvent, EventCategory } from '@/types/calendar';

export const useCalendarEvents = () => {
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('calendar-events', []);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id' | 'createdAt' | 'completed'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  }, [setEvents]);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }, [setEvents]);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, [setEvents]);

  const toggleComplete = useCallback((id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e)));
  }, [setEvents]);

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
  };
};
