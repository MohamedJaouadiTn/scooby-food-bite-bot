import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard } from '@/components/admin/StatCard';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductTable } from '@/components/admin/ProductTable';
import { Package, Users, ShoppingCart, DollarSign, LogOut, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ProductFormData } from '@/lib/validations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  total_products: number;
  total_customers: number;
  total_orders: number;
  total_sales: number;
}

interface Product {
  id: string;
  product_id: string;
  name: string;
  french_name: string;
  price: number;
  category: string;
  image_url: string | null;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_price: number;
  status: string;
  created_at: string;
  items: any[];
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    total_products: 0,
    total_customers: 0,
    total_orders: 0,
    total_sales: 0
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    subscribeToChanges();
  }, []);

  const subscribeToChanges = () => {
    // Subscribe to products changes
    const productsChannel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        loadProducts();
        loadStats();
      })
      .subscribe();

    // Subscribe to orders changes
    const ordersChannel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders();
        loadStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(ordersChannel);
    };
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    await Promise.all([
      loadStats(),
      loadProducts(),
      loadOrders(),
      loadCustomers()
    ]);
    setIsLoading(false);
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_dashboard_stats');
      if (error) throw error;
      setStats(data as unknown as DashboardStats);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error loading products:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setOrders((data || []) as Order[]);
    } catch (error: any) {
      console.error('Error loading orders:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (error: any) {
      console.error('Error loading customers:', error);
    }
  };

  const handleAddProduct = async (data: ProductFormData) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          product_id: data.product_id,
          name: data.name,
          french_name: data.french_name,
          price: data.price,
          category: data.category,
          image_url: data.image_url || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      await loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          product_id: data.product_id,
          name: data.name,
          french_name: data.french_name,
          price: data.price,
          category: data.category,
          image_url: data.image_url || null
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      setEditingProduct(null);
      await loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      await loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Scooby Food Admin</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Products"
            value={stats.total_products}
            icon={Package}
            description="Active menu items"
          />
          <StatCard
            title="Total Customers"
            value={stats.total_customers}
            icon={Users}
            description="Registered customers"
          />
          <StatCard
            title="Total Orders"
            value={stats.total_orders}
            icon={ShoppingCart}
            description="All time orders"
          />
          <StatCard
            title="Total Sales"
            value={`${stats.total_sales.toFixed(3)} TND`}
            icon={DollarSign}
            description="Confirmed orders only"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <ProductForm
                  onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                  initialData={editingProduct ? {
                    product_id: editingProduct.product_id,
                    name: editingProduct.name,
                    french_name: editingProduct.french_name,
                    price: editingProduct.price,
                    category: editingProduct.category as 'mlawi' | 'chapati' | 'tacos' | 'drinks',
                    image_url: editingProduct.image_url || ''
                  } : undefined}
                  onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
                />
              </div>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Products List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProductTable
                      products={products}
                      onEdit={setEditingProduct}
                      onDelete={handleDeleteProduct}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}</TableCell>
                        <TableCell>{order.customer_name}</TableCell>
                        <TableCell>{order.customer_phone}</TableCell>
                        <TableCell>{order.total_price.toFixed(3)} TND</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.address || 'N/A'}</TableCell>
                        <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
