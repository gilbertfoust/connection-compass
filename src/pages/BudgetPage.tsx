import { DollarSign } from 'lucide-react';
import { useBudget } from '@/hooks/useBudget';
import BudgetSetup from '@/components/budget/BudgetSetup';
import BudgetDashboard from '@/components/budget/BudgetDashboard';
import MonthSelector from '@/components/budget/MonthSelector';

const BudgetPage = () => {
  const {
    currentBudget, items, loading,
    selectedMonth, selectedYear, setSelectedMonth, setSelectedYear,
    createBudget, updateIncome, addItem, updateItem, deleteItem, deleteBudget,
    totalPlanned, totalActual, totalSavingsPlanned, totalSavingsActual,
    remaining, unallocated,
  } = useBudget();

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
    </div>
  );
};

export default BudgetPage;
