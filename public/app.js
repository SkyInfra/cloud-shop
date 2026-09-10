const products = [
    { id: 1, title: 'Elastic Compute Unit (t3.micro)', category: 'Compute', priceUSD: 15.00, desc: 'Optimized virtual server instance with scalable vCPU architecture.' },
    { id: 2, title: 'Distributed Cluster Node', category: 'Compute', priceUSD: 45.00, desc: 'High-throughput dedicated node configured for heavy background workloads.' },
    { id: 3, title: 'Relational Database Engine', category: 'Database', priceUSD: 30.00, desc: 'Managed ACID-compliant relational SQL storage cluster with automated failover.' },
    { id: 4, title: 'In-Memory Caching Tier', category: 'Database', priceUSD: 20.00, desc: 'Sub-millisecond Redis-compatible key-value cache layer.' },
    { id: 5, title: 'SSL Zero-Trust Gateway', category: 'Security', priceUSD: 25.00, desc: 'Enterprise edge security proxy with integrated DDoS mitigation.' },
    { id: 6, title: 'Identity & Access Manager', category: 'Security', priceUSD: 18.00, desc: 'Role-based access control and OAuth authentication microservice.' }
];

const exchangeRates = {
    USD: { rate: 1.0, symbol: '$' },
    EUR: { rate: 0.92, symbol: '€' },
    GBP: { rate: 0.79, symbol: '£' },
    PKR: { rate: 278.50, symbol: '₨' }
};

let currentCurrency = 'USD';
let currentCategory = 'all';
let searchQuery = '';
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('productGrid');
    const currencySelector = document.getElementById('currencySelector');
    const searchInput = document.getElementById('searchInput');
    const filterChips = document.querySelectorAll('.filter-chip');
    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function renderProducts() {
        productGrid.innerHTML = '';
        
        const filtered = products.filter(p => {
            const matchesCat = currentCategory === 'all' || p.category === currentCategory;
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  p.desc.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">No cloud infrastructure components matched your query.</p>';
            return;
        }

        const { rate, symbol } = exchangeRates[currentCurrency];

        filtered.forEach(product => {
            const convertedPrice = (product.priceUSD * rate).toFixed(currentCurrency === 'PKR' ? 0 : 2);
            
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div>
                    <span class="product-tag">${product.category}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-desc">${product.desc}</p>
                </div>
                <div class="product-footer">
                    <span class="product-price">${symbol}${convertedPrice}</span>
                    <button class="buy-btn" onclick="addToCart(${product.id})">Add to Stack</button>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    // Currency Switcher
    currencySelector.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        renderProducts();
        updateCartUI();
    });

    // Search Handler
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderProducts();
    });

    // Filter Chips
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentCategory = chip.dataset.category;
            renderProducts();
        });
    });

    // Cart Drawer Toggles
    cartBtn.addEventListener('click', () => {
        cartDrawer.classList.add('open');
        overlay.classList.add('active');
    });

    const closeDrawer = () => {
        cartDrawer.classList.remove('open');
        overlay.classList.remove('active');
    };

    closeCart.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Add to Cart Logic
    window.addToCart = function(id) {
        const product = products.find(p => p.id === id);
        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCartUI();
        cartBtn.classList.add('pulse');
        setTimeout(() => cartBtn.classList.remove('pulse'), 300);
    };

    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    };

    function updateCartUI() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotalAmount = document.getElementById('cartTotalAmount');

        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalCount;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            cartTotalAmount.textContent = `${exchangeRates[currentCurrency].symbol}0.00`;
            return;
        }

        const { rate, symbol } = exchangeRates[currentCurrency];
        cartItemsContainer.innerHTML = '';
        let totalUSD = 0;

        cart.forEach(item => {
            totalUSD += item.priceUSD * item.quantity;
            const itemPrice = (item.priceUSD * rate).toFixed(currentCurrency === 'PKR' ? 0 : 2);

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <span>Qty: ${item.quantity} • ${symbol}${itemPrice}</span>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartItemsContainer.appendChild(div);
        });

        const convertedTotal = (totalUSD * rate).toFixed(currentCurrency === 'PKR' ? 0 : 2);
        cartTotalAmount.textContent = `${symbol}${convertedTotal}`;
    }

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        alert('Provisioning simulated successfully! Your containerized assets are spinning up.');
        cart = [];
        updateCartUI();
        closeDrawer();
    });

    renderProducts();
});