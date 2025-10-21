import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { orderSchema } from "@/lib/validations";

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
  extras?: FoodOption[];
  totalPrice?: number;
  sodaType?: string;
};

type FoodOptionType = {
  id: string;
  name: string;
  frenchName: string;
  price: number;
  category: string;
  image: string;
};

const MenuPage = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCartModal, setShowCartModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSodaModal, setShowSodaModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedSodaType, setSelectedSodaType] = useState<string>("Coca-Cola");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: localStorage.getItem("customerName") || "",
    address: localStorage.getItem("customerAddress") || "",
    phone: localStorage.getItem("customerPhone") || "",
    allergies: localStorage.getItem("customerAllergies") || ""
  });
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [telegramConfig, setTelegramConfig] = useState<{ botToken: string; chatId: string } | null>(null);
  const [menuItems, setMenuItems] = useState<FoodOptionType[]>([]);


  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      if (data) {
        // Transform database products to match existing FoodOptionType structure
        const transformed = data.map(p => ({
          id: p.product_id,
          name: p.name,
          frenchName: p.french_name,
          price: p.price,
          category: p.category,
          image: p.image_url || ''
        }));
        setMenuItems(transformed);
      }
    };
    
    fetchProducts();
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        () => fetchProducts()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  // Extras options - now separate from menu
  const extraOptions = [{
    id: "extra1",
    name: "Cheddar",
    frenchName: "Cheddar",
    price: 2.5
  }, {
    id: "extra2",
    name: "Mozzarella",
    frenchName: "Mozzarella",
    price: 2.5
  }, {
    id: "extra3",
    name: "French Fries",
    frenchName: "Frites",
    price: 2.0
  }, {
    id: "extra4",
    name: "Water",
    frenchName: "Eau",
    price: 1.5
  }];

  // Soda options
  const sodaOptions = ["Coca-Cola", "Fanta", "Sprite", "Schweppes", "Boga"];

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
      openingHours: "Opening Hours",
      chooseSodaType: "Which soda would you like?",
      selectSoda: "Select a soda",
      confirm: "Confirm",
      selectExtras: "Select Extras (Optional)",
      addItemToCart: "Add Item to Cart"
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
      openingHours: "Horaires d'Ouverture",
      chooseSodaType: "Quelle boisson voulez-vous?",
      selectSoda: "Sélectionnez une boisson",
      confirm: "Confirmer",
      selectExtras: "Sélectionner Suppléments (Optionnel)",
      addItemToCart: "Ajouter Article au Panier"
    }
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
  const filteredItems = activeFilter === 'all' ? menuItems : menuItems.filter(item => item.category === activeFilter);

  // Calculate total items in cart
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.totalPrice || item.price * item.quantity), 0).toFixed(3);
  };

  // Add item to cart with extras selection
  const addToCart = (item: any) => {
    if (item.category === "drinks" && item.id === "drink1") {
      setSelectedItem({
        id: item.id,
        name: currentLanguage === 'en' ? item.name : item.frenchName,
        price: item.price,
        quantity: 1,
        category: item.category
      });
      setIsAddingToCart(true);
      setShowSodaModal(true);
      return;
    }
    
    setSelectedItem({
      id: item.id,
      name: currentLanguage === 'en' ? item.name : item.frenchName,
      price: item.price,
      quantity: 1,
      category: item.category
    });
    setSelectedExtras([]);
    setTotalPrice(item.price);
    setIsAddingToCart(true);
    setShowExtrasModal(true);
  };

  // Buy now function
  const buyNow = (item: any) => {
    if (item.category === "drinks" && item.id === "drink1") {
      setSelectedItem({
        id: item.id,
        name: currentLanguage === 'en' ? item.name : item.frenchName,
        price: item.price,
        quantity: 1,
        category: item.category
      });
      setIsAddingToCart(false);
      setShowSodaModal(true);
      return;
    }
    setSelectedItem({
      id: item.id,
      name: currentLanguage === 'en' ? item.name : item.frenchName,
      price: item.price,
      quantity: 1,
      category: item.category
    });
    setSelectedExtras([]);
    setTotalPrice(item.price);
    setIsAddingToCart(false);
    setShowExtrasModal(true);
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

  // Handle soda selection confirmation
  const handleSodaConfirm = () => {
    if (!selectedItem) return;
    const sodaItem = {
      ...selectedItem,
      name: `${selectedItem.name} (${selectedSodaType})`,
      sodaType: selectedSodaType
    };
    setSelectedItem(sodaItem);
    setShowSodaModal(false);
    
    if (isAddingToCart) {
      // Add directly to cart for soda
      const updatedCart = [...cart];
      const existingItemIndex = updatedCart.findIndex(
        cartItem => cartItem.id === sodaItem.id && cartItem.sodaType === selectedSodaType
      );
      
      if (existingItemIndex > -1) {
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart.push({
          ...sodaItem,
          totalPrice: sodaItem.price
        });
      }
      
      setCart(updatedCart);
      toast({
        title: "Added to Cart",
        description: `${sodaItem.name} has been added to your cart.`
      });
      setIsAddingToCart(false);
    } else {
      // For buy now, proceed to order
      setSelectedExtras([]);
      setTotalPrice(sodaItem.price);
      setShowOrderModal(true);
    }
  };

  // Handle extras confirmation and add to cart
  const handleExtrasConfirm = () => {
    if (!selectedItem) return;
    
    const selectedExtrasData = selectedExtras.map(id => {
      const option = extraOptions.find(opt => opt.id === id);
      return {
        id: option!.id,
        name: currentLanguage === 'en' ? option!.name : option!.frenchName,
        price: option!.price
      };
    });
    
    if (isAddingToCart) {
      // Add to cart
      const updatedCart = [...cart];
      const cartItemId = `${selectedItem.id}_${selectedExtras.join('_')}`;
      const existingItemIndex = updatedCart.findIndex(cartItem => cartItem.id === cartItemId);
      
      if (existingItemIndex > -1) {
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart.push({
          ...selectedItem,
          id: cartItemId,
          extras: selectedExtrasData,
          totalPrice: totalPrice
        });
      }
      
      setCart(updatedCart);
      toast({
        title: "Added to Cart",
        description: `${selectedItem.name} has been added to your cart.`
      });
      setShowExtrasModal(false);
      setIsAddingToCart(false);
    } else {
      // For buy now, proceed to order
      setShowExtrasModal(false);
      setShowOrderModal(true);
    }
  };

  // Decrease quantity
  const decreaseQuantity = (id: string) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: Math.max(1, item.quantity - 1)
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  // Increase quantity
  const increaseQuantity = (id: string) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: item.quantity + 1
        };
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
    const {
      name,
      value
    } = e.target;
    
    // Special handling for phone number formatting
    if (name === 'phone') {
      // Remove all non-digit characters
      const digits = value.replace(/\D/g, '');
      
      // Format as XX XXX XXX
      let formatted = '';
      if (digits.length > 0) {
        formatted = digits.substring(0, 2);
        if (digits.length > 2) {
          formatted += ' ' + digits.substring(2, 5);
        }
        if (digits.length > 5) {
          formatted += ' ' + digits.substring(5, 8);
        }
      }
      
      setOrderForm({
        ...orderForm,
        [name]: formatted
      });
      localStorage.setItem(`customer${name.charAt(0).toUpperCase() + name.slice(1)}`, formatted);
    } else {
      setOrderForm({
        ...orderForm,
        [name]: value
      });
      // Store customer info in localStorage
      localStorage.setItem(`customer${name.charAt(0).toUpperCase() + name.slice(1)}`, value);
    }
  };

  // Fetch Telegram configuration from database
  useEffect(() => {
    const fetchTelegramConfig = async () => {
      const { data, error } = await supabase
        .from('telegram_config')
        .select('bot_token, chat_id')
        .single();

      if (error) {
        console.error('Error fetching Telegram config:', error);
        toast({
          title: "Configuration Error",
          description: "Failed to load Telegram configuration.",
          variant: "destructive",
        });
      } else if (data) {
        setTelegramConfig({
          botToken: data.bot_token,
          chatId: data.chat_id
        });
      }
    };

    fetchTelegramConfig();
  }, []);

  // Send order to Telegram
  const sendToTelegram = (message: string) => {
    if (!telegramConfig) {
      console.error("Telegram configuration not loaded");
      return Promise.reject(new Error("Telegram configuration not loaded"));
    }

    console.log("Sending to Telegram with token:", telegramConfig.botToken, "and chat ID:", telegramConfig.chatId);
    console.log("Message:", message);
    return fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: telegramConfig.chatId,
        text: message
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  };

  // Handle order submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate order form using Zod schema
    try {
      orderSchema.parse({
        name: orderForm.name,
        phone: orderForm.phone,
        address: orderForm.address,
        allergies: orderForm.allergies
      });
    } catch (validationError: any) {
      const errorMessage = validationError.errors?.[0]?.message || "Please check your information and try again.";
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive"
      });
      return;
    }

    if (!selectedItem) {
      toast({
        title: "Error",
        description: "No item selected.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Save customer to database (upsert by phone)
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .upsert({
          name: orderForm.name,
          phone: orderForm.phone,
          address: orderForm.address
        }, { onConflict: 'phone' })
        .select()
        .single();

      if (customerError) {
        console.error('Error saving customer:', customerError);
      }

      // Calculate total price
      let totalWithExtras = selectedItem.price;
      const selectedOptions = selectedExtras.map(id => {
        const option = extraOptions.find(opt => opt.id === id);
        return {
          name: currentLanguage === 'en' ? option?.name : option?.frenchName,
          price: option?.price || 0
        };
      });
      selectedOptions.forEach(opt => {
        totalWithExtras += opt.price;
      });

      // Save order to database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customer?.id,
          customer_name: orderForm.name,
          customer_phone: orderForm.phone,
          customer_address: orderForm.address,
          allergies: orderForm.allergies || null,
          items: [{
            ...selectedItem,
            extras: selectedExtras.map(id => {
              const option = extraOptions.find(opt => opt.id === id);
              return {
                id,
                name: option?.name,
                price: option?.price
              };
            })
          }],
          total_price: totalWithExtras,
          telegram_sent: false
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create message for Telegram
      let message = `New Order!\n\n`;
      message += `Order = ${selectedItem.name}\n`;
      message += `Quantity = ${selectedItem.quantity}\n`;
      message += `Price = ${selectedItem.price.toFixed(3)} TND\n`;

      // Add extras if selected
      if (selectedExtras.length > 0) {
        const extraNames = selectedOptions.map(opt => opt.name).join(' + ');
        message += `Extras = ${extraNames}\n\n`;
        message += `Total = ${selectedItem.price.toFixed(3)} TND`;
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
      try {
        await sendToTelegram(message);
        
        // Update order as telegram_sent
        if (order) {
          await supabase
            .from('orders')
            .update({ telegram_sent: true, status: 'confirmed' })
            .eq('id', order.id);
        }

        toast({
          title: "Order Sent",
          description: "Your order has been sent successfully!"
        });
        setShowOrderModal(false);
        setShowConfirmationModal(true);
        setCart([]);
      } catch (telegramError) {
        console.error("Error sending to Telegram:", telegramError);
        toast({
          title: "Order Saved",
          description: "Order saved but failed to send notification. Admin will be notified.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error processing order:", error);
      toast({
        title: "Error",
        description: error.message || "Error processing order. Please try again.",
        variant: "destructive"
      });
    }
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
            
            <div className="right-header-items">
              {/* Language Switcher moved next to cart icon */}
              <div className="language-switcher">
                <select value={currentLanguage} onChange={e => setCurrentLanguage(e.target.value)} className="language-select">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              
              <div className="cart-icon" onClick={() => setShowCartModal(true)}>
                <ShoppingCart className="w-6 h-6" />
                {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
              </div>
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
          <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
            {t('all')}
          </button>
          <button className={`filter-btn ${activeFilter === 'mlawi' ? 'active' : ''}`} onClick={() => setActiveFilter('mlawi')}>
            {t('mlawi')}
          </button>
          <button className={`filter-btn ${activeFilter === 'chapati' ? 'active' : ''}`} onClick={() => setActiveFilter('chapati')}>
            {t('chapati')}
          </button>
          <button className={`filter-btn ${activeFilter === 'tacos' ? 'active' : ''}`} onClick={() => setActiveFilter('tacos')}>
            {t('tacos')}
          </button>
          <button className={`filter-btn ${activeFilter === 'drinks' ? 'active' : ''}`} onClick={() => setActiveFilter('drinks')}>
            {t('drinks')}
          </button>
        </div>
        
        <div className="menu-items">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-item" data-category={item.category}>
              <img src={item.image} alt={currentLanguage === 'en' ? item.name : item.frenchName} className="menu-item-img" />
              <h3>{currentLanguage === 'en' ? item.name : item.frenchName}</h3>
              <div className="menu-item-price">{item.price.toFixed(3)} {t('TND')}</div>
              
              <div className="menu-item-actions">
                <button className="btn-add-cart" onClick={() => addToCart(item)}>
                  {t('addToCart')}
                </button>
                <button className="btn-buy-now" onClick={() => buyNow(item)}>
                  {t('buyNow')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Modal */}
      {showCartModal && (
        <div className="modal" onClick={e => {
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
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      {item.extras && item.extras.length > 0 && (
                        <p className="cart-item-extras">
                          + {item.extras.map(extra => extra.name).join(', ')}
                        </p>
                      )}
                      <span>{item.totalPrice?.toFixed(3) || (item.price * item.quantity).toFixed(3)} {t('TND')}</span>
                    </div>
                    <div className="cart-item-quantity">
                      <button className="quantity-decrease" onClick={() => decreaseQuantity(item.id)}>
                        -
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button className="quantity-increase" onClick={() => increaseQuantity(item.id)}>
                        +
                      </button>
                      <span className="remove-item" onClick={() => removeFromCart(item.id)}>
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
                <button id="clearCart" className="btn-secondary" onClick={clearCart} disabled={cart.length === 0}>
                  {t('clearCart')}
                </button>
                <button id="checkoutBtn" className="btn-primary" onClick={() => {
                  if (cart.length === 0) {
                    toast({
                      title: "Empty Cart",
                      description: "Your cart is empty. Please add items before checking out.",
                      variant: "destructive"
                    });
                    return;
                  }
                  setShowCartModal(false);
                  setShowOrderModal(true);
                }} disabled={cart.length === 0}>
                  {t('checkout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Soda Selection Modal */}
      {showSodaModal && (
        <div className="modal" onClick={e => {
          if ((e.target as HTMLElement).classList.contains('modal')) {
            setShowSodaModal(false);
          }
        }}>
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowSodaModal(false)}>×</span>
            <h2>{t('chooseSodaType')}</h2>
            
            <div className="soda-options">
              {sodaOptions.map(soda => (
                <div key={soda} className="soda-option">
                  <input type="radio" id={`soda-${soda}`} name="sodaType" value={soda} checked={selectedSodaType === soda} onChange={e => setSelectedSodaType(e.target.value)} className="soda-radio" />
                  <label htmlFor={`soda-${soda}`} className="soda-label">{soda}</label>
                </div>
              ))}
            </div>
            
            <button className="btn-primary btn-block mt-4" onClick={handleSodaConfirm}>
              {t('confirm')}
            </button>
          </div>
        </div>
      )}

      {/* Extras Selection Modal */}
      {showExtrasModal && (
        <div className="modal" onClick={e => {
          if ((e.target as HTMLElement).classList.contains('modal')) {
            setShowExtrasModal(false);
          }
        }}>
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowExtrasModal(false)}>×</span>
            <h2>{t('selectExtras')}</h2>
            
            {selectedItem && (
              <div className="selected-item-info">
                <h3>{selectedItem.name}</h3>
                <p>{t('basePrice')} {selectedItem.price.toFixed(3)} {t('TND')}</p>
              </div>
            )}
            
            <div className="extras-list">
              {extraOptions.map(option => (
                <div key={option.id} className="extra-option-item">
                  <div className="option-checkbox">
                    <input 
                      type="checkbox" 
                      id={`option-${option.id}`} 
                      checked={selectedExtras.includes(option.id)} 
                      onChange={e => handleExtraOptionChange(option.id, e.target.checked)} 
                      className="checkbox-with-border" 
                    />
                    <label htmlFor={`option-${option.id}`}>
                      {currentLanguage === 'en' ? option.name : option.frenchName}
                    </label>
                  </div>
                  <span className="option-price">{option.price.toFixed(3)} {t('TND')}</span>
                </div>
              ))}
            </div>
            
            <div className="extras-total">
              <span>{t('total')}: {totalPrice.toFixed(3)} {t('TND')}</span>
            </div>
            
            <button className="btn-primary btn-block mt-4" onClick={handleExtrasConfirm}>
              {isAddingToCart ? t('addItemToCart') : t('buyNow')}
            </button>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="modal" onClick={e => {
          if ((e.target as HTMLElement).classList.contains('modal')) {
            setShowOrderModal(false);
          }
        }}>
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowOrderModal(false)}>×</span>
            <h2>{t('completeOrder')}</h2>
            
            <form id="orderForm" onSubmit={handleSubmitOrder}>
              <div className="form-group">
                <label htmlFor="name">{t('name')} *</label>
                <input type="text" id="name" name="name" value={orderForm.name} onChange={handleInputChange} placeholder="Ex : foulen falteny" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">{t('deliveryAddress')} *</label>
                <textarea id="address" name="address" value={orderForm.address} onChange={handleInputChange} placeholder=" Ex : kairouan al aghaliba 3100 appartement n24 etage 6" required></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">{t('phoneNumber')} *</label>
                <input type="tel" id="phone" name="phone" value={orderForm.phone} onChange={handleInputChange} placeholder=" Ex : 99 586 375" required />
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
                <textarea id="allergies" name="allergies" value={orderForm.allergies} onChange={handleInputChange} placeholder="onion / ketchup / Mayonnaise / harissa ..."></textarea>
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
                    {selectedExtras.map(id => {
                      const extra = extraOptions.find(opt => opt.id === id);
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
            <button id="backToMenuBtn" className="btn-primary" onClick={() => setShowConfirmationModal(false)}>
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
              <p><i className="fa fa-phone"></i> (123) 456-7890</p>
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
