// Image configuration - VPS hosted image
const PRODUCT_IMAGE_URL = 'https://gunshub.online/images/image2.jpg';

// Load featured products on homepage
document.addEventListener('DOMContentLoaded', () => {
    const featuredProductsGrid = document.getElementById('featured-products');
    if (!featuredProductsGrid) return;

    // Get products from localStorage or use default
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // If no products in localStorage, load from products.js
    if (products.length === 0) {
        // Default products
        const defaultProducts = [
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
            }
        ];
        
        // Display featured products (first 3, excluding PremRawsAPI id: 4)
        const featuredProducts = defaultProducts.filter(p => p.id !== 4).slice(0, 3);
        displayFeaturedProducts(featuredProducts);
    } else {
        // Display featured products (first 3, excluding PremRawsAPI id: 4)
        const featuredProducts = products.filter(p => p.id !== 4).slice(0, 3);
        displayFeaturedProducts(featuredProducts);
    }

    // Update cart count
    updateCartCount();

    // Setup search
    setupSearch();
});

function displayFeaturedProducts(products) {
    const featuredProductsGrid = document.getElementById('featured-products');
    if (!featuredProductsGrid) return;

    if (products.length === 0) {
        featuredProductsGrid.innerHTML = '<p style="text-align: center; color: var(--text-gray);">No featured products available.</p>';
        return;
    }

    featuredProductsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image || PRODUCT_IMAGE_URL}" alt="${product.title}" class="product-image-img" crossorigin="anonymous" 
                     onload="console.log('Image loaded successfully:', this.src);" 
                     onerror="console.error('Failed to load product image from:', this.src); this.style.display='none'; const parent = this.parentElement; if (!parent.querySelector('i')) { const fallback = document.createElement('i'); fallback.className = '${product.icon || 'fas fa-box'}'; parent.appendChild(fallback); }">
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

function addToCart(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    if (products.length === 0) {
        // Load default products
        products = [
            { id: 1, title: "GunsHub Crasher", description: "GunsHub will crash all games by one press of a button", price: 49.99, icon: "fas fa-laptop-code" },
            { id: 2, title: "Virus C2", description: "Virus C2 Powered By RawAPI", price: 99.99, icon: "fas fa-graduation-cap", image: "http://51.89.251.240/images/Virus.png" },
            { id: 3, title: "RawAPI", description: "RawAPI Is The Strongest API In The Comm", price: 29.99, icon: "fas fa-file-alt", image: "https://gunshub.online/images/rawapi.jpg" },
            { id: 4, title: "PremRawsAPI", description: "PremRawsAPI With The Strongest Power And Best Bypasses With All L7s, TCPs And UDP Bypasses", price: 39.99, icon: "fas fa-images", image: "https://gunshub.online/images/premraws.jpg" },
            { id: 5, title: "Start Your Own Online Business", description: "You Want To Make Money Check The Products Here To Help You Earn", price: 59.99, icon: "fas fa-music", image: "https://gunshub.online/images/business.jpg" },
            { id: 6, title: "3D Model Collection", description: "Premium 3D models ready for use.", price: 79.99, icon: "fas fa-cube" },
            { id: 7, title: "E-book Collection", description: "Library of 200+ e-books.", price: 19.99, icon: "fas fa-book" },
            { id: 8, title: "Premium Font Pack", description: "Collection of 500+ premium fonts.", price: 34.99, icon: "fas fa-font" }
        ];
    }

    const product = products.find(p => p.id === productId);
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
    showNotification('Product added to cart!');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(el => {
        if (el) el.textContent = count;
    });
}

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
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            window.location.href = `products.html?search=${encodeURIComponent(e.target.value)}`;
        }
    });
}

