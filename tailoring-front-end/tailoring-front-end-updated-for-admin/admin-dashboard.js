document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    checkAdminAuth();
    
    // Initialize theme
    initTheme();
    
    // Initialize admin dashboard functionality
    initAdminDashboard();
    
    // Initialize product management
    initProductManagement();
});

// Check if admin is logged in
function checkAdminAuth() {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    
    if (!adminLoggedIn || adminLoggedIn !== 'true') {
        // Redirect to admin login page
        window.location.href = 'admin-login.html';
    }
}

// Initialize theme switching functionality
function initTheme() {
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        // Use device preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }
}

// Initialize admin dashboard functionality
function initAdminDashboard() {
    // Toggle sidebar on mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    const adminMain = document.getElementById('adminMain');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            adminSidebar.classList.toggle('active');
            adminMain.classList.toggle('pushed');
        });
    }
    
    // Toggle user dropdown
    const adminUser = document.getElementById('adminUser');
    const adminUserDropdown = document.getElementById('adminUserDropdown');
    
    if (adminUser) {
        adminUser.addEventListener('click', function(e) {
            e.stopPropagation();
            adminUserDropdown.classList.toggle('active');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        if (adminUserDropdown && adminUserDropdown.classList.contains('active')) {
            adminUserDropdown.classList.remove('active');
        }
    });
    
    // Handle logout
    const logoutLink = document.getElementById('logoutLink');
    const dropdownLogoutLink = document.getElementById('dropdownLogoutLink');
    
    const handleLogout = function() {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    };
    
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
    
    if (dropdownLogoutLink) {
        dropdownLogoutLink.addEventListener('click', handleLogout);
    }
    
    // Handle navigation
    const productsLink = document.getElementById('productsLink');
    const productsSection = document.getElementById('productsSection');
    
    if (productsLink) {
        productsLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Highlight active link
            document.querySelector('.admin-sidebar-menu a.active').classList.remove('active');
            this.classList.add('active');
            
            // Show products section
            productsSection.style.display = 'block';
        });
    }
}

// Initialize product management functionality
function initProductManagement() {
    // Sample product data (in a real app, this would come from a database)
    let products = [
        {
            id: 1,
            name: 'Designer Lining Blouse',
            category: 'blouse',
            subcategory: 'lining',
            price: 1200,
            discountPrice: 1500,
            status: 'active',
            image: 'https://via.placeholder.com/150x200',
            description: 'Elegant designer lining blouse with intricate embroidery and perfect fitting.',
            features: [
                'Premium quality fabric',
                'Intricate embroidery work',
                'Comfortable inner lining',
                'Perfect fitting',
                'Customizable design'
            ],
            variants: [
                { type: 'Fabric', options: ['Silk', 'Cotton', 'Satin'] },
                { type: 'Color', options: ['Red', 'Green', 'Blue', 'Yellow', 'Purple'] }
            ],
            specifications: [
                { name: 'Material', value: 'Premium Silk, Cotton, or Satin' },
                { name: 'Lining', value: 'Soft Cotton' },
                { name: 'Embroidery', value: 'Hand-crafted' },
                { name: 'Closure', value: 'Hook and Eye' },
                { name: 'Care Instructions', value: 'Dry Clean Only' }
            ]
        },
        {
            id: 2,
            name: 'Normal Blouse',
            category: 'blouse',
            subcategory: 'normal',
            price: 800,
            discountPrice: 1000,
            status: 'active',
            image: 'https://via.placeholder.com/150x200',
            description: 'Simple and elegant normal blouse with perfect fitting.',
            features: [
                'Quality fabric',
                'Simple design',
                'Perfect fitting',
                'Customizable'
            ],
            variants: [
                { type: 'Fabric', options: ['Cotton', 'Silk'] },
                { type: 'Color', options: ['Red', 'Green', 'Blue', 'Black'] }
            ],
            specifications: [
                { name: 'Material', value: 'Cotton or Silk' },
                { name: 'Closure', value: 'Hook and Eye' },
                { name: 'Care Instructions', value: 'Hand Wash' }
            ]
        },
        {
            id: 3,
            name: 'Designer Chudithar',
            category: 'chudithar',
            subcategory: '',
            price: 1500,
            discountPrice: 1800,
            status: 'active',
            image: 'https://via.placeholder.com/150x200',
            description: 'Beautiful designer chudithar with elegant embroidery.',
            features: [
                'Premium quality fabric',
                'Elegant design',
                'Perfect fitting',
                'Comfortable wear'
            ],
            variants: [
                { type: 'Fabric', options: ['Cotton', 'Silk', 'Crepe'] },
                { type: 'Color', options: ['Red', 'Green', 'Blue', 'Yellow'] }
            ],
            specifications: [
                { name: 'Material', value: 'Premium Cotton, Silk, or Crepe' },
                { name: 'Set Includes', value: 'Top, Bottom, Dupatta' },
                { name: 'Care Instructions', value: 'Dry Clean Recommended' }
            ]
        }
    ];
    
    // Get DOM elements
    const productTableBody = document.getElementById('productTableBody');
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const productForm = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');
    
    // Populate product table
    function renderProductTable() {
        if (!productTableBody) return;
        
        productTableBody.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" class="product-image"></td>
                <td>
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${getCategoryName(product.category)}${product.subcategory ? ' - ' + getSubcategoryName(product.subcategory) : ''}</div>
                </td>
                <td>${getCategoryName(product.category)}</td>
                <td>
                    <div class="product-price">₹${product.price}</div>
                    ${product.discountPrice ? `<div class="product-discount">₹${product.discountPrice}</div>` : ''}
                </td>
                <td><span class="product-status status-${product.status}">${capitalizeFirstLetter(product.status)}</span></td>
                <td>
                    <div class="product-actions">
                        <button class="action-btn edit-btn" data-id="${product.id}" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${product.id}" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            
            productTableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                editProduct(productId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                deleteProduct(productId);
            });
        });
    }
    
    // Helper functions
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
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Add new product
    function addProduct() {
        modalTitle.textContent = 'Add New Product';
        productForm.reset();
        document.getElementById('productId').value = '';
        openModal();
    }
    
    // Edit product
    function editProduct(productId) {
        const product = products.find(p => p.id === productId);
        
        if (product) {
            modalTitle.textContent = 'Edit Product';
            
            // Fill form with product data
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            
            // Update subcategories based on selected category
            updateSubcategories(product.category);
            
            document.getElementById('productSubcategory').value = product.subcategory;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDiscountPrice').value = product.discountPrice || '';
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productStatus').value = product.status;
            
            // Handle image preview
            const imagePreview = document.getElementById('imagePreview');
            if (imagePreview) {
                imagePreview.innerHTML = `
                    <div class="admin-image-item">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="admin-image-remove"><i class="fas fa-times"></i></div>
                    </div>
                `;
            }
            
            openModal();
        }
    }
    
    // Delete product
    function deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== productId);
            renderProductTable();
            
            // In a real app, you would also delete from the database
            // and update the product count in the dashboard
            updateProductCount();
        }
    }
    
    // Update subcategories based on selected category
    function updateSubcategories(category) {
        const subcategorySelect = document.getElementById('productSubcategory');
        
        // Clear existing options
        subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
        
        // Add relevant subcategories based on category
        if (category === 'blouse') {
            subcategorySelect.innerHTML += `
                <option value="normal">Normal Blouse</option>
                <option value="lining">Lining Blouse</option>
            `;
        }
        
        // Enable/disable subcategory select based on whether options are available
        subcategorySelect.disabled = subcategorySelect.options.length <= 1;
    }
    
    // Open modal
    function openModal() {
        productModal.classList.add('active');
    }
    
    // Close modal
    function closeModal() {
        productModal.classList.remove('active');
    }
    
    // Update product count in dashboard
    function updateProductCount() {
        const productCountElement = document.querySelector('.admin-card-value');
        if (productCountElement) {
            productCountElement.textContent = products.length;
        }
    }
    
    // Event listeners
    if (addProductBtn) {
        addProductBtn.addEventListener('click', addProduct);
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === productModal) {
            closeModal();
        }
    });
    
    // Handle category change
    const categorySelect = document.getElementById('productCategory');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            updateSubcategories(this.value);
        });
    }
    
    // Handle form submission
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productId = document.getElementById('productId').value;
            const name = document.getElementById('productName').value;
            const category = document.getElementById('productCategory').value;
            const subcategory = document.getElementById('productSubcategory').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const discountPrice = document.getElementById('productDiscountPrice').value ? parseFloat(document.getElementById('productDiscountPrice').value) : null;
            const description = document.getElementById('productDescription').value;
            const status = document.getElementById('productStatus').value;
            const image = 'https://via.placeholder.com/150x200'; // In a real app, this would be uploaded
            
            if (productId) {
                // Update existing product
                const index = products.findIndex(p => p.id === parseInt(productId));
                
                if (index !== -1) {
                    products[index] = {
                        ...products[index],
                        name,
                        category,
                        subcategory,
                        price,
                        discountPrice,
                        description,
                        status,
                        image
                    };
                }
            } else {
                // Add new product
                const newProduct = {
                    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                    name,
                    category,
                    subcategory,
                    price,
                    discountPrice,
                    description,
                    status,
                    image,
                    features: [],
                    variants: [],
                    specifications: []
                };
                
                products.push(newProduct);
            }
            
            // Update UI
            renderProductTable();
            updateProductCount();
            closeModal();
            
            // In a real app, you would save to a database here
        });
    }
    
    // Initialize the product table
    renderProductTable();
    updateProductCount();
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

// Function to update product listings on user-facing pages
function updateProductListings() {
    // In a real application, this would update the product listings on user-facing pages
    // For this demo, we're just saving to localStorage
    const products = loadProducts();
    
    // Update category pages with products
    // This is a simplified example - in a real app, this would be more complex
    const categories = ['blouse', 'chudithar', 'uniform', 'artwork', 'embroidery'];
    
    categories.forEach(category => {
        const categoryProducts = products.filter(p => p.category === category);
        // Save category products to localStorage or update DOM
        localStorage.setItem(`${category}Products`, JSON.stringify(categoryProducts));
    });
}