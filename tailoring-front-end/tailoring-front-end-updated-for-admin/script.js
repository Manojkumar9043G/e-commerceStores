document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize animations
    initAnimations();
    
    // Initialize dropdown menu functionality
    initDropdowns();
    
    // Add scroll effects
    initScrollEffects();
    
    // Add particle effects to CTA button
    initCTAButtonEffects();
    
    // Add particle effects to login button
    initLoginButtonEffects();
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
            showNotification('Dark mode activated!', 'success');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            showNotification('Light mode activated!', 'success');
        }
    });
}

// Initialize animations
function initAnimations() {
    // Add animation classes to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.category-card, .review-card, .contact-form, .contact-info');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles
    document.querySelectorAll('.category-card, .review-card, .contact-form, .contact-info').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Call on load and scroll
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
}

// Initialize dropdown menu functionality
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        
        // Mobile dropdown toggle
        dropbtn.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownContent.classList.toggle('active');
        });
        
        // Sub-dropdown toggle for mobile
        const subDropdowns = dropdown.querySelectorAll('.sub-dropdown');
        subDropdowns.forEach(subDropdown => {
            const subDropbtn = subDropdown.querySelector('.sub-dropbtn');
            const subDropdownContent = subDropdown.querySelector('.sub-dropdown-content');
            
            subDropbtn.addEventListener('click', function(e) {
                e.preventDefault();
                subDropdownContent.classList.toggle('active');
            });
        });
    });
    
    // Initialize menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-right .menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-right') && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        }
    });
}

// Show notification
function showNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(-20px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Show login modal - Enhanced animation version
function showLoginModal() {
    // Create modal if it doesn't exist
    if (!document.querySelector('.login-modal')) {
        const modal = document.createElement('div');
        modal.className = 'login-modal';
        
        modal.innerHTML = `
            <div class="login-modal-content">
                <span class="close-modal">&times;</span>
                <h2>Sign In</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="login-email" required placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="login-password" required placeholder="Enter your password">
                    </div>
                    <button type="submit" class="login-submit-btn">
                        <span>Sign In</span>
                    </button>
                </form>
                <p class="toggle-form">Don't have an account? <a href="#" id="show-register">Register</a></p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking X
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            closeLoginModal();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeLoginModal();
            }
        });
        
        // Handle form submission with animation
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Show loading animation
            const submitBtn = document.querySelector('.login-submit-btn');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simulate login (in a real app, this would be an API call)
            setTimeout(() => {
                if (email && password) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('user', JSON.stringify({ email }));
                    
                    // Update login button
                    const loginBtn = document.querySelector('.login-btn');
                    loginBtn.textContent = 'Logout';
                    
                    // Hide modal with nice animation
                    closeLoginModal();
                    
                    // Show success message
                    showNotification('Logged in successfully!', 'success');
                } else {
                    showNotification('Please fill in all fields', 'error');
                    submitBtn.innerHTML = '<span>Sign In</span>';
                    submitBtn.disabled = false;
                }
            }, 1000);
        });
        
        // Toggle to register form with animation
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            closeLoginModal();
            
            // Short delay before showing register modal for better transition
            setTimeout(() => {
                showRegisterModal();
            }, 300);
        });
        
        // Add input animation
        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => {
            // Add focus animation
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Initialize if there's already a value
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }
    
    // Show modal with animation
    const loginModal = document.querySelector('.login-modal');
    loginModal.style.display = 'flex';
    
    // Trigger reflow for animation
    void loginModal.offsetWidth;
    
    // Add active class to trigger animations
    loginModal.classList.add('active');
}

// Close login modal with animation
function closeLoginModal() {
    const loginModal = document.querySelector('.login-modal');
    if (!loginModal) return;
    
    loginModal.classList.remove('active');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        loginModal.style.display = 'none';
    }, 400);
}

// Show register modal - Enhanced animation version
function showRegisterModal() {
    // Create modal if it doesn't exist
    if (!document.querySelector('.register-modal')) {
        const modal = document.createElement('div');
        modal.className = 'register-modal';
        
        modal.innerHTML = `
            <div class="register-modal-content">
                <span class="close-modal">&times;</span>
                <h2>Create Account</h2>
                <form id="register-form">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="register-name" name="name" required placeholder="Enter your name">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="register-email" name="email" required placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="register-password" name="password" required placeholder="Enter your password">
                    </div>
                    <button type="submit" class="register-submit-btn">
                        <span>Register</span>
                    </button>
                </form>
                <p class="toggle-form">Already have an account? <a href="#" id="show-login">Login</a></p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking X - Fix the event listener
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            closeRegisterModal();
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeRegisterModal();
            }
        });
        
        // Handle form submission with animation
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            // Show loading animation
            const submitBtn = document.querySelector('.register-submit-btn');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simulate registration (in a real app, this would be an API call)
            setTimeout(() => {
                if (name && email && password) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('user', JSON.stringify({ name, email }));
                    
                    // Update login button
                    const loginBtn = document.querySelector('.login-btn');
                    loginBtn.textContent = 'Logout';
                    
                    // Hide modal with nice animation
                    closeRegisterModal();
                    
                    // Show success message
                    showNotification('Account created successfully!', 'success');
                } else {
                    showNotification('Please fill in all fields', 'error');
                    submitBtn.innerHTML = '<span>Register</span>';
                    submitBtn.disabled = false;
                }
            }, 1000);
        });
        
        // Toggle to login form with animation
        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            closeRegisterModal();
            
            // Short delay before showing login modal for better transition
            setTimeout(() => {
                showLoginModal();
            }, 300);
        });
        
        // Add input animation
        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => {
            // Add focus animation
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Initialize if there's already a value
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }
    
    // Show modal with animation
    const registerModal = document.querySelector('.register-modal');
    registerModal.style.display = 'flex';
    
    // Trigger reflow for animation
    void registerModal.offsetWidth;
    
    // Add active class to trigger animations
    registerModal.classList.add('active');
}

// Close register modal with animation
function closeRegisterModal() {
    const registerModal = document.querySelector('.register-modal');
    if (!registerModal) return;
    
    registerModal.classList.remove('active');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        registerModal.style.display = 'none';
    }, 400);
}

// Initialize scroll effects
function initScrollEffects() {
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    
    const updateScrollProgress = () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = window.scrollY / totalHeight;
        scrollProgress.style.transform = `scaleX(${progress})`;
    };
    
    window.addEventListener('scroll', updateScrollProgress);
}

// Function to initialize CTA button effects
function initCTAButtonEffects() {
    const ctaButton = document.querySelector('.cta-button');
    if (!ctaButton) return;
    
    // Add particle container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    ctaButton.appendChild(particlesContainer);
    
    // Mouse move 3D effect
    ctaButton.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (centerY - y) / 10;
        const rotateY = (x - centerX) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    ctaButton.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
    
    // Click effect with particles
    ctaButton.addEventListener('click', function(e) {
        // Create explosion of particles
        for (let i = 0; i < 20; i++) {
            createParticle(e.clientX, e.clientY, particlesContainer);
        }
        
        // Add pulse effect
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 500);
    });
}

// Function to create a single particle
function createParticle(x, y, container) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    container.appendChild(particle);
    
    // Random position variables
    const destinationX = (Math.random() - 0.5) * 200;
    const destinationY = (Math.random() - 0.5) * 200;
    
    // Set custom properties for the animation
    particle.style.setProperty('--tx', `${destinationX}px`);
    particle.style.setProperty('--ty', `${destinationY}px`);
    
    // Set initial position
    const rect = container.getBoundingClientRect();
    const offsetX = x - rect.left;
    const offsetY = y - rect.top;
    
    particle.style.left = `${offsetX}px`;
    particle.style.top = `${offsetY}px`;
    
    // Random size
    const size = Math.floor(Math.random() * 10) + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random color from theme
    const colors = [
        getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim()
    ];
    
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Remove particle after animation completes
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Function to initialize Login button effects
function initLoginButtonEffects() {
    const loginButton = document.querySelector('.login-btn');
    if (!loginButton) return;
    
    // Add particle container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    loginButton.appendChild(particlesContainer);
    
    // Mouse move 3D effect
    loginButton.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (centerY - y) / 10;
        const rotateY = (x - centerX) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    loginButton.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
    
    // Click effect with particles
    loginButton.addEventListener('click', function(e) {
        // Create explosion of particles
        for (let i = 0; i < 20; i++) {
            createParticle(e.clientX, e.clientY, particlesContainer);
        }
        
        // Add pulse effect
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
            showLoginModal();
        }, 500);
    });
} 