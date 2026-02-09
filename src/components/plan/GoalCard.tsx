import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GOAL_CATEGORIES } from '@/types/plan';
import type { Goal } from '@/types/plan';

interface GoalCardProps {
  goal: Goal;
  progress: number;
  onToggleStep: (goalId: string, stepId: string) => void;
  onAddReflection: (goalId: string, text: string) => void;
  onDelete: (id: string) => void;
}

const GoalCard = ({ goal, progress, onToggleStep, onAddReflection, onDelete }: GoalCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const category = GOAL_CATEGORIES.find((c) => c.value === goal.category);

  const handleAddReflection = () => {
    if (reflectionText.trim()) {
      onAddReflection(goal.id, reflectionText.trim());
      setReflectionText('');
    }
  };

  return (
    <Card className="border-0 shadow-card overflow-hidden">
      {/* Progress bar accent */}
      <div className="h-1 bg-muted">
        <div
          className="h-full gradient-warm transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{category?.emoji}</span>
              <Badge variant="secondary" className="text-[10px] font-normal">
                {category?.label}
              </Badge>
            </div>
            <h4 className="font-semibold text-sm text-card-foreground">{goal.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-primary">{progress}%</span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="h-1.5 mt-3" />

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 space-y-4 animate-fade-in-up">
            {/* Steps */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Steps
              </h5>
              <div className="space-y-2">
                {goal.steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={step.completed}
                      onCheckedChange={() => onToggleStep(goal.id, step.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span
                      className={`text-xs ${
                        step.completed
                          ? 'line-through text-muted-foreground'
                          : 'text-card-foreground'
                      }`}
                    >
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reflections */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Reflections
              </h5>
              <div className="flex gap-2">
                <Input
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="How's this goal going?"
                  className="text-xs h-8"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddReflection()}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddReflection}
                  disabled={!reflectionText.trim()}
                  className="h-8 px-2"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              {goal.reflections.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {goal.reflections.slice(0, 3).map((ref) => (
                    <div
                      key={ref.id}
                      className="p-2 rounded-lg bg-accent/50 text-xs text-card-foreground"
                    >
                      <p>"{ref.text}"</p>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(ref.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delete */}
            <div className="pt-2 border-t border-border/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(goal.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 text-xs"
              >
                <Trash2 className="h-3 w-3" />
                Remove Goal
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalCard;
