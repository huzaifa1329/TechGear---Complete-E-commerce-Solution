// Product Data - Array of Objects
const products = [
    {
        id: 1,
        name: "MacBook Pro 14",
        description: "Powerful laptop with M2 Pro chip, 16GB RAM, 512GB SSD",
        price: 1999.99,
        category: "laptop",
        image: "images/products/macbook.jpg"
    },
    {
        id: 2,
        name: "iPhone 14 Pro",
        description: "Latest iPhone with Dynamic Island and 48MP camera",
        price: 999.99,
        category: "phone",
        image: "images/products/iphone.jpg"
    },
    {
        id: 3,
        name: "Samsung Galaxy S23",
        description: "Android flagship with Snapdragon 8 Gen 2 and 200MP camera",
        price: 849.99,
        category: "phone",
        image: "images/products/samsung.jpg"
    },
    {
        id: 4,
        name: "Dell XPS 13",
        description: "Ultra-thin laptop with InfinityEdge display, 13.4-inch",
        price: 1199.99,
        category: "laptop",
        image: "images/products/dell.jpg"
    },
    {
        id: 5,
        name: "AirPods Pro",
        description: "Wireless earbuds with Active Noise Cancellation",
        price: 249.99,
        category: "accessory",
        image: "images/products/airpods.jpg"
    },
    {
        id: 6,
        name: "Apple Watch Series 8",
        description: "Smartwatch with health monitoring and fitness tracking",
        price: 399.99,
        category: "accessory",
        image: "images/products/applewatch.jpg"
    },
    {
        id: 7,
        name: "Sony WH-1000XM5",
        description: "Premium noise-cancelling headphones with 30-hour battery",
        price: 399.99,
        category: "accessory",
        image: "images/products/sonyheadphones.jpg"
    },
    {
        id: 8,
        name: "iPad Air",
        description: "Thin and light tablet with M1 chip and 10.9-inch display",
        price: 599.99,
        category: "laptop",
        image: "images/products/ipad.jpg"
    }
];

// Cart State
let cart = [];

// User State
let currentUser = null;

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const emptyCart = document.getElementById('empty-cart');
const cartSummary = document.getElementById('cart-summary');
const cartCount = document.getElementById('cart-count');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const cartToggle = document.getElementById('cart-toggle');
const mobileToggle = document.getElementById('mobile-toggle');
const mobileNav = document.getElementById('mobile-nav');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Auth Elements
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const userProfile = document.getElementById('user-profile');
const authButtons = document.getElementById('auth-buttons');
const userName = document.getElementById('user-name');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const closeAuthButtons = document.querySelectorAll('.close-auth');

// Mobile Auth Elements
const mobileLoginBtn = document.getElementById('mobile-login-btn');
const mobileSignupBtn = document.getElementById('mobile-signup-btn');
const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
const mobileUserProfile = document.getElementById('mobile-user-profile');
const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
const mobileUserName = document.getElementById('mobile-user-name');

// Initialize the page
function init() {
    loadCartFromStorage();
    loadUserFromStorage();
    renderProducts();
    renderCart();
    setupEventListeners();
    updateUIForUser();
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('techgear-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('techgear-cart', JSON.stringify(cart));
    updateCartCount();
}

// Load user from localStorage
function loadUserFromStorage() {
    const savedUser = localStorage.getItem('techgear-user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

// Save user to localStorage
function saveUserToStorage() {
    if (currentUser) {
        localStorage.setItem('techgear-user', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('techgear-user');
    }
}

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show toast notification
function showToast(message, type = 'info') {
    toastMessage.textContent = message;
    toast.className = 'toast';
    toast.classList.add('show');
    
    // Add type class for different toast styles
    if (type === 'success') {
        toast.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#e74c3c';
    } else {
        toast.style.backgroundColor = '#4a6cf7';
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Render products to the page
function renderProducts(filteredProducts = products) {
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Product+Image'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    renderCart();
    showToast(`${product.name} added to cart!`, 'success');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    renderCart();
    showToast('Item removed from cart', 'info');
}

// Update quantity of cart item
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        saveCartToStorage();
        renderCart();
    }
}

// Render cart items
function renderCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartSummary.style.display = 'block';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=Product'">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Calculate totals
    const shipping = 5.99;
    const total = subtotal + shipping;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners to cart controls
    document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                updateQuantity(productId, cartItem.quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                updateQuantity(productId, cartItem.quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            const newQuantity = parseInt(e.target.value) || 1;
            updateQuantity(productId, newQuantity);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        renderProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => product.category === category);
    renderProducts(filteredProducts);
}

// Search products
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    renderProducts(filteredProducts);
}

// Clear cart
function clearCart() {
    if (cart.length === 0) {
        showToast('Cart is already empty', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCartToStorage();
        renderCart();
        showToast('Cart cleared successfully', 'success');
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5.99;
    
    if (confirm(`Proceed to checkout? Total: $${total.toFixed(2)}`)) {
        showToast('Checkout successful! Thank you for your purchase.', 'success');
        cart = [];
        saveCartToStorage();
        renderCart();
    }
}

// Auth Functions
function login(email, password) {
    // Simple validation
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return false;
    }
    
    // In a real app, this would be a server call
    // For demo purposes, we'll create a simple user
    currentUser = {
        name: email.split('@')[0],
        email: email,
        joined: new Date().toISOString()
    };
    
    saveUserToStorage();
    updateUIForUser();
    closeAuthModal();
    showToast('Login successful!', 'success');
    return true;
}

function signup(name, email, password, confirmPassword) {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return false;
    }
    
    // In a real app, this would be a server call
    currentUser = {
        name: name,
        email: email,
        joined: new Date().toISOString()
    };
    
    saveUserToStorage();
    updateUIForUser();
    closeAuthModal();
    showToast('Account created successfully!', 'success');
    return true;
}

function logout() {
    currentUser = null;
    saveUserToStorage();
    updateUIForUser();
    showToast('Logged out successfully', 'info');
}

function updateUIForUser() {
    if (currentUser) {
        // Show user profile
        authButtons.style.display = 'none';
        userProfile.style.display = 'flex';
        userName.textContent = currentUser.name;
        
        // Update mobile UI
        mobileAuthButtons.style.display = 'none';
        mobileUserProfile.style.display = 'block';
        mobileUserName.textContent = currentUser.name;
    } else {
        // Show auth buttons
        authButtons.style.display = 'flex';
        userProfile.style.display = 'none';
        
        // Update mobile UI
        mobileAuthButtons.style.display = 'block';
        mobileUserProfile.style.display = 'none';
    }
}

// Modal Functions
function openAuthModal(modal) {
    modal.style.display = 'flex';
}

function closeAuthModal() {
    loginModal.style.display = 'none';
    signupModal.style.display = 'none';
    mobileNav.classList.remove('active');
}

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Open about section
function openAboutSection() {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');
            // Filter products
            const category = e.target.getAttribute('data-category');
            filterProducts(category);
        });
    });
    
    // Clear cart button
    clearCartBtn.addEventListener('click', clearCart);
    
    // Checkout button
    checkoutBtn.addEventListener('click', checkout);
    
    // Cart toggle (scroll to cart)
    cartToggle.addEventListener('click', () => {
        document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !mobileNav.contains(e.target)) {
            mobileNav.classList.remove('active');
        }
    });
    
    // Auth Event Listeners
    loginBtn.addEventListener('click', () => openAuthModal(loginModal));
    signupBtn.addEventListener('click', () => openAuthModal(signupModal));
    logoutBtn.addEventListener('click', logout);
    
    mobileLoginBtn.addEventListener('click', () => {
        openAuthModal(loginModal);
        mobileNav.classList.remove('active');
    });
    
    mobileSignupBtn.addEventListener('click', () => {
        openAuthModal(signupModal);
        mobileNav.classList.remove('active');
    });
    
    mobileLogoutBtn.addEventListener('click', logout);
    
    // Close modals when clicking X
    closeAuthButtons.forEach(button => {
        button.addEventListener('click', closeAuthModal);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal || e.target === signupModal) {
            closeAuthModal();
        }
    });
    
    // Switch between login and signup modals
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'flex';
    });
    
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });
    
    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        login(email, password);
    });
    
    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        signup(name, email, password, confirmPassword);
    });
    
    // Contact form submission
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Message sent successfully! We will get back to you soon.', 'success');
        e.target.reset();
    });
    
    // Newsletter form submission
    document.getElementById('newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Thank you for subscribing to our newsletter!', 'success');
        e.target.reset();
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);