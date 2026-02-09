import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { BudgetSnapshot } from '@/hooks/useBudgetHistory';
import type { ChartConfig } from '@/components/ui/chart';

interface BudgetTrendChartProps {
  snapshots: BudgetSnapshot[];
}

const chartConfig: ChartConfig = {
  income: { label: 'Income', color: 'hsl(var(--chart-1))' },
  spent: { label: 'Spent', color: 'hsl(var(--destructive))' },
  savings: { label: 'Savings', color: 'hsl(var(--chart-3))' },
  remaining: { label: 'Remaining', color: 'hsl(var(--chart-2))' },
};

const fmt = (n: number) => `$${n.toLocaleString()}`;

const BudgetTrendChart = ({ snapshots }: BudgetTrendChartProps) => {
  if (snapshots.length < 2) return null;

  const data = snapshots.map((s) => ({
    month: s.label,
    income: Number(s.budget.total_income),
    spent: s.totalActual,
    savings: s.totalSavingsActual,
    remaining: s.remaining,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          📈 Month-over-Month Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-3">
        <ChartContainer config={chartConfig} className="h-56 w-full">
          <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="var(--color-income)"
              fill="url(#gradIncome)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="spent"
              stroke="var(--color-spent)"
              fill="none"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="var(--color-savings)"
              fill="url(#gradSavings)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        <div className="flex justify-center gap-4 mt-2">
          {Object.entries(chartConfig).slice(0, 3).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
              {cfg.label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetTrendChart;
