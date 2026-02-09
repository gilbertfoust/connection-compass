import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EVENT_CATEGORIES, SUGGESTED_EVENTS } from '@/types/calendar';
import type { CalendarEvent, EventCategory } from '@/types/calendar';
import { conversationDecks } from '@/data/conversationDecks';

interface AddEventFormProps {
  onAdd: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'completed'>) => void;
  onClose: () => void;
  preselectedDate?: string;
}

const allQuestions = conversationDecks.flatMap((d) => d.cards);

const getRandomPrompt = () => allQuestions[Math.floor(Math.random() * allQuestions.length)].question;

const AddEventForm = ({ onAdd, onClose, preselectedDate }: AddEventFormProps) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(preselectedDate ? new Date(preselectedDate + 'T12:00:00') : undefined);
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<EventCategory>('custom');
  const [description, setDescription] = useState('');
  const [recurring, setRecurring] = useState<'none' | 'weekly' | 'biweekly' | 'monthly'>('none');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSubmit = () => {
    if (!title.trim() || !date) return;
    onAdd({
      title: title.trim(),
      date: format(date, 'yyyy-MM-dd'),
      time: time || undefined,
      category,
      description: description.trim() || undefined,
      recurring,
      conversationPrompt: getRandomPrompt(),
    });
    onClose();
  };

  const handleSuggestion = (suggestion: typeof SUGGESTED_EVENTS[number]) => {
    setTitle(suggestion.title);
    setCategory(suggestion.category);
    setDescription(suggestion.description || '');
    setRecurring(suggestion.recurring || 'none');
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <h3 className="font-semibold text-foreground">Add Event</h3>

      {showSuggestions && !preselectedDate && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Quick add suggestions
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTED_EVENTS.map((s) => (
              <button
                key={s.title}
                onClick={() => handleSuggestion(s)}
                className="text-left p-2.5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <span className="text-sm">{EVENT_CATEGORIES[s.category].emoji}</span>
                <p className="text-xs font-medium text-card-foreground mt-1">{s.title}</p>
                <p className="text-[10px] text-muted-foreground">{s.recurring}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <Input
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-card"
      />

      <div className="grid grid-cols-2 gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn('justify-start text-left font-normal', !date && 'text-muted-foreground')}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {date ? format(date, 'MMM d') : 'Pick date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className={cn('p-3 pointer-events-auto')}
            />
          </PopoverContent>
        </Popover>

        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="bg-card"
          placeholder="Time (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select value={category} onValueChange={(v) => setCategory(v as EventCategory)}>
          <SelectTrigger className="bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EVENT_CATEGORIES).map(([key, val]) => (
              <SelectItem key={key} value={key}>
                {val.emoji} {val.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={recurring} onValueChange={(v) => setRecurring(v as typeof recurring)}>
          <SelectTrigger className="bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">One-time</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Bi-weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Textarea
        placeholder="Notes or description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-card resize-none"
        rows={2}
      />

      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={!title.trim() || !date} className="flex-1">
          <Plus className="h-4 w-4 mr-1" /> Add Event
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddEventForm;
