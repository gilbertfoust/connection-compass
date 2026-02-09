import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface PersonalProfile {
  id: string;
  user_id: string;
  couple_id: string | null;
  interests: string[];
  values: string[];
  communication_style: string;
  relationship_goals: string;
  relationship_strengths: string[];
  growth_areas: string[];
  ideal_date: string;
  stress_relief: string;
  appreciation_style: string;
  quality_time_preferences: string[];
  dreams_and_aspirations: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * usePersonalProfile — Private per-user profile data (not shared with partner).
 * Stores questionnaire answers (interests, values, communication style, etc.).
 * RLS ensures only the owner can read/write. Future: AI functions will query
 * this data server-side to personalize suggestions.
 */
export const usePersonalProfile = () => {
  const { user, coupleId } = useAuth();
  const [profile, setProfile] = useState<PersonalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('personal_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as unknown as PersonalProfile);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = async (updates: Partial<PersonalProfile>) => {
    if (!user) return;
    setSaving(true);

    const payload = {
      ...updates,
      user_id: user.id,
      couple_id: coupleId || null,
    };

    if (profile) {
      // Update existing
      const { error } = await supabase
        .from('personal_profiles')
        .update(payload)
        .eq('user_id', user.id);

      if (error) {
        toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
      } else {
        await fetchProfile();
        toast({ title: 'Profile updated ✨' });
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('personal_profiles')
        .insert(payload);

      if (error) {
        toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
      } else {
        await fetchProfile();
        toast({ title: 'Profile saved ✨' });
      }
    }

    setSaving(false);
  };

  return { profile, loading, saving, saveProfile, refetch: fetchProfile };
};
