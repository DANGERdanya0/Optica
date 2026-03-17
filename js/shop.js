// Ensure the global data store is initialized
if (!window.siteData) {
  window.siteData = {
    products: [],
  };
}

document.addEventListener("DOMContentLoaded", function () {
  // Get all necessary DOM elements
  const categoryModal = document.getElementById("category-modal");
  const categoryChoiceBtns = document.querySelectorAll(".category-choice-btn");
  const productGrid = document.getElementById("product-grid");
  const searchBox = document.getElementById("search-box");
  const categoryFilterContainer = document.getElementById("category-filter");
  const subcategoryFilterContainer =
    document.getElementById("subcategory-filter");
  const brandFilterContainer = document.getElementById("brand-filter");
  const priceRange = document.getElementById("price-range");
  const priceMaxValue = document.getElementById("price-max-value");

  // State variables
  let currentFilters = {
    category: "",
    subcategories: [],
    brands: [],
    maxPrice: 50000,
    searchTerm: "",
  };
  const productFiles = [
    "data/glasses.json",
    "data/accessories.json",
    "data/care_products.json",
  ];

  // --- Main Initialization Function ---
  function initializeShop() {
    // Fetch all products from JSON files
    Promise.all(
      productFiles.map((file) => fetch(file).then((res) => res.json())),
    )
      .then((productArrays) => {
        // Use the global product store
        window.siteData.products = productArrays.flat();
        console.log(
          "All products loaded into global store:",
          window.siteData.products,
        );

        populateCategoryFilters();
        addFilterEventListeners();
      })
      .catch((error) => {
        console.error("Error loading product data:", error);
        if (productGrid)
          productGrid.innerHTML = "<p>Ошибка загрузки товаров.</p>";
      });
  }

  // --- UI Population Functions ---
  function populateCategoryFilters() {
    const categories = [
      ...new Set(window.siteData.products.map((p) => p.category)),
    ];
    if (!categoryFilterContainer) return;
    categoryFilterContainer.innerHTML = categories
      .map(
        (cat) => `
            <label><input type="radio" name="category" value="${cat}"> ${cat}</label>
        `,
      )
      .join("");
  }

  function updateDynamicFilterControls(category) {
    const categoryProducts = window.siteData.products.filter(
      (p) => p.category === category,
    );

    const subcategories = [
      ...new Set(categoryProducts.map((p) => p.subcategory)),
    ];
    if (subcategoryFilterContainer) {
      subcategoryFilterContainer.innerHTML = subcategories
        .map(
          (sub) => `
                <label><input type="checkbox" name="subcategory" value="${sub}"> ${sub}</label>
            `,
        )
        .join("");
    }

    const brands = [...new Set(categoryProducts.map((p) => p.brand))];
    if (brandFilterContainer) {
      brandFilterContainer.innerHTML = brands
        .map(
          (b) => `
                <label><input type="checkbox" name="brand" value="${b}"> ${b}</label>
            `,
        )
        .join("");
    }

    addDynamicFilterEventListeners();
  }

  function renderProductGrid(products) {
    if (!productGrid) return;
    if (products.length === 0) {
      productGrid.innerHTML = "<p>Товары не найдены.</p>";
      return;
    }
    productGrid.innerHTML = products.map(createProductCard).join("");
  }

  // --- Event Listener Functions ---
  function addFilterEventListeners() {
    if (categoryChoiceBtns.length > 0) {
      categoryChoiceBtns.forEach((btn) => {
        btn.addEventListener("click", () =>
          handleCategoryChoice(btn.dataset.category),
        );
      });
    }

    if (categoryFilterContainer) {
      categoryFilterContainer.addEventListener("change", (e) => {
        if (e.target.name === "category") {
          handleCategoryChoice(e.target.value, false);
        }
      });
    }

    if (searchBox) {
      searchBox.addEventListener("input", (e) => {
        currentFilters.searchTerm = e.target.value.toLowerCase();
        applyFilters();
      });
    }

    if (priceRange) {
      priceRange.addEventListener("input", (e) => {
        currentFilters.maxPrice = parseInt(e.target.value, 10);
        if (priceMaxValue)
          priceMaxValue.textContent = `${currentFilters.maxPrice.toLocaleString("ru-RU")} ₽`;
        applyFilters();
      });
    }

    function setupModalClosing(modal) {
        if (!modal) return;
        let mouseDownOnOverlay = false;

        modal.addEventListener('mousedown', (e) => {
            if (e.target === modal) {
                mouseDownOnOverlay = true;
            }
        });

        modal.addEventListener('mouseup', (e) => {
            if (e.target === modal && mouseDownOnOverlay) {
                modal.classList.remove('active');
            }
            mouseDownOnOverlay = false;
        });
    }

    setupModalClosing(categoryModal);
  }

  function addDynamicFilterEventListeners() {
    if (subcategoryFilterContainer) {
      subcategoryFilterContainer.addEventListener("change", (e) => {
        if (e.target.name === "subcategory") {
          currentFilters.subcategories = Array.from(
            document.querySelectorAll('input[name="subcategory"]:checked'),
          ).map((el) => el.value);
          applyFilters();
        }
      });
    }

    if (brandFilterContainer) {
      brandFilterContainer.addEventListener("change", (e) => {
        if (e.target.name === "brand") {
          currentFilters.brands = Array.from(
            document.querySelectorAll('input[name="brand"]:checked'),
          ).map((el) => el.value);
          applyFilters();
        }
      });
    }
  }

  // --- Logic Handlers ---
  function handleCategoryChoice(category, closeModal = true) {
    currentFilters.category = category;
    if (closeModal && categoryModal) categoryModal.classList.remove("active");

    const radioToSelect = document.querySelector(
      `input[name="category"][value="${category}"]`,
    );
    if (radioToSelect) radioToSelect.checked = true;

    currentFilters.subcategories = [];
    currentFilters.brands = [];
    updateDynamicFilterControls(category);

    applyFilters();
  }

  function applyFilters() {
    const filteredProducts = window.siteData.products.filter((p) => {
      const categoryMatch = currentFilters.category
        ? p.category === currentFilters.category
        : true;
      const subcategoryMatch =
        currentFilters.subcategories.length > 0
          ? currentFilters.subcategories.includes(p.subcategory)
          : true;
      const brandMatch =
        currentFilters.brands.length > 0
          ? currentFilters.brands.includes(p.brand)
          : true;
      const priceMatch = p.price <= currentFilters.maxPrice;
      const searchMatch = currentFilters.searchTerm
        ? p.name.toLowerCase().includes(currentFilters.searchTerm) ||
          p.brand.toLowerCase().includes(currentFilters.searchTerm)
        : true;

      return (
        categoryMatch &&
        subcategoryMatch &&
        brandMatch &&
        priceMatch &&
        searchMatch
      );
    });

    renderProductGrid(filteredProducts);
  }

  // --- Helper Functions ---
  function createProductCard(product) {
    const priceHtml =
      product.discount > 0
        ? `<span class="old-price">${product.price.toLocaleString("ru-RU")} ₽</span>
               <span class="new-price">${(product.price * (1 - product.discount / 100)).toLocaleString("ru-RU")} ₽</span>`
        : `${product.price.toLocaleString("ru-RU")} ₽`;

    const secondImage =
      product.images.length > 1 ? product.images[1] : product.images[0];

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

  // --- Start the application ---
  initializeShop();
});
