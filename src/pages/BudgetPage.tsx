import { BarChart3, History } from 'lucide-react';
import { useBudget } from '@/hooks/useBudget';
import { useBudgetHistory } from '@/hooks/useBudgetHistory';
import { LoadingState, PartnerRequiredState } from '@/components/ui/StateView';
import BudgetSetup from '@/components/budget/BudgetSetup';
import BudgetDashboard from '@/components/budget/BudgetDashboard';
import MonthSelector from '@/components/budget/MonthSelector';
import BudgetTrendChart from '@/components/budget/BudgetTrendChart';
import BudgetSpendingBreakdown from '@/components/budget/BudgetSpendingBreakdown';
import BudgetHistoryList from '@/components/budget/BudgetHistoryList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BudgetPage = () => {
  const {
    currentBudget, items, loading, hasCoupleId,
    selectedMonth, selectedYear, setSelectedMonth, setSelectedYear,
    createBudget, updateIncome, addItem, updateItem, deleteItem, deleteBudget,
    totalPlanned, totalActual, totalSavingsPlanned, totalSavingsActual,
    remaining, unallocated,
  } = useBudget();

  const { snapshots, loading: historyLoading } = useBudgetHistory();

  if (loading) return <LoadingState message="Loading budget..." />;

  if (!hasCoupleId) {
    return <PartnerRequiredState feature="Couple Budget" />;
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current" className="text-xs gap-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            Current
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs gap-1.5">
            <History className="h-3.5 w-3.5" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-4">
          {currentBudget ? (
            <BudgetDashboard
              budget={currentBudget}
              items={items}
              totalPlanned={totalPlanned}
              totalActual={totalActual}
              totalSavingsPlanned={totalSavingsPlanned}
              totalSavingsActual={totalSavingsActual}
              remaining={remaining}
              unallocated={unallocated}
              onUpdateIncome={updateIncome}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
              onDeleteBudget={deleteBudget}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
            />
          ) : (
            <>
              <MonthSelector
                month={selectedMonth}
                year={selectedYear}
                setMonth={setSelectedMonth}
                setYear={setSelectedYear}
              />
              <BudgetSetup
                onCreateBudget={createBudget}
                month={selectedMonth}
                year={selectedYear}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-4">
          {historyLoading ? (
            <LoadingState message="Loading history..." />
          ) : (
            <>
              <BudgetTrendChart snapshots={snapshots} />
              <BudgetSpendingBreakdown snapshots={snapshots} />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  📅 All Budgets
                </h3>
                <BudgetHistoryList
                  snapshots={snapshots}
                  onSelectMonth={(m, y) => {
                    setSelectedMonth(m);
                    setSelectedYear(y);
                  }}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetPage;
