import { focusAreas } from '@/data/conversationDecks';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filterLabels: Record<string, string> = {
  All: '✨ All',
  communication: '💬 Communication',
  trust: '🤝 Trust',
  intimacy: '🔥 Intimacy',
  fun: '🎉 Fun',
  healing: '🌱 Healing',
};

const FilterBar = ({ activeFilter, onFilterChange }: FilterBarProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {focusAreas.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`shrink-0 text-xs font-medium px-3.5 py-2 rounded-full transition-all duration-200 ${
            activeFilter === filter
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card text-muted-foreground hover:bg-accent'
          }`}
        >
          {filterLabels[filter] || filter}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
