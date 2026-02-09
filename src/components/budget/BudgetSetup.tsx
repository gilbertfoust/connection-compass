import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BUDGET_TEMPLATES, type BudgetTemplate } from '@/types/budget';

interface BudgetSetupProps {
  onCreateBudget: (template: BudgetTemplate, totalIncome: number) => Promise<void>;
  month: number;
  year: number;
}

const BudgetSetup = ({ onCreateBudget, month, year }: BudgetSetupProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<BudgetTemplate>('standard');
  const [income, setIncome] = useState('');
  const [creating, setCreating] = useState(false);

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  const handleCreate = async () => {
    const incomeNum = parseFloat(income) || 0;
    if (incomeNum <= 0) return;
    setCreating(true);
    await onCreateBudget(selectedTemplate, incomeNum);
    setCreating(false);
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create Budget for {monthName} {year}</CardTitle>
          <CardDescription className="text-xs">Choose a template and enter your combined monthly income</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Combined Monthly Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Budget Template</Label>
            <div className="grid grid-cols-1 gap-2">
              {BUDGET_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.value}
                  onClick={() => setSelectedTemplate(tmpl.value as BudgetTemplate)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedTemplate === tmpl.value
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <span className="text-xl mt-0.5">{tmpl.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tmpl.label}</p>
                    <p className="text-xs text-muted-foreground">{tmpl.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleCreate}
            disabled={creating || !income || parseFloat(income) <= 0}
            className="w-full"
          >
            {creating ? 'Creating...' : 'Create Budget'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSetup;
