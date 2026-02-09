import { Compass, HeartHandshake, ShieldAlert } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InsightCenterPage from './InsightCenterPage';
import LoveLanguagesPage from './LoveLanguagesPage';
import TriggersPage from './TriggersPage';

const GrowPage = () => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Grow</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Understand yourselves and each other more deeply
        </p>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights" className="gap-1 text-xs">
            <Compass className="h-3.5 w-3.5" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="love" className="gap-1 text-xs">
            <HeartHandshake className="h-3.5 w-3.5" />
            Love
          </TabsTrigger>
          <TabsTrigger value="triggers" className="gap-1 text-xs">
            <ShieldAlert className="h-3.5 w-3.5" />
            Triggers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-4">
          <InsightCenterPage />
        </TabsContent>
        <TabsContent value="love" className="mt-4">
          <LoveLanguagesPage />
        </TabsContent>
        <TabsContent value="triggers" className="mt-4">
          <TriggersPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GrowPage;
