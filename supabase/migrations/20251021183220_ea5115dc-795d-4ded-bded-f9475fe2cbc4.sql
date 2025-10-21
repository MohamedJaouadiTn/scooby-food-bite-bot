-- Fix RLS policies - they are showing as RESTRICTIVE instead of PERMISSIVE
-- This is blocking all inserts from the anon role

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can view all customers" ON public.customers;
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

-- Create explicitly PERMISSIVE policies for customers
CREATE POLICY "Anyone can insert customers"
  ON public.customers
  AS PERMISSIVE
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all customers"
  ON public.customers
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create explicitly PERMISSIVE policies for orders
CREATE POLICY "Anyone can insert orders"
  ON public.orders
  AS PERMISSIVE
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all orders"
  ON public.orders
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update orders"
  ON public.orders
  AS PERMISSIVE
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));