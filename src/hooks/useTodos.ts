import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Todo, TodoCategory } from '@/types/plan';
import { toast } from '@/hooks/use-toast';

export const useTodos = () => {
  const { coupleId, user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

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
    } else {
      setTodos(
        (data || []).map((t: any) => ({
          id: t.id,
          text: t.title,
          completed: t.completed,
          category: t.category as TodoCategory,
          createdAt: t.created_at,
        }))
      );
    }
    setLoading(false);
  }, [coupleId]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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
    } else {
      await fetchTodos();
    }
  }, [coupleId, user, fetchTodos]);

  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id);
    if (error) {
      console.error('Error toggling todo:', error);
    } else {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    }
  }, [todos]);

  const deleteTodo = useCallback(async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) {
      console.error('Error deleting todo:', error);
    } else {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }, []);

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return { todos, addTodo, toggleTodo, deleteTodo, completedCount, totalCount, loading };
};
