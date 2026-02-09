import { MessageCircle, Gamepad2, CalendarHeart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EngagementHub from './EngagementHub';
import ActivitiesPage from './ActivitiesPage';
import DateNightPage from './DateNightPage';

const EngagePage = () => {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Engage</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Talk, play, and connect with each other
        </p>
      </div>

      <Tabs defaultValue="talk" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="talk" className="gap-1 text-xs">
            <MessageCircle className="h-3.5 w-3.5" />
            Talk
          </TabsTrigger>
          <TabsTrigger value="play" className="gap-1 text-xs">
            <Gamepad2 className="h-3.5 w-3.5" />
            Play
          </TabsTrigger>
          <TabsTrigger value="date" className="gap-1 text-xs">
            <CalendarHeart className="h-3.5 w-3.5" />
            Date
          </TabsTrigger>
        </TabsList>

        <TabsContent value="talk" className="mt-4">
          <EngagementHub />
        </TabsContent>
        <TabsContent value="play" className="mt-4">
          <ActivitiesPage />
        </TabsContent>
        <TabsContent value="date" className="mt-4">
          <DateNightPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EngagePage;
