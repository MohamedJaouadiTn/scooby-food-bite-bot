-- Fix RLS policies to allow anonymous (unauthenticated) users to insert
-- The previous attempt didn't work because we need to explicitly grant to anon role

-- Drop all existing policies on customers and orders
DROP POLICY IF EXISTS "Anyone can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can view all customers" ON public.customers;
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

-- Create new permissive policies for customers
CREATE POLICY "Anyone can insert customers"
  ON public.customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all customers"
  ON public.customers
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create new permissive policies for orders
CREATE POLICY "Anyone can insert orders"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));