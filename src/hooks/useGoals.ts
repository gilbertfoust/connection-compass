import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Goal, GoalCategory, GoalStep, GoalReflection } from '@/types/plan';
import { toast } from '@/hooks/use-toast';

export const useGoals = () => {
  const { coupleId, user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const mapDbGoal = (g: any): Goal => ({
    id: g.id,
    title: g.title,
    description: g.category, // we store category as the description field equivalent
    category: g.category as GoalCategory,
    steps: Array.isArray(g.milestones) ? g.milestones : [],
    reflections: Array.isArray(g.reflections) ? g.reflections : [],
    createdAt: g.created_at,
  });

  const fetchGoals = useCallback(async () => {
    if (!coupleId) {
      setGoals([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
    } else {
      setGoals((data || []).map(mapDbGoal));
    }
    setLoading(false);
  }, [coupleId]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(
    async (title: string, description: string, category: GoalCategory, steps: string[]) => {
      if (!coupleId || !user) {
        toast({ title: 'Link a partner first', description: 'You need to link with a partner before adding shared items.', variant: 'destructive' });
        return;
      }
      const milestones: GoalStep[] = steps.map((s) => ({
        id: crypto.randomUUID(),
        text: s,
        completed: false,
      }));

      const { error } = await supabase.from('goals').insert({
        couple_id: coupleId,
        title,
        category,
        target_date: null,
        milestones: milestones as any,
        reflections: [] as any,
        created_by: user.id,
      });
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        await fetchGoals();
      }
    },
    [coupleId, user, fetchGoals]
  );

  const toggleStep = useCallback(async (goalId: string, stepId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const updatedSteps = goal.steps.map((s) =>
      s.id === stepId ? { ...s, completed: !s.completed } : s
    );
    const { error } = await supabase
      .from('goals')
      .update({ milestones: updatedSteps as any })
      .eq('id', goalId);
    if (error) {
      console.error('Error toggling step:', error);
    } else {
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, steps: updatedSteps } : g))
      );
    }
  }, [goals]);

  const addReflection = useCallback(async (goalId: string, text: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const reflection: GoalReflection = {
      id: crypto.randomUUID(),
      text,
      date: new Date().toISOString(),
    };
    const updatedReflections = [reflection, ...goal.reflections];
    const { error } = await supabase
      .from('goals')
      .update({ reflections: updatedReflections as any })
      .eq('id', goalId);
    if (error) {
      console.error('Error adding reflection:', error);
    } else {
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, reflections: updatedReflections } : g))
      );
    }
  }, [goals]);

  const deleteGoal = useCallback(async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) {
      console.error('Error deleting goal:', error);
    } else {
      setGoals((prev) => prev.filter((g) => g.id !== id));
    }
  }, []);

  const getProgress = (goal: Goal) => {
    if (goal.steps.length === 0) return 0;
    return Math.round(
      (goal.steps.filter((s) => s.completed).length / goal.steps.length) * 100
    );
  };

  return { goals, addGoal, toggleStep, addReflection, deleteGoal, getProgress, loading };
};
