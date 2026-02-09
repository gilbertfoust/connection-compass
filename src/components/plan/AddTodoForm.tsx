import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TODO_CATEGORIES, type TodoCategory } from '@/types/plan';

interface AddTodoFormProps {
  onAdd: (text: string, category: TodoCategory) => void;
}

const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<TodoCategory>('couple');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), category);
      setText('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full gap-1.5 border-dashed"
      >
        <Plus className="h-4 w-4" />
        Add a task
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-xl bg-card border border-border/50 animate-fade-in-up">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        autoFocus
        className="text-sm"
      />
      <Select value={category} onValueChange={(v) => setCategory(v as TodoCategory)}>
        <SelectTrigger className="text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TODO_CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.emoji} {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={!text.trim()}>
          Add
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddTodoForm;
