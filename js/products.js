// Image configuration - VPS hosted image
const PRODUCT_IMAGE_URL = 'https://gunshub.online/images/image2.jpg';

// Products data
const products = [
    {
        id: 1,
        title: "GunsHub Crasher",
        description: "GunsHub will crash all games by one press of a button",
        price: 49.99,
        icon: "fas fa-laptop-code"
    },
    {
        id: 2,
        title: "Virus C2",
        description: "Virus C2 Powered By RawAPI",
        price: 99.99,
        icon: "fas fa-graduation-cap",
        image: "https://gunshub.online/images/virus.jpg"
    },
    {
        id: 3,
        title: "RawAPI",
        description: "RawAPI Is The Strongest API In The Comm",
        price: 29.99,
        icon: "fas fa-file-alt",
        image: "https://gunshub.online/images/rawapi.jpg"
    },
    {
        id: 4,
        title: "PremRawsAPI",
        description: "PremRawsAPI With The Strongest Power And Best Bypasses With All L7s, TCPs And UDP Bypasses",
        price: 39.99,
        icon: "fas fa-images",
        image: "https://gunshub.online/images/premraws.jpg"
    },
    {
        id: 5,
        title: "Start Your Own Online Business",
        description: "You Want To Make Money Check The Products Here To Help You Earn",
        price: 59.99,
        icon: "fas fa-music",
        image: "https://gunshub.online/images/business.jpg"
    },
    {
        id: 6,
        title: "Guns OVH VPNs",
        description: "OVH Plans Here So You Can Be Protected From DDoS Attacks And Kept Anonymous.",
        price: 79.99,
        icon: "fas fa-cube",
        image: "https://gunshub.online/images/ovh.jpg"
    }
];

// Load products from localStorage or use default
let allProducts = JSON.parse(localStorage.getItem('products')) || products;

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(allProducts));
}

// Display products
function displayProducts(productsToShow = allProducts) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; color: var(--text-gray); grid-column: 1 / -1;">No products found.</p>';
        return;
    }

    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image || PRODUCT_IMAGE_URL}" alt="${product.title}" class="product-image-img" referrerpolicy="no-referrer" loading="lazy"
                     onerror="this.style.display='none'; const parent = this.parentElement; if (!parent.querySelector('i')) { const fallback = document.createElement('i'); fallback.className = '${product.icon}'; parent.appendChild(fallback); }"
                     onload="this.style.display='block';">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    ${product.id === 1 ? 
                        `<a href="gunshub.html" class="add-to-cart">
                            <i class="fas fa-eye"></i> View Product
                        </a>` :
                        product.id === 2 ? 
                        `<a href="virus.html" class="add-to-cart">
                            <i class="fas fa-eye"></i> View Product
                        </a>` :
                        product.id === 3 ?
                        `<a href="rawapi.html" class="add-to-cart">
                            <i class="fas fa-eye"></i> View Product
                        </a>` :
                        product.id === 4 ?
                        `<a href="premrawapi.html" class="add-to-cart">
                            <i class="fas fa-eye"></i> View Product
                        </a>` :
                        product.id === 5 ?
                        `<a href="business.html" class="add-to-cart">
                            <i class="fas fa-eye"></i> View Product
                        </a>` :
                        product.id === 6 ?
                        `<a href="ovh.html" class="add-to-cart">
                            <i class="fas fa-eye"></i> View Product
                        </a>` :
                        `<button class="add-to-cart" data-id="${product.id}">
                            <i class="fas fa-eye"></i> View Product
                        </button>`
                    }
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        // Skip if it's a link (Virus C2)
        if (button.tagName === 'A') return;
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Add to cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification('Product added to cart!');
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(el => {
        if (el) el.textContent = count;
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allProducts.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        displayProducts(filtered);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartCount();
    setupSearch();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products: allProducts, addToCart, updateCartCount };
}

