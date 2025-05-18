import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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
  extras?: FoodOption[];  // Changed from options to extras
  totalPrice?: number;
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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
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
    { id: "mlawi1", name: "Mlawi with Tuna", frenchName: "Mlawi au thon", price: 3.5, category: "mlawi", image: "/lovable-uploads/e036f500-7659-4481-8dbb-7fd189e0342a.png" },
    { id: "mlawi2", name: "Special Mlawi with Tuna", frenchName: "Mlawi spécial thon", price: 4.5, category: "mlawi", image: "/lovable-uploads/e036f500-7659-4481-8dbb-7fd189e0342a.png" },
    { id: "mlawi3", name: "Mlawi with Salami", frenchName: "Mlawi au salami", price: 3.5, category: "mlawi", image: "/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png" },
    { id: "mlawi4", name: "Special Mlawi with Salami", frenchName: "Mlawi spécial salami", price: 4.5, category: "mlawi", image: "/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png" },
    { id: "mlawi5", name: "Mlawi with Ham", frenchName: "Mlawi au jambon", price: 4.0, category: "mlawi", image: "/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png" },
    
    // Chapati Category
    { id: "chapati1", name: "Chapati with Grilled Chicken", frenchName: "Chapati escalope grillée", price: 6.0, category: "chapati", image: "/lovable-uploads/c92d067b-44d8-4570-bd8e-2bd4927e7fb7.png" },
    { id: "chapati2", name: "Chapati with Tuna", frenchName: "Chapati au thon", price: 7.99, category: "chapati", image: "/lovable-uploads/a9a310a0-a2f6-4a19-ad28-62cc5f6a0bca.png" },
    { id: "chapati3", name: "Chapati Cordon Bleu", frenchName: "Chapati cordon bleu", price: 6.5, category: "chapati", image: "/lovable-uploads/c92d067b-44d8-4570-bd8e-2bd4927e7fb7.png" },
    
    // Tacos Category
    { id: "tacos1", name: "Tacos with Tuna", frenchName: "Tacos au thon", price: 3.5, category: "tacos", image: "/lovable-uploads/7f6ef961-d8a3-4cc3-8a10-943b8487da0b.png" },
    { id: "tacos2", name: "Tacos with Special Tuna", frenchName: "Tacos spécial thon", price: 4.5, category: "tacos", image: "/lovable-uploads/85aba854-be50-4f4f-b700-711a5ba92d9d.png" },

    // Sides & Drinks
    { id: "side1", name: "Cheddar", frenchName: "Cheddar", price: 2.5, category: "sides", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
    { id: "side2", name: "Mozzarella", frenchName: "Mozzarella", price: 2.5, category: "sides", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
    { id: "side3", name: "French Fries", frenchName: "Frite", price: 2.0, category: "sides", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
    { id: "drink1", name: "Soda Can", frenchName: "Canette", price: 2.0, category: "drinks", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
    { id: "drink2", name: "Water", frenchName: "Eau", price: 1.5, category: "drinks", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
  ];

  // Extras options that can be added
  const extraOptions = [
    { id: "extra1", name: "Cheddar", frenchName: "Cheddar", price: 2.5 },
    { id: "extra2", name: "Mozzarella", frenchName: "Mozzarella", price: 2.5 },
    { id: "extra3", name: "French Fries", frenchName: "Frites", price: 2.0 },
  ];

  // Translation data
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
      copyright: "2025 Scooby Food. All rights reserved.",
      deliciousFood: "Delicious street food for takeaway",
      aboutText: "We are a street food stand offering delicious takeaway food. We don't offer dine-in service, so customers order and enjoy our food at home.",
      noIngredients: "Ingredient information not available for this item.",
      TND: "TND",
      openingHours: "Opening Hours"
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
      extras: "Suppléments",
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
      copyright: "2025 Scooby Food. Tous droits réservés.",
      deliciousFood: "Délicieuse street food à emporter",
      aboutText: "Nous sommes un stand de street food offrant de délicieux plats à emporter. Nous n'offrons pas de service sur place, donc les clients commandent et profitent de notre nourriture chez eux.",
      noIngredients: "Les informations sur les ingrédients ne sont pas disponibles pour cet article.",
      TND: "TND",
      openingHours: "Horaires d'Ouverture"
    }
  };

  // Ingredients data with French translations
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

  // Get translation function
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
    return cart.reduce((total, item) => total + (item.totalPrice || item.price * item.quantity), 0).toFixed(3);
  };

  // Add item to cart
  const addToCart = (item: any) => {
    setSelectedItem({
      id: item.id,
      name: currentLanguage === 'en' ? item.name : item.frenchName,
      price: item.price,
      quantity: 1,
      category: item.category
    });
    setSelectedExtras([]);
    setTotalPrice(item.price);
    setShowOrderModal(true);
  };

  // Buy now function
  const buyNow = (item: any) => {
    setSelectedItem({
      id: item.id,
      name: currentLanguage === 'en' ? item.name : item.frenchName,
      price: item.price,
      quantity: 1,
      category: item.category
    });
    setSelectedExtras([]);
    setTotalPrice(item.price);
    setShowOrderModal(true);
  };

  // Handle extra option selection
  const handleExtraOptionChange = (optionId: string, checked: boolean) => {
    const option = extraOptions.find(opt => opt.id === optionId);
    
    if (!option) return;
    
    if (checked) {
      setSelectedExtras([...selectedExtras, optionId]);
      setTotalPrice(prev => prev + option.price);
    } else {
      setSelectedExtras(selectedExtras.filter(id => id !== optionId));
      setTotalPrice(prev => prev - option.price);
    }
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
    
    if (!selectedItem) {
      toast({
        title: "Error",
        description: "No item selected.",
        variant: "destructive",
      });
      return;
    }

    // Create message for Telegram
    let message = `New Order!\n\n`;
    message += `Order = ${selectedItem.name}\n`;
    message += `Quantity = ${selectedItem.quantity}\n`;
    message += `Price = ${selectedItem.price.toFixed(3)} TND\n`;
    
    // Add extras if selected
    if (selectedExtras.length > 0) {
      const selectedOptions = selectedExtras.map(id => {
        const option = extraOptions.find(opt => opt.id === id);
        return {
          name: currentLanguage === 'en' ? option?.name : option?.frenchName,
          price: option?.price || 0
        };
      });
      
      const extraNames = selectedOptions.map(opt => opt.name).join(' + ');
      message += `Extras = ${extraNames}\n\n`;
      
      // Calculate total price with extras
      let totalWithExtras = selectedItem.price;
      selectedOptions.forEach(opt => {
        totalWithExtras += opt.price;
      });
      
      message += `Total = ${selectedItem.price.toFixed(3)} TND`;
      
      // Add each extra price
      selectedOptions.forEach(opt => {
        message += ` + ${opt.price.toFixed(3)} TND`;
      });
      
      message += ` = ${totalWithExtras.toFixed(3)} TND\n\n`;
    } else {
      message += `\nTotal = ${selectedItem.price.toFixed(3)} TND\n\n`;
    }
    
    message += `Customer Information:\n`;
    message += `Name = ${orderForm.name}\n`;
    message += `Address = ${orderForm.address}\n`;
    message += `Phone = ${orderForm.phone}\n`;
    
    // Add allergies information if provided
    if (orderForm.allergies.trim()) {
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

  return (
    <div className="menu-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
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
          </div>
        </div>
      </header>

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
                      ? ingredients[item.id as keyof typeof ingredients][currentLanguage as 'en' | 'fr'].map((ingredient: string, index: number) => (
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

      {/* Order Modal */}
      {showOrderModal && (
        <div className="modal" onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains('modal')) {
            setShowOrderModal(false);
          }
        }}>
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowOrderModal(false)}>×</span>
            <h2>{t('completeOrder')}</h2>
            
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
                <label htmlFor="address">{t('deliveryAddress')}</label>
                <textarea 
                  id="address" 
                  name="address" 
                  value={orderForm.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
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
              
              {/* Extras section */}
              <div className="form-group">
                <h3>{t('extras')}</h3>
                <div className="extras-list">
                  {extraOptions.map((option) => (
                    <div key={option.id} className="extra-option-item">
                      <div className="option-checkbox">
                        <input
                          type="checkbox"
                          id={`option-${option.id}`}
                          checked={selectedExtras.includes(option.id)}
                          onChange={(e) => handleExtraOptionChange(option.id, e.target.checked)}
                        />
                        <label htmlFor={`option-${option.id}`}>
                          {currentLanguage === 'en' ? option.name : option.frenchName}
                        </label>
                      </div>
                      <span className="option-price">{option.price.toFixed(3)} {t('TND')}</span>
                    </div>
                  ))}
                </div>
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
              
              <div className="order-summary">
                <h3>{t('orderSummary')}</h3>
                {selectedItem && (
                  <div className="order-item">
                    <div>{selectedItem.quantity}x {selectedItem.name}</div>
                    <div>{selectedItem.price.toFixed(3)} {t('TND')}</div>
                  </div>
                )}
                
                {selectedExtras.length > 0 && (
                  <div className="order-extras">
                    {selectedExtras.map((id) => {
                      const extra = extraOptions.find((opt) => opt.id === id);
                      if (!extra) return null;
                      return (
                        <div key={id} className="order-item">
                          <div>+ {currentLanguage === 'en' ? extra.name : extra.frenchName}</div>
                          <div>{extra.price.toFixed(3)} {t('TND')}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="order-total">
                  <span>{t('total')}</span>
                  <span id="orderTotal">{totalPrice.toFixed(3)} {t('TND')}</span>
                </div>
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

      <footer className="footer">
        <div className="container">
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
              <p><i className="fa fa-map-marker"></i> 123 Food Street, Tasty Town</p>
              <p><i className="fa fa-phone"></i> +1 (555) 123-4567</p>
              <p><i className="fa fa-envelope"></i> info@scoobyfood.com</p>
            </div>
            
            <div className="footer-hours">
              <h3>{t('openingHours')}</h3>
              <p><strong>Monday - Friday:</strong> 10:00 AM - 10:00 PM</p>
              <p><strong>Saturday - Sunday:</strong> 11:00 AM - 11:00 PM</p>
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
        </div>
      </footer>
    </div>
  );
};

export default MenuPage;
