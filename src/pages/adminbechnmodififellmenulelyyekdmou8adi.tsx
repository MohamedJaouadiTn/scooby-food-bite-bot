
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Admin password - stored in JS file as requested
const ADMIN_PASSWORD = "ScoobyAdmin2025!";

type Product = {
  id: string;
  name: string;
  frenchName: string;
  price: number;
  category: string;
  image: string;
  ingredients?: string[];
};

const AdminPanel = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    name: "",
    frenchName: "",
    price: 0,
    category: "mlawi",
    image: "",
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Mock function to simulate loading products from storage/API
  const loadProducts = () => {
    const storedProducts = localStorage.getItem('scoobyfood_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Default products if none in storage
      const defaultProducts = [
        { id: "mlawi1", name: "Mlawi with Tuna", frenchName: "Mlawi au thon", price: 3.5, category: "mlawi", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
        { id: "chapati1", name: "Chapati with Tuna", frenchName: "Chapati au thon", price: 7.99, category: "chapati", image: "/lovable-uploads/a9a310a0-a2f6-4a19-ad28-62cc5f6a0bca.png" },
        { id: "chapati2", name: "Regular Chapati", frenchName: "Chapati régulier", price: 5.49, category: "chapati", image: "/lovable-uploads/c92d067b-44d8-4570-bd8e-2bd4927e7fb7.png" },
        { id: "tacos1", name: "Tacos", frenchName: "Tacos", price: 9.99, category: "tacos", image: "/lovable-uploads/7f6ef961-d8a3-4cc3-8a10-943b8487da0b.png" },
      ];
      setProducts(defaultProducts);
      localStorage.setItem('scoobyfood_products', JSON.stringify(defaultProducts));
    }
  };

  useEffect(() => {
    // Check if already logged in via session
    const adminSession = sessionStorage.getItem('scoobyfood_admin_auth');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
      loadProducts();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('scoobyfood_admin_auth', 'true');
      loadProducts();
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('scoobyfood_admin_auth');
    toast({
      title: "Logged Out",
      description: "You have been logged out of the admin panel",
    });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.frenchName || newProduct.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Generate a random ID if not provided
    if (!newProduct.id) {
      newProduct.id = newProduct.category + Date.now().toString();
    }

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('scoobyfood_products', JSON.stringify(updatedProducts));
    
    // Reset form
    setNewProduct({
      id: "",
      name: "",
      frenchName: "",
      price: 0,
      category: "mlawi",
      image: "",
    });
    
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added to the menu`,
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setNewProduct({ ...product });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.frenchName || newProduct.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedProducts = products.map(p => 
      p.id === editingProductId ? newProduct : p
    );
    
    setProducts(updatedProducts);
    localStorage.setItem('scoobyfood_products', JSON.stringify(updatedProducts));
    
    // Reset form and editing state
    setNewProduct({
      id: "",
      name: "",
      frenchName: "",
      price: 0,
      category: "mlawi",
      image: "",
    });
    setEditingProductId(null);
    
    toast({
      title: "Product Updated",
      description: `${newProduct.name} has been updated`,
    });
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('scoobyfood_products', JSON.stringify(updatedProducts));
    
    toast({
      title: "Product Deleted",
      description: "The product has been removed from the menu",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto my-10 p-6 max-w-md bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-primary"
            />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-10 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Scooby Food Admin Panel</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingProductId ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={editingProductId ? handleUpdateProduct : handleAddProduct}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Product ID</label>
              <input
                type="text"
                value={newProduct.id}
                onChange={(e) => setNewProduct({...newProduct, id: e.target.value})}
                placeholder="Auto-generated if empty"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-primary"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name (English)</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-primary"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name (French)</label>
              <input
                type="text"
                value={newProduct.frenchName}
                onChange={(e) => setNewProduct({...newProduct, frenchName: e.target.value})}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-primary"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Price (TND)</label>
              <input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-primary"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-primary"
              >
                <option value="mlawi">Mlawi</option>
                <option value="chapati">Chapati</option>
                <option value="tacos">Tacos</option>
                <option value="sides">Sides</option>
                <option value="drinks">Drinks</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Image URL</label>
              <input
                type="text"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                placeholder="Image path or URL"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-primary"
              />
            </div>
            
            <Button type="submit" className="w-full">
              {editingProductId ? "Update Product" : "Add Product"}
            </Button>
            
            {editingProductId && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => {
                  setEditingProductId(null);
                  setNewProduct({
                    id: "",
                    name: "",
                    frenchName: "",
                    price: 0,
                    category: "mlawi",
                    image: "",
                  });
                }}
              >
                Cancel Edit
              </Button>
            )}
          </form>
        </div>
        
        {/* Products List Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current Menu Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{product.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{product.price.toFixed(3)} TND</td>
                    <td className="px-4 py-3 whitespace-nowrap capitalize">{product.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
