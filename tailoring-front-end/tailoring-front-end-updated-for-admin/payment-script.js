document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Load order details from local storage
    loadOrderDetails();
    
    // Initialize payment method selection
    initPaymentMethodSelection();
    
    // Initialize form submission
    initFormSubmission();
    
    // Initialize back button
    initBackButton();
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

// Load order details from local storage
function loadOrderDetails() {
    // Get cart and customization data from local storage
    if (localStorage.getItem('cart') && localStorage.getItem('customization')) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        const customization = JSON.parse(localStorage.getItem('customization'));
        
        // Get the last added product (most recent)
        if (cart.length > 0) {
            const product = cart[cart.length - 1];
            
            // Update product details in the summary
            document.getElementById('product-image').src = product.image;
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-fabric').textContent = `Fabric: ${product.fabricType}`;
            
            // Update color dot and name
            const colorDot = document.querySelector('.color-dot');
            colorDot.style.backgroundColor = product.color;
            
            // Convert RGB color to name (simplified version)
            const colorName = getColorName(product.color);
            document.getElementById('product-color').innerHTML = `Color: <span class="color-dot" style="background-color: ${product.color}"></span> ${colorName}`;
            
            // Update quantity and price
            document.getElementById('product-quantity').textContent = `Quantity: ${product.quantity}`;
            document.getElementById('product-price').textContent = product.price;
            document.getElementById('quantity').textContent = product.quantity;
            
            // Calculate total price
            const price = parseInt(product.price.replace(/[^0-9]/g, ''));
            const quantity = parseInt(product.quantity);
            const totalPrice = price * quantity;
            document.getElementById('total-price').textContent = `₹${totalPrice.toLocaleString()}`;
            document.getElementById('cod-total-price').textContent = `₹${(totalPrice + 50).toLocaleString()}`;
            
            // Update customer details
            document.getElementById('customer-name').textContent = `Name: ${customization.customerName}`;
            document.getElementById('customer-phone').textContent = `Phone: ${customization.customerPhone}`;
            document.getElementById('customer-email').textContent = `Email: ${customization.customerEmail || 'Not provided'}`;
        } else {
            // Redirect to product page if no product in cart
            window.location.href = 'product-page.html';
        }
    } else {
        // Redirect to product page if no cart or customization data exists
        window.location.href = 'product-page.html';
    }
}

// Get color name from RGB value (simplified)
function getColorName(rgbColor) {
    // Extract RGB values
    const rgb = rgbColor.match(/\d+/g);
    
    if (!rgb || rgb.length < 3) {
        // Handle hex colors or named colors
        const colorMap = {
            '#d32f2f': 'Red',
            '#388e3c': 'Green',
            '#1976d2': 'Blue',
            '#fbc02d': 'Yellow',
            '#7b1fa2': 'Purple'
        };
        
        // Try to match with known colors
        for (const [hex, name] of Object.entries(colorMap)) {
            if (rgbColor.toLowerCase() === hex) {
                return name;
            }
        }
        
        return 'Custom';
    }
    
    const r = parseInt(rgb[0]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2]);
    
    // Simple color detection
    if (r > 200 && g < 100 && b < 100) return 'Red';
    if (r < 100 && g > 200 && b < 100) return 'Green';
    if (r < 100 && g < 100 && b > 200) return 'Blue';
    if (r > 200 && g > 200 && b < 100) return 'Yellow';
    if (r > 200 && g < 100 && b > 200) return 'Purple';
    if (r < 100 && g > 200 && b > 200) return 'Cyan';
    if (r > 200 && g > 100 && b < 100) return 'Orange';
    if (r > 200 && g > 200 && b > 200) return 'White';
    if (r < 100 && g < 100 && b < 100) return 'Black';
    
    return 'Custom';
}

// Initialize payment method selection
function initPaymentMethodSelection() {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const paymentForms = document.querySelectorAll('.payment-form-section');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all payment forms
            paymentForms.forEach(form => {
                form.classList.remove('active');
            });
            
            // Show selected payment form
            const selectedForm = document.getElementById(`${this.value}-form`);
            if (selectedForm) {
                selectedForm.classList.add('active');
            }
        });
    });
}

// Initialize form submission
function initFormSubmission() {
    const paymentForm = document.getElementById('payment-form');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form based on selected payment method
        if (validatePaymentForm()) {
            // Generate random order ID
            const orderId = 'ETS' + Math.floor(100000 + Math.random() * 900000);
            document.getElementById('order-id').textContent = orderId;
            
            // Calculate delivery date (7-10 days from now)
            const today = new Date();
            const deliveryDate = new Date(today);
            deliveryDate.setDate(today.getDate() + 7);
            const formattedDate = deliveryDate.toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            document.getElementById('delivery-date').textContent = formattedDate + ' - ' + 
                new Date(today.setDate(today.getDate() + 3)).toLocaleDateString('en-IN', { 
                    day: 'numeric' 
                }) + ' ' + 
                new Date(today).toLocaleDateString('en-IN', { 
                    month: 'long'
                });
            
            // Show confirmation modal
            confirmationModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Clear cart and customization data from local storage
            localStorage.removeItem('cart');
            localStorage.removeItem('customization');
        }
    });
    
    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
        window.location.href = 'index.html';
    });
    
    // Continue shopping button
    continueShoppingBtn.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
        window.location.href = 'index.html';
    });
    
    // Close modal when clicking outside the content
    window.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling
            window.location.href = 'index.html';
        }
    });
}

// Validate payment form based on selected method
function validatePaymentForm() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    let isValid = true;
    
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    
    if (selectedMethod === 'upi') {
        const upiId = document.getElementById('upi-id');
        if (!upiId.value.trim() || !upiId.value.includes('@')) {
            isValid = false;
            showError(upiId, 'Please enter a valid UPI ID');
        }
    } else if (selectedMethod === 'card') {
        const cardNumber = document.getElementById('card-number');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCvv = document.getElementById('card-cvv');
        const cardName = document.getElementById('card-name');
        
        if (!cardNumber.value.trim() || cardNumber.value.replace(/\s/g, '').length !== 16) {
            isValid = false;
            showError(cardNumber, 'Please enter a valid 16-digit card number');
        }
        
        if (!cardExpiry.value.trim() || !cardExpiry.value.includes('/')) {
            isValid = false;
            showError(cardExpiry, 'Please enter a valid expiry date (MM/YY)');
        }
        
        if (!cardCvv.value.trim() || cardCvv.value.length !== 3) {
            isValid = false;
            showError(cardCvv, 'Please enter a valid 3-digit CVV');
        }
        
        if (!cardName.value.trim()) {
            isValid = false;
            showError(cardName, 'Please enter the name on card');
        }
    } else if (selectedMethod === 'netbanking') {
        const bankSelect = document.getElementById('bank-select');
        if (!bankSelect.value) {
            isValid = false;
            showError(bankSelect, 'Please select your bank');
        }
    }
    
    return isValid;
}

// Show error message for a field
function showError(field, message) {
    field.classList.add('error');
    
    // Add error message if not exists
    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
        const errorMessage = document.createElement('span');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = message;
        field.parentNode.insertBefore(errorMessage, field.nextSibling);
    }
}

// Initialize back button
function initBackButton() {
    const backBtn = document.getElementById('back-to-customize');
    
    backBtn.addEventListener('click', function() {
        window.location.href = 'customize.html';
    });
}