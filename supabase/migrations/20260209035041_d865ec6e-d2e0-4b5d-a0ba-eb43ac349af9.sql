
-- Create storage bucket for vision board images
INSERT INTO storage.buckets (id, name, public)
VALUES ('vision-images', 'vision-images', true);

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload vision images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'vision-images');

-- Allow public read access (images are displayed publicly within the couple)
CREATE POLICY "Vision images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vision-images');

-- Allow users to update their own uploads
CREATE POLICY "Users can update own vision images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'vision-images');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own vision images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'vision-images');

-- Enable realtime on shared data tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.goals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vision_items;
