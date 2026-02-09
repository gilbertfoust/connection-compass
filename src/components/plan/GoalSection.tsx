import { useState } from 'react';
import { Target, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GoalCard from './GoalCard';
import AddGoalForm from './AddGoalForm';
import { useGoals } from '@/hooks/useGoals';
import { GOAL_CATEGORIES } from '@/types/plan';

const GoalSection = () => {
  const { goals, addGoal, toggleStep, addReflection, deleteGoal, getProgress } = useGoals();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredGoals = filterCategory === 'all'
    ? goals
    : goals.filter((g) => g.category === filterCategory);

  return (
    <div className="space-y-4">
      {/* Filter */}
      {goals.length > 0 && (
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="text-xs h-8 w-auto min-w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {GOAL_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Add Form */}
      <AddGoalForm onAdd={addGoal} />

      {/* Goals List */}
      <div className="space-y-3">
        {filteredGoals.length === 0 && goals.length === 0 && (
          <div className="text-center py-8">
            <Target className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No goals yet. Set your first goal together!
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Track relationship, financial, and personal goals
            </p>
          </div>
        )}
        {filteredGoals.length === 0 && goals.length > 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No goals in this category
          </p>
        )}
        {filteredGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            progress={getProgress(goal)}
            onToggleStep={toggleStep}
            onAddReflection={addReflection}
            onDelete={deleteGoal}
          />
        ))}
      </div>
    </div>
  );
};

export default GoalSection;
