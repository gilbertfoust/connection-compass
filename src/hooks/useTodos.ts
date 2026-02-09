import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Todo, TodoCategory } from '@/types/plan';
import { toast } from '@/hooks/use-toast';

/**
 * useTodos — Shared couple to-do list.
 * All queries are scoped by couple_id (enforced by RLS via get_user_couple_id).
 * Realtime subscription listens for INSERT/UPDATE/DELETE on the todos table
 * filtered by couple_id, and cleans up the channel on unmount.
 */
export const useTodos = () => {
  const { coupleId, user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapDbTodo = (t: any): Todo => ({
    id: t.id,
    text: t.title,
    completed: t.completed,
    category: t.category as TodoCategory,
    createdAt: t.created_at,
  });

  const fetchTodos = useCallback(async () => {
    if (!coupleId) {
      setTodos([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
      setError(error.message);
    } else {
      setTodos((data || []).map(mapDbTodo));
      setError(null);
    }
    setLoading(false);
  }, [coupleId]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Real-time subscription
  useEffect(() => {
    if (!coupleId) return;

    const channel = supabase
      .channel('todos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos', filter: `couple_id=eq.${coupleId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTodos((prev) => {
              if (prev.some((t) => t.id === (payload.new as any).id)) return prev;
              return [mapDbTodo(payload.new), ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setTodos((prev) =>
              prev.map((t) => (t.id === (payload.new as any).id ? mapDbTodo(payload.new) : t))
            );
          } else if (payload.eventType === 'DELETE') {
            setTodos((prev) => prev.filter((t) => t.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const addTodo = useCallback(async (text: string, category: TodoCategory) => {
    if (!coupleId || !user) {
      toast({ title: 'Link a partner first', description: 'You need to link with a partner before adding shared items.', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('todos').insert({
      couple_id: coupleId,
      title: text,
      category,
      created_by: user.id,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  }, [coupleId, user]);

  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id);
    if (error) console.error('Error toggling todo:', error);
  }, [todos]);

  const deleteTodo = useCallback(async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) console.error('Error deleting todo:', error);
  }, []);

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return { todos, addTodo, toggleTodo, deleteTodo, completedCount, totalCount, loading, error, refetch: fetchTodos };
};
