// Ensure the global data store is initialized
if (!window.siteData) {
    window.siteData = {
        products: []
    };
}

// --- Cart Logic (using localStorage) ---
const cart = {
    KEY: 'userCart',

    get() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : { userId: null, items: [], lastUpdated: null };
    },

    save(cartData) {
        cartData.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.KEY, JSON.stringify(cartData));
        this.updateCartIcon();
    },

    add(productId, quantity = 1, price = 0, discount = 0, name = '', image = '') {
        const cartData = this.get();
        const existingItem = cartData.items.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Store essential info for rendering without needing the full product list every time
            cartData.items.push({ productId, quantity, price, discount, name, image });
        }
        this.save(cartData);
        console.log(`Product ${productId} added to cart.`);
    },

    remove(productId) {
        let cartData = this.get();
        cartData.items = cartData.items.filter(item => item.productId !== productId);
        this.save(cartData);
    },

    updateQuantity(productId, newQuantity) {
        let cartData = this.get();
        const item = cartData.items.find(item => item.productId === productId);
        if (item) {
            if (newQuantity > 0) {
                item.quantity = newQuantity;
                this.save(cartData);
            } else {
                this.remove(productId); // This already saves
            }
        }
    },

    getTotalItems() {
        const cartData = this.get();
        return cartData.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    updateCartIcon() {
        const totalItems = this.getTotalItems();
        const cartTabBtn = document.querySelector('.profile-tab-btn[data-tab="cart-tab"]');
        if (cartTabBtn) {
            cartTabBtn.textContent = `Корзина (${totalItems})`;
        }
    }
};

// --- User Profile & Cart Modal Logic ---
document.addEventListener('DOMContentLoaded', function() {
    const userProfileModal = document.getElementById('user-profile-modal');
    const accountButton = document.querySelector('.account-button');
    const closeModalButton = userProfileModal ? userProfileModal.querySelector('.profile-modal-close') : null;
    const tabButtons = userProfileModal ? userProfileModal.querySelectorAll('.profile-tab-btn') : [];
    const tabContents = userProfileModal ? userProfileModal.querySelectorAll('.profile-tab-content') : [];
    const cartTab = document.getElementById('cart-tab');

    // This is a placeholder for a real login check
    let isLoggedIn = true; // Set to true for dev purposes to show profile modal

    if (accountButton) {
        accountButton.addEventListener('click', () => {
            if (isLoggedIn) {
                if (userProfileModal) {
                    userProfileModal.classList.add('active');
                    openTab('cart-tab');
                    renderCart();
                }
            } else {
                const authModal = document.getElementById('auth-modal');
                if (authModal) authModal.classList.add('active');
            }
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            if (userProfileModal) userProfileModal.classList.remove('active');
        });
    }

    function openTab(tabId) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        const tabBtn = document.querySelector(`.profile-tab-btn[data-tab="${tabId}"]`);
        const tabContent = document.getElementById(tabId);

        if (tabBtn) tabBtn.classList.add('active');
        if (tabContent) tabContent.classList.add('active');
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            openTab(tabId);
            if (tabId === 'cart-tab') {
                renderCart();
            }
        });
    });

    // --- Cart Rendering Logic ---
    function renderCart() {
        if (!cartTab) return;
        const cartData = cart.get();
        cart.updateCartIcon();

        if (cartData.items.length === 0) {
            cartTab.innerHTML = `
                <div class="empty-cart">
                    <h3>Ваша корзина пуста</h3>
                    <p>Перейдите в каталог, чтобы начать покупки.</p>
                    <a href="shop.html" class="btn">Перейти в каталог</a>
                </div>
            `;
            return;
        }

        const itemsHtml = cartData.items.map(item => {
            const itemPrice = item.price * (1 - item.discount / 100);
            return `
            <div class="cart-item" data-id="${item.productId}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <button class="remove-item-btn">Удалить</button>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
                <div class="item-price">
                    ${(itemPrice * item.quantity).toLocaleString('ru-RU')} ₽
                </div>
            </div>
        `}).join('');

        const subtotal = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = cartData.items.reduce((sum, item) => {
            const itemPrice = item.price * (1 - item.discount / 100);
            return sum + (itemPrice * item.quantity);
        }, 0);
        const totalDiscount = subtotal - total;

        const summaryHtml = `
            <div id="cart-summary">
                <p>Сумма товаров: ${subtotal.toLocaleString('ru-RU')} ₽</p>
                <p>Скидка: -${totalDiscount.toLocaleString('ru-RU')} ₽</p>
                <h3>Итого: ${total.toLocaleString('ru-RU')} ₽</h3>
                <button class="btn">Оформить заказ</button>
            </div>
        `;

        cartTab.innerHTML = itemsHtml + summaryHtml;
        addCartActionListeners();
    }

    function addCartActionListeners() {
        cartTab.querySelectorAll('.cart-item').forEach(itemElement => {
            const productId = itemElement.dataset.id;
            
            itemElement.querySelector('.plus').addEventListener('click', () => {
                const currentItem = cart.get().items.find(i => i.productId === productId);
                cart.updateQuantity(productId, currentItem.quantity + 1);
                renderCart();
            });

            itemElement.querySelector('.minus').addEventListener('click', () => {
                const currentItem = cart.get().items.find(i => i.productId === productId);
                cart.updateQuantity(productId, currentItem.quantity - 1);
                renderCart();
            });

            itemElement.querySelector('.remove-item-btn').addEventListener('click', () => {
                cart.remove(productId);
                renderCart();
            });
        });
    }

    // Initialize cart icon on page load
    cart.updateCartIcon();
});

// --- Add to Cart Event Delegation ---
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const card = e.target.closest('.product-card');
        if (!card) return;

        const productId = card.dataset.id;
        const productData = window.siteData.products.find(p => p.id === productId);

        if (productData) {
            cart.add(
                productData.id,
                1,
                productData.price,
                productData.discount,
                productData.name,
                productData.images[0]
            );
            alert(`${productData.name} добавлен в корзину!`);
        } else {
            console.error(`Product with ID ${productId} not found in siteData.`);
            alert('Не удалось добавить товар. Попробуйте обновить страницу.');
        }
    }
});
