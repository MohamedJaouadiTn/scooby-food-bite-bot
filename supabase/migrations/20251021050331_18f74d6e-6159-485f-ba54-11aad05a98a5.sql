-- Fix critical security issue: Restrict telegram_config access to admins only

-- Drop the insecure public read policy
DROP POLICY IF EXISTS "Allow public read access to telegram_config" ON public.telegram_config;

-- Create admin-only read policy
CREATE POLICY "Only admins can read telegram config"
  ON public.telegram_config
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Create admin-only update policy for future configuration changes
CREATE POLICY "Only admins can update telegram config"
  ON public.telegram_config
  FOR UPDATE
  USING (public.is_admin(auth.uid()));