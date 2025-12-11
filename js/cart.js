// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    setupCartSidebar();
    loadCartItems();
});

// Setup cart sidebar
function setupCartSidebar() {
    const cartLink = document.getElementById('cart-link');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartLink && cartSidebar) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                window.location.href = 'checkout.html';
            }
        });
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar) cartSidebar.classList.add('active');
    if (cartOverlay) cartOverlay.classList.add('active');
    loadCartItems();
}

function closeCartSidebar() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (cartOverlay) cartOverlay.classList.remove('active');
}

function loadCartItems() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            ${item.image ? 
                `<img src="${item.image}" alt="${item.title}" class="cart-item-image-img">` :
                `<div class="cart-item-image">
                    <i class="${item.icon || 'fas fa-box'}"></i>
                </div>`
            }
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div style="color: var(--text-gray); font-size: 0.9rem;">Quantity: ${item.quantity}</div>
            </div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }

    // Add remove event listeners
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = parseInt(button.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
}

function updateCartCount() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(el => {
        if (el) el.textContent = count;
    });
}

// Export functions
if (typeof window !== 'undefined') {
    window.cartFunctions = {
        openCart,
        closeCartSidebar,
        loadCartItems,
        removeFromCart,
        updateCartCount
    };
}

