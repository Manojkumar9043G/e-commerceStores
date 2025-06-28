document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize cart tabs
    initCartTabs();
    
    // Load cart items from local storage
    loadCartItems();
    
    // Load order history from local storage
    loadOrderHistory();
    
    // Initialize checkout button
    initCheckoutButton();
});

// Initialize theme switching functionality
function initTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            themeSwitch.checked = true;
        }
    }
    
    // Add event listener to toggle theme
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Initialize cart tabs
function initCartTabs() {
    const tabs = document.querySelectorAll('.cart-tab');
    const contents = document.querySelectorAll('.cart-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const tabName = this.getAttribute('data-tab');
            document.getElementById(`${tabName}-content`).classList.add('active');
        });
    });
}

// Load cart items from local storage
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    
    // Get cart from local storage
    let cart = [];
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    
    // Show empty cart message if cart is empty
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        return;
    }
    
    // Hide empty cart message and show cart items
    cartItemsContainer.style.display = 'block';
    emptyCartMessage.style.display = 'none';
    
    // Clear cart items container
    cartItemsContainer.innerHTML = '';
    
    // Calculate total price
    let subtotal = 0;
    
    // Add each cart item to the container
    cart.forEach((item, index) => {
        // Extract price value (remove currency symbol and commas)
        const price = parseInt(item.price.replace(/[^0-9]/g, ''));
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-info">
                    <div>
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-variant">Fabric: ${item.fabricType}</p>
                        <p class="cart-item-variant">Color: <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${item.color}; margin-right: 5px;"></span></p>
                    </div>
                    <div class="cart-item-price">₹${itemTotal.toLocaleString()}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="decrease-btn" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-btn" data-index="${index}">+</button>
                    </div>
                    <div class="cart-item-remove" data-index="${index}">Remove</div>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update summary
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('tax').textContent = `₹${tax.toLocaleString()}`;
    document.getElementById('total').textContent = `₹${total.toLocaleString()}`;
    
    // Add event listeners to quantity buttons and remove buttons
    addCartItemEventListeners();
}

// Add event listeners to cart item buttons
function addCartItemEventListeners() {
    // Decrease quantity buttons
    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateCartItemQuantity(index, -1);
        });
    });
    
    // Increase quantity buttons
    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateCartItemQuantity(index, 1);
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeCartItem(index);
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(index, change) {
    // Get cart from local storage
    let cart = [];
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    
    // Update quantity
    cart[index].quantity = Math.max(1, parseInt(cart[index].quantity) + change);
    
    // Save updated cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Reload cart items
    loadCartItems();
}

// Remove cart item
function removeCartItem(index) {
    // Get cart from local storage
    let cart = [];
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    
    // Remove item at index
    cart.splice(index, 1);
    
    // Save updated cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Reload cart items
    loadCartItems();
}

// Load order history from local storage
function loadOrderHistory() {
    const orderHistoryContainer = document.getElementById('order-history');
    const emptyHistoryMessage = document.getElementById('empty-history');
    
    // Get order history from local storage
    let orderHistory = [];
    if (localStorage.getItem('orderHistory')) {
        orderHistory = JSON.parse(localStorage.getItem('orderHistory'));
    }
    
    // Show empty history message if history is empty
    if (orderHistory.length === 0) {
        orderHistoryContainer.style.display = 'none';
        emptyHistoryMessage.style.display = 'block';
        return;
    }
    
    // Hide empty history message and show order history
    orderHistoryContainer.style.display = 'block';
    emptyHistoryMessage.style.display = 'none';
    
    // Clear order history container
    orderHistoryContainer.innerHTML = '';
    
    // Add each order to the container (most recent first)
    orderHistory.reverse().forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-history-item';
        
        // Create order header
        const orderHeader = document.createElement('div');
        orderHeader.className = 'order-header';
        orderHeader.innerHTML = `
            <div>
                <div class="order-id">Order #${order.orderId}</div>
                <div class="order-status completed">Completed</div>
            </div>
            <div class="order-date">${new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        `;
        
        // Create order items list
        const orderItems = document.createElement('div');
        orderItems.className = 'order-items';
        
        // Add each item in the order
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-info">
                        <div>
                            <h3 class="cart-item-name">${item.name}</h3>
                            <p class="cart-item-variant">Fabric: ${item.fabricType}</p>
                            <p class="cart-item-variant">Color: <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${item.color}; margin-right: 5px;"></span></p>
                        </div>
                        <div class="cart-item-price">₹${(parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity).toLocaleString()}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <span>Quantity: ${item.quantity}</span>
                        </div>
                    </div>
                </div>
            `;
            
            orderItems.appendChild(itemElement);
        });
        
        // Create order total
        const orderTotal = document.createElement('div');
        orderTotal.className = 'order-total';
        orderTotal.textContent = `Total: ₹${order.total.toLocaleString()}`;
        
        // Assemble the order element
        orderElement.appendChild(orderHeader);
        orderElement.appendChild(orderItems);
        orderElement.appendChild(orderTotal);
        
        orderHistoryContainer.appendChild(orderElement);
    });
}

// Initialize checkout button
function initCheckoutButton() {
    const checkoutBtn = document.getElementById('checkout-btn');
    
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get cart from local storage
        let cart = [];
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        
        // Check if cart is empty
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items to your cart before checkout.');
            return;
        }
        
        // Calculate total price
        let subtotal = 0;
        cart.forEach(item => {
            const price = parseInt(item.price.replace(/[^0-9]/g, ''));
            subtotal += price * item.quantity;
        });
        
        const tax = Math.round(subtotal * 0.05); // 5% tax
        const total = subtotal + tax;
        
        // Simulate payment process (in a real app, this would redirect to a payment gateway)
        if (confirm('Proceed to payment?')) {
            // Create order object
            const order = {
                orderId: 'ETS' + Math.floor(100000 + Math.random() * 900000),
                date: new Date().toISOString(),
                items: [...cart],
                subtotal: subtotal,
                tax: tax,
                total: total
            };
            
            // Add order to order history
            let orderHistory = [];
            if (localStorage.getItem('orderHistory')) {
                orderHistory = JSON.parse(localStorage.getItem('orderHistory'));
            }
            
            orderHistory.push(order);
            
            // Save order history to local storage
            localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
            
            // Clear cart
            localStorage.removeItem('cart');
            
            // Show success message
            alert('Payment successful! Your order has been placed.');
            
            // Reload cart and order history
            loadCartItems();
            loadOrderHistory();
            
            // Switch to order history tab
            document.querySelector('.cart-tab[data-tab="history"]').click();
        }
    });
}