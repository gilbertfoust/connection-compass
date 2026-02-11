
-- Junction table: tracks all couples a user belongs to
CREATE TABLE public.user_couples (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  couple_id UUID NOT NULL REFERENCES public.couples(id),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, couple_id)
);

ALTER TABLE public.user_couples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memberships"
  ON public.user_couples FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view partner memberships in same couple"
  ON public.user_couples FOR SELECT
  USING (couple_id IN (SELECT couple_id FROM public.user_couples WHERE user_id = auth.uid()));

-- Backfill existing couple relationships
INSERT INTO public.user_couples (user_id, couple_id)
SELECT user_id, couple_id FROM public.profiles WHERE couple_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Replace link_partner: single-use codes, 2-person limit, multi-couple support
CREATE OR REPLACE FUNCTION public.link_partner(partner_invite_code text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_profile RECORD;
  partner_profile RECORD;
  new_couple_id UUID;
  member_count INT;
BEGIN
  -- Get current user's profile
  SELECT * INTO current_user_profile FROM public.profiles WHERE user_id = auth.uid();
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;

  -- Find partner by invite code
  SELECT * INTO partner_profile FROM public.profiles WHERE invite_code = partner_invite_code;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or already-used invite code');
  END IF;

  -- Can't link to yourself
  IF partner_profile.user_id = auth.uid() THEN
    RETURN json_build_object('success', false, 'error', 'Cannot link to yourself');
  END IF;

  -- Check if you're already linked to this partner in any couple
  IF EXISTS (
    SELECT 1 FROM public.user_couples uc1
    JOIN public.user_couples uc2 ON uc1.couple_id = uc2.couple_id
    WHERE uc1.user_id = auth.uid() AND uc2.user_id = partner_profile.user_id
  ) THEN
    RETURN json_build_object('success', false, 'error', 'You are already linked with this partner');
  END IF;

  -- Create a NEW couple for this pair (always fresh)
  INSERT INTO public.couples DEFAULT VALUES RETURNING id INTO new_couple_id;

  -- Add both users to the junction table
  INSERT INTO public.user_couples (user_id, couple_id) VALUES (auth.uid(), new_couple_id);
  INSERT INTO public.user_couples (user_id, couple_id) VALUES (partner_profile.user_id, new_couple_id);

  -- Set this new couple as active for both users
  UPDATE public.profiles SET couple_id = new_couple_id WHERE user_id = auth.uid();
  UPDATE public.profiles SET couple_id = new_couple_id WHERE user_id = partner_profile.user_id;

  -- Invalidate the used invite code and generate a new one for the partner
  UPDATE public.profiles SET invite_code = substr(md5(random()::text), 1, 8) WHERE user_id = partner_profile.user_id;

  RETURN json_build_object('success', true, 'couple_id', new_couple_id, 'partner_name', partner_profile.display_name);
END;
$function$;

-- Function to switch active couple
CREATE OR REPLACE FUNCTION public.switch_active_couple(target_couple_id uuid)
  RETURNS json
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
BEGIN
  -- Verify user is a member of this couple
  IF NOT EXISTS (SELECT 1 FROM public.user_couples WHERE user_id = auth.uid() AND couple_id = target_couple_id) THEN
    RETURN json_build_object('success', false, 'error', 'You are not a member of this couple');
  END IF;

  UPDATE public.profiles SET couple_id = target_couple_id WHERE user_id = auth.uid();

  RETURN json_build_object('success', true);
END;
$function$;

-- Function to get all couples for a user with partner names
CREATE OR REPLACE FUNCTION public.get_user_couples()
  RETURNS json
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
DECLARE
  result json;
BEGIN
  SELECT json_agg(row_to_json(t)) INTO result FROM (
    SELECT 
      uc.couple_id,
      uc.joined_at,
      p.display_name as partner_name,
      (uc.couple_id = (SELECT couple_id FROM public.profiles WHERE user_id = auth.uid())) as is_active
    FROM public.user_couples uc
    JOIN public.user_couples uc2 ON uc.couple_id = uc2.couple_id AND uc2.user_id != auth.uid()
    JOIN public.profiles p ON p.user_id = uc2.user_id
    WHERE uc.user_id = auth.uid()
    ORDER BY uc.joined_at DESC
  ) t;

  RETURN COALESCE(result, '[]'::json);
END;
$function$;
