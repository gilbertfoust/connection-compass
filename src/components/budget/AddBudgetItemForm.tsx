import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { CATEGORY_ICONS, type BudgetItem } from '@/types/budget';

interface AddBudgetItemFormProps {
  onAdd: (item: Omit<BudgetItem, 'id' | 'budget_id' | 'couple_id' | 'created_at'>) => Promise<void>;
}

const ITEM_TYPES = [
  { value: 'expense', label: 'Expense' },
  { value: 'savings', label: 'Savings' },
] as const;

const AddBudgetItemForm = ({ onAdd }: AddBudgetItemFormProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('other');
  const [type, setType] = useState<'expense' | 'savings'>('expense');
  const [planned, setPlanned] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return;
    await onAdd({
      name: name.trim(),
      category,
      type,
      planned_amount: parseFloat(planned) || 0,
      actual_amount: 0,
    });
    setName('');
    setPlanned('');
  };

  const categories = Object.entries(CATEGORY_ICONS);

  return (
    <div className="flex flex-wrap items-end gap-2 p-3 border border-dashed border-border rounded-xl">
      <div className="flex-1 min-w-[120px]">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          className="h-8 text-xs"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
      </div>
      <div className="w-28">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(([key, emoji]) => (
              <SelectItem key={key} value={key} className="text-xs">
                {emoji} {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-24">
        <Select value={type} onValueChange={(v) => setType(v as 'expense' | 'savings')}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ITEM_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value} className="text-xs">{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-20">
        <Input
          type="number"
          value={planned}
          onChange={(e) => setPlanned(e.target.value)}
          placeholder="$0"
          className="h-8 text-xs"
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
      </div>
      <Button size="sm" onClick={handleAdd} disabled={!name.trim()} className="h-8 px-3">
        <Plus className="h-3.5 w-3.5 mr-1" /> Add
      </Button>
    </div>
  );
};

export default AddBudgetItemForm;
