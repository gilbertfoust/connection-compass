import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TODO_CATEGORIES } from '@/types/plan';
import type { Todo } from '@/types/plan';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const category = TODO_CATEGORIES.find((c) => c.value === todo.category);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/30 group transition-all duration-200 hover:shadow-card">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-tight ${
            todo.completed
              ? 'line-through text-muted-foreground'
              : 'text-card-foreground'
          }`}
        >
          {todo.text}
        </p>
        <Badge variant="secondary" className="text-[10px] mt-1 font-normal">
          {category?.emoji} {category?.label}
        </Badge>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-destructive"
        aria-label="Delete task"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default TodoItem;
