import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GOAL_CATEGORIES, type GoalCategory } from '@/types/plan';

interface AddGoalFormProps {
  onAdd: (title: string, description: string, category: GoalCategory, steps: string[]) => void;
}

const AddGoalForm = ({ onAdd }: AddGoalFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('communication');
  const [steps, setSteps] = useState<string[]>(['']);

  const addStep = () => setSteps((prev) => [...prev, '']);

  const updateStep = (index: number, value: string) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validSteps = steps.filter((s) => s.trim());
    if (title.trim() && validSteps.length > 0) {
      onAdd(title.trim(), description.trim(), category, validSteps);
      setTitle('');
      setDescription('');
      setCategory('communication');
      setSteps(['']);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full gap-1.5 border-dashed"
      >
        <Plus className="h-4 w-4" />
        Create a new goal
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-xl bg-card border border-border/50 animate-fade-in-up">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Goal title"
        autoFocus
        className="text-sm"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What does this goal mean for your relationship? (optional)"
        className="text-sm min-h-[60px] resize-none"
      />
      <Select value={category} onValueChange={(v) => setCategory(v as GoalCategory)}>
        <SelectTrigger className="text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {GOAL_CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.emoji} {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Steps to get there</label>
        {steps.map((step, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={step}
              onChange={(e) => updateStep(i, e.target.value)}
              placeholder={`Step ${i + 1}`}
              className="text-xs h-8"
            />
            {steps.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => removeStep(i)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addStep}
          className="text-xs gap-1"
        >
          <Plus className="h-3 w-3" />
          Add step
        </Button>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={!title.trim() || !steps.some((s) => s.trim())}>
          Create Goal
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddGoalForm;
