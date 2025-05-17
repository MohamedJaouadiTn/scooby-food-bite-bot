
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Info } from "lucide-react";
import { MenuItem, CartItem, ExtraItem, OrderFormData, Category } from "@/types/menuTypes";
import OrderModal from "@/components/OrderModal";

const MenuPage = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<Category | 'all'>('all');
  const [showCartModal, setShowCartModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showOrderItemModal, setShowOrderItemModal] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState<CartItem | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderFormData>({
    name: "",
    address: "",
    phone: "",
    allergies: "",
  });
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'fr'>('en');
  const [showIngredients, setShowIngredients] = useState<string | null>(null);

  // Telegram Bot Configuration
  const token = "8170617850:AAFJWVcrDKSCaRknRSs_XTj_6epWef8qnjQ";
  const chatId = "7809319602";

  // Menu items data
  const menuItems: MenuItem[] = [
    // Mlawi Category
    { id: "m1", name: "Mlawi thon", englishName: "Mlawi Tuna", price: 3.500, category: "mlawi", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=2080" },
    { id: "m2", name: "Mlawi spécial thon", englishName: "Mlawi Special Tuna", price: 4.500, category: "mlawi", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=2080" },
    { id: "m3", name: "Mlawi salami", englishName: "Mlawi Salami", price: 3.500, category: "mlawi", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=2080" },
    { id: "m4", name: "Mlawi spécial salami", englishName: "Mlawi Special Salami", price: 4.500, category: "mlawi", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=2080" },
    { id: "m5", name: "Mlawi jambon", englishName: "Mlawi Ham", price: 4.000, category: "mlawi", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=2080" },
    { id: "m6", name: "Mlawi spécial jambon", englishName: "Mlawi Special Ham", price: 5.500, category: "mlawi", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=2080" },
    { id: "m7", name: "Mlawi thon salami", englishName: "Mlawi Tuna Salami", price: 4.000, category: "mlawi", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=2080" },
    { id: "m8", name: "Mlawi thon 4 fromage", englishName: "Mlawi Tuna 4 Cheese", price: 5.500, category: "mlawi", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=2080" },
    { id: "m9", name: "Mlawi thon jambon", englishName: "Mlawi Tuna Ham", price: 4.500, category: "mlawi", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=2080" },
    { id: "m10", name: "Mlawi spécial fromage", englishName: "Mlawi Special Cheese", price: 8.000, category: "mlawi", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=2080" },
    
    // Chapatti Category
    { id: "c1", name: "Chapatti escalope grillée", englishName: "Chapatti Grilled Chicken", price: 6.000, category: "chapatti", image: "/lovable-uploads/a0b46da6-d8b9-474a-9eb4-4721b602592e.png" },
    { id: "c2", name: "Chapatti escalope panée", englishName: "Chapatti Breaded Chicken", price: 6.500, category: "chapatti", image: "/lovable-uploads/a0b46da6-d8b9-474a-9eb4-4721b602592e.png" },
    { id: "c3", name: "Chapatti cordon bleu", englishName: "Chapatti Cordon Bleu", price: 6.500, category: "chapatti", image: "/lovable-uploads/a0b46da6-d8b9-474a-9eb4-4721b602592e.png" },
    
    // Tacos Category
    { id: "t1", name: "Tacos shawarma", englishName: "Shawarma Tacos", price: 7.000, category: "tacos", image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGFjb3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" },
    { id: "t2", name: "Tacos mix escalope-shawarma", englishName: "Mixed Chicken-Shawarma Tacos", price: 10.000, category: "tacos", image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGFjb3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" },
    
    // Extras Category
    { id: "e1", name: "Cheddar", englishName: "Cheddar", price: 2.500, category: "extras", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    { id: "e2", name: "Mozzarella", englishName: "Mozzarella", price: 2.500, category: "extras", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    { id: "e3", name: "Frite", englishName: "French Fries", price: 2.000, category: "extras", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    
    // Drinks Category
    { id: "d1", name: "Canette", englishName: "Soda Can", price: 2.000, category: "drinks", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
    { id: "d2", name: "Eau", englishName: "Water", price: 1.500, category: "drinks", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
  ];
  
  // Extra options for order customization
  const extraOptions: ExtraItem[] = [
    { id: "ex1", name: "thon", englishName: "Tuna", price: 1.000, selected: false },
    { id: "ex2", name: "spécial thon", englishName: "Special Tuna", price: 1.000, selected: false },
    { id: "ex3", name: "salami", englishName: "Salami", price: 1.000, selected: false },
    { id: "ex4", name: "spécial salami", englishName: "Special Salami", price: 1.000, selected: false },
    { id: "ex5", name: "jambon", englishName: "Ham", price: 1.000, selected: false },
    { id: "ex6", name: "spécial jambon", englishName: "Special Ham", price: 1.500, selected: false },
    { id: "ex7", name: "thon salami", englishName: "Tuna Salami", price: 1.500, selected: false },
    { id: "ex8", name: "thon jambon", englishName: "Tuna Ham", price: 1.500, selected: false },
    { id: "ex9", name: "spécial fromage", englishName: "Special Cheese", price: 3.500, selected: false },
    { id: "ex10", name: "cheddar", englishName: "Cheddar", price: 2.500, selected: false },
    { id: "ex11", name: "mozzarella", englishName: "Mozzarella", price: 2.500, selected: false },
    { id: "ex12", name: "frite", englishName: "French Fries", price: 2.000, selected: false },
    { id: "ex13", name: "soda", englishName: "Soda", price: 2.000, selected: false },
    { id: "ex14", name: "eau", englishName: "Water", price: 1.500, selected: false },
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
      chapatti: "Chapatti",
      tacos: "Tacos",
      extras: "Extras",
      drinks: "Drinks",
      addToCart: "Add to Cart",
      buyNow: "Buy Now",
      yourCart: "Your Cart",
      emptyCart: "Your cart is empty",
      total: "Total",
      clearCart: "Clear Cart",
      checkout: "Checkout",
      completeOrder: "Complete Your Order",
      orderSummary: "Order Summary",
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
      deliciousFood: "Delicious food for every mood",
      currency: "DT",
      basePrice: "Base Price",
      orderDetails: "Order Details",
      baseItem: "Base Item",
      foodOptions: "Food Options",
      extras: "Extras",
      totalPrice: "Total Price",
      yourInfo: "Your Information",
      contactAddress: "123 Food Street, Foodville",
      contactPhone: "+1 (555) 123-4567",
      contactEmail: "info@scoobyfood.com"
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
      chapatti: "Chapatti",
      tacos: "Tacos",
      extras: "Extras",
      drinks: "Boissons",
      addToCart: "Ajouter au Panier",
      buyNow: "Acheter",
      yourCart: "Votre Panier",
      emptyCart: "Votre panier est vide",
      total: "Total",
      clearCart: "Vider le Panier",
      checkout: "Commander",
      completeOrder: "Compléter Votre Commande",
      orderSummary: "Résumé de la Commande",
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
      deliciousFood: "Des plats délicieux pour chaque humeur",
      currency: "DT",
      basePrice: "Prix de Base",
      orderDetails: "Détails de la Commande",
      baseItem: "Article de Base",
      foodOptions: "Options Alimentaires",
      extras: "Extras",
      totalPrice: "Prix Total",
      yourInfo: "Vos Informations",
      contactAddress: "123 Rue de la Nourriture, Foodville",
      contactPhone: "+1 (555) 123-4567",
      contactEmail: "info@scoobyfood.com"
    }
  };

  // Ingredients data with French translations
  const ingredients = {
    "m1": {
      en: ["Mlawi bread", "Tuna", "Olive oil", "Harissa", "Olives"],
      fr: ["Pain Mlawi", "Thon", "Huile d'olive", "Harissa", "Olives"]
    },
    "m2": {
      en: ["Mlawi bread", "Tuna", "Cheese", "Olives", "Special sauce"],
      fr: ["Pain Mlawi", "Thon", "Fromage", "Olives", "Sauce spéciale"]
    },
    // ... keep existing code for other ingredients
  };

  // Get translation function
  const t = (key: string) => {
    return translations[currentLanguage][key as keyof typeof translations["en"]] || key;
  };

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('scoobyfoodCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // Load user info for order form
    const savedUserInfo = localStorage.getItem('scoobyfoodUserInfo');
    if (savedUserInfo) {
      const parsedUserInfo = JSON.parse(savedUserInfo);
      setOrderForm(prevState => ({
        ...prevState,
        name: parsedUserInfo.name || '',
        phone: parsedUserInfo.phone || '',
        address: parsedUserInfo.address || '',
      }));
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
      // Base price of item multiplied by quantity
      let itemTotal = item.price * item.quantity;
      
      // Add price of extras if any
      if (item.extras && item.extras.length > 0) {
        itemTotal += item.extras.reduce((extrasTotal, extra) => {
          return extrasTotal + extra.price;
        }, 0) * item.quantity;
      }
      
      return total + itemTotal;
    }, 0).toFixed(3);
  };

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      const newCartItem: CartItem = {
        id: item.id,
        name: currentLanguage === 'en' ? item.englishName : item.name,
        price: item.price,
        quantity: 1,
        extras: []
      };
      setCart([...cart, newCartItem]);
    }
    
    toast({
      title: t("addToCart"),
      description: `${currentLanguage === 'en' ? item.englishName : item.name} ${t("addToCart").toLowerCase()}.`,
      duration: 2000,
    });
  };

  // Buy now function
  const buyNow = (item: MenuItem) => {
    const cartItem: CartItem = {
      id: item.id,
      name: currentLanguage === 'en' ? item.englishName : item.name,
      price: item.price,
      quantity: 1,
      extras: []
    };
    
    setSelectedOrderItem(cartItem);
    setShowOrderItemModal(true);
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

  // Handle order submission from OrderModal
  const handleSubmitItemOrder = (item: CartItem, formData: OrderFormData) => {
    // Create message for Telegram
    let message = `New Order!\n\n`;
    message += `Order = ${item.name}\n`;
    message += `Price = ${item.price.toFixed(3)} DT\n\n`;
    
    if (item.extras && item.extras.length > 0) {
      message += `Extras:\n`;
      let extrasTotal = 0;
      
      item.extras.forEach(extra => {
        const extraName = currentLanguage === 'en' ? extra.englishName : extra.name;
        message += `- ${extraName} (+${extra.price.toFixed(3)} DT)\n`;
        extrasTotal += extra.price;
      });
      
      message += `\nExtras Total = ${extrasTotal.toFixed(3)} DT\n`;
      message += `Order Total = ${(item.price + extrasTotal).toFixed(3)} DT\n\n`;
    }
    
    message += `\nCustomer Information:\n`;
    message += `Name = ${formData.name}\n`;
    message += `Address = ${formData.address}\n`;
    message += `Phone = ${formData.phone}\n`;
    
    // Add allergies information if provided
    if (formData.allergies) {
      message += `Allergies/Preferences = ${formData.allergies}\n`;
    }
    
    // Send to Telegram
    sendToTelegram(message)
      .then(() => {
        toast({
          title: t("orderConfirmed"),
          description: t("thankYou"),
        });
        setShowOrderItemModal(false);
        setShowConfirmationModal(true);
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

  // Handle regular checkout from cart
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

    // Save user info for future orders
    const userInfo = {
      name: orderForm.name,
      phone: orderForm.phone,
      address: orderForm.address,
    };
    localStorage.setItem('scoobyfoodUserInfo', JSON.stringify(userInfo));

    // Create message for Telegram
    let message = `New Order!\n\n`;
    
    cart.forEach(item => {
      message += `Order = ${item.name}\n`;
      message += `Quantity = ${item.quantity}\n`;
      
      const itemPrice = item.price * item.quantity;
      message += `Price = ${itemPrice.toFixed(3)} DT\n`;
      
      if (item.extras && item.extras.length > 0) {
        message += `Extras:\n`;
        let extrasTotal = 0;
        
        item.extras.forEach(extra => {
          const extraName = currentLanguage === 'en' ? extra.englishName : extra.name;
          message += `- ${extraName} (+${(extra.price * item.quantity).toFixed(3)} DT)\n`;
          extrasTotal += extra.price * item.quantity;
        });
        
        message += `Item Total = ${(itemPrice + extrasTotal).toFixed(3)} DT\n`;
      }
      
      message += `\n`;
    });
    
    message += `Total = ${calculateTotal()} DT\n`;
    message += `\nCustomer Information:\n`;
    message += `Name = ${orderForm.name}\n`;
    message += `Address = ${orderForm.address}\n`;
    message += `Phone = ${orderForm.phone}\n`;
    
    // Add allergies information if provided
    if (orderForm.allergies) {
      message += `Allergies/Preferences = ${orderForm.allergies}\n`;
    }
    
    // Send to Telegram
    sendToTelegram(message)
      .then(() => {
        toast({
          title: t("orderConfirmed"),
          description: t("thankYou"),
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
            onChange={(e) => setCurrentLanguage(e.target.value as 'en' | 'fr')}
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
            className={`filter-btn ${activeFilter === 'chapatti' ? 'active' : ''}`}
            onClick={() => setActiveFilter('chapatti')}
          >
            {t('chapatti')}
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'tacos' ? 'active' : ''}`}
            onClick={() => setActiveFilter('tacos')}
          >
            {t('tacos')}
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'extras' ? 'active' : ''}`}
            onClick={() => setActiveFilter('extras')}
          >
            {t('extras')}
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
              <img src={item.image} alt={currentLanguage === 'en' ? item.englishName : item.name} className="menu-item-img" />
              <h3>{currentLanguage === 'en' ? item.englishName : item.name}</h3>
              <div className="menu-item-price">{item.price.toFixed(3)} {t('currency')}</div>
              
              {/* Ingredients button */}
              <button 
                className="btn-view-ingredients" 
                onClick={() => toggleIngredients(item.id)}
              >
                {t('viewIngredients')}
              </button>
              
              {/* Ingredients popup */}
              {showIngredients === item.id && ingredients[item.id as keyof typeof ingredients] && (
                <div className="ingredients-popup">
                  <h4>{t('ingredients')}</h4>
                  <ul>
                    {ingredients[item.id as keyof typeof ingredients][currentLanguage].map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
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
                      <span>{item.price.toFixed(3)} {t('currency')}</span>
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
                <span>{t('total')}:</span>
                <span id="cartTotal">{calculateTotal()} {t('currency')}</span>
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

      {/* Order Modal for Individual Items */}
      {showOrderItemModal && (
        <OrderModal
          isOpen={showOrderItemModal}
          onClose={() => setShowOrderItemModal(false)}
          item={selectedOrderItem}
          extraOptions={extraOptions}
          onSubmitOrder={handleSubmitItemOrder}
          currentLanguage={currentLanguage}
          translations={translations}
        />
      )}

      {/* Order Modal for Cart Checkout */}
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
                    <div>{(item.price * item.quantity).toFixed(3)} {t('currency')}</div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>{t('total')}</span>
                <span id="orderTotal">{calculateTotal()} {t('currency')}</span>
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

      <footer className="footer text-white">
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
            <p><i className="fa fa-map-marker"></i> {t('contactAddress')}</p>
            <p><i className="fa fa-phone"></i> {t('contactPhone')}</p>
            <p><i className="fa fa-envelope"></i> {t('contactEmail')}</p>
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
