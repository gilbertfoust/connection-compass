import { Compass, HeartHandshake, ShieldAlert, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { PartnerRequiredState } from '@/components/ui/StateView';
import InsightCenterPage from './InsightCenterPage';
import LoveLanguagesPage from './LoveLanguagesPage';
import TriggersPage from './TriggersPage';
import VisionBoardPage from './VisionBoardPage';

const InsightPage = () => {
  const { coupleId } = useAuth();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Insight</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Reflect, understand, and dream together
        </p>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights" className="gap-1 text-[10px] sm:text-xs px-1">
            <Compass className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Insights</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
          <TabsTrigger value="love" className="gap-1 text-[10px] sm:text-xs px-1">
            <HeartHandshake className="h-3.5 w-3.5" />
            Love
          </TabsTrigger>
          <TabsTrigger value="triggers" className="gap-1 text-[10px] sm:text-xs px-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Triggers</span>
            <span className="sm:hidden">Trig</span>
          </TabsTrigger>
          <TabsTrigger value="vision" className="gap-1 text-[10px] sm:text-xs px-1">
            <Eye className="h-3.5 w-3.5" />
            Vision
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-4">
          <InsightCenterPage />
        </TabsContent>
        <TabsContent value="love" className="mt-4">
          {coupleId ? (
            <LoveLanguagesPage />
          ) : (
            <PartnerRequiredState
              feature="Love Languages"
              description="Take the love language quiz together to discover how you each give and receive love."
            />
          )}
        </TabsContent>
        <TabsContent value="triggers" className="mt-4">
          {coupleId ? (
            <TriggersPage />
          ) : (
            <PartnerRequiredState
              feature="Triggers & Understanding"
              description="Map your emotional triggers together to navigate conflict with care."
            />
          )}
        </TabsContent>
        <TabsContent value="vision" className="mt-4">
          {coupleId ? (
            <VisionBoardPage />
          ) : (
            <PartnerRequiredState
              feature="Vision Board"
              description="Build a shared vision for your future together — dreams, goals, and aspirations."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightPage;
