import { EVENT_CATEGORIES } from '@/types/calendar';
import type { EventCategory } from '@/types/calendar';

interface CalendarCategoryFilterProps {
  activeFilter: EventCategory | 'all';
  onFilterChange: (filter: EventCategory | 'all') => void;
}

const CalendarCategoryFilter = ({ activeFilter, onFilterChange }: CalendarCategoryFilterProps) => {
  const filters: { key: EventCategory | 'all'; label: string }[] = [
    { key: 'all', label: '✨ All' },
    ...Object.entries(EVENT_CATEGORIES).map(([key, val]) => ({
      key: key as EventCategory,
      label: `${val.emoji} ${val.label}`,
    })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`shrink-0 text-xs font-medium px-3.5 py-2 rounded-full transition-all duration-200 ${
            activeFilter === f.key
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card text-muted-foreground hover:bg-accent'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default CalendarCategoryFilter;
