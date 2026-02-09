import InsightInput from '@/components/insights/InsightInput';
import InsightResults from '@/components/insights/InsightResults';
import { useConversationAnalysis } from '@/hooks/useConversationAnalysis';

const InsightCenterPage = () => {
  const { analyze, isAnalyzing, result, reset } = useConversationAnalysis();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Tell us what's going on and we'll match you with the right activities, questions, and prompts.
      </p>

      {result ? (
        <InsightResults result={result} onReset={reset} />
      ) : (
        <InsightInput onSubmit={analyze} isLoading={isAnalyzing} />
      )}
    </div>
  );
};

export default InsightCenterPage;
