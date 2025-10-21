-- Update customer insertion policy to accurately reflect public access
-- This aligns the policy name with its actual behavior (WITH CHECK true)

DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;

CREATE POLICY "Anyone can insert customers"
  ON public.customers
  FOR INSERT
  WITH CHECK (true);
