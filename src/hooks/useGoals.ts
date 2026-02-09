import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Goal, GoalCategory, GoalStep, GoalReflection } from '@/types/plan';

export const useGoals = () => {
  const [goals, setGoals] = useLocalStorage<Goal[]>('tmla-goals', []);

  const addGoal = useCallback(
    (title: string, description: string, category: GoalCategory, steps: string[]) => {
      const newGoal: Goal = {
        id: crypto.randomUUID(),
        title,
        description,
        category,
        steps: steps.map((s) => ({
          id: crypto.randomUUID(),
          text: s,
          completed: false,
        })),
        reflections: [],
        createdAt: new Date().toISOString(),
      };
      setGoals((prev) => [newGoal, ...prev]);
    },
    [setGoals]
  );

  const toggleStep = useCallback((goalId: string, stepId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              steps: g.steps.map((s) =>
                s.id === stepId ? { ...s, completed: !s.completed } : s
              ),
            }
          : g
      )
    );
  }, [setGoals]);

  const addReflection = useCallback((goalId: string, text: string) => {
    const reflection: GoalReflection = {
      id: crypto.randomUUID(),
      text,
      date: new Date().toISOString(),
    };
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, reflections: [reflection, ...g.reflections] }
          : g
      )
    );
  }, [setGoals]);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, [setGoals]);

  const getProgress = (goal: Goal) => {
    if (goal.steps.length === 0) return 0;
    return Math.round(
      (goal.steps.filter((s) => s.completed).length / goal.steps.length) * 100
    );
  };

  return { goals, addGoal, toggleStep, addReflection, deleteGoal, getProgress };
};
