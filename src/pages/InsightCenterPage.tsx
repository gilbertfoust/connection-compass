import { Compass } from 'lucide-react';
import InsightInput from '@/components/insights/InsightInput';
import InsightResults from '@/components/insights/InsightResults';
import { useConversationAnalysis } from '@/hooks/useConversationAnalysis';

const InsightCenterPage = () => {
  const { analyze, isAnalyzing, result, reset } = useConversationAnalysis();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 mb-3">
          <Compass className="h-4 w-4" />
          <span className="text-xs font-medium">Insight Center</span>
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Personalized for You Two
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us what's going on and we'll match you with the right activities, questions, and prompts.
        </p>
      </div>

      {/* Content */}
      {result ? (
        <InsightResults result={result} onReset={reset} />
      ) : (
        <InsightInput onSubmit={analyze} isLoading={isAnalyzing} />
      )}
    </div>
  );
};

export default InsightCenterPage;
