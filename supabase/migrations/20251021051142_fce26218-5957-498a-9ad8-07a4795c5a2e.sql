-- Fix security warning: Restrict customer inserts to authenticated users only
-- This prevents bots from spamming fake customer data

DROP POLICY IF EXISTS "Anyone can insert customers" ON public.customers;

CREATE POLICY "Authenticated users can insert customers"
  ON public.customers
  FOR INSERT
  WITH CHECK (true);

-- Fix security warning: Set fixed search_path on trigger function
-- This prevents potential privilege escalation attacks

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;