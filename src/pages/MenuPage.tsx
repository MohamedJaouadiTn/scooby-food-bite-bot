
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

type FoodOption = {
  id: string;
  name: string;
  price: number;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  options?: FoodOption[];  // Added this property
  totalPrice?: number;     // Added this property
};

type FoodOptionType = {
  id: string;
  name: string;
  frenchName: string;
  price: number;
  category: string;
};

const MenuPage = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCartModal, setShowCartModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showFoodOptionsModal, setShowFoodOptionsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [selectedFoodOptions, setSelectedFoodOptions] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderForm, setOrderForm] = useState({
    name: localStorage.getItem("customerName") || "",
    address: localStorage.getItem("customerAddress") || "",
    phone: localStorage.getItem("customerPhone") || "",
    allergies: localStorage.getItem("customerAllergies") || "",
  });
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [showIngredients, setShowIngredients] = useState<string | null>(null);

  // Telegram Bot Configuration
  const token = "8170617850:AAFJWVcrDKSCaRknRSs_XTj_6epWef8qnjQ";
  const chatId = "7809319602";

  // Menu items data - organized by category
  const menuItems = [
    // Mlawi Category
    { id: "mlawi1", name: "Mlawi with Tuna", frenchName: "Mlawi au thon", price: 3.5, category: "mlawi", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    { id: "mlawi2", name: "Special Mlawi with Tuna", frenchName: "Mlawi spécial thon", price: 4.5, category: "mlawi", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    { id: "mlawi3", name: "Mlawi with Salami", frenchName: "Mlawi au salami", price: 3.5, category: "mlawi", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    { id: "mlawi4", name: "Special Mlawi with Salami", frenchName: "Mlawi spécial salami", price: 4.5, category: "mlawi", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    { id: "mlawi5", name: "Mlawi with Ham", frenchName: "Mlawi au jambon", price: 4.0, category: "mlawi", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    { id: "mlawi6", name: "Special Mlawi with Ham", frenchName: "Mlawi spécial jambon", price: 5.5, category: "mlawi", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    { id: "mlawi7", name: "Mlawi with Tuna & Salami", frenchName: "Mlawi Thon Salami", price: 4.0, category: "mlawi", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    { id: "mlawi8", name: "Mlawi with 4 Cheese & Tuna", frenchName: "Mlawi Thon 4 Fromage", price: 5.5, category: "mlawi", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    { id: "mlawi9", name: "Mlawi with Tuna & Ham", frenchName: "Mlawi thon jambon", price: 4.5, category: "mlawi", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    { id: "mlawi10", name: "Special Mlawi with Cheese", frenchName: "Mlawi spécial Fromage", price: 8.0, category: "mlawi", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },

    // Chapati Category
    { id: "chapati1", name: "Chapati with Grilled Chicken", frenchName: "Chapati escalope grillée", price: 6.0, category: "chapati", image: "/lovable-uploads/a0b46da6-d8b9-474a-9eb4-4721b602592e.png" },
    { id: "chapati2", name: "Chapati with Breaded Chicken", frenchName: "Chapati escalope panée", price: 6.5, category: "chapati", image: "/lovable-uploads/a0b46da6-d8b9-474a-9eb4-4721b602592e.png" },
    { id: "chapati3", name: "Chapati Cordon Bleu", frenchName: "Chapati cordon bleu", price: 6.5, category: "chapati", image: "/lovable-uploads/a0b46da6-d8b9-474a-9eb4-4721b602592e.png" },
    { id: "chapati4", name: "Chapati with Shawarma", frenchName: "Chapati shawarma", price: 7.0, category: "chapati", image: "/lovable-uploads/a0b46da6-d8b9-474a-9eb4-4721b602592e.png" },
    { id: "chapati5", name: "Chapati with Chicken & Shawarma", frenchName: "Chapati mix escalope-shawarma", price: 10.0, category: "chapati", image: "/lovable-uploads/a0b46da6-d8b9-474a-9eb4-4721b602592e.png" },

    // Tacos Category
    { id: "tacos1", name: "Tacos with Tuna", frenchName: "Tacos au thon", price: 3.5, category: "tacos", image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGFjb3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" },
    { id: "tacos2", name: "Tacos with Special Tuna", frenchName: "Tacos spécial thon", price: 4.5, category: "tacos", image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGFjb3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" },
    { id: "tacos3", name: "Tacos with Salami", frenchName: "Tacos au salami", price: 3.5, category: "tacos", image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGFjb3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" },

    // Sides & Drinks
    { id: "side1", name: "Cheddar", frenchName: "Cheddar", price: 2.5, category: "sides", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
    { id: "side2", name: "Mozzarella", frenchName: "Mozzarella", price: 2.5, category: "sides", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
    { id: "side3", name: "French Fries", frenchName: "Frite", price: 2.0, category: "sides", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
    { id: "drink1", name: "Soda Can", frenchName: "Canette", price: 2.0, category: "drinks", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
    { id: "drink2", name: "Water", frenchName: "Eau", price: 1.5, category: "drinks", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
  ];

  // Updated food options that can be added - organized by category
  const foodOptions = [
    // Base options
    { id: "base1", name: "Mlewi", frenchName: "Mlewi", price: 0, category: "base" },
    { id: "base2", name: "Chapati", frenchName: "Chapati", price: 0, category: "base" },
    { id: "base3", name: "Tacos", frenchName: "Tacos", price: 0, category: "base" },
    
    // Filling options
    { id: "fill1", name: "Tuna", frenchName: "Thon", price: 3.5, category: "filling" },
    { id: "fill2", name: "Special Tuna", frenchName: "Spécial Thon", price: 4.5, category: "filling" },
    { id: "fill3", name: "Salami", frenchName: "Salami", price: 3.5, category: "filling" },
    { id: "fill4", name: "Special Salami", frenchName: "Spécial Salami", price: 4.5, category: "filling" },
    { id: "fill5", name: "Ham", frenchName: "Jambon", price: 4.0, category: "filling" },
    { id: "fill6", name: "Special Ham", frenchName: "Spécial Jambon", price: 5.5, category: "filling" },
    { id: "fill7", name: "Tuna & Salami", frenchName: "Thon + Salami", price: 4.0, category: "filling" },
    { id: "fill8", name: "Tuna 4 Cheese", frenchName: "Thon 4 Fromages", price: 5.5, category: "filling" },
    { id: "fill9", name: "Tuna & Ham", frenchName: "Thon + Jambon", price: 4.5, category: "filling" },
    { id: "fill10", name: "Special Cheese", frenchName: "Spécial Fromage", price: 8.0, category: "filling" },
    
    // Meat options
    { id: "meat1", name: "Grilled Chicken", frenchName: "Escalope grillée", price: 6.0, category: "meat" },
    { id: "meat2", name: "Breaded Chicken", frenchName: "Escalope panée", price: 6.5, category: "meat" },
    { id: "meat3", name: "Cordon Bleu", frenchName: "Cordon Bleu", price: 6.5, category: "meat" },
    { id: "meat4", name: "Shawarma", frenchName: "Shawarma", price: 7.0, category: "meat" },
    { id: "meat5", name: "Chicken & Shawarma Mix", frenchName: "Mix Escalope + Shawarma", price: 10.0, category: "meat" },
    
    // Extras
    { id: "extra1", name: "Cheddar", frenchName: "Cheddar", price: 2.5, category: "extra" },
    { id: "extra2", name: "Mozzarella", frenchName: "Mozzarella", price: 2.5, category: "extra" },
    { id: "extra3", name: "French Fries", frenchName: "Frites", price: 2.0, category: "extra" },
    
    // Drinks
    { id: "drink1", name: "Soda Can", frenchName: "Canette", price: 2.0, category: "drink" },
    { id: "drink2", name: "Water", frenchName: "Eau", price: 1.5, category: "drink" },
  ];

  // Get translation function
  const translations = {
    en: {
      home: "Home",
      menu: "Menu",
      about: "About",
      contact: "Contact",
      ourMenu: "Our Menu",
      discoverDishes: "Discover your favorite dishes",
      all: "All",
      mlawi: "Mlawi",
      chapati: "Chapati",
      tacos: "Tacos",
      sides: "Sides",
      drinks: "Drinks",
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      yourCart: "Your Cart",
      emptyCart: "Your cart is empty",
      total: "Total:",
      clearCart: "Clear Cart",
      checkout: "Checkout",
      completeOrder: "Complete Your Order",
      orderSummary: "Order Summary",
      basePrice: "Base Price:",
      customizeOrder: "Customize Your Order",
      foodOptions: "Food Options",
      base: "Base",
      fillings: "Fillings",
      meat: "Meat",
      extras: "Extras",
      name: "Name",
      deliveryAddress: "Delivery Address",
      phoneNumber: "Phone Number",
      allergies: "Allergies or preferences (optional)",
      allergiesInfo: "Use this field to let us know about any allergies or preferences. It's optional!",
      placeOrder: "Place Order",
      orderConfirmed: "Order Confirmed!",
      thankYou: "Thank you for your order. We'll prepare it right away!",
      continueShopping: "Continue Shopping",
      viewIngredients: "View Ingredients",
      ingredients: "Ingredients:",
      quickLinks: "Quick Links",
      followUs: "Follow Us",
      contactUs: "Contact Us",
      copyright: "2023 Scooby Food. All rights reserved.",
      deliciousFood: "Delicious street food for takeaway",
      aboutText: "We are a street food stand offering delicious takeaway food. We don't offer dine-in service, so customers order and enjoy our food at home.",
      noIngredients: "Ingredient information not available for this item.",
      TND: "TND"
    },
    fr: {
      home: "Accueil",
      menu: "Menu",
      about: "À Propos",
      contact: "Contact",
      ourMenu: "Notre Menu",
      discoverDishes: "Découvrez vos plats préférés",
      all: "Tous",
      mlawi: "Mlawi",
      chapati: "Chapati",
      tacos: "Tacos",
      sides: "Accompagnements",
      drinks: "Boissons",
      addToCart: "Ajouter au Panier",
      buyNow: "Acheter",
      yourCart: "Votre Panier",
      emptyCart: "Votre panier est vide",
      total: "Total:",
      clearCart: "Vider le Panier",
      checkout: "Commander",
      completeOrder: "Compléter Votre Commande",
      orderSummary: "Résumé de la Commande",
      basePrice: "Prix de base:",
      customizeOrder: "Personnalisez Votre Commande",
      foodOptions: "Options de Nourriture",
      base: "Base",
      fillings: "Garnitures",
      meat: "Viande",
      extras: "Extras",
      name: "Nom",
      deliveryAddress: "Adresse de Livraison",
      phoneNumber: "Numéro de Téléphone",
      allergies: "Allergies ou préférences (optionnel)",
      allergiesInfo: "Utilisez ce champ pour nous informer de vos allergies ou préférences. C'est optionnel!",
      placeOrder: "Passer la Commande",
      orderConfirmed: "Commande Confirmée!",
      thankYou: "Merci pour votre commande. Nous la préparerons immédiatement!",
      continueShopping: "Continuer vos Achats",
      viewIngredients: "Voir les Ingrédients",
      ingredients: "Ingrédients:",
      quickLinks: "Liens Rapides",
      followUs: "Suivez-nous",
      contactUs: "Contactez-nous",
      copyright: "2023 Scooby Food. Tous droits réservés.",
      deliciousFood: "Délicieuse street food à emporter",
      aboutText: "Nous sommes un stand de street food offrant de délicieux plats à emporter. Nous n'offrons pas de service sur place, donc les clients commandent et profitent de notre nourriture chez eux.",
      noIngredients: "Les informations sur les ingrédients ne sont pas disponibles pour cet article.",
      TND: "TND"
    }
  };

  // Translation helper function
  const t = (key: string) => {
    return translations[currentLanguage as keyof typeof translations][key as keyof typeof translations["en"]] || key;
  };

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('scoobyfoodCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('scoobyfoodCart', JSON.stringify(cart));
  }, [cart]);

  // Filter menu items based on category
  const filteredItems = activeFilter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeFilter);

  // Calculate total items in cart
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      // Use totalPrice if available, otherwise calculate from price * quantity
      const itemTotal = item.totalPrice !== undefined ? item.totalPrice : item.price * item.quantity;
      return total + itemTotal;
    }, 0).toFixed(3);
  };

  // Add item to cart
  const addToCart = (item: any) => {
    setSelectedItem({
      id: item.id,
      name: currentLanguage === 'en' ? item.name : item.frenchName,
      price: 0, // Start with 0 since we'll build it up with options
      quantity: 1,
      category: item.category
    });
    setSelectedFoodOptions([]);
    setTotalPrice(0); // Start with 0 price, options will add to it
    setShowFoodOptionsModal(true);
  };

  // Buy now function
  const buyNow = (item: any) => {
    setSelectedItem({
      id: item.id,
      name: currentLanguage === 'en' ? item.name : item.frenchName,
      price: 0, // Start with 0 since we'll build it up with options
      quantity: 1,
      category: item.category
    });
    setSelectedFoodOptions([]);
    setTotalPrice(0); // Start with 0 price, options will add to it
    setShowFoodOptionsModal(true);
  };

  // Handle food option selection
  const handleFoodOptionChange = (optionId: string, checked: boolean) => {
    const option = foodOptions.find(opt => opt.id === optionId);
    
    if (!option) return;
    
    if (checked) {
      setSelectedFoodOptions([...selectedFoodOptions, optionId]);
      setTotalPrice(prev => prev + option.price);
    } else {
      setSelectedFoodOptions(selectedFoodOptions.filter(id => id !== optionId));
      setTotalPrice(prev => prev - option.price);
    }
  };

  // Continue to checkout after food options
  const continueToCheckout = () => {
    // Add item to cart with selected options
    if (selectedItem) {
      const itemWithOptions = {
        ...selectedItem,
        options: selectedFoodOptions.map(id => {
          const option = foodOptions.find(o => o.id === id);
          return {
            id,
            name: currentLanguage === 'en' ? option?.name : option?.frenchName,
            price: option?.price || 0
          };
        }),
        totalPrice: totalPrice
      };
      
      setCart([itemWithOptions]);
    }
    
    setShowFoodOptionsModal(false);
    setShowOrderModal(true);
  };

  // Toggle ingredients display
  const toggleIngredients = (id: string) => {
    if (showIngredients === id) {
      setShowIngredients(null);
    } else {
      setShowIngredients(id);
    }
  };

  // Decrease quantity
  const decreaseQuantity = (id: string) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity - 1) };
      }
      return item;
    });
    setCart(updatedCart);
  };

  // Increase quantity
  const increaseQuantity = (id: string) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm({
      ...orderForm,
      [name]: value,
    });
    
    // Store customer info in localStorage
    localStorage.setItem(`customer${name.charAt(0).toUpperCase() + name.slice(1)}`, value);
  };

  // Send order to Telegram
  const sendToTelegram = (message: string) => {
    console.log("Sending to Telegram with token:", token, "and chat ID:", chatId);
    console.log("Message:", message);
    
    return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  };

  // Handle order submission
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before checking out.",
        variant: "destructive",
      });
      return;
    }

    // Create message for Telegram
    let message = `New Order!\n\n`;
    
    cart.forEach(item => {
      message += `Order = ${item.name}\n`;
      
      // Add food options if available
      if (item.options && item.options.length > 0) {
        const optionNames = item.options.map((opt: any) => opt.name).join(', ');
        message += `Food Options = ${optionNames}\n`;
      }
      
      message += `Quantity = ${item.quantity}\n`;
      message += `Price = ${(item.totalPrice || item.price * item.quantity).toFixed(3)} TND\n\n`;
    });
    
    message += `Total = ${calculateTotal()} TND\n`;
    message += `\nCustomer Information:\n`;
    message += `Name = ${orderForm.name}\n`;
    message += `Address = ${orderForm.address}\n`;
    message += `Phone = ${orderForm.phone}\n`;
    
    // Add allergies information if provided
    if (orderForm.allergies) {
      message += `Allergies/Preferences = ${orderForm.allergies}\n`;
    } else {
      message += `Allergies/Preferences = (none)\n`;
    }
    
    // Send to Telegram
    sendToTelegram(message)
      .then(() => {
        toast({
          title: "Order Sent",
          description: "Your order has been sent successfully!",
        });
        setShowOrderModal(false);
        setShowConfirmationModal(true);
        setCart([]);
      })
      .catch(error => {
        console.error("Error sending to Telegram:", error);
        toast({
          title: "Error",
          description: "Error sending order. Please try again.",
          variant: "destructive",
        });
      });
  };

  // Get ingredients info for a specific item
  const ingredients = {
    "mlawi1": {
      en: ["Flour", "Water", "Salt", "Oil", "Tuna", "Harissa", "Olives"],
      fr: ["Farine", "Eau", "Sel", "Huile", "Thon", "Harissa", "Olives"]
    },
    "mlawi2": {
      en: ["Flour", "Water", "Salt", "Oil", "Premium Tuna", "Harissa", "Olives", "Special sauce"],
      fr: ["Farine", "Eau", "Sel", "Huile", "Thon premium", "Harissa", "Olives", "Sauce spéciale"]
    },
    "chapati1": {
      en: ["Flour", "Water", "Salt", "Grilled Chicken", "Vegetables", "Sauce"],
      fr: ["Farine", "Eau", "Sel", "Escalope grillée", "Légumes", "Sauce"]
    },
    "tacos1": {
      en: ["Tortilla", "Tuna", "Lettuce", "Tomato", "Cheese", "Sauce"],
      fr: ["Tortilla", "Thon", "Laitue", "Tomate", "Fromage", "Sauce"]
    },
  };

  return (
    <div className="menu-page">
      {/* Header Section */}
      <header className="header">
        <div className="logo">
          <h1>Scooby<span>Food</span></h1>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/">{t('home')}</Link></li>
            <li><Link to="/menu" className="active">{t('menu')}</Link></li>
            <li><a href="/#about">{t('about')}</a></li>
            <li><a href="/#contact">{t('contact')}</a></li>
          </ul>
        </nav>
        
        {/* Language Switcher */}
        <div className="language-switcher">
          <select 
            value={currentLanguage} 
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="language-select"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
        
        <div className="cart-icon" onClick={() => setShowCartModal(true)}>
          <ShoppingCart className="w-6 h-6" />
          {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
        </div>
        <div className="mobile-menu-btn" onClick={() => {
          const nav = document.querySelector('.nav') as HTMLElement;
          if (nav) nav.classList.toggle('active');
        }}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      {/* Menu Section */}
      <section className="menu-section">
        <div className="section-title">
          <h2>{t('ourMenu')}</h2>
          <p>{t('discoverDishes')}</p>
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            {t('all')}
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'mlawi' ? 'active' : ''}`}
            onClick={() => setActiveFilter('mlawi')}
          >
            {t('mlawi')}
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'chapati' ? 'active' : ''}`}
            onClick={() => setActiveFilter('chapati')}
          >
            {t('chapati')}
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'tacos' ? 'active' : ''}`}
            onClick={() => setActiveFilter('tacos')}
          >
            {t('tacos')}
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'sides' ? 'active' : ''}`}
            onClick={() => setActiveFilter('sides')}
          >
            {t('sides')}
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'drinks' ? 'active' : ''}`}
            onClick={() => setActiveFilter('drinks')}
          >
            {t('drinks')}
          </button>
        </div>
        
        <div className="menu-items">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-item" data-category={item.category}>
              <img src={item.image} alt={currentLanguage === 'en' ? item.name : item.frenchName} className="menu-item-img" />
              <h3>{currentLanguage === 'en' ? item.name : item.frenchName}</h3>
              <div className="menu-item-price">{item.price.toFixed(3)} {t('TND')}</div>
              
              {/* Ingredients button */}
              <button 
                className="btn-view-ingredients" 
                onClick={() => toggleIngredients(item.id)}
              >
                {t('viewIngredients')}
              </button>
              
              {/* Ingredients popup */}
              {showIngredients === item.id && (
                <div className="ingredients-popup">
                  <h4>{t('ingredients')}</h4>
                  <ul>
                    {ingredients[item.id as keyof typeof ingredients] 
                      ? ingredients[item.id as keyof typeof ingredients][currentLanguage as 'en' | 'fr'].map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))
                      : <li>{t('noIngredients')}</li>
                    }
                  </ul>
                  <button 
                    className="close-ingredients"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowIngredients(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="menu-item-actions">
                <button 
                  className="btn-add-cart" 
                  onClick={() => addToCart(item)}
                >
                  {t('addToCart')}
                </button>
                <button 
                  className="btn-buy-now"
                  onClick={() => buyNow(item)}
                >
                  {t('buyNow')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Modal */}
      {showCartModal && (
        <div className="modal" onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains('modal')) {
            setShowCartModal(false);
          }
        }}>
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowCartModal(false)}>×</span>
            <h2>{t('yourCart')}</h2>
            
            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">{t('emptyCart')}</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <span>{item.totalPrice?.toFixed(3) || (item.price * item.quantity).toFixed(3)} {t('TND')}</span>
                    </div>
                    <div className="cart-item-quantity">
                      <button 
                        className="quantity-decrease"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        className="quantity-increase"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                      <span 
                        className="remove-item"
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="cart-footer">
              <div className="cart-total">
                <span>{t('total')}</span>
                <span id="cartTotal">{calculateTotal()} {t('TND')}</span>
              </div>
              
              <div className="cart-actions">
                <button 
                  id="clearCart" 
                  className="btn-secondary"
                  onClick={clearCart}
                  disabled={cart.length === 0}
                >
                  {t('clearCart')}
                </button>
                <button 
                  id="checkoutBtn" 
                  className="btn-primary"
                  onClick={() => {
                    if (cart.length === 0) {
                      toast({
                        title: "Empty Cart",
                        description: "Your cart is empty. Please add items before checking out.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setShowCartModal(false);
                    setShowOrderModal(true);
                  }}
                  disabled={cart.length === 0}
                >
                  {t('checkout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Food Options Modal - Updated for customization with categories */}
      {showFoodOptionsModal && selectedItem && (
        <div className="modal" onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains('modal')) {
            setShowFoodOptionsModal(false);
          }
        }}>
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowFoodOptionsModal(false)}>×</span>
            <h2>{t('customizeOrder')}</h2>
            
            <div className="food-options-summary">
              <div className="order-item-name">{selectedItem.name}</div>
              
              <h3>{t('foodOptions')}</h3>
              
              {/* Display options by category */}
              <div className="food-options-by-category">
                {/* Base options */}
                <div className="option-category">
                  <h4>{t('base')}</h4>
                  <div className="option-group">
                    {foodOptions.filter(opt => opt.category === "base").map((option) => (
                      <div key={option.id} className="food-option-item">
                        <div className="option-checkbox">
                          <Checkbox 
                            id={`option-${option.id}`}
                            checked={selectedFoodOptions.includes(option.id)}
                            onCheckedChange={(checked) => {
                              handleFoodOptionChange(option.id, checked === true);
                            }}
                          />
                          <label htmlFor={`option-${option.id}`}>
                            {currentLanguage === 'en' ? option.name : option.frenchName}
                          </label>
                        </div>
                        <span className="option-price">{option.price > 0 ? `+${option.price.toFixed(3)} ${t('TND')}` : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Filling options */}
                <div className="option-category">
                  <h4>{t('fillings')}</h4>
                  <div className="option-group">
                    {foodOptions.filter(opt => opt.category === "filling").map((option) => (
                      <div key={option.id} className="food-option-item">
                        <div className="option-checkbox">
                          <Checkbox 
                            id={`option-${option.id}`}
                            checked={selectedFoodOptions.includes(option.id)}
                            onCheckedChange={(checked) => {
                              handleFoodOptionChange(option.id, checked === true);
                            }}
                          />
                          <label htmlFor={`option-${option.id}`}>
                            {currentLanguage === 'en' ? option.name : option.frenchName}
                          </label>
                        </div>
                        <span className="option-price">+{option.price.toFixed(3)} {t('TND')}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Meat options */}
                <div className="option-category">
                  <h4>{t('meat')}</h4>
                  <div className="option-group">
                    {foodOptions.filter(opt => opt.category === "meat").map((option) => (
                      <div key={option.id} className="food-option-item">
                        <div className="option-checkbox">
                          <Checkbox 
                            id={`option-${option.id}`}
                            checked={selectedFoodOptions.includes(option.id)}
                            onCheckedChange={(checked) => {
                              handleFoodOptionChange(option.id, checked === true);
                            }}
                          />
                          <label htmlFor={`option-${option.id}`}>
                            {currentLanguage === 'en' ? option.name : option.frenchName}
                          </label>
                        </div>
                        <span className="option-price">+{option.price.toFixed(3)} {t('TND')}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Extras options */}
                <div className="option-category">
                  <h4>{t('extras')}</h4>
                  <div className="option-group">
                    {foodOptions.filter(opt => opt.category === "extra" || opt.category === "drink").map((option) => (
                      <div key={option.id} className="food-option-item">
                        <div className="option-checkbox">
                          <Checkbox 
                            id={`option-${option.id}`}
                            checked={selectedFoodOptions.includes(option.id)}
                            onCheckedChange={(checked) => {
                              handleFoodOptionChange(option.id, checked === true);
                            }}
                          />
                          <label htmlFor={`option-${option.id}`}>
                            {currentLanguage === 'en' ? option.name : option.frenchName}
                          </label>
                        </div>
                        <span className="option-price">+{option.price.toFixed(3)} {t('TND')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="total-price">
                <span>{t('total')}</span>
                <span>{totalPrice.toFixed(3)} {t('TND')}</span>
              </div>
              
              <button 
                className="btn-primary btn-block"
                onClick={continueToCheckout}
                disabled={totalPrice <= 0 || selectedFoodOptions.length === 0}
              >
                {t('checkout')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowOrderModal(false)}>×</span>
            <h2>{t('completeOrder')}</h2>
            
            <div className="order-summary">
              <h3>{t('orderSummary')}</h3>
              <div id="orderSummary">
                {cart.map((item) => (
                  <div key={item.id} className="order-item">
                    <div>{item.quantity}x {item.name}</div>
                    <div>
                      {item.options && item.options.length > 0 && (
                        <div className="order-options">
                          {item.options.map((opt: any, index: number) => (
                            <span key={opt.id} className="order-option-item">
                              {opt.name}{index < (item.options?.length || 0) - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>{item.totalPrice?.toFixed(3) || (item.price * item.quantity).toFixed(3)} {t('TND')}</div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>{t('total')}</span>
                <span id="orderTotal">{calculateTotal()} {t('TND')}</span>
              </div>
            </div>
            
            <form id="orderForm" onSubmit={handleSubmitOrder}>
              <div className="form-group">
                <label htmlFor="name">{t('name')}</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={orderForm.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">{t('phoneNumber')}</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={orderForm.phone}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">{t('deliveryAddress')}</label>
                <textarea 
                  id="address" 
                  name="address" 
                  value={orderForm.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              
              {/* Allergies field */}
              <div className="form-group allergies-group">
                <div className="allergies-label-container">
                  <label htmlFor="allergies">{t('allergies')}</label>
                  <div className="info-tooltip">
                    <Info size={16} />
                    <span className="tooltip-text">{t('allergiesInfo')}</span>
                  </div>
                </div>
                <textarea 
                  id="allergies" 
                  name="allergies" 
                  value={orderForm.allergies}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary btn-block">{t('placeOrder')}</button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal">
          <div className="modal-content confirmation-modal">
            <h2>{t('orderConfirmed')}</h2>
            <p>{t('thankYou')}</p>
            <div className="confirmation-icon">✓</div>
            <button 
              id="backToMenuBtn" 
              className="btn-primary"
              onClick={() => setShowConfirmationModal(false)}
            >
              {t('continueShopping')}
            </button>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Scooby<span>Food</span></h2>
            <p>{t('deliciousFood')}</p>
          </div>
          
          <div className="footer-links">
            <h3>{t('quickLinks')}</h3>
            <ul>
              <li><Link to="/">{t('home')}</Link></li>
              <li><Link to="/menu">{t('menu')}</Link></li>
              <li><a href="/#about">{t('about')}</a></li>
              <li><a href="/#contact">{t('contact')}</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>{t('contactUs')}</h3>
            <p><i className="fa fa-map-marker"></i> 123 Food Street, Foodville</p>
            <p><i className="fa fa-phone"></i> +1 (555) 123-4567</p>
            <p><i className="fa fa-envelope"></i> info@scoobyfood.com</p>
          </div>
          
          <div className="footer-social">
            <h3>{t('followUs')}</h3>
            <div className="social-icons">
              <a href="#" className="social-icon"><i className="fa fa-facebook"></i></a>
              <a href="#" className="social-icon"><i className="fa fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fa fa-twitter"></i></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {t('copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default MenuPage;
