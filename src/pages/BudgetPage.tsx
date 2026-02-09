import { DollarSign, BarChart3, History } from 'lucide-react';
import { useBudget } from '@/hooks/useBudget';
import { useBudgetHistory } from '@/hooks/useBudgetHistory';
import BudgetSetup from '@/components/budget/BudgetSetup';
import BudgetDashboard from '@/components/budget/BudgetDashboard';
import MonthSelector from '@/components/budget/MonthSelector';
import BudgetTrendChart from '@/components/budget/BudgetTrendChart';
import BudgetSpendingBreakdown from '@/components/budget/BudgetSpendingBreakdown';
import BudgetHistoryList from '@/components/budget/BudgetHistoryList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BudgetPage = () => {
  const {
    currentBudget, items, loading,
    selectedMonth, selectedYear, setSelectedMonth, setSelectedYear,
    createBudget, updateIncome, addItem, updateItem, deleteItem, deleteBudget,
    totalPlanned, totalActual, totalSavingsPlanned, totalSavingsActual,
    remaining, unallocated,
  } = useBudget();

  const { snapshots, loading: historyLoading } = useBudgetHistory();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Couple Budget
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track spending, set goals, and build financial harmony together
        </p>
      </div>

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
            <div className="flex items-center justify-center py-10">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
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
