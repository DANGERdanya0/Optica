// Create a global object to hold site-wide data
window.siteData = {
    products: []
};

document.addEventListener('DOMContentLoaded', function() {
    // Slider Logic
    const slides = document.querySelectorAll('.slider .slide');
    const prevBtn = document.querySelector('.slider .prev');
    const nextBtn = document.querySelector('.slider .next');
    let currentSlide = 0;

    function showSlide(n) {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    if(slides.length > 0) {
        if(prevBtn) prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    
        if(nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    
        setInterval(nextSlide, 10000); // Auto-scroll every 10 seconds
    }


    // --- Product Loading Logic ---
    const productCarousel = document.querySelector('.product-carousel');

    function createProductCard(product) {
        const priceHtml = product.discount > 0
            ? `<span class="old-price">${product.price.toLocaleString('ru-RU')} ₽</span>
               <span class="new-price">${(product.price * (1 - product.discount / 100)).toLocaleString('ru-RU')} ₽</span>`
            : `${product.price.toLocaleString('ru-RU')} ₽`;

        const secondImage = product.images.length > 1 ? product.images[1] : product.images[0];

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image" style="background-image: url('${product.images[0]}');">
                    <div class="product-image img-top" style="background-image: url('${secondImage}');"></div>
                </div>
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <div class="price">${priceHtml}</div>
                    <button class="add-to-cart-btn">В корзину</button>
                </div>
            </div>
        `;
    }

    function renderProducts(products, container) {
        if (!container) return;
        container.innerHTML = products.map(createProductCard).join('');
    }

    // Fetch and display products for the carousel
    fetch('data/glasses.json')
        .then(response => response.json())
        .then(products => {
            // Store products globally
            window.siteData.products = [...products];
            // Display top 5 products as "Товары недели"
            renderProducts(products.slice(0, 5), productCarousel);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            if(productCarousel) productCarousel.innerHTML = '<p>Не удалось загрузить товары.</p>';
        });

});
