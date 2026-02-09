import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { BudgetSnapshot } from '@/hooks/useBudgetHistory';

interface BudgetHistoryListProps {
  snapshots: BudgetSnapshot[];
  onSelectMonth: (month: number, year: number) => void;
  selectedMonth: number;
  selectedYear: number;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

const BudgetHistoryList = ({ snapshots, onSelectMonth, selectedMonth, selectedYear }: BudgetHistoryListProps) => {
  if (snapshots.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-4">
        No budget history yet — create your first budget to start tracking!
      </p>
    );
  }

  // Show in reverse chronological order
  const sorted = [...snapshots].reverse();

  return (
    <div className="space-y-2">
      {sorted.map((snap, idx) => {
        const prevSnap = idx < sorted.length - 1 ? sorted[idx + 1] : null;
        const spentChange = prevSnap ? snap.totalActual - prevSnap.totalActual : 0;
        const savingsChange = prevSnap ? snap.totalSavingsActual - prevSnap.totalSavingsActual : 0;
        const isActive = snap.budget.month === selectedMonth && snap.budget.year === selectedYear;
        const spentPct = Number(snap.budget.total_income) > 0
          ? Math.round((snap.totalActual / Number(snap.budget.total_income)) * 100)
          : 0;

        return (
          <Card
            key={snap.budget.id}
            className={`cursor-pointer transition-all hover:shadow-md ${isActive ? 'ring-2 ring-primary' : ''}`}
            onClick={() => onSelectMonth(snap.budget.month, snap.budget.year)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{snap.label}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{snap.budget.template} template</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{fmt(snap.totalActual)}</p>
                  <p className="text-[10px] text-muted-foreground">of {fmt(Number(snap.budget.total_income))}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-muted/50 rounded-full h-1.5 mt-2">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    spentPct > 90 ? 'bg-destructive' : spentPct > 70 ? 'bg-chart-5' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(spentPct, 100)}%` }}
                />
              </div>

              {/* Comparison badges */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">Spent:</span>
                  <span className="text-[10px] font-medium text-foreground">{spentPct}%</span>
                  {prevSnap && spentChange !== 0 && (
                    <span className={`text-[10px] flex items-center ${spentChange > 0 ? 'text-destructive' : 'text-chart-2'}`}>
                      {spentChange > 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                      {fmt(Math.abs(spentChange))}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">Saved:</span>
                  <span className="text-[10px] font-medium text-foreground">{fmt(snap.totalSavingsActual)}</span>
                  {prevSnap && savingsChange !== 0 && (
                    <span className={`text-[10px] flex items-center ${savingsChange > 0 ? 'text-chart-2' : 'text-destructive'}`}>
                      {savingsChange > 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                      {fmt(Math.abs(savingsChange))}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BudgetHistoryList;
