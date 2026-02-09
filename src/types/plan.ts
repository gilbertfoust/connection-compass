export const TODO_CATEGORIES = [
  { value: 'personal', label: 'Personal', emoji: '👤' },
  { value: 'couple', label: 'Couple', emoji: '💑' },
  { value: 'relationship', label: 'Relationship Commitment', emoji: '💕' },
  { value: 'repair', label: 'Repair Commitment', emoji: '🌱' },
  { value: 'shared', label: 'Shared Responsibility', emoji: '🤝' },
] as const;

export const GOAL_CATEGORIES = [
  { value: 'communication', label: 'Relationship Communication', emoji: '🗣️', color: 'bg-primary/10 text-primary' },
  { value: 'financial', label: 'Financial Harmony', emoji: '💰', color: 'bg-chart-5/10 text-chart-5' },
  { value: 'quality-time', label: 'Quality Time', emoji: '⏰', color: 'bg-chart-1/10 text-chart-1' },
  { value: 'family', label: 'Family Planning', emoji: '👨‍👩‍👧', color: 'bg-chart-2/10 text-chart-2' },
  { value: 'dreams', label: 'Long-term Dreams', emoji: '✨', color: 'bg-chart-3/10 text-chart-3' },
  { value: 'intimacy', label: 'Intimacy Goals', emoji: '🔥', color: 'bg-destructive/10 text-destructive' },
  { value: 'growth', label: 'Personal Growth', emoji: '🌟', color: 'bg-chart-4/10 text-chart-4' },
  { value: 'wellness', label: 'Wellness', emoji: '🧘', color: 'bg-accent text-accent-foreground' },
] as const;

export type TodoCategory = typeof TODO_CATEGORIES[number]['value'];
export type GoalCategory = typeof GOAL_CATEGORIES[number]['value'];

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: TodoCategory;
  createdAt: string;
}

export interface GoalStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface GoalReflection {
  id: string;
  text: string;
  date: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  steps: GoalStep[];
  reflections: GoalReflection[];
  createdAt: string;
}
