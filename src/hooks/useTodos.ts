import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Todo, TodoCategory } from '@/types/plan';

export const useTodos = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('tmla-todos', []);

  const addTodo = useCallback((text: string, category: TodoCategory) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      category,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  }, [setTodos]);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, [setTodos]);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, [setTodos]);

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return { todos, addTodo, toggleTodo, deleteTodo, completedCount, totalCount };
};
