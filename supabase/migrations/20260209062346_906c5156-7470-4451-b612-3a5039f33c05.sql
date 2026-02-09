
-- Add gender field to profiles for gender-adaptive theming
ALTER TABLE public.profiles ADD COLUMN gender text;

-- Add check constraint for valid values
ALTER TABLE public.profiles ADD CONSTRAINT profiles_gender_check CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));
