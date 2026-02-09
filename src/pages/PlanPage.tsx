import { ClipboardList, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TodoSection from '@/components/plan/TodoSection';
import GoalSection from '@/components/plan/GoalSection';

const PlanPage = () => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="todos" className="gap-1.5 text-xs">
            <ClipboardList className="h-3.5 w-3.5" />
            To-Do List
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-1.5 text-xs">
            <Target className="h-3.5 w-3.5" />
            Goals
          </TabsTrigger>
        </TabsList>
        <TabsContent value="todos" className="mt-4">
          <TodoSection />
        </TabsContent>
        <TabsContent value="goals" className="mt-4">
          <GoalSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanPage;
