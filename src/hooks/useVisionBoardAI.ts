import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GeneratedBoard {
  title: string;
  description: string;
  imageUrl: string | null;
  imagePrompt: string;
}

/**
 * useVisionBoardAI — Calls the 'generate-vision-board' edge function.
 * Reads the couple's vision items server-side (via SUPABASE_SERVICE_ROLE_KEY),
 * generates an AI summary + image, and uploads the image to 'vision-images' bucket.
 * Requires LOVABLE_API_KEY and SUPABASE_SERVICE_ROLE_KEY in Supabase secrets.
 */
export const useVisionBoardAI = () => {
  const { coupleId } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBoard, setGeneratedBoard] = useState<GeneratedBoard | null>(null);

  const generateBoard = async () => {
    if (!coupleId) {
      toast({ title: 'Link a partner first', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    setGeneratedBoard(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-vision-board', {
        body: { coupleId },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      setGeneratedBoard({
        title: data.title || 'Your Shared Vision',
        description: data.description || '',
        imageUrl: data.imageUrl || null,
        imagePrompt: data.imagePrompt || '',
      });

      toast({ title: '✨ Vision board created!', description: data.title });
    } catch (err) {
      console.error('Vision board generation error:', err);
      toast({
        title: 'Could not generate vision board',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearBoard = () => setGeneratedBoard(null);

  return { isGenerating, generatedBoard, generateBoard, clearBoard };
};
