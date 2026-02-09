import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AnalysisResult {
  summary: string;
  themes: string[];
  suggestedActivities: {
    title: string;
    description: string;
    emoji: string;
    reason: string;
  }[];
  conversationStarters: {
    question: string;
    context: string;
  }[];
  reflectionPrompts: string[];
  moodInsight: string;
  focusArea: string;
}

export const useConversationAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyze = async (text: string) => {
    if (text.trim().length < 20) {
      toast({
        title: 'Tell us a bit more',
        description: 'Please share more detail so we can give you meaningful suggestions.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-conversation', {
        body: { conversationText: text },
      });

      if (error) {
        throw new Error(error.message || 'Something went wrong');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult(data as AnalysisResult);
    } catch (err) {
      console.error('Analysis error:', err);
      toast({
        title: 'Couldn\'t process that',
        description: err instanceof Error ? err.message : 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
  };

  return { analyze, isAnalyzing, result, reset };
};
