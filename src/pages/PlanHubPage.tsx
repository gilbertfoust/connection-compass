import { Calendar, DollarSign, ClipboardList, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { PartnerRequiredState } from '@/components/ui/StateView';
import CalendarPage from './CalendarPage';
import BudgetPage from './BudgetPage';
import PlanPage from './PlanPage';
import VisionBoardPage from './VisionBoardPage';

const PlanHubPage = () => {
  const { coupleId } = useAuth();

  if (!coupleId) {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Plan</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize your life together
          </p>
        </div>
        <PartnerRequiredState
          feature="Planning features"
          description="Calendar, Budget, Goals, and Vision Board require a partner link. Share your invite code to get started."
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Plan</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Organize your life together
        </p>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar" className="gap-1 text-[10px] sm:text-xs px-1">
            <Calendar className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Calendar</span>
            <span className="sm:hidden">Cal</span>
          </TabsTrigger>
          <TabsTrigger value="budget" className="gap-1 text-[10px] sm:text-xs px-1">
            <DollarSign className="h-3.5 w-3.5" />
            Budget
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-1 text-[10px] sm:text-xs px-1">
            <ClipboardList className="h-3.5 w-3.5" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="vision" className="gap-1 text-[10px] sm:text-xs px-1">
            <Eye className="h-3.5 w-3.5" />
            Vision
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4">
          <CalendarPage />
        </TabsContent>
        <TabsContent value="budget" className="mt-4">
          <BudgetPage />
        </TabsContent>
        <TabsContent value="goals" className="mt-4">
          <PlanPage />
        </TabsContent>
        <TabsContent value="vision" className="mt-4">
          <VisionBoardPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanHubPage;
