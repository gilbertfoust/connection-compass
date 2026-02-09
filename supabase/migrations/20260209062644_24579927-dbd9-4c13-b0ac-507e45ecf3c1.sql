
-- Create personal_profiles table for rich profile questionnaire data
-- This stores each user's personal answers privately to feed AI recommendations
CREATE TABLE public.personal_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  couple_id UUID REFERENCES public.couples(id),

  -- Structured personal data (JSONB for flexibility)
  interests JSONB NOT NULL DEFAULT '[]',
  values JSONB NOT NULL DEFAULT '[]',
  communication_style TEXT NOT NULL DEFAULT '',
  relationship_goals TEXT NOT NULL DEFAULT '',
  relationship_strengths JSONB NOT NULL DEFAULT '[]',
  growth_areas JSONB NOT NULL DEFAULT '[]',
  ideal_date TEXT NOT NULL DEFAULT '',
  stress_relief TEXT NOT NULL DEFAULT '',
  appreciation_style TEXT NOT NULL DEFAULT '',
  quality_time_preferences JSONB NOT NULL DEFAULT '[]',
  dreams_and_aspirations TEXT NOT NULL DEFAULT '',

  -- Track completion
  completed BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id)
);

-- Enable RLS - only user can see their own profile (AI uses service_role)
ALTER TABLE public.personal_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own personal profile"
  ON public.personal_profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own personal profile"
  ON public.personal_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own personal profile"
  ON public.personal_profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own personal profile"
  ON public.personal_profiles FOR DELETE
  USING (user_id = auth.uid());

-- Auto-update timestamp
CREATE TRIGGER update_personal_profiles_updated_at
  BEFORE UPDATE ON public.personal_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
