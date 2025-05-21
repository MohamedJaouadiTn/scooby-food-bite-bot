
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type MenuItemType = {
  id: string;
  name: string;
  frenchName: string;
  price: number;
  category: string;
  image: string;
};

type ExtraOptionType = {
  id: string;
  name: string;
  frenchName: string;
  price: number;
};

const AdminPanel = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [extraOptions, setExtraOptions] = useState<ExtraOptionType[]>([]);
  const [editItem, setEditItem] = useState<MenuItemType | null>(null);
  const [editExtra, setEditExtra] = useState<ExtraOptionType | null>(null);
  const [activeTab, setActiveTab] = useState('products');
  
  // Initial data loading
  useEffect(() => {
    // Fetch menu items from localStorage or use hardcoded data
    const savedItems = localStorage.getItem('scoobyfoodMenuItems');
    if (savedItems) {
      setMenuItems(JSON.parse(savedItems));
    } else {
      // Use default menu items from the app
      const defaultItems = [
        // Mlawi Category
        {
          id: "mlawi1",
          name: "Mlawi with Tuna",
          frenchName: "Mlawi au thon",
          price: 3.5,
          category: "mlawi",
          image: "/lovable-uploads/e036f500-7659-4481-8dbb-7fd189e0342a.png"
        }, 
        {
          id: "mlawi2",
          name: "Special Mlawi with Tuna",
          frenchName: "Mlawi spécial thon",
          price: 4.5,
          category: "mlawi",
          image: "/lovable-uploads/e036f500-7659-4481-8dbb-7fd189e0342a.png"
        }, 
        {
          id: "mlawi3",
          name: "Mlawi with Salami",
          frenchName: "Mlawi au salami",
          price: 3.5,
          category: "mlawi",
          image: "/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png"
        }, 
        {
          id: "mlawi4",
          name: "Special Mlawi with Salami",
          frenchName: "Mlawi spécial salami",
          price: 4.5,
          category: "mlawi",
          image: "/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png"
        }, 
        {
          id: "mlawi5",
          name: "Mlawi with Ham",
          frenchName: "Mlawi au jambon",
          price: 4.0,
          category: "mlawi",
          image: "/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png"
        },
        // Chapati Category
        {
          id: "chapati1",
          name: "Chapati with Grilled Chicken",
          frenchName: "Chapati escalope grillée",
          price: 6.0,
          category: "chapati",
          image: "/lovable-uploads/c92d067b-44d8-4570-bd8e-2bd4927e7fb7.png"
        }, 
        {
          id: "chapati2",
          name: "Chapati with Tuna",
          frenchName: "Chapati au thon",
          price: 7.99,
          category: "chapati",
          image: "/lovable-uploads/a9a310a0-a2f6-4a19-ad28-62cc5f6a0bca.png"
        }, 
        {
          id: "chapati3",
          name: "Chapati Cordon Bleu",
          frenchName: "Chapati cordon bleu",
          price: 6.5,
          category: "chapati",
          image: "/lovable-uploads/c92d067b-44d8-4570-bd8e-2bd4927e7fb7.png"
        },
        // Tacos Category
        {
          id: "tacos1",
          name: "Tacos with Tuna",
          frenchName: "Tacos au thon",
          price: 3.5,
          category: "tacos",
          image: "/lovable-uploads/7f6ef961-d8a3-4cc3-8a10-943b8487da0b.png"
        }, 
        {
          id: "tacos2",
          name: "Tacos with Special Tuna",
          frenchName: "Tacos spécial thon",
          price: 4.5,
          category: "tacos",
          image: "/lovable-uploads/85aba854-be50-4f4f-b700-711a5ba92d9d.png"
        },
        // Drinks
        {
          id: "drink1",
          name: "Soda Can",
          frenchName: "Canette",
          price: 2.0,
          category: "drinks",
          image: "/lovable-uploads/d0cd08a4-4b41-456e-9348-166d9b4e3420.png"
        }
      ];
      setMenuItems(defaultItems);
      localStorage.setItem('scoobyfoodMenuItems', JSON.stringify(defaultItems));
    }
    
    // Fetch extras from localStorage or use hardcoded data
    const savedExtras = localStorage.getItem('scoobyfoodExtraOptions');
    if (savedExtras) {
      setExtraOptions(JSON.parse(savedExtras));
    } else {
      // Use default extras from the app
      const defaultExtras = [
        {
          id: "extra1",
          name: "Cheddar",
          frenchName: "Cheddar",
          price: 2.5
        }, 
        {
          id: "extra2",
          name: "Mozzarella",
          frenchName: "Mozzarella",
          price: 2.5
        }, 
        {
          id: "extra3",
          name: "French Fries",
          frenchName: "Frites",
          price: 2.0
        }, 
        {
          id: "extra4",
          name: "Water",
          frenchName: "Eau",
          price: 1.5
        }
      ];
      setExtraOptions(defaultExtras);
      localStorage.setItem('scoobyfoodExtraOptions', JSON.stringify(defaultExtras));
    }
  }, []);

  // Handle editing a menu item
  const handleEditItem = (item: MenuItemType) => {
    setEditItem({ ...item });
  };

  // Handle editing an extra option
  const handleEditExtra = (extra: ExtraOptionType) => {
    setEditExtra({ ...extra });
  };

  // Update menu item
  const updateMenuItem = () => {
    if (!editItem) return;
    
    const updatedItems = menuItems.map(item => 
      item.id === editItem.id ? editItem : item
    );
    
    setMenuItems(updatedItems);
    localStorage.setItem('scoobyfoodMenuItems', JSON.stringify(updatedItems));
    setEditItem(null);
    
    toast({
      title: "Success!",
      description: "Menu item updated successfully",
    });
  };

  // Update extra option
  const updateExtraOption = () => {
    if (!editExtra) return;
    
    const updatedExtras = extraOptions.map(extra => 
      extra.id === editExtra.id ? editExtra : extra
    );
    
    setExtraOptions(updatedExtras);
    localStorage.setItem('scoobyfoodExtraOptions', JSON.stringify(updatedExtras));
    setEditExtra(null);
    
    toast({
      title: "Success!",
      description: "Extra option updated successfully",
    });
  };
  
  // Add new menu item
  const addNewMenuItem = () => {
    const newId = `item${Date.now()}`;
    const newItem: MenuItemType = {
      id: newId,
      name: "New Item",
      frenchName: "Nouvel Article",
      price: 0,
      category: "mlawi",
      image: "/lovable-uploads/placeholder.svg"
    };
    
    setMenuItems([...menuItems, newItem]);
    setEditItem(newItem);
  };
  
  // Add new extra option
  const addNewExtra = () => {
    const newId = `extra${Date.now()}`;
    const newExtra: ExtraOptionType = {
      id: newId,
      name: "New Extra",
      frenchName: "Nouveau Supplément",
      price: 0
    };
    
    setExtraOptions([...extraOptions, newExtra]);
    setEditExtra(newExtra);
  };
  
  // Delete menu item
  const deleteMenuItem = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const updatedItems = menuItems.filter(item => item.id !== id);
      setMenuItems(updatedItems);
      localStorage.setItem('scoobyfoodMenuItems', JSON.stringify(updatedItems));
      
      toast({
        title: "Deleted!",
        description: "Menu item removed successfully",
      });
    }
  };
  
  // Delete extra option
  const deleteExtraOption = (id: string) => {
    if (confirm("Are you sure you want to delete this extra option?")) {
      const updatedExtras = extraOptions.filter(extra => extra.id !== id);
      setExtraOptions(updatedExtras);
      localStorage.setItem('scoobyfoodExtraOptions', JSON.stringify(updatedExtras));
      
      toast({
        title: "Deleted!",
        description: "Extra option removed successfully",
      });
    }
  };

  // Group menu items by category for display
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItemType[]>);

  return (
    <div className="admin-panel max-w-7xl mx-auto p-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Scooby Food Admin Panel</h1>
        <p className="text-gray-500">Manage your menu items and extras here</p>
        <div className="mt-4">
          <Link to="/" className="text-blue-600 hover:underline mr-4">Go to Home Page</Link>
          <Link to="/menu" className="text-blue-600 hover:underline">Go to Menu</Link>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Menu Items</TabsTrigger>
          <TabsTrigger value="extras">Extra Options</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Menu Items</h2>
            <Button onClick={addNewMenuItem}>Add New Item</Button>
          </div>

          {editItem && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Edit Menu Item</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name (English)</label>
                      <Input 
                        value={editItem.name} 
                        onChange={(e) => setEditItem({...editItem, name: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Name (French)</label>
                      <Input 
                        value={editItem.frenchName} 
                        onChange={(e) => setEditItem({...editItem, frenchName: e.target.value})} 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price</label>
                      <Input 
                        type="number" 
                        step="0.001"
                        value={editItem.price} 
                        onChange={(e) => setEditItem({...editItem, price: parseFloat(e.target.value)})} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <Select 
                        value={editItem.category} 
                        onValueChange={(value) => setEditItem({...editItem, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mlawi">Mlawi</SelectItem>
                          <SelectItem value="chapati">Chapati</SelectItem>
                          <SelectItem value="tacos">Tacos</SelectItem>
                          <SelectItem value="sides">Sides</SelectItem>
                          <SelectItem value="drinks">Drinks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <Input 
                      value={editItem.image} 
                      onChange={(e) => setEditItem({...editItem, image: e.target.value})}
                    />
                    {editItem.image && (
                      <div className="mt-2">
                        <img 
                          src={editItem.image} 
                          alt={editItem.name} 
                          className="h-24 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
                    <Button onClick={updateMenuItem}>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {Object.keys(groupedMenuItems).map(category => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-medium mb-3 capitalize">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedMenuItems[category].map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.frenchName}</p>
                      <p className="text-sm font-semibold mt-2">{item.price.toFixed(3)} TND</p>
                      <div className="flex justify-between mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditItem(item)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteMenuItem(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="extras" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Extra Options</h2>
            <Button onClick={addNewExtra}>Add New Extra</Button>
          </div>

          {editExtra && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Edit Extra Option</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name (English)</label>
                      <Input 
                        value={editExtra.name} 
                        onChange={(e) => setEditExtra({...editExtra, name: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Name (French)</label>
                      <Input 
                        value={editExtra.frenchName} 
                        onChange={(e) => setEditExtra({...editExtra, frenchName: e.target.value})} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <Input 
                      type="number" 
                      step="0.001"
                      value={editExtra.price} 
                      onChange={(e) => setEditExtra({...editExtra, price: parseFloat(e.target.value)})} 
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setEditExtra(null)}>Cancel</Button>
                    <Button onClick={updateExtraOption}>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {extraOptions.map(extra => (
              <Card key={extra.id}>
                <CardContent className="p-4">
                  <h4 className="font-medium">{extra.name}</h4>
                  <p className="text-sm text-gray-500">{extra.frenchName}</p>
                  <p className="text-sm font-semibold mt-2">{extra.price.toFixed(3)} TND</p>
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditExtra(extra)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteExtraOption(extra.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
