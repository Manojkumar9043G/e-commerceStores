document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize category page
    initCategoryPage();
});

// Initialize theme switching functionality
function initTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            themeSwitch.checked = true;
        }
    } else {
        // Use device preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
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

function initCategoryPage() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const subcategory = urlParams.get('subcategory');
    
    // Update page title and description based on category
    updateCategoryHeader(category, subcategory);
    
    // Load products
    loadCategoryProducts(category, subcategory);
    
    // Initialize view toggle
    initViewToggle();
    
    // Initialize filters
    initFilters(category);
}

function updateCategoryHeader(category, subcategory) {
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryDescription = document.getElementById('categoryDescription');
    
    if (category) {
        const categoryMap = {
            'blouse': 'Blouses',
            'chudithar': 'Chudithar',
            'uniform': 'Uniforms',
            'artwork': 'Artwork Designs',
            'embroidery': 'Embroidery'
        };
        
        const subcategoryMap = {
            'normal': 'Normal Blouses',
            'lining': 'Lining Blouses'
        };
        
        if (subcategory && subcategoryMap[subcategory]) {
            categoryTitle.textContent = subcategoryMap[subcategory];
            categoryDescription.textContent = `Browse our collection of high-quality ${subcategoryMap[subcategory].toLowerCase()} designed for your style and comfort.`;
        } else if (categoryMap[category]) {
            categoryTitle.textContent = categoryMap[category];
            categoryDescription.textContent = `Browse our collection of high-quality ${categoryMap[category].toLowerCase()} designed for your style and comfort.`;
        }
    }
}

function loadCategoryProducts(category, subcategory) {
    // In a real app, this would fetch from a database or API
    // For demo purposes, we'll use sample data from localStorage or create some
    let products = [];
    
    // Try to get products from localStorage (would be populated by admin)
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        const allProducts = JSON.parse(savedProducts);
        
        // Filter by category and subcategory if provided
        products = allProducts.filter(product => {
            if (category && subcategory) {
                return product.category === category && product.subcategory === subcategory;
            } else if (category) {
                return product.category === category;
            }
            return true;
        });
    }
    
    // If no products found in localStorage, use sample data
    if (products.length === 0) {
        // Sample products for demo
        products = [
            {
                id: 1,
                name: 'Designer Lining Blouse',
                category: 'blouse',
                subcategory: 'lining',
                price: 1200,
                discountPrice: 1500,
                discount: 20,
                image: 'https://via.placeholder.com/300x400',
                description: 'Elegant designer lining blouse with intricate embroidery and perfect fitting.',
                rating: 4.5,
                ratingCount: 42
            },
            {
                id: 2,
                name: 'Normal Blouse',
                category: 'blouse',
                subcategory: 'normal',
                price: 800,
                discountPrice: 1000,
                discount: 20,
                image: 'https://via.placeholder.com/300x400',
                description: 'Simple and elegant normal blouse with perfect fitting.',
                rating: 4.2,
                ratingCount: 28
            },
            {
                id: 3,
                name: 'Designer Chudithar',
                category: 'chudithar',
                subcategory: '',
                price: 1500,
                discountPrice: 1800,
                discount: 16,
                image: 'https://via.placeholder.com/300x400',
                description: 'Beautiful designer chudithar with elegant embroidery.',
                rating: 4.7,
                ratingCount: 35
            }
        ];
        
        // Filter by category and subcategory if provided
        products = products.filter(product => {
            if (category && subcategory) {
                return product.category === category && product.subcategory === subcategory;
            } else if (category) {
                return product.category === category;
            }
            return true;
        });
    }
    
    // Display products
    displayProducts(products);
}

function displayProducts(products) {
    const productsContainer = document.getElementById('productsContainer');
    const noProductsMessage = document.getElementById('noProducts');
    const pagination = document.getElementById('pagination');
    
    // Clear container
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        // Show no products message
        noProductsMessage.style.display = 'block';
        pagination.style.display = 'none';
        return;
    }
    
    // Hide no products message and show pagination
    noProductsMessage.style.display = 'none';
    pagination.style.display = 'flex';
    
    // Check if grid or list view
    const isGridView = document.getElementById('gridViewBtn').classList.contains('active');
    
    // Add products to container
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = isGridView ? 'product-card product-card-grid' : 'product-card product-card-list';
        
        // Calculate stars based on rating
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.discount ? `<div class="product-discount-tag">${product.discount}% OFF</div>` : ''}
            </div>
            <div class="product-content">
                <div>
                    <div class="product-category">${getCategoryName(product.category)}${product.subcategory ? ' - ' + getSubcategoryName(product.subcategory) : ''}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">₹${product.price}</span>
                        ${product.discountPrice ? `<span class="original-price">₹${product.discountPrice}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        <div class="rating-stars">${starsHTML}</div>
                        <span class="rating-count">(${product.ratingCount} reviews)</span>
                    </div>
                    <div class="product-description">${product.description}</div>
                </div>
                <div class="product-actions">
                    <button class="product-btn view-details-btn" onclick="viewProductDetails(${product.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="product-btn add-to-cart-btn" title="Add to Cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="product-btn wishlist-btn" title="Add to Wishlist">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
}

function getCategoryName(category) {
    const categories = {
        'blouse': 'Blouse',
        'chudithar': 'Chudithar',
        'uniform': 'Uniform',
        'artwork': 'Artwork Design',
        'embroidery': 'Embroidery'
    };
    
    return categories[category] || category;
}

function getSubcategoryName(subcategory) {
    const subcategories = {
        'normal': 'Normal Blouse',
        'lining': 'Lining Blouse'
    };
    
    return subcategories[subcategory] || subcategory;
}

function initViewToggle() {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productsContainer = document.getElementById('productsContainer');
    
    gridViewBtn.addEventListener('click', function() {
        if (!this.classList.contains('active')) {
            this.classList.add('active');
            listViewBtn.classList.remove('active');
            productsContainer.className = 'products-grid';
            
            // Update product cards
            document.querySelectorAll('.product-card').forEach(card => {
                card.classList.remove('product-card-list');
                card.classList.add('product-card-grid');
            });
        }
    });
    
    listViewBtn.addEventListener('click', function() {
        if (!this.classList.contains('active')) {
            this.classList.add('active');
            gridViewBtn.classList.remove('active');
            productsContainer.className = 'products-list';
            
            // Update product cards
            document.querySelectorAll('.product-card').forEach(card => {
                card.classList.remove('product-card-grid');
                card.classList.add('product-card-list');
            });
        }
    });
}

function initFilters(category) {
    const subcategoryFilter = document.getElementById('subcategoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    // Populate subcategory filter based on category
    if (category === 'blouse') {
        subcategoryFilter.innerHTML = `
            <option value="">All Blouses</option>
            <option value="normal">Normal Blouse</option>
            <option value="lining">Lining Blouse</option>
        `;
    } else {
        // Hide subcategory filter if not applicable
        subcategoryFilter.parentElement.style.display = 'none';
    }
    
    // Set initial subcategory filter value from URL
    const urlParams = new URLSearchParams(window.location.search);
    const subcategory = urlParams.get('subcategory');
    if (subcategory) {
        subcategoryFilter.value = subcategory;
    }
    
    // Add event listeners to filters
    subcategoryFilter.addEventListener('change', function() {
        // Update URL and reload products
        const urlParams = new URLSearchParams(window.location.search);
        if (this.value) {
            urlParams.set('subcategory', this.value);
        } else {
            urlParams.delete('subcategory');
        }
        window.location.search = urlParams.toString();
    });
    
    sortFilter.addEventListener('change', function() {
        // Sort products without reloading page
        sortProducts(this.value);
    });
}

function sortProducts(sortBy) {
    const productsContainer = document.getElementById('productsContainer');
    const products = Array.from(productsContainer.children);
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.current-price').textContent.replace('₹', ''));
        const priceB = parseFloat(b.querySelector('.current-price').textContent.replace('₹', ''));
        
        if (sortBy === 'price-low') {
            return priceA - priceB;
        } else if (sortBy === 'price-high') {
            return priceB - priceA;
        }
        
        // Default to featured (original order)
        return 0;
    });
    
    // Clear and re-append sorted products
    productsContainer.innerHTML = '';
    products.forEach(product => {
        productsContainer.appendChild(product);
    });
}

function viewProductDetails(productId) {
    // Redirect to product detail page
    window.location.href = `product-page.html?id=${productId}`;
}

// Function to save products to localStorage (for demo purposes)
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Function to load products from localStorage (for demo purposes)
function loadProducts() {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
}