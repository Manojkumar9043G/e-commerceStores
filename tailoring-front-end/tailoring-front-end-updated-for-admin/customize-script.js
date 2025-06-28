document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Load product details from local storage
    loadProductDetails();
    
    // Initialize form functionality
    initFormFunctionality();
    
    // Initialize measurement guide modal
    initMeasurementGuide();
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

// Load product details from local storage
function loadProductDetails() {
    // Get cart from local storage
    if (localStorage.getItem('cart')) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        
        // Get the last added product (most recent)
        if (cart.length > 0) {
            const product = cart[cart.length - 1];
            
            // Update product details in the summary
            document.getElementById('product-image').src = product.image;
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-price').textContent = product.price;
            document.getElementById('product-fabric').textContent = product.fabricType;
            
            // Update color dot and name
            const colorDot = document.querySelector('.color-dot');
            colorDot.style.backgroundColor = product.color;
            
            // Convert RGB color to name (simplified version)
            const colorName = getColorName(product.color);
            document.getElementById('product-color').innerHTML = `<span class="color-dot" style="background-color: ${product.color}"></span> ${colorName}`;
            
            // Update quantity and total price
            document.getElementById('product-quantity').textContent = product.quantity;
            
            // Calculate total price
            const price = parseInt(product.price.replace(/[^0-9]/g, ''));
            const quantity = parseInt(product.quantity);
            const totalPrice = price * quantity;
            document.getElementById('total-price').textContent = `₹${totalPrice.toLocaleString()}`;
        } else {
            // Redirect to product page if no product in cart
            window.location.href = 'product-page.html';
        }
    } else {
        // Redirect to product page if no cart exists
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

// Initialize form functionality
function initFormFunctionality() {
    const customizeForm = document.getElementById('customize-form');
    const backToProductBtn = document.getElementById('back-to-product');
    
    // Handle back to product button
    backToProductBtn.addEventListener('click', function() {
        window.location.href = 'product-page.html';
    });
    
    // Handle form submission
    customizeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            // Save form data to local storage
            saveFormData();
            
            // Redirect to payment page
            window.location.href = 'payment.html';
        }
    });
}

// Validate form fields
function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Add error message if not exists
            if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                const errorMessage = document.createElement('span');
                errorMessage.classList.add('error-message');
                errorMessage.textContent = 'This field is required';
                field.parentNode.insertBefore(errorMessage, field.nextSibling);
            }
        } else {
            field.classList.remove('error');
            
            // Remove error message if exists
            if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                field.nextElementSibling.remove();
            }
        }
    });
    
    return isValid;
}

// Save form data to local storage
function saveFormData() {
    const formData = {
        customerName: document.getElementById('customer-name').value,
        customerPhone: document.getElementById('customer-phone').value,
        customerEmail: document.getElementById('customer-email').value,
        customerAddress: document.getElementById('customer-address').value,
        measurements: {
            chest: document.getElementById('measurement-chest').value,
            waist: document.getElementById('measurement-waist').value,
            shoulder: document.getElementById('measurement-shoulder').value,
            sleeve: document.getElementById('measurement-sleeve').value,
            length: document.getElementById('measurement-length').value,
            neck: document.getElementById('measurement-neck').value
        },
        design: {
            neckDesign: document.getElementById('neck-design').value,
            sleeveDesign: document.getElementById('sleeve-design').value,
            backDesign: document.getElementById('back-design').value,
            additionalNotes: document.getElementById('additional-notes').value
        }
    };
    
    // Save to local storage
    localStorage.setItem('customization', JSON.stringify(formData));
}

// Initialize measurement guide modal
function initMeasurementGuide() {
    const showGuideBtn = document.getElementById('show-measurement-guide');
    const measurementModal = document.getElementById('measurement-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Show modal when clicking the guide link
    showGuideBtn.addEventListener('click', function(e) {
        e.preventDefault();
        measurementModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', function() {
        measurementModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    });
    
    // Close modal when clicking outside the content
    window.addEventListener('click', function(e) {
        if (e.target === measurementModal) {
            measurementModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
    });
}