import { RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTriggerProfiles } from '@/hooks/useTriggerProfiles';
import { useAuth } from '@/contexts/AuthContext';
import { PartnerRequiredState } from '@/components/ui/StateView';
import TriggerForm from '@/components/triggers/TriggerForm';
import TriggerProfileView from '@/components/triggers/TriggerProfileView';
import TriggerInsightsView from '@/components/triggers/TriggerInsightsView';

const TriggersPage = () => {
  const {
    myProfile, partnerProfile, insights, loading, analyzing,
    saveProfile, analyzeInsights, resetProfile,
  } = useTriggerProfiles();
  const { profile, coupleId } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!coupleId) {
    return <PartnerRequiredState feature="Triggers & Understanding" />;
  }

  const myName = profile?.display_name || 'You';

  if (!myProfile) {
    return (
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-accent/30 text-center">
          <p className="text-2xl mb-2">🧡</p>
          <p className="text-sm font-medium text-foreground">Share Your Inner World</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            This safe space helps you identify emotional triggers, childhood patterns, and personal hangups 
            that shape how you react in your relationship.
          </p>
        </div>
        <TriggerForm onComplete={saveProfile} />
      </div>
    );
  }

  return (
    <Tabs defaultValue={partnerProfile ? 'insights' : 'mine'} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="mine" className="text-xs">My Profile</TabsTrigger>
        <TabsTrigger value="insights" className="text-xs" disabled={!partnerProfile}>
          Insights
        </TabsTrigger>
        <TabsTrigger value="partner" className="text-xs" disabled={!partnerProfile}>
          Partner
        </TabsTrigger>
      </TabsList>

      <TabsContent value="mine" className="mt-4 space-y-3">
        <TriggerProfileView profile={myProfile} label={myName} />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetProfile}
            className="flex-1 text-xs text-muted-foreground"
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Redo Profile
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="insights" className="mt-4 space-y-3">
        {partnerProfile ? (
          <>
            {!insights && (
              <div className="p-6 rounded-xl bg-accent/30 text-center space-y-3">
                <p className="text-2xl">🔮</p>
                <p className="text-sm font-medium text-foreground">Both profiles complete!</p>
                <p className="text-xs text-muted-foreground">
                  Generate AI-powered insights to understand how your triggers interact.
                </p>
                <Button
                  size="sm"
                  onClick={analyzeInsights}
                  disabled={analyzing}
                  className="text-xs"
                >
                  {analyzing ? (
                    <>
                      <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-1.5" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Generate Insights
                    </>
                  )}
                </Button>
              </div>
            )}
            {insights && (
              <>
                <TriggerInsightsView insights={insights} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={analyzeInsights}
                  disabled={analyzing}
                  className="w-full text-xs text-muted-foreground"
                >
                  {analyzing ? 'Regenerating...' : '🔄 Regenerate Insights'}
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="p-6 rounded-xl bg-accent/30 text-center">
            <p className="text-2xl mb-2">⏳</p>
            <p className="text-sm font-medium text-foreground">Waiting for your partner</p>
            <p className="text-xs text-muted-foreground mt-1">
              Ask them to fill out their trigger profile — insights will appear here once both are complete!
            </p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="partner" className="mt-4">
        {partnerProfile ? (
          <TriggerProfileView profile={partnerProfile} label="Partner" />
        ) : (
          <div className="p-6 rounded-xl bg-accent/30 text-center">
            <p className="text-sm text-muted-foreground">Partner hasn't shared their profile yet</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TriggersPage;
