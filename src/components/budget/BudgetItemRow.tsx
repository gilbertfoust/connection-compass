import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { CATEGORY_ICONS } from '@/types/budget';
import type { BudgetItem } from '@/types/budget';

interface BudgetItemRowProps {
  item: BudgetItem;
  onUpdate: (id: string, updates: Partial<Pick<BudgetItem, 'planned_amount' | 'actual_amount' | 'name'>>) => void;
  onDelete: (id: string) => void;
}

const BudgetItemRow = ({ item, onUpdate, onDelete }: BudgetItemRowProps) => {
  const [planned, setPlanned] = useState(String(item.planned_amount || ''));
  const [actual, setActual] = useState(String(item.actual_amount || ''));
  const icon = CATEGORY_ICONS[item.category] || '📌';

  const diff = Number(planned || 0) - Number(actual || 0);

  const handleBlurPlanned = () => {
    const val = parseFloat(planned) || 0;
    if (val !== Number(item.planned_amount)) {
      onUpdate(item.id, { planned_amount: val });
    }
  };

  const handleBlurActual = () => {
    const val = parseFloat(actual) || 0;
    if (val !== Number(item.actual_amount)) {
      onUpdate(item.id, { actual_amount: val });
    }
  };

  const percent = Number(planned || 0) > 0
    ? Math.min((Number(actual || 0) / Number(planned || 0)) * 100, 100)
    : 0;

  return (
    <div className="flex items-center gap-2 py-2 border-b border-border/50 last:border-b-0">
      <span className="text-sm shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
        <div className="w-full bg-muted/50 rounded-full h-1 mt-1">
          <div
            className={`h-1 rounded-full transition-all ${
              percent > 90 ? 'bg-destructive' : percent > 70 ? 'bg-chart-5' : 'bg-primary'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-20">
          <Input
            type="number"
            value={planned}
            onChange={(e) => setPlanned(e.target.value)}
            onBlur={handleBlurPlanned}
            placeholder="Plan"
            className="h-7 text-xs px-1.5 text-center"
          />
        </div>
        <div className="w-20">
          <Input
            type="number"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            onBlur={handleBlurActual}
            placeholder="Actual"
            className="h-7 text-xs px-1.5 text-center"
          />
        </div>
        <span className={`text-[10px] font-mono w-12 text-right ${diff >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
          {diff >= 0 ? '+' : ''}{diff.toFixed(0)}
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(item.id)}>
          <Trash2 className="h-3 w-3 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};

export default BudgetItemRow;
