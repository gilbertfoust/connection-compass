
-- ╔══════════════════════════════════════════╗
-- ║  COUPLES & PROFILES                      ║
-- ╚══════════════════════════════════════════╝

-- Couples table (shared unit between two partners)
CREATE TABLE public.couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  couple_id UUID REFERENCES public.couples(id) ON DELETE SET NULL,
  invite_code TEXT UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function: get the couple_id for a user (SECURITY DEFINER to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_couple_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT couple_id FROM public.profiles WHERE user_id = _user_id
$$;

-- Couples RLS: users can see their own couple
CREATE POLICY "Users can view own couple"
  ON public.couples FOR SELECT
  USING (id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Authenticated users can create couples"
  ON public.couples FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Profiles RLS
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view partner profile"
  ON public.profiles FOR SELECT
  USING (couple_id IS NOT NULL AND couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ╔══════════════════════════════════════════╗
-- ║  SHARED DATA TABLES                      ║
-- ╚══════════════════════════════════════════╝

-- Todos
CREATE TABLE public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'personal',
  completed BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view couple todos"
  ON public.todos FOR SELECT
  USING (couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can insert couple todos"
  ON public.todos FOR INSERT
  WITH CHECK (couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can update couple todos"
  ON public.todos FOR UPDATE
  USING (couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can delete couple todos"
  ON public.todos FOR DELETE
  USING (couple_id = public.get_user_couple_id(auth.uid()));

-- Goals
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  target_date TEXT,
  milestones JSONB DEFAULT '[]'::jsonb,
  reflections JSONB DEFAULT '[]'::jsonb,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view couple goals"
  ON public.goals FOR SELECT
  USING (couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can insert couple goals"
  ON public.goals FOR INSERT
  WITH CHECK (couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can update couple goals"
  ON public.goals FOR UPDATE
  USING (couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can delete couple goals"
  ON public.goals FOR DELETE
  USING (couple_id = public.get_user_couple_id(auth.uid()));

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Calendar Events
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  category TEXT NOT NULL DEFAULT 'custom',
  description TEXT,
  recurring TEXT DEFAULT 'none',
  conversation_prompt TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view couple calendar events"
  ON public.calendar_events FOR SELECT
  USING (couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can insert couple calendar events"
  ON public.calendar_events FOR INSERT
  WITH CHECK (couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can update couple calendar events"
  ON public.calendar_events FOR UPDATE
  USING (couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can delete couple calendar events"
  ON public.calendar_events FOR DELETE
  USING (couple_id = public.get_user_couple_id(auth.uid()));

-- Vision Items
CREATE TABLE public.vision_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  timeframe TEXT NOT NULL DEFAULT '1-year',
  image_url TEXT,
  color TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vision_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view couple vision items"
  ON public.vision_items FOR SELECT
  USING (couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can insert couple vision items"
  ON public.vision_items FOR INSERT
  WITH CHECK (couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can update couple vision items"
  ON public.vision_items FOR UPDATE
  USING (couple_id = public.get_user_couple_id(auth.uid()));

CREATE POLICY "Users can delete couple vision items"
  ON public.vision_items FOR DELETE
  USING (couple_id = public.get_user_couple_id(auth.uid()));

-- ╔══════════════════════════════════════════╗
-- ║  PARTNER LINKING FUNCTION                ║
-- ╚══════════════════════════════════════════╝

CREATE OR REPLACE FUNCTION public.link_partner(partner_invite_code TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_profile RECORD;
  partner_profile RECORD;
  new_couple_id UUID;
BEGIN
  -- Get current user's profile
  SELECT * INTO current_user_profile FROM public.profiles WHERE user_id = auth.uid();
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;

  -- Check if already linked
  IF current_user_profile.couple_id IS NOT NULL THEN
    RETURN json_build_object('success', false, 'error', 'You are already linked to a partner');
  END IF;

  -- Find partner by invite code
  SELECT * INTO partner_profile FROM public.profiles WHERE invite_code = partner_invite_code;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid invite code');
  END IF;

  -- Can't link to yourself
  IF partner_profile.user_id = auth.uid() THEN
    RETURN json_build_object('success', false, 'error', 'Cannot link to yourself');
  END IF;

  -- If partner already has a couple, join it
  IF partner_profile.couple_id IS NOT NULL THEN
    UPDATE public.profiles SET couple_id = partner_profile.couple_id WHERE user_id = auth.uid();
    RETURN json_build_object('success', true, 'couple_id', partner_profile.couple_id, 'partner_name', partner_profile.display_name);
  END IF;

  -- Create new couple
  INSERT INTO public.couples DEFAULT VALUES RETURNING id INTO new_couple_id;

  -- Link both profiles
  UPDATE public.profiles SET couple_id = new_couple_id WHERE user_id = auth.uid();
  UPDATE public.profiles SET couple_id = new_couple_id WHERE user_id = partner_profile.user_id;

  RETURN json_build_object('success', true, 'couple_id', new_couple_id, 'partner_name', partner_profile.display_name);
END;
$$;
