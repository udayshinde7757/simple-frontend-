/* ==========================================
   VoltX Electronics - Products Page Logic
   Dynamic product rendering, filtering, search
   ========================================== */

(function() {

    // ==========================================
    // Product Data (frontend-only mock inventory)
    // ==========================================
    const products = [
        // Smartphones
        { name: "iPhone 16 Pro Max", brand: "Apple", price: "₹1,44,900", category: "smartphone", emoji: "📱", available: true, stock: "limited" },
        { name: "Samsung Galaxy S24 Ultra", brand: "Samsung", price: "₹1,29,999", category: "smartphone", emoji: "📱", available: true, stock: "available" },
        { name: "Google Pixel 9 Pro", brand: "Google", price: "₹1,09,999", category: "smartphone", emoji: "📱", available: false, stock: "unavailable" },
        { name: "OnePlus 12", brand: "OnePlus", price: "₹64,999", category: "smartphone", emoji: "📱", available: true, stock: "available" },
        { name: "Xiaomi 14 Ultra", brand: "Xiaomi", price: "₹99,999", category: "smartphone", emoji: "📱", available: true, stock: "limited" },
        { name: "Nothing Phone (2a)", brand: "Nothing", price: "₹23,999", category: "smartphone", emoji: "📱", available: true, stock: "available" },

        // Laptops
        { name: "MacBook Air M3", brand: "Apple", price: "₹1,14,900", category: "laptop", emoji: "💻", available: true, stock: "available" },
        { name: "Dell XPS 15", brand: "Dell", price: "₹1,54,990", category: "laptop", emoji: "💻", available: true, stock: "limited" },
        { name: "ASUS ROG Strix G16", brand: "ASUS", price: "₹1,29,990", category: "laptop", emoji: "💻", available: false, stock: "unavailable" },
        { name: "HP Spectre x360", brand: "HP", price: "₹1,39,990", category: "laptop", emoji: "💻", available: true, stock: "available" },
        { name: "Lenovo ThinkPad X1 Carbon", brand: "Lenovo", price: "₹1,65,000", category: "laptop", emoji: "💻", available: true, stock: "available" },

        // Audio
        { name: "Sony WH-1000XM5", brand: "Sony", price: "₹29,990", category: "audio", emoji: "🎧", available: false, stock: "unavailable" },
        { name: "AirPods Pro 2", brand: "Apple", price: "₹24,900", category: "audio", emoji: "🎧", available: true, stock: "available" },
        { name: "Bose QuietComfort Ultra", brand: "Bose", price: "₹34,900", category: "audio", emoji: "🎧", available: true, stock: "limited" },
        { name: "JBL Flip 6", brand: "JBL", price: "₹11,999", category: "audio", emoji: "🔊", available: true, stock: "available" },
        { name: "Samsung Galaxy Buds3 Pro", brand: "Samsung", price: "₹17,999", category: "audio", emoji: "🎧", available: true, stock: "available" },

        // Gaming
        { name: "PlayStation 5 Slim", brand: "Sony", price: "₹49,990", category: "gaming", emoji: "🎮", available: true, stock: "limited" },
        { name: "Xbox Series X", brand: "Microsoft", price: "₹49,990", category: "gaming", emoji: "🎮", available: false, stock: "unavailable" },
        { name: "Nintendo Switch OLED", brand: "Nintendo", price: "₹34,999", category: "gaming", emoji: "🎮", available: true, stock: "available" },
        { name: "SteelSeries Arctis Nova Pro", brand: "SteelSeries", price: "₹24,999", category: "gaming", emoji: "🎧", available: true, stock: "available" },

        // Cameras
        { name: "Sony A7 IV", brand: "Sony", price: "₹2,18,990", category: "camera", emoji: "📷", available: true, stock: "limited" },
        { name: "Canon EOS R6 Mark II", brand: "Canon", price: "₹2,15,995", category: "camera", emoji: "📷", available: true, stock: "available" },
        { name: "GoPro Hero 12 Black", brand: "GoPro", price: "₹40,490", category: "camera", emoji: "📹", available: false, stock: "unavailable" },

        // Wearables
        { name: "Apple Watch Ultra 2", brand: "Apple", price: "₹89,900", category: "wearable", emoji: "⌚", available: true, stock: "available" },
        { name: "Samsung Galaxy Watch 6", brand: "Samsung", price: "₹29,999", category: "wearable", emoji: "⌚", available: true, stock: "available" },
        { name: "Fitbit Charge 6", brand: "Fitbit", price: "₹14,999", category: "wearable", emoji: "⌚", available: true, stock: "limited" },

        // Accessories
        { name: "Apple Magic Keyboard", brand: "Apple", price: "₹13,900", category: "accessory", emoji: "⌨️", available: true, stock: "available" },
        { name: "Logitech MX Master 3S", brand: "Logitech", price: "₹9,995", category: "accessory", emoji: "🖱️", available: true, stock: "available" },
        { name: "Anker 65W Charger", brand: "Anker", price: "₹3,499", category: "accessory", emoji: "🔌", available: false, stock: "unavailable" },
        { name: "Samsung T7 1TB SSD", brand: "Samsung", price: "₹8,999", category: "accessory", emoji: "💾", available: true, stock: "available" },
    ];

    // ==========================================
    // DOM Elements
    // ==========================================
    const productsGrid = document.getElementById('productsGrid');
    const productsCount = document.getElementById('productsCount');
    const noResults = document.getElementById('noResults');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const availabilityToggle = document.getElementById('availabilityToggle');

    let activeFilter = 'all';
    let searchQuery = '';
    let showInStockOnly = false;

    // ==========================================
    // Render Products
    // ==========================================
    function renderProducts() {
        let filtered = [...products];

        // Category filter
        if (activeFilter !== 'all') {
            filtered = filtered.filter(p => p.category === activeFilter);
        }

        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }

        // Availability filter
        if (showInStockOnly) {
            filtered = filtered.filter(p => p.available);
        }

        // Update count
        productsCount.textContent = `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;

        // Show/hide no results
        if (filtered.length === 0) {
            productsGrid.style.display = 'none';
            noResults.style.display = 'block';
        } else {
            productsGrid.style.display = 'grid';
            noResults.style.display = 'none';
        }

        // Render cards
        productsGrid.innerHTML = filtered.map((product, index) => {
            const statusClass = product.available
                ? (product.stock === 'limited' ? 'status-limited' : 'status-available')
                : 'status-unavailable';

            const statusText = product.available
                ? (product.stock === 'limited' ? 'Limited Stock' : 'In Stock')
                : 'Out of Stock';

            const badgeClass = product.available ? 'available' : 'out-of-stock';
            const cardClass = product.available ? '' : 'out-of-stock-card';
            const priceClass = product.available ? 'in-stock-price' : 'out-stock-price';

            return `
                <div class="product-page-card ${cardClass}" style="animation-delay: ${index * 0.05}s">
                    <div class="product-header">
                        <span class="product-category-tag">${product.category}</span>
                        <span class="product-badge ${badgeClass}">${statusText}</span>
                    </div>
                    <div class="product-page-emoji">${product.emoji}</div>
                    <div class="product-page-info">
                        <h3>${product.name}</h3>
                        <p class="product-page-brand">${product.brand}</p>
                        <div class="product-page-price ${priceClass}">${product.price}</div>
                        <div class="availability-status ${statusClass}">
                            <span class="status-dot"></span>
                            <span>${statusText}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Re-apply tilt to new cards
        applyTiltToCards();
        // Re-apply scroll reveal
        applyScrollReveal();
    }

    // ==========================================
    // 3D Tilt on product cards
    // ==========================================
    function applyTiltToCards() {
        const cards = productsGrid.querySelectorAll('.product-page-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -6;
                const rotateY = (x - centerX) / centerX * 6;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    function applyScrollReveal() {
        const cards = productsGrid.querySelectorAll('.product-page-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.classList.add('reveal');
            observer.observe(card);
        });
    }

    // ==========================================
    // Event Listeners
    // ==========================================

    // Category filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            renderProducts();
        });
    });

    // Search input
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value.trim();
                renderProducts();
            }, 250);
        });
    }

    // Availability toggle
    if (availabilityToggle) {
        availabilityToggle.addEventListener('change', (e) => {
            showInStockOnly = e.target.checked;
            renderProducts();
        });
    }

    // Initial render
    renderProducts();

})();
