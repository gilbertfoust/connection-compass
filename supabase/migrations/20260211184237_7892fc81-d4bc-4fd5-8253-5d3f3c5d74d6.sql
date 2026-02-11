
-- Make the vision-images bucket private
UPDATE storage.buckets SET public = false WHERE id = 'vision-images';

-- Drop existing permissive storage policies for vision-images
DROP POLICY IF EXISTS "Vision images are publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload vision images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own vision images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own vision images" ON storage.objects;

-- Couple-scoped SELECT policy
CREATE POLICY "Couple members can view vision images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'vision-images' AND
    public.get_user_couple_id(auth.uid())::text = ANY(string_to_array(name, '/'))
  );

-- Couple-scoped INSERT policy
CREATE POLICY "Couple members can upload vision images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'vision-images' AND
    public.get_user_couple_id(auth.uid())::text = ANY(string_to_array(name, '/'))
  );

-- Couple-scoped UPDATE policy
CREATE POLICY "Couple members can update vision images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'vision-images' AND
    public.get_user_couple_id(auth.uid())::text = ANY(string_to_array(name, '/'))
  );

-- Couple-scoped DELETE policy
CREATE POLICY "Couple members can delete vision images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'vision-images' AND
    public.get_user_couple_id(auth.uid())::text = ANY(string_to_array(name, '/'))
  );
