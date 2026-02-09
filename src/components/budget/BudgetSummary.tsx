import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

interface BudgetSummaryProps {
  totalIncome: number;
  totalPlanned: number;
  totalActual: number;
  totalSavingsActual: number;
  remaining: number;
  unallocated: number;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

const BudgetSummary = ({
  totalIncome, totalPlanned, totalActual, totalSavingsActual, remaining, unallocated,
}: BudgetSummaryProps) => {
  const spentPercent = totalIncome > 0 ? Math.min((totalActual / totalIncome) * 100, 100) : 0;
  const plannedPercent = totalIncome > 0 ? Math.min((totalPlanned / totalIncome) * 100, 100) : 0;

  const cards = [
    { label: 'Income', value: fmt(totalIncome), icon: Wallet, color: 'text-chart-1' },
    { label: 'Spent', value: fmt(totalActual), icon: TrendingDown, color: 'text-destructive' },
    { label: 'Remaining', value: fmt(remaining), icon: TrendingUp, color: remaining >= 0 ? 'text-chart-2' : 'text-destructive' },
    { label: 'Saved', value: fmt(totalSavingsActual), icon: PiggyBank, color: 'text-chart-3' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-3 flex items-center gap-2.5">
              <div className={`p-2 rounded-xl bg-card ${c.color}`}>
                <c.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{c.label}</p>
                <p className="text-sm font-bold text-foreground">{c.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Planned</span>
            <span className="font-medium text-foreground">{fmt(totalPlanned)} / {fmt(totalIncome)}</span>
          </div>
          <Progress value={plannedPercent} className="h-2" />

          <div className="flex justify-between text-xs mt-2">
            <span className="text-muted-foreground">Spent</span>
            <span className="font-medium text-foreground">{fmt(totalActual)} / {fmt(totalIncome)}</span>
          </div>
          <Progress value={spentPercent} className="h-2" />

          {unallocated > 0 && (
            <p className="text-xs text-chart-5 mt-1">
              💡 {fmt(unallocated)} unallocated — assign it to categories!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;
