import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Budget, BudgetItem } from '@/types/budget';

export interface BudgetSnapshot {
  budget: Budget;
  items: BudgetItem[];
  totalPlanned: number;
  totalActual: number;
  totalSavingsPlanned: number;
  totalSavingsActual: number;
  remaining: number;
  label: string; // e.g. "Jan 2026"
}

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const useBudgetHistory = () => {
  const { coupleId } = useAuth();
  const [snapshots, setSnapshots] = useState<BudgetSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!coupleId) {
      setSnapshots([]);
      setLoading(false);
      return;
    }

    // Fetch all budgets
    const { data: budgets, error: bErr } = await supabase
      .from('budgets')
      .select('*')
      .eq('couple_id', coupleId)
      .order('year', { ascending: true })
      .order('month', { ascending: true });

    if (bErr || !budgets || budgets.length === 0) {
      setSnapshots([]);
      setLoading(false);
      return;
    }

    // Fetch all budget items for this couple
    const { data: allItems, error: iErr } = await supabase
      .from('budget_items')
      .select('*')
      .eq('couple_id', coupleId);

    if (iErr) {
      setSnapshots([]);
      setLoading(false);
      return;
    }

    const itemsByBudget = new Map<string, BudgetItem[]>();
    for (const item of (allItems || []) as BudgetItem[]) {
      const list = itemsByBudget.get(item.budget_id) || [];
      list.push(item);
      itemsByBudget.set(item.budget_id, list);
    }

    const result: BudgetSnapshot[] = (budgets as Budget[]).map((b) => {
      const items = itemsByBudget.get(b.id) || [];
      const totalPlanned = items
        .filter((i) => i.type === 'expense' || i.type === 'savings')
        .reduce((s, i) => s + Number(i.planned_amount), 0);
      const totalActual = items
        .filter((i) => i.type === 'expense' || i.type === 'savings')
        .reduce((s, i) => s + Number(i.actual_amount), 0);
      const totalSavingsPlanned = items
        .filter((i) => i.type === 'savings')
        .reduce((s, i) => s + Number(i.planned_amount), 0);
      const totalSavingsActual = items
        .filter((i) => i.type === 'savings')
        .reduce((s, i) => s + Number(i.actual_amount), 0);

      return {
        budget: b,
        items,
        totalPlanned,
        totalActual,
        totalSavingsPlanned,
        totalSavingsActual,
        remaining: Number(b.total_income) - totalActual,
        label: `${MONTHS_SHORT[b.month - 1]} ${b.year}`,
      };
    });

    setSnapshots(result);
    setLoading(false);
  }, [coupleId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Re-fetch when budgets change
  useEffect(() => {
    if (!coupleId) return;
    const channel = supabase
      .channel('budget-history-realtime')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'budgets',
        filter: `couple_id=eq.${coupleId}`,
      }, () => fetchHistory())
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'budget_items',
        filter: `couple_id=eq.${coupleId}`,
      }, () => fetchHistory())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [coupleId, fetchHistory]);

  return { snapshots, loading, refetch: fetchHistory };
};
