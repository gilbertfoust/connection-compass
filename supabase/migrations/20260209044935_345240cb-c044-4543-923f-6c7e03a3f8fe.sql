
-- Create love_languages table to store quiz results per user
CREATE TABLE public.love_languages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  couple_id UUID NOT NULL,
  words_of_affirmation INTEGER NOT NULL DEFAULT 0,
  acts_of_service INTEGER NOT NULL DEFAULT 0,
  receiving_gifts INTEGER NOT NULL DEFAULT 0,
  quality_time INTEGER NOT NULL DEFAULT 0,
  physical_touch INTEGER NOT NULL DEFAULT 0,
  primary_language TEXT NOT NULL DEFAULT '',
  secondary_language TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.love_languages ENABLE ROW LEVEL SECURITY;

-- Users can view their own love languages
CREATE POLICY "Users can view own love languages"
ON public.love_languages
FOR SELECT
USING (user_id = auth.uid());

-- Users can view their partner's love languages (same couple)
CREATE POLICY "Users can view partner love languages"
ON public.love_languages
FOR SELECT
USING (couple_id IS NOT NULL AND couple_id = get_user_couple_id(auth.uid()));

-- Users can insert their own love languages
CREATE POLICY "Users can insert own love languages"
ON public.love_languages
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own love languages
CREATE POLICY "Users can update own love languages"
ON public.love_languages
FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own love languages
CREATE POLICY "Users can delete own love languages"
ON public.love_languages
FOR DELETE
USING (user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_love_languages_updated_at
BEFORE UPDATE ON public.love_languages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
