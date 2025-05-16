
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

const MenuPage = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCartModal, setShowCartModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [orderForm, setOrderForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  // Telegram Bot Configuration
  const token = "8170617850:AAFJWVcrDKSCaRknRSs_XTj_6epWef8qnjQ";
  const chatId = "7809319602";

  type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
  };

  // Menu items data
  const menuItems = [
    { id: "1", name: "Burger", price: 8.99, category: "main", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" },
    { id: "2", name: "Chapaty", price: 5.99, category: "main", image: "/lovable-uploads/a0b46da6-d8b9-474a-9eb4-4721b602592e.png" },
    { id: "3", name: "Malawi", price: 7.99, category: "main", image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" },
    { id: "4", name: "Tacos", price: 6.99, category: "main", image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGFjb3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" },
    { id: "5", name: "Soda", price: 2.50, category: "drinks", image: "/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" },
    { id: "6", name: "Coffee", price: 3.50, category: "drinks", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" },
    { id: "7", name: "Breakfast", price: 12.99, category: "breakfast", image: "https://images.unsplash.com/photo-1533920379810-6bedac961c2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YnJlYWtmYXN0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" },
    { id: "8", name: "Salad", price: 9.99, category: "healthy", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsYWR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" },
  ];

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
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Add item to cart
  const addToCart = (item: any) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  // Buy now function
  const buyNow = (item: any) => {
    setCart([{ ...item, quantity: 1 }]);
    setShowOrderModal(true);
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
      message += `Quantity = ${item.quantity}\n`;
      message += `Price = $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += `Total = $${calculateTotal()}\n`;
    message += `\nCustomer Information:\n`;
    message += `Name = ${orderForm.name}\n`;
    message += `Address = ${orderForm.address}\n`;
    message += `Phone = ${orderForm.phone}`;
    
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
        <div className="logo">
          <h1>Scooby<span>Food</span></h1>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu" className="active">Menu</Link></li>
            <li><a href="/#about">About</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </nav>
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
          <h2>Our Menu</h2>
          <p>Discover your favorite dishes</p>
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'main' ? 'active' : ''}`}
            onClick={() => setActiveFilter('main')}
          >
            Main Dishes
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'breakfast' ? 'active' : ''}`}
            onClick={() => setActiveFilter('breakfast')}
          >
            Breakfast
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'drinks' ? 'active' : ''}`}
            onClick={() => setActiveFilter('drinks')}
          >
            Drinks
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'healthy' ? 'active' : ''}`}
            onClick={() => setActiveFilter('healthy')}
          >
            Healthy Options
          </button>
        </div>
        
        <div className="menu-items">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-item" data-category={item.category}>
              <img src={item.image} alt={item.name} className="menu-item-img" />
              <h3>{item.name}</h3>
              <div className="menu-item-price">${item.price.toFixed(2)}</div>
              <div className="menu-item-actions">
                <button 
                  className="btn-add-cart" 
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
                <button 
                  className="btn-buy-now"
                  onClick={() => buyNow(item)}
                >
                  Buy Now
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
            <h2>Your Cart</h2>
            
            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <span>${item.price.toFixed(2)}</span>
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
                <span>Total:</span>
                <span id="cartTotal">${calculateTotal()}</span>
              </div>
              
              <div className="cart-actions">
                <button 
                  id="clearCart" 
                  className="btn-secondary"
                  onClick={clearCart}
                  disabled={cart.length === 0}
                >
                  Clear Cart
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
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowOrderModal(false)}>×</span>
            <h2>Complete Your Order</h2>
            
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div id="orderSummary">
                {cart.map((item) => (
                  <div key={item.id} className="order-item">
                    <div>{item.quantity}x {item.name}</div>
                    <div>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>Total:</span>
                <span id="orderTotal">${calculateTotal()}</span>
              </div>
            </div>
            
            <form id="orderForm" onSubmit={handleSubmitOrder}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
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
                <label htmlFor="address">Delivery Address</label>
                <textarea 
                  id="address" 
                  name="address" 
                  value={orderForm.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={orderForm.phone}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <button type="submit" className="btn-primary btn-block">Place Order</button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal">
          <div className="modal-content confirmation-modal">
            <h2>Order Confirmed!</h2>
            <p>Thank you for your order. We'll prepare it right away!</p>
            <div className="confirmation-icon">✓</div>
            <button 
              id="backToMenuBtn" 
              className="btn-primary"
              onClick={() => setShowConfirmationModal(false)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Scooby<span>Food</span></h2>
            <p>Delicious food for every mood</p>
          </div>
          
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><a href="/#about">About</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p><i className="fa fa-map-marker"></i> 123 Food Street, Foodville</p>
            <p><i className="fa fa-phone"></i> +1 (555) 123-4567</p>
            <p><i className="fa fa-envelope"></i> info@scoobyfood.com</p>
          </div>
          
          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" className="social-icon"><i className="fa fa-facebook"></i></a>
              <a href="#" className="social-icon"><i className="fa fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fa fa-twitter"></i></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2023 Scooby Food. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MenuPage;
