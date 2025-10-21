-- Add UPDATE policy for customers table to allow upsert operations
-- The code uses upsert with onConflict which requires UPDATE permission

CREATE POLICY "Anyone can update customers"
  ON public.customers
  AS PERMISSIVE
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);