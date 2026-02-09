import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CATEGORY_ICONS, type BudgetItem } from '@/types/budget';
import type { ChartConfig } from '@/components/ui/chart';

interface BudgetCategoryChartProps {
  items: BudgetItem[];
}

const chartConfig: ChartConfig = {
  planned: { label: 'Planned', color: 'hsl(var(--chart-3))' },
  actual: { label: 'Actual', color: 'hsl(var(--primary))' },
};

const BudgetCategoryChart = ({ items }: BudgetCategoryChartProps) => {
  const data = items
    .filter((i) => Number(i.planned_amount) > 0 || Number(i.actual_amount) > 0)
    .map((i) => ({
      name: (CATEGORY_ICONS[i.category] || '') + ' ' + i.name.slice(0, 10),
      planned: Number(i.planned_amount),
      actual: Number(i.actual_amount),
    }));

  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">📊 Planned vs Actual</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-3">
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 9 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="planned" fill="var(--color-planned)" radius={[0, 4, 4, 0]} barSize={8} />
            <Bar dataKey="actual" fill="var(--color-actual)" radius={[0, 4, 4, 0]} barSize={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BudgetCategoryChart;
