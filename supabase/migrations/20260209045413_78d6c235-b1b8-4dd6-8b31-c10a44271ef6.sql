
-- Create trigger_profiles table for storing emotional triggers and childhood patterns
CREATE TABLE public.trigger_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  couple_id UUID NOT NULL,
  
  -- Core trigger areas (stored as JSONB arrays of strings)
  emotional_triggers JSONB NOT NULL DEFAULT '[]'::jsonb,
  childhood_triggers JSONB NOT NULL DEFAULT '[]'::jsonb,
  hangups JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Deeper context
  conflict_style TEXT NOT NULL DEFAULT '',
  stress_response TEXT NOT NULL DEFAULT '',
  needs_when_triggered TEXT NOT NULL DEFAULT '',
  misread_signals TEXT NOT NULL DEFAULT '',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.trigger_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own trigger profile
CREATE POLICY "Users can view own trigger profile"
ON public.trigger_profiles
FOR SELECT
USING (user_id = auth.uid());

-- Users can view partner's trigger profile (same couple)
CREATE POLICY "Users can view partner trigger profile"
ON public.trigger_profiles
FOR SELECT
USING (couple_id IS NOT NULL AND couple_id = get_user_couple_id(auth.uid()));

-- Users can insert their own trigger profile
CREATE POLICY "Users can insert own trigger profile"
ON public.trigger_profiles
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own trigger profile
CREATE POLICY "Users can update own trigger profile"
ON public.trigger_profiles
FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own trigger profile
CREATE POLICY "Users can delete own trigger profile"
ON public.trigger_profiles
FOR DELETE
USING (user_id = auth.uid());

-- Updated_at trigger
CREATE TRIGGER update_trigger_profiles_updated_at
BEFORE UPDATE ON public.trigger_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
