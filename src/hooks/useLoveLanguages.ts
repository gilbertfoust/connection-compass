import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { LoveLanguageResult, LoveLanguageKey } from '@/data/loveLanguages';

export const useLoveLanguages = () => {
  const { user, coupleId } = useAuth();
  const [myResult, setMyResult] = useState<LoveLanguageResult | null>(null);
  const [partnerResult, setPartnerResult] = useState<LoveLanguageResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    // Fetch all love language results the user can see (own + partner via RLS)
    const { data, error } = await supabase
      .from('love_languages')
      .select('*');

    if (error) {
      console.error('Error fetching love languages:', error);
      setLoading(false);
      return;
    }

    const results = (data || []) as unknown as LoveLanguageResult[];
    const mine = results.find((r) => r.user_id === user.id) || null;
    const partner = results.find((r) => r.user_id !== user.id) || null;

    setMyResult(mine);
    setPartnerResult(partner);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Real-time updates
  useEffect(() => {
    if (!coupleId) return;
    const channel = supabase
      .channel('love-languages-realtime')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'love_languages',
        filter: `couple_id=eq.${coupleId}`,
      }, () => fetchResults())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [coupleId, fetchResults]);

  const saveResult = useCallback(async (scores: Record<LoveLanguageKey, number>) => {
    if (!user || !coupleId) {
      toast({ title: 'Link a partner first', variant: 'destructive' });
      return;
    }

    // Determine primary and secondary
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const primary = sorted[0][0];
    const secondary = sorted[1][0];

    const payload = {
      user_id: user.id,
      couple_id: coupleId,
      ...scores,
      primary_language: primary,
      secondary_language: secondary,
      updated_at: new Date().toISOString(),
    };

    // Upsert based on user_id uniqueness
    if (myResult) {
      const { error } = await supabase
        .from('love_languages')
        .update(payload)
        .eq('id', myResult.id);
      if (error) {
        toast({ title: 'Error saving results', description: error.message, variant: 'destructive' });
        return;
      }
    } else {
      const { error } = await supabase
        .from('love_languages')
        .insert(payload);
      if (error) {
        toast({ title: 'Error saving results', description: error.message, variant: 'destructive' });
        return;
      }
    }

    toast({ title: 'Love languages saved! 💕' });
    await fetchResults();
  }, [user, coupleId, myResult, fetchResults]);

  const resetQuiz = useCallback(async () => {
    if (!myResult) return;
    const { error } = await supabase
      .from('love_languages')
      .delete()
      .eq('id', myResult.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setMyResult(null);
    toast({ title: 'Quiz reset — take it again anytime!' });
  }, [myResult]);

  return { myResult, partnerResult, loading, saveResult, resetQuiz, refetch: fetchResults };
};
