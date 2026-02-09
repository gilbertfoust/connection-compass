import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { TriggerProfile, TriggerInsights } from '@/types/triggers';

/**
 * useTriggerProfiles — Per-user trigger profiles, visible to partner via RLS.
 * analyzeInsights() calls the 'analyze-triggers' edge function which uses
 * LOVABLE_API_KEY to get AI insights on how both partners' triggers interact.
 */
export const useTriggerProfiles = () => {
  const { user, coupleId } = useAuth();
  const [myProfile, setMyProfile] = useState<TriggerProfile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<TriggerProfile | null>(null);
  const [insights, setInsights] = useState<TriggerInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchProfiles = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('trigger_profiles')
      .select('*');

    if (error) {
      console.error('Error fetching trigger profiles:', error);
      setLoading(false);
      return;
    }

    const results = (data || []) as unknown as TriggerProfile[];
    setMyProfile(results.find((r) => r.user_id === user.id) || null);
    setPartnerProfile(results.find((r) => r.user_id !== user.id) || null);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  // Real-time
  useEffect(() => {
    if (!coupleId) return;
    const channel = supabase
      .channel('trigger-profiles-realtime')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'trigger_profiles',
        filter: `couple_id=eq.${coupleId}`,
      }, () => fetchProfiles())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [coupleId, fetchProfiles]);

  const saveProfile = useCallback(async (profile: Omit<TriggerProfile, 'id' | 'user_id' | 'couple_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !coupleId) {
      toast({ title: 'Link a partner first', variant: 'destructive' });
      return;
    }

    const payload = {
      user_id: user.id,
      couple_id: coupleId,
      ...profile,
      updated_at: new Date().toISOString(),
    };

    if (myProfile) {
      const { error } = await supabase
        .from('trigger_profiles')
        .update(payload)
        .eq('id', myProfile.id);
      if (error) {
        toast({ title: 'Error saving', description: error.message, variant: 'destructive' });
        return;
      }
    } else {
      const { error } = await supabase
        .from('trigger_profiles')
        .insert(payload);
      if (error) {
        toast({ title: 'Error saving', description: error.message, variant: 'destructive' });
        return;
      }
    }

    toast({ title: 'Trigger profile saved 🧡' });
    await fetchProfiles();
  }, [user, coupleId, myProfile, fetchProfiles]);

  const analyzeInsights = useCallback(async () => {
    if (!myProfile || !partnerProfile) return;
    setAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-triggers', {
        body: { myProfile, partnerProfile },
      });

      if (error) throw error;
      if (data?.error) {
        toast({ title: 'AI Error', description: data.error, variant: 'destructive' });
        setAnalyzing(false);
        return;
      }

      setInsights(data as TriggerInsights);
    } catch (e: any) {
      console.error('Error analyzing triggers:', e);
      toast({ title: 'Error', description: e.message || 'Failed to analyze triggers', variant: 'destructive' });
    }

    setAnalyzing(false);
  }, [myProfile, partnerProfile]);

  const resetProfile = useCallback(async () => {
    if (!myProfile) return;
    const { error } = await supabase.from('trigger_profiles').delete().eq('id', myProfile.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setMyProfile(null);
    setInsights(null);
    toast({ title: 'Profile reset' });
  }, [myProfile]);

  return {
    myProfile, partnerProfile, insights, loading, analyzing,
    saveProfile, analyzeInsights, resetProfile, refetch: fetchProfiles,
  };
};
