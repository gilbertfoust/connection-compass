import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Trash2, DollarSign } from 'lucide-react';
import { useState } from 'react';
import BudgetSummary from './BudgetSummary';
import BudgetItemRow from './BudgetItemRow';
import AddBudgetItemForm from './AddBudgetItemForm';
import BudgetCategoryChart from './BudgetCategoryChart';
import type { Budget, BudgetItem } from '@/types/budget';

interface BudgetDashboardProps {
  budget: Budget;
  items: BudgetItem[];
  totalPlanned: number;
  totalActual: number;
  totalSavingsPlanned: number;
  totalSavingsActual: number;
  remaining: number;
  unallocated: number;
  onUpdateIncome: (income: number) => Promise<void>;
  onAddItem: (item: Omit<BudgetItem, 'id' | 'budget_id' | 'couple_id' | 'created_at'>) => Promise<void>;
  onUpdateItem: (id: string, updates: Partial<Pick<BudgetItem, 'planned_amount' | 'actual_amount' | 'name'>>) => void;
  onDeleteItem: (id: string) => void;
  onDeleteBudget: () => void;
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (m: number) => void;
  setSelectedYear: (y: number) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const BudgetDashboard = ({
  budget, items, totalPlanned, totalActual, totalSavingsPlanned, totalSavingsActual,
  remaining, unallocated, onUpdateIncome, onAddItem, onUpdateItem, onDeleteItem, onDeleteBudget,
  selectedMonth, selectedYear, setSelectedMonth, setSelectedYear,
}: BudgetDashboardProps) => {
  const [editingIncome, setEditingIncome] = useState(false);
  const [incomeValue, setIncomeValue] = useState(String(budget.total_income));

  const navigateMonth = (dir: number) => {
    let m = selectedMonth + dir;
    let y = selectedYear;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    setSelectedMonth(m);
    setSelectedYear(y);
  };

  const handleSaveIncome = () => {
    onUpdateIncome(parseFloat(incomeValue) || 0);
    setEditingIncome(false);
  };

  const expenseItems = items.filter((i) => i.type === 'expense');
  const savingsItems = items.filter((i) => i.type === 'savings');

  return (
    <div className="space-y-4">
      {/* Month navigator */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <p className="font-semibold text-foreground text-sm">{MONTHS[selectedMonth - 1]} {selectedYear}</p>
          <p className="text-[10px] text-muted-foreground capitalize">{budget.template} template</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Income edit */}
      <Card>
        <CardContent className="p-3 flex items-center gap-3">
          <DollarSign className="h-4 w-4 text-chart-1 shrink-0" />
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground uppercase">Monthly Income</p>
            {editingIncome ? (
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={incomeValue}
                  onChange={(e) => setIncomeValue(e.target.value)}
                  className="h-7 text-xs w-28"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveIncome()}
                />
                <Button size="sm" onClick={handleSaveIncome} className="h-7 text-xs">Save</Button>
              </div>
            ) : (
              <button onClick={() => { setIncomeValue(String(budget.total_income)); setEditingIncome(true); }}
                className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                ${Number(budget.total_income).toLocaleString()}
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <BudgetSummary
        totalIncome={Number(budget.total_income)}
        totalPlanned={totalPlanned}
        totalActual={totalActual}
        totalSavingsActual={totalSavingsActual}
        remaining={remaining}
        unallocated={unallocated}
      />

      {/* Chart */}
      <BudgetCategoryChart items={items} />

      {/* Expense items */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            📋 Expenses ({expenseItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          {expenseItems.map((item) => (
            <BudgetItemRow key={item.id} item={item} onUpdate={onUpdateItem} onDelete={onDeleteItem} />
          ))}
          {expenseItems.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-3">No expense items yet</p>
          )}
        </CardContent>
      </Card>

      {/* Savings items */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            💰 Savings ({savingsItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          {savingsItems.map((item) => (
            <BudgetItemRow key={item.id} item={item} onUpdate={onUpdateItem} onDelete={onDeleteItem} />
          ))}
          {savingsItems.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-3">No savings items yet</p>
          )}
        </CardContent>
      </Card>

      {/* Add new item */}
      <AddBudgetItemForm onAdd={onAddItem} />

      {/* Delete budget */}
      <div className="pt-2">
        <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive text-xs" onClick={onDeleteBudget}>
          <Trash2 className="h-3 w-3 mr-1.5" /> Delete This Budget
        </Button>
      </div>
    </div>
  );
};

export default BudgetDashboard;
