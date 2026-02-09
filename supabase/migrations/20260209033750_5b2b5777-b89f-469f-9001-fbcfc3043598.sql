
-- Drop the overly permissive INSERT policy
DROP POLICY "Authenticated users can create couples" ON public.couples;

-- The couples table is only created via the link_partner SECURITY DEFINER function,
-- so no direct INSERT policy is needed. But add one scoped to prevent abuse.
CREATE POLICY "Users can create couples during linking"
  ON public.couples FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Only allow if the user doesn't already have a couple
    public.get_user_couple_id(auth.uid()) IS NULL
  );
