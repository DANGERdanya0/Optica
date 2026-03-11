# GEMINI.md - Project Overview: DIVOptica

## Project Overview

This project is a static e-commerce website for an optics store named "DIVOptica". It is built using plain HTML, CSS, and vanilla JavaScript. The application is designed as a single-page application (SPA) experience where different sections (like Auth, Cart, Admin) are handled through dynamically appearing modals rather than separate page loads.

The project features a clean, modern design and focuses on providing a smooth user experience for browsing and purchasing optical products.

**Key Technologies:**

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Data:** Product information is managed through static JSON files located in the `/data` directory.
- **Architecture:**
  - The UI is structured across several HTML files (`index.html`, `shop.html`, etc.).
  - Client-side logic is modularized into separate `.js` files (`main.js`, `shop.js`, `cart.js`, `auth.js`, `admin.js`).
  - A global `window.siteData` object is used as a simple in-memory data store for products fetched from JSON files.
  - The site relies on modals for user interactions like login, registration, viewing the cart, and accessing the admin panel.

## Building and Running the Project

This is a static website and does not have a build process (e.g., Webpack, Vite, or npm scripts).

**To run the project:**

You need to serve the files using a local web server. Opening the `index.html` file directly in the browser via the `file://` protocol will likely fail due to CORS security restrictions when the JavaScript code tries to `fetch()` the local JSON data files.

**Using a simple Python server (if Python is installed):**

1.  Navigate to the project's root directory in your terminal.
2.  Run one of the following commands:
    - For Python 3: `python3 -m http.server`
    - For Python 2: `python -m SimpleHTTPServer`
3.  Open your web browser and go to `http://localhost:8000`.

**Using VS Code Live Server:**

1.  Install the "Live Server" extension in Visual Studio Code.
2.  Open the project folder in VS Code.
3.  Right-click on `index.html` in the Explorer and select "Open with Live Server".

## Development Conventions

- **Documentation:** The project is well-documented in the `/docs` directory. These markdown files provide detailed plans for development, site structure, and feature implementation. Refer to them before making changes.
- **Data Management:** All product data is stored in `.json` files within the `/data` directory. To add or modify products, edit these files.
- **State Management:** The project uses a global `window.siteData` object to hold product data that is loaded from the JSON files. This object is populated by `js/main.js` and `js/shop.js`.
- **Modularity:** JavaScript functionality is broken down into logical files:
  - `js/main.js`: Core logic for the main page (slider, featured products).
  - `js/shop.js`: Logic for the catalog page, including searching and filtering.
  - `js/auth.js`: Handles user login, registration, and profile modals.
  - `js/cart.js`: Manages the shopping cart functionality within the user profile modal.
  - `js/admin.js`: Logic for the admin panel modal.
- **Styling:** Styles are organized into separate CSS files in the `/css` directory, corresponding to different features (e.g., `shop.css`, `auth.css`). `main.css` contains the main styles.
- **Assets:** All static assets like images are located in the `/media` directory.
