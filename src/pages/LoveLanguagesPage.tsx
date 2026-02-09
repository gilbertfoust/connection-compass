import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLoveLanguages } from '@/hooks/useLoveLanguages';
import { useAuth } from '@/contexts/AuthContext';
import { PartnerRequiredState } from '@/components/ui/StateView';
import LoveLanguageQuiz from '@/components/lovelanguage/LoveLanguageQuiz';
import LoveLanguageResults from '@/components/lovelanguage/LoveLanguageResults';
import PartnerComparison from '@/components/lovelanguage/PartnerComparison';

const LoveLanguagesPage = () => {
  const { myResult, partnerResult, loading, saveResult, resetQuiz } = useLoveLanguages();
  const { profile, coupleId } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!coupleId) {
    return <PartnerRequiredState feature="Love Languages" />;
  }

  const myName = profile?.display_name || 'You';

  if (!myResult) {
    return (
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-accent/30 text-center">
          <p className="text-2xl mb-2">💕</p>
          <p className="text-sm font-medium text-foreground">Take the Love Languages Quiz</p>
          <p className="text-xs text-muted-foreground mt-1">
            Answer 10 quick questions to discover your primary love language
          </p>
        </div>
        <LoveLanguageQuiz onComplete={(scores) => saveResult(scores)} />
      </div>
    );
  }

  return (
    <Tabs defaultValue={partnerResult ? 'compare' : 'mine'} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="mine" className="text-xs">My Results</TabsTrigger>
        <TabsTrigger value="compare" className="text-xs" disabled={!partnerResult}>
          Compare
        </TabsTrigger>
        <TabsTrigger value="partner" className="text-xs" disabled={!partnerResult}>
          Partner
        </TabsTrigger>
      </TabsList>

      <TabsContent value="mine" className="mt-4 space-y-3">
        <LoveLanguageResults result={myResult} label={myName} />
        <Button
          variant="ghost"
          size="sm"
          onClick={resetQuiz}
          className="w-full text-xs text-muted-foreground"
        >
          <RefreshCw className="h-3 w-3 mr-1.5" />
          Retake Quiz
        </Button>
      </TabsContent>

      <TabsContent value="compare" className="mt-4">
        {partnerResult ? (
          <PartnerComparison
            myResult={myResult}
            partnerResult={partnerResult}
            myName={myName}
            partnerName="Partner"
          />
        ) : (
          <div className="p-6 rounded-xl bg-accent/30 text-center">
            <p className="text-2xl mb-2">⏳</p>
            <p className="text-sm font-medium text-foreground">Waiting for your partner</p>
            <p className="text-xs text-muted-foreground mt-1">
              Ask them to take the quiz too — you'll see your comparison here!
            </p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="partner" className="mt-4">
        {partnerResult ? (
          <LoveLanguageResults result={partnerResult} label="Partner" />
        ) : (
          <div className="p-6 rounded-xl bg-accent/30 text-center">
            <p className="text-sm text-muted-foreground">Partner hasn't taken the quiz yet</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default LoveLanguagesPage;
