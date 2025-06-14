
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

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
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("products");

  // Load products from storage/API
  const loadProducts = () => {
    const storedProducts = localStorage.getItem('scoobyfood_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Default products if none in storage - now including all menu items
      const defaultProducts = [
        { id: "mlawi1", name: "Mlawi with Tuna", frenchName: "Mlawi au thon", price: 3.5, category: "mlawi", image: "/lovable-uploads/e036f500-7659-4481-8dbb-7fd189e0342a.png" },
        { id: "mlawi2", name: "Special Mlawi with Tuna", frenchName: "Mlawi spécial thon", price: 4.5, category: "mlawi", image: "/lovable-uploads/e036f500-7659-4481-8dbb-7fd189e0342a.png" },
        { id: "mlawi3", name: "Mlawi with Salami", frenchName: "Mlawi au salami", price: 3.5, category: "mlawi", image: "/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png" },
        { id: "mlawi4", name: "Special Mlawi with Salami", frenchName: "Mlawi spécial salami", price: 4.5, category: "mlawi", image: "/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png" },
        { id: "mlawi5", name: "Mlawi with Ham", frenchName: "Mlawi au jambon", price: 4.0, category: "mlawi", image: "/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png" },
        { id: "chapati1", name: "Chapati with Grilled Chicken", frenchName: "Chapati escalope grillée", price: 6.0, category: "chapati", image: "/lovable-uploads/c92d067b-44d8-4570-bd8e-2bd4927e7fb7.png" },
        { id: "chapati2", name: "Chapati with Tuna", frenchName: "Chapati au thon", price: 7.99, category: "chapati", image: "/lovable-uploads/a9a310a0-a2f6-4a19-ad28-62cc5f6a0bca.png" },
        { id: "chapati3", name: "Chapati Cordon Bleu", frenchName: "Chapati cordon bleu", price: 6.5, category: "chapati", image: "/lovable-uploads/c92d067b-44d8-4570-bd8e-2bd4927e7fb7.png" },
        { id: "tacos1", name: "Tacos with Tuna", frenchName: "Tacos au thon", price: 3.5, category: "tacos", image: "/lovable-uploads/7f6ef961-d8a3-4cc3-8a10-943b8487da0b.png" },
        { id: "tacos2", name: "Tacos with Special Tuna", frenchName: "Tacos spécial thon", price: 4.5, category: "tacos", image: "/lovable-uploads/85aba854-be50-4f4f-b700-711a5ba92d9d.png" },
        { id: "drink1", name: "Soda Can", frenchName: "Canette", price: 2.0, category: "drinks", image: "/lovable-uploads/d0cd08a4-4b41-456e-9348-166d9b4e3420.png" },
        { id: "drink2", name: "Water", frenchName: "Eau", price: 1.5, category: "drinks", image: "/lovable-uploads/aecdc132-2508-4edd-b708-436456343d31.png" },
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
    setActiveTab("add-edit");
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
    setActiveTab("products");
    
    toast({
      title: "Product Updated",
      description: `${newProduct.name} has been updated`,
    });
  };

  const handleDeleteProduct = (id: string) => {
    setConfirmDelete(id);
  };

  const confirmDeleteProduct = () => {
    if (!confirmDelete) return;
    
    const updatedProducts = products.filter(p => p.id !== confirmDelete);
    setProducts(updatedProducts);
    localStorage.setItem('scoobyfood_products', JSON.stringify(updatedProducts));
    
    toast({
      title: "Product Deleted",
      description: "The product has been removed from the menu",
    });
    
    setConfirmDelete(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <h1 className="admin-login-title">Scooby Food Admin</h1>
        <form onSubmit={handleLogin} className="admin-form">
          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <button type="submit" className="admin-submit">Login</button>
          <div className="mt-4 text-center">
            <Link to="/menu" className="text-blue-500 hover:underline">Back to Menu</Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1 className="admin-title">Scooby Food Admin Panel</h1>
        <button className="admin-logout" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="admin-tabs">
        <div 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} 
          onClick={() => setActiveTab('products')}
        >
          Products
        </div>
        <div 
          className={`admin-tab ${activeTab === 'add-edit' ? 'active' : ''}`} 
          onClick={() => {
            setActiveTab('add-edit');
            if (editingProductId) {
              setEditingProductId(null);
              setNewProduct({
                id: "",
                name: "",
                frenchName: "",
                price: 0,
                category: "mlawi",
                image: "",
              });
            }
          }}
        >
          {editingProductId ? 'Edit Product' : 'Add New Product'}
        </div>
      </div>
      
      {activeTab === 'products' && (
        <div className="admin-card">
          <h2>Current Menu Items</h2>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>French Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.frenchName}</td>
                    <td>{product.price.toFixed(3)} TND</td>
                    <td className="capitalize">{product.category}</td>
                    <td>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="admin-action-btn admin-edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="admin-action-btn admin-delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'add-edit' && (
        <div className="admin-card">
          <h2>{editingProductId ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={editingProductId ? handleUpdateProduct : handleAddProduct} className="admin-form">
            <div className="admin-form-group">
              <label>Product ID</label>
              <input
                type="text"
                value={newProduct.id}
                onChange={(e) => setNewProduct({...newProduct, id: e.target.value})}
                placeholder="Auto-generated if empty"
              />
            </div>
            
            <div className="admin-form-group">
              <label>Name (English)</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
            </div>
            
            <div className="admin-form-group">
              <label>Name (French)</label>
              <input
                type="text"
                value={newProduct.frenchName}
                onChange={(e) => setNewProduct({...newProduct, frenchName: e.target.value})}
                required
              />
            </div>
            
            <div className="admin-form-group">
              <label>Price (TND)</label>
              <input
                type="number"
                step="0.001"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                required
              />
            </div>
            
            <div className="admin-form-group">
              <label>Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option value="mlawi">Mlawi</option>
                <option value="chapati">Chapati</option>
                <option value="tacos">Tacos</option>
                <option value="drinks">Drinks</option>
              </select>
            </div>
            
            <div className="admin-form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                placeholder="Image path or URL"
              />
            </div>
            
            <button type="submit" className="admin-submit">
              {editingProductId ? "Update Product" : "Add Product"}
            </button>
            
            {editingProductId && (
              <button 
                type="button" 
                className="admin-cancel"
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
                  setActiveTab("products");
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
