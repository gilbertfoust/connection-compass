import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { Budget, BudgetItem, BudgetTemplate } from '@/types/budget';
import { BUDGET_TEMPLATES } from '@/types/budget';

/**
 * useBudget — Shared couple budget management.
 * Scoped by couple_id with realtime sync on both budgets and budget_items.
 * Supports template-based budget creation with seeded categories.
 */
export const useBudget = () => {
  const { coupleId, user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const hasCoupleId = !!coupleId;

  // Fetch all budgets
  const fetchBudgets = useCallback(async () => {
    if (!coupleId) { setBudgets([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('couple_id', coupleId)
      .order('year', { ascending: false })
      .order('month', { ascending: false });
    if (error) console.error('Error fetching budgets:', error);
    else setBudgets((data || []) as Budget[]);
    setLoading(false);
  }, [coupleId]);

  // Fetch items for current budget
  const fetchItems = useCallback(async (budgetId: string) => {
    const { data, error } = await supabase
      .from('budget_items')
      .select('*')
      .eq('budget_id', budgetId)
      .order('created_at', { ascending: true });
    if (error) console.error('Error fetching budget items:', error);
    else setItems((data || []) as BudgetItem[]);
  }, []);

  // Find or load current budget for selected month/year
  useEffect(() => {
    if (!coupleId) return;
    fetchBudgets();
  }, [fetchBudgets, coupleId]);

  useEffect(() => {
    const budget = budgets.find(
      (b) => b.month === selectedMonth && b.year === selectedYear
    );
    setCurrentBudget(budget || null);
    if (budget) fetchItems(budget.id);
    else setItems([]);
  }, [budgets, selectedMonth, selectedYear, fetchItems]);

  // Real-time for budgets
  useEffect(() => {
    if (!coupleId) return;
    const channel = supabase
      .channel('budgets-realtime')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'budgets',
        filter: `couple_id=eq.${coupleId}`,
      }, () => { fetchBudgets(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [coupleId, fetchBudgets]);

  // Real-time for budget items
  useEffect(() => {
    if (!currentBudget) return;
    const channel = supabase
      .channel('budget-items-realtime')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'budget_items',
        filter: `budget_id=eq.${currentBudget.id}`,
      }, () => { fetchItems(currentBudget.id); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [currentBudget, fetchItems]);

  const createBudget = useCallback(async (template: BudgetTemplate, totalIncome: number) => {
    if (!coupleId || !user) {
      toast({ title: 'Link a partner first', variant: 'destructive' });
      return;
    }
    // Create budget
    const { data: budget, error } = await supabase
      .from('budgets')
      .insert({
        couple_id: coupleId,
        month: selectedMonth,
        year: selectedYear,
        template,
        total_income: totalIncome,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error creating budget', description: error.message, variant: 'destructive' });
      return;
    }

    // Seed template categories
    const tmpl = BUDGET_TEMPLATES.find((t) => t.value === template);
    if (tmpl && budget) {
      const seedItems = tmpl.categories.map((c) => ({
        budget_id: (budget as Budget).id,
        couple_id: coupleId,
        category: c.category,
        name: c.name,
        planned_amount: 0,
        actual_amount: 0,
        type: c.type,
      }));
      await supabase.from('budget_items').insert(seedItems);
    }

    toast({ title: 'Budget created! 🎉', description: `${template} template for ${selectedMonth}/${selectedYear}` });
    await fetchBudgets();
  }, [coupleId, user, selectedMonth, selectedYear, fetchBudgets]);

  const updateIncome = useCallback(async (income: number) => {
    if (!currentBudget) return;
    const { error } = await supabase
      .from('budgets')
      .update({ total_income: income })
      .eq('id', currentBudget.id);
    if (error) console.error('Error updating income:', error);
  }, [currentBudget]);

  const addItem = useCallback(async (item: Omit<BudgetItem, 'id' | 'budget_id' | 'couple_id' | 'created_at'>) => {
    if (!currentBudget || !coupleId) return;
    const { error } = await supabase.from('budget_items').insert({
      ...item,
      budget_id: currentBudget.id,
      couple_id: coupleId,
    });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
  }, [currentBudget, coupleId]);

  const updateItem = useCallback(async (id: string, updates: Partial<Pick<BudgetItem, 'planned_amount' | 'actual_amount' | 'name'>>) => {
    const { error } = await supabase
      .from('budget_items')
      .update(updates)
      .eq('id', id);
    if (error) console.error('Error updating item:', error);
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase.from('budget_items').delete().eq('id', id);
    if (error) console.error('Error deleting item:', error);
  }, []);

  const deleteBudget = useCallback(async () => {
    if (!currentBudget) return;
    const { error } = await supabase.from('budgets').delete().eq('id', currentBudget.id);
    if (error) console.error('Error deleting budget:', error);
    else {
      setCurrentBudget(null);
      setItems([]);
      toast({ title: 'Budget deleted' });
      fetchBudgets();
    }
  }, [currentBudget, fetchBudgets]);

  // Computed values
  const totalPlanned = items.filter((i) => i.type === 'expense' || i.type === 'savings').reduce((s, i) => s + Number(i.planned_amount), 0);
  const totalActual = items.filter((i) => i.type === 'expense' || i.type === 'savings').reduce((s, i) => s + Number(i.actual_amount), 0);
  const totalSavingsPlanned = items.filter((i) => i.type === 'savings').reduce((s, i) => s + Number(i.planned_amount), 0);
  const totalSavingsActual = items.filter((i) => i.type === 'savings').reduce((s, i) => s + Number(i.actual_amount), 0);
  const remaining = (currentBudget?.total_income || 0) - totalActual;
  const unallocated = (currentBudget?.total_income || 0) - totalPlanned;

  return {
    budgets, currentBudget, items, loading, hasCoupleId,
    selectedMonth, selectedYear, setSelectedMonth, setSelectedYear,
    createBudget, updateIncome, addItem, updateItem, deleteItem, deleteBudget,
    totalPlanned, totalActual, totalSavingsPlanned, totalSavingsActual,
    remaining, unallocated,
  };
};
