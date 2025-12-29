 // Application State
const state = {
    currentUser: null,
    cart: [],
    currentPage: 'login',
    products: [
        {
            id: 1,
            name: "Premium Dog Food",
            category: "dog",
            price: 24.99,
            image: "dog-food",
            description: "Nutrient-rich formula for adult dogs with real chicken"
        },
        {
            id: 2,
            name: "Grain-Free Cat Food",
            category: "cat",
            price: 19.99,
            image: "cat-food",
            description: "High-protein, grain-free recipe for all life stages"
        },
        {
            id: 3,
            name: "Parrot Seed Mix",
            category: "bird",
            price: 12.99,
            image: "bird-food",
            description: "Balanced blend of seeds, nuts, and dried fruits"
        },
        {
            id: 4,
            name: "Tropical Fish Flakes",
            category: "fish",
            price: 8.99,
            image: "fish-food",
            description: "Complete nutrition for tropical freshwater fish"
        },
        {
            id: 5,
            name: "Puppy Growth Formula",
            category: "dog",
            price: 26.99,
            image: "puppy-food",
            description: "Supports healthy growth and development for puppies"
        },
        {
            id: 6,
            name: "Senior Cat Formula",
            category: "cat",
            price: 22.99,
            image: "senior-cat-food",
            description: "Specialized nutrition for cats 7 years and older"
        },
        {
            id: 7,
            name: "Canary Seed Mix",
            category: "bird",
            price: 9.99,
            image: "canary-food",
            description: "Premium blend for canaries and finches"
        },
        {
            id: 8,
            name: "Goldfish Pellets",
            category: "fish",
            price: 7.99,
            image: "goldfish-food",
            description: "Sinking pellets formulated for goldfish"
        }
    ]
};

// DOM Elements
const pageSections = {
    login: document.getElementById('login-page'),
    menu: document.getElementById('menu-page'),
    about: document.getElementById('about-page'),
    payment: document.getElementById('payment-page')
};

// Initialize the application
function init() {
    // Set up event listeners
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            showPage(page);
        });
    });
    
    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('pay-btn').addEventListener('click', processPayment);
    
    // Show login page by default
    showPage('login');
    
    // Initialize products
    renderProducts();
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        state.currentUser = JSON.parse(savedUser);
        showPage('menu');
        document.getElementById('username').textContent = state.currentUser.name;
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        state.cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Page Navigation
function showPage(page) {
    // Hide all pages
    Object.values(pageSections).forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the requested page
    if (pageSections[page]) {
        pageSections[page].classlassList.remove('hidden');
        state.currentPage = page;
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Special handling for payment page
    if (page === 'payment') {
        renderCartItems();
    }
}

// User Authentication
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    // In a real app, this would be an API call
    state.currentUser = {
        name: email.split('@')[0],
        email: email
    };
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    
    // Update UI
    document.getElementById('username').textContent = state.currentUser.name;
    showPage('menu');
    
    alert('Login successful! Welcome to PetPals Pantry.');
}

function logout() {
    state.currentUser = null;
    localStorage.removeItem('currentUser');
    showPage('login');
    alert('You have been logged out.');
}

// Product Management
function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    state.products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <div class="product-image">
                <i class="fas fa-${product.image} fa-3x"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-category">${product.category.toUpperCase()}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p>${product.description}</p>
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus" data-id="${product.id}">-</button>
                        <span class="quantity">1</span>
                        <button class="quantity-btn plus" data-id="${product.id}">+</button>
                    </div>
                    <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        container.appendChild(productElement);
    });
    
    // Add event listeners for the buttons we just created
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const quantityElement = e.target.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = quantity + 1;
        });
    });
    
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const quantityElement = e.target.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            if (quantity > 1) {
                quantityElement.textContent = quantity - 1;
            }
        });
    });
    
    // Set up category filtering
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            
            // Update active button
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Filter products
            if (category === 'all') {
                container.querySelectorAll('.product-card').forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                container.querySelectorAll('.product-card').forEach(card => {
                    if (card.querySelector('.product-category').textContent.toLowerCase() === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
}

// Shopping Cart
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    // Get quantity from UI
    const quantityElement = document.querySelector(`.add-to-cart[data-id="${productId}"]`)
        .closest('.product-actions')
        .querySelector('.quantity');
    const quantity = parseInt(quantityElement.textContent);
    
    // Check if product is already in cart
    const existingItem = state.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        state.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image
        });
    }
    
    // Reset quantity to 1
    quantityElement.textContent = '1';
    
    // Update UI and save to localStorage
    updateCartUI();
    localStorage.setItem('cart', JSON.stringify(state.cart));
    
    alert(`${quantity} ${product.name} added to cart!`);
}

function updateCartUI() {
    // Update cart count
    const totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    container.innerHTML = '';
    
    let total = 0;
    
    if (state.cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty</p>';
        totalElement.textContent = '$0.00';
        return;
    }
    
    state.cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <i class="fas fa-${item.image}"></i>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                <div class="cart-item-quantity">
                    <button class="btn quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn quantity-btn plus" data-id="${item.id}">+</button>
                    <button class="btn remove-btn" data-id="${item.id}">Remove</button>
                </div>
            </div>
            <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
        `;
        container.appendChild(itemElement);
    });
    
    // Update total
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners for cart buttons
    document.querySelectorAll('.cart-item .plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const item = state.cart.find(i => i.id === productId);
            if (item) {
                item.quantity++;
                updateCartUI();
                renderCartItems(); // Re-render to update totals
                localStorage.setItem('cart', JSON.stringify(state.cart));
            }
        });
    });
    
    document.querySelectorAll('.cart-item .minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const item = state.cart.find(i => i.id === productId);
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCartUI();
                renderCartItems(); // Re-render to update totals
                localStorage.setItem('cart', JSON.stringify(state.cart));
            }
        });
    });
    
    document.querySelectorAll('.cart-item .remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            state.cart = state.cart.filter(item => item.id !== productId);
            updateCartUI();
            renderCartItems(); // Re-render to update totals
            localStorage.setItem('cart', JSON.stringify(state.cart));
        });
    });
}

// Payment Processing
function processPayment() {
    // Get form values
    const cardName = document.getElementById('card-name').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    const address = document.getElementById('billing-address').value;
    
    // Simple validation
    if (!cardName || !cardNumber || !expiryDate || !cvv || !address) {
        alert('Please fill in all payment details');
        return;
    }
    
    if (state.cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    // In a real app, this would process the payment through a payment gateway
    alert('Payment processed successfully! Thank you for your order.');
    
    // Clear cart
    state.cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
    renderCartItems();
    
    // Redirect to menu
    showPage('menu');
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init);