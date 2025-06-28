document.addEventListener('DOMContentLoaded', function() {
    // Initialize product page functionality
    initProductImageGallery();
    initProductRotation();
    initVariantSelection();
    initQuantitySelector();
    initProductTabs();
    initAddToCartButton();
});

// Initialize product image gallery
function initProductImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image source
            const imgSrc = this.querySelector('img').src;
            mainImage.src = imgSrc;
            
            // Reset rotation
            mainImage.style.transform = 'rotate(0deg)';
        });
    });
}

// Initialize 360° product rotation
function initProductRotation() {
    const mainImage = document.getElementById('main-product-image');
    const rotateLeftBtn = document.getElementById('rotate-left');
    const rotateRightBtn = document.getElementById('rotate-right');
    
    let currentRotation = 0;
    
    rotateLeftBtn.addEventListener('click', function() {
        currentRotation -= 90;
        mainImage.style.transform = `rotate(${currentRotation}deg)`;
    });
    
    rotateRightBtn.addEventListener('click', function() {
        currentRotation += 90;
        mainImage.style.transform = `rotate(${currentRotation}deg)`;
    });
}

// Initialize variant selection
function initVariantSelection() {
    // Fabric type selection
    const variantBtns = document.querySelectorAll('.variant-btn');
    variantBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all variant buttons in the same group
            const parentGroup = this.closest('.variant-options');
            parentGroup.querySelectorAll('.variant-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // Color selection
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all color buttons
            colorBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
}

// Initialize quantity selector
function initQuantitySelector() {
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    const quantityInput = document.getElementById('quantity');
    
    decreaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    // Ensure quantity is always valid
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        } else if (value > 10) {
            this.value = 10;
        }
    });
}

// Initialize product tabs
function initProductTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get the tab to activate
            const tabToActivate = this.getAttribute('data-tab');
            
            // Remove active class from all tab buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(tabToActivate).classList.add('active');
        });
    });
}

// Initialize add to cart button
function initAddToCartButton() {
    const addToCartBtn = document.getElementById('add-to-cart');
    
    addToCartBtn.addEventListener('click', function() {
        // Get selected options
        const fabricType = document.querySelector('.variant-btn.active').textContent;
        const color = document.querySelector('.color-btn.active').style.backgroundColor;
        const quantity = document.getElementById('quantity').value;
        
        // Create product object
        const product = {
            name: document.querySelector('.product-details h1').textContent,
            price: document.querySelector('.current-price').textContent,
            fabricType: fabricType,
            color: color,
            quantity: quantity,
            image: document.getElementById('main-product-image').src
        };
        
        // Save to local storage
        saveToCart(product);
        
        // Redirect to customization page
        window.location.href = 'customize.html';
    });
}

// Save product to cart in local storage
function saveToCart(product) {
    let cart = [];
    
    // Check if cart already exists in local storage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    
    // Add product to cart
    cart.push(product);
    
    // Save cart back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
}