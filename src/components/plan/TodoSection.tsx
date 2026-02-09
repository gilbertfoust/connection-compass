import { useState } from 'react';
import { ListChecks, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';
import { useTodos } from '@/hooks/useTodos';
import { TODO_CATEGORIES, type TodoCategory } from '@/types/plan';

const TodoSection = () => {
  const { todos, addTodo, toggleTodo, deleteTodo, completedCount, totalCount } = useTodos();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTodos = filterCategory === 'all'
    ? todos
    : todos.filter((t) => t.category === filterCategory);

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      {totalCount > 0 && (
        <Card className="border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                {completedCount} of {totalCount} done
              </span>
              <span className="text-xs font-semibold text-primary">
                {progressPercent}%
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      {totalCount > 0 && (
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="text-xs h-8 w-auto min-w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {TODO_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Add Form */}
      <AddTodoForm onAdd={addTodo} />

      {/* Todo List */}
      <div className="space-y-2">
        {filteredTodos.length === 0 && totalCount === 0 && (
          <div className="text-center py-8">
            <ListChecks className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No tasks yet. Add your first one above!
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Track personal, couple, and shared responsibilities
            </p>
          </div>
        )}
        {filteredTodos.length === 0 && totalCount > 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No tasks in this category
          </p>
        )}
        {filteredTodos
          .sort((a, b) => Number(a.completed) - Number(b.completed))
          .map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
      </div>
    </div>
  );
};

export default TodoSection;
