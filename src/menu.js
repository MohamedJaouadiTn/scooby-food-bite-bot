
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const menuItems = document.querySelectorAll('.menu-item');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cartIcon = document.querySelector('.cart-icon');
  const cartCount = document.querySelector('.cart-count');
  const cartModal = document.getElementById('cartModal');
  const orderModal = document.getElementById('orderModal');
  const confirmationModal = document.getElementById('confirmationModal');
  const cartItems = document.querySelector('.cart-items');
  const cartTotal = document.getElementById('cartTotal');
  const orderSummary = document.getElementById('orderSummary');
  const orderTotal = document.getElementById('orderTotal');
  const clearCartBtn = document.getElementById('clearCart');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const orderForm = document.getElementById('orderForm');
  const backToMenuBtn = document.getElementById('backToMenuBtn');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  
  // Telegram Bot Configuration
  const token = "YOUR_BOT_TOKEN"; // Replace with your Telegram bot token
  const chatId = "YOUR_CHAT_ID"; // Replace with your chat ID
  
  // Cart data
  let cart = [];
  const savedCart = localStorage.getItem('scoobyfoodCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
  
  // Menu item filtering
  if (filterBtns) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        // Filter menu items
        menuItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
  
  // Add to cart functionality
  const addToCartBtns = document.querySelectorAll('.btn-add-cart');
  if (addToCartBtns) {
    addToCartBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        
        // Check if item is already in cart
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            id,
            name,
            price,
            quantity: 1
          });
        }
        
        // Update cart UI
        updateCartCount();
        saveCart();
        
        // Show confirmation
        showToast(`${name} added to cart!`);
      });
    });
  }
  
  // Buy now functionality
  const buyNowBtns = document.querySelectorAll('.btn-buy-now');
  if (buyNowBtns) {
    buyNowBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        
        // Clear existing cart
        cart = [{
          id,
          name,
          price,
          quantity: 1
        }];
        
        updateCartCount();
        saveCart();
        
        // Open order modal directly
        openOrderModal();
      });
    });
  }
  
  // Open cart modal
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      updateCartItemsUI();
      openModal(cartModal);
    });
  }
  
  // Proceed to checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
      }
      
      closeModal(cartModal);
      openOrderModal();
    });
  }
  
  // Clear cart
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      cart = [];
      updateCartCount();
      updateCartItemsUI();
      saveCart();
    });
  }
  
  // Handle order submission
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const name = document.getElementById('name').value;
      const address = document.getElementById('address').value;
      const phone = document.getElementById('phone').value;
      
      // Create message for Telegram
      let message = `New Order!\n\n`;
      
      cart.forEach(item => {
        message += `Item = ${item.name}\n`;
        message += `Quantity = ${item.quantity}\n`;
        message += `Price = $${(item.price * item.quantity).toFixed(2)}\n`;
      });
      
      message += `\nTotal = $${calculateTotal()}\n`;
      message += `\nCustomer Information:\n`;
      message += `Name = ${name}\n`;
      message += `Address = ${address}\n`;
      message += `Phone = ${phone}`;
      
      // Send to Telegram
      sendToTelegram(message);
      
      // Show confirmation and reset cart
      closeModal(orderModal);
      openModal(confirmationModal);
      cart = [];
      updateCartCount();
      saveCart();
    });
  }
  
  // Back to menu button
  if (backToMenuBtn) {
    backToMenuBtn.addEventListener('click', () => {
      closeModal(confirmationModal);
    });
  }
  
  // Close modals
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      closeModal(modal);
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      closeModal(e.target);
    }
  });
  
  // Helper Functions
  function updateCartCount() {
    if (cartCount) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartCount.textContent = totalItems;
    }
  }
  
  function saveCart() {
    localStorage.setItem('scoobyfoodCart', JSON.stringify(cart));
  }
  
  function updateCartItemsUI() {
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      cartTotal.textContent = '$0.00';
      return;
    }
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span>$${item.price.toFixed(2)}</span>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-decrease" data-id="${item.id}">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-increase" data-id="${item.id}">+</button>
          <span class="remove-item" data-id="${item.id}">×</span>
        </div>
      `;
      
      cartItems.appendChild(cartItem);
    });
    
    // Update total
    cartTotal.textContent = `$${calculateTotal()}`;
    
    // Add event listeners to quantity buttons
    const decreaseBtns = cartItems.querySelectorAll('.quantity-decrease');
    const increaseBtns = cartItems.querySelectorAll('.quantity-increase');
    const removeItemBtns = cartItems.querySelectorAll('.remove-item');
    
    decreaseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        decreaseQuantity(id);
      });
    });
    
    increaseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        increaseQuantity(id);
      });
    });
    
    removeItemBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        removeFromCart(id);
      });
    });
  }
  
  function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  }
  
  function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        removeFromCart(id);
        return;
      }
      updateCartCount();
      updateCartItemsUI();
      saveCart();
    }
  }
  
  function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
      item.quantity += 1;
      updateCartCount();
      updateCartItemsUI();
      saveCart();
    }
  }
  
  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    updateCartItemsUI();
    saveCart();
  }
  
  function openOrderModal() {
    if (!orderSummary || !orderTotal) return;
    
    orderSummary.innerHTML = '';
    
    cart.forEach(item => {
      const orderItem = document.createElement('div');
      orderItem.classList.add('order-item');
      
      orderItem.innerHTML = `
        <div>${item.quantity}x ${item.name}</div>
        <div>$${(item.price * item.quantity).toFixed(2)}</div>
      `;
      
      orderSummary.appendChild(orderItem);
    });
    
    orderTotal.textContent = `$${calculateTotal()}`;
    openModal(orderModal);
  }
  
  function sendToTelegram(message) {
    // Don't send to Telegram if token or chatId is not set
    if (token === "YOUR_BOT_TOKEN" || chatId === "YOUR_CHAT_ID") {
      console.log("Telegram bot not configured. Message would be:");
      console.log(message);
      return;
    }
    
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error sending to Telegram:", error));
  }
  
  function openModal(modal) {
    if (modal) {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeModal(modal) {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }
  
  // Toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Add styles inline
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    toast.style.color = 'white';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '4px';
    toast.style.zIndex = '1000';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Show toast
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      
      // Remove from DOM after fade out
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
});
