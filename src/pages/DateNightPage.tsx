import { useState } from 'react';
import { dateNightIdeas } from '@/data/activities';
import DateNightCard from '@/components/datenight/DateNightCard';

const budgetOptions = ['All', 'free', 'low', 'medium'] as const;
const settingOptions = ['All', 'indoor', 'outdoor'] as const;
const energyOptions = ['All', 'low', 'medium', 'high'] as const;

const DateNightPage = () => {
  const [budgetFilter, setBudgetFilter] = useState('All');
  const [settingFilter, setSettingFilter] = useState('All');
  const [energyFilter, setEnergyFilter] = useState('All');

  const filtered = dateNightIdeas.filter((idea) => {
    if (budgetFilter !== 'All' && idea.budget !== budgetFilter) return false;
    if (settingFilter !== 'All' && idea.setting !== settingFilter) return false;
    if (energyFilter !== 'All' && idea.energy !== energyFilter) return false;
    return true;
  });

  const FilterRow = ({
    label,
    options,
    active,
    onChange,
  }: {
    label: string;
    options: readonly string[];
    active: string;
    onChange: (v: string) => void;
  }) => (
    <div>
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="flex gap-1.5 mt-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all ${
              active === opt
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-accent'
            }`}
          >
            {opt === 'All' ? '✨ All' : opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="space-y-3 bg-card rounded-2xl p-4 shadow-card">
        <FilterRow label="Budget" options={budgetOptions} active={budgetFilter} onChange={setBudgetFilter} />
        <FilterRow label="Setting" options={settingOptions} active={settingFilter} onChange={setSettingFilter} />
        <FilterRow label="Energy" options={energyOptions} active={energyFilter} onChange={setEnergyFilter} />
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtered.map((idea, i) => (
          <DateNightCard key={idea.id} idea={idea} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No dates match your filters. Try adjusting them! 🌟
        </div>
      )}
    </div>
  );
};

export default DateNightPage;
