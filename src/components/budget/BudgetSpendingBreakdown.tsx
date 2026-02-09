import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { BudgetSnapshot } from '@/hooks/useBudgetHistory';
import type { ChartConfig } from '@/components/ui/chart';

interface BudgetSpendingBreakdownProps {
  snapshots: BudgetSnapshot[];
}

const chartConfig: ChartConfig = {
  planned: { label: 'Planned', color: 'hsl(var(--chart-3))' },
  actual: { label: 'Actual', color: 'hsl(var(--primary))' },
};

const BudgetSpendingBreakdown = ({ snapshots }: BudgetSpendingBreakdownProps) => {
  if (snapshots.length < 2) return null;

  const data = snapshots.map((s) => ({
    month: s.label,
    planned: s.totalPlanned,
    actual: s.totalActual,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          📊 Planned vs Actual Over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-3">
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="planned" fill="var(--color-planned)" radius={[4, 4, 0, 0]} barSize={14} />
            <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} barSize={14} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BudgetSpendingBreakdown;
