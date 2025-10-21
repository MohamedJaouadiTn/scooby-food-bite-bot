-- Fix RLS policies for customers and orders tables
-- The existing policies are RESTRICTIVE instead of PERMISSIVE
-- This causes inserts to fail even though WITH CHECK is true

-- Drop existing restrictive INSERT policies
DROP POLICY IF EXISTS "Anyone can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;

-- Create PERMISSIVE policies that actually grant access
CREATE POLICY "Anyone can insert customers"
  ON public.customers
  AS PERMISSIVE
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can insert orders"
  ON public.orders
  AS PERMISSIVE
  FOR INSERT
  WITH CHECK (true);