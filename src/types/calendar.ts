export type EventCategory = 'date-night' | 'check-in' | 'vision-update' | 'budget' | 'custom';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  time?: string;
  category: EventCategory;
  description?: string;
  recurring?: 'none' | 'weekly' | 'biweekly' | 'monthly';
  conversationPrompt?: string;
  completed: boolean;
  createdAt: string;
}

export const EVENT_CATEGORIES: Record<EventCategory, { label: string; emoji: string; color: string }> = {
  'date-night': { label: 'Date Night', emoji: '💕', color: 'bg-primary/10 text-primary' },
  'check-in': { label: 'Weekly Check-In', emoji: '💬', color: 'bg-chart-1/10 text-chart-1' },
  'vision-update': { label: 'Vision Update', emoji: '🔮', color: 'bg-chart-4/10 text-chart-4' },
  'budget': { label: 'Budget Review', emoji: '💰', color: 'bg-chart-5/10 text-chart-5' },
  'custom': { label: 'Custom', emoji: '📌', color: 'bg-chart-3/10 text-chart-3' },
};

export const SUGGESTED_EVENTS: Omit<CalendarEvent, 'id' | 'date' | 'createdAt' | 'completed'>[] = [
  {
    title: 'Date Night',
    category: 'date-night',
    recurring: 'weekly',
    description: 'A dedicated evening for just the two of you',
    conversationPrompt: 'What made you smile this week?',
  },
  {
    title: 'Weekly Check-In',
    category: 'check-in',
    recurring: 'weekly',
    description: 'Share highs, lows, and what you need from each other',
    conversationPrompt: 'How are we doing as a couple this week?',
  },
  {
    title: 'Monthly Vision Board Update',
    category: 'vision-update',
    recurring: 'monthly',
    description: 'Review and refresh your shared vision together',
    conversationPrompt: 'What progress have we made toward our dreams?',
  },
  {
    title: 'Budget Check-In',
    category: 'budget',
    recurring: 'monthly',
    description: 'Review spending, savings, and financial goals together',
    conversationPrompt: 'How do we feel about our financial harmony this month?',
  },
];
