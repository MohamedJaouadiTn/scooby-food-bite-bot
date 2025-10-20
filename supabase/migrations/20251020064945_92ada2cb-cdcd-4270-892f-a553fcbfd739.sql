-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Products table
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text UNIQUE NOT NULL,
  name text NOT NULL,
  french_name text NOT NULL,
  price decimal(10,3) NOT NULL,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User roles table (for admin access control)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Customers table
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  address text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(phone)
);

-- Orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  allergies text,
  items jsonb NOT NULL,
  total_price decimal(10,3) NOT NULL,
  status text DEFAULT 'pending',
  telegram_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = is_admin.user_id
    AND role = 'admin'
  );
$$;

-- Products RLS policies
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- User roles RLS policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Orders RLS policies
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Customers RLS policies
CREATE POLICY "Admins can view all customers"
  ON public.customers FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert customers"
  ON public.customers FOR INSERT
  WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get dashboard statistics
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stats jsonb;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  SELECT jsonb_build_object(
    'total_products', (SELECT COUNT(*) FROM public.products),
    'total_customers', (SELECT COUNT(DISTINCT customer_id) FROM public.orders WHERE customer_id IS NOT NULL),
    'total_orders', (SELECT COUNT(*) FROM public.orders),
    'total_sales', (SELECT COALESCE(SUM(total_price), 0) FROM public.orders WHERE telegram_sent = true)
  ) INTO stats;
  
  RETURN stats;
END;
$$;

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images' 
    AND public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images' 
    AND public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images' 
    AND public.is_admin(auth.uid())
  );

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- Seed initial products from current menu
INSERT INTO public.products (product_id, name, french_name, price, category, image_url) VALUES
  ('mlawi1', 'Mlawi with Tuna', 'Mlawi au thon', 3.500, 'mlawi', '/lovable-uploads/e036f500-7659-4481-8dbb-7fd189e0342a.png'),
  ('mlawi2', 'Special Mlawi with Tuna', 'Mlawi spécial thon', 4.500, 'mlawi', '/lovable-uploads/e036f500-7659-4481-8dbb-7fd189e0342a.png'),
  ('mlawi3', 'Mlawi with Salami', 'Mlawi au salami', 3.500, 'mlawi', '/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png'),
  ('mlawi4', 'Special Mlawi with Salami', 'Mlawi spécial salami', 4.500, 'mlawi', '/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png'),
  ('mlawi5', 'Mlawi with Ham', 'Mlawi au jambon', 4.000, 'mlawi', '/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png'),
  ('chapati1', 'Chapati with Grilled Chicken', 'Chapati escalope grillée', 6.000, 'chapati', '/lovable-uploads/c92d067b-44d8-4570-bd8e-2bd4927e7fb7.png'),
  ('chapati2', 'Chapati with Tuna', 'Chapati au thon', 7.990, 'chapati', '/lovable-uploads/a9a310a0-a2f6-4a19-ad28-62cc5f6a0bca.png'),
  ('chapati3', 'Chapati Cordon Bleu', 'Chapati cordon bleu', 6.500, 'chapati', '/lovable-uploads/c92d067b-44d8-4570-bd8e-2bd4927e7fb7.png'),
  ('tacos1', 'Tacos with Tuna', 'Tacos au thon', 3.500, 'tacos', '/lovable-uploads/7f6ef961-d8a3-4cc3-8a10-943b8487da0b.png'),
  ('tacos2', 'Tacos with Special Tuna', 'Tacos spécial thon', 4.500, 'tacos', '/lovable-uploads/85aba854-be50-4f4f-b700-711a5ba92d9d.png'),
  ('drink1', 'Soda Can', 'Canette', 2.000, 'drinks', '/lovable-uploads/d0cd08a4-4b41-456e-9348-166d9b4e3420.png'),
  ('drink2', 'Water', 'Eau', 1.500, 'drinks', '/lovable-uploads/aecdc132-2508-4edd-b708-436456343d31.png');