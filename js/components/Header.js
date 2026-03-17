const headerTemplate = document.createElement('template');

headerTemplate.innerHTML = `
<style>
    :host {
        --color-white: #ffffff;
        --color-dark: #2c3e50;
        --color-primary: #3498db;
        --color-text-secondary: #8f8f8f;
        --color-shadow-light: rgba(0, 0, 0, 0.1);
    }
    .site-header-component {
      position: fixed;
      top: 20px;
      left: 15px;
      right: 15px;
      z-index: 1000;
    }
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;
      background-color: var(--color-white);
      border-radius: 10px;
      box-shadow: 0 2px 5px var(--color-shadow-light);
      padding: 0 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .header-left,
    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .header-right {
      justify-content: flex-end;
    }
    .logo a {
      font-size: 24px;
      font-weight: bold;
      text-decoration: none;
      color: var(--color-dark);
    }
    .header-left a,
    .header-right a {
      text-decoration: none;
      color: var(--color-text-secondary);
      font-weight: 500;
      transition: color 0.3s ease;
    }
    .header-left a:hover,
    .header-right a:hover {
      color: var(--color-primary);
    }
    .account-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }

    .hamburger-menu, .mobile-nav {
        display: none;
    }

    @media (max-width: 768px) {
        .header-left, .header-right {
            display: none;
        }
        .header-container {
            justify-content: space-between;
        }
        .hamburger-menu {
            display: block;
            cursor: pointer;
        }
        .mobile-nav.active {
            display: flex;
            flex-direction: column;
            gap: 15px;
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background-color: var(--color-white);
            padding: 20px;
            box-shadow: 0 2px 5px var(--color-shadow-light);
        }
        .mobile-nav a {
            text-decoration: none;
            color: var(--color-text-secondary);
            font-weight: 500;
            font-size: 18px;
        }
    }
  </style>
  <header class="site-header-component">
    <div class="header-container">
      <div class="logo">
        <a href="index.html">DIVOptica</a>
      </div>
      <div class="header-left">
        <a href="branches.html">Филиалы</a>
        <a href="support.html">Поддержка</a>
        <a href="shop.html">Каталог</a>
        <a href="health.html">Здоровье</a>
      </div>
      <div class="header-right">
        <a href="info.html">О нас</a>
        <a href="service.html">Сервис</a>
        <button class="account-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 12C10.6739 12 9.40215 12.5268 8.46447 13.4645C7.52678 14.4021 7 15.6739 7 17V20H17V17C17 15.6739 16.4732 14.4021 15.5355 13.4645C14.5979 12.5268 13.3261 12 12 12Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="hamburger-menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 6H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 18H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    <nav class="mobile-nav">
      <a href="branches.html">Филиалы</a>
      <a href="support.html">Поддержка</a>
      <a href="shop.html">Каталог</a>
      <a href="health.html">Здоровье</a>
      <a href="info.html">О нас</a>
      <a href="service.html">Сервис</a>
    </nav>
  </header>
`;

class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(headerTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    const hamburgerMenu = this.shadowRoot.querySelector('.hamburger-menu');
    const mobileNav = this.shadowRoot.querySelector('.mobile-nav');

    if (hamburgerMenu && mobileNav) {
      hamburgerMenu.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
      });
    }

    const accountButton = this.shadowRoot.querySelector('.account-button');
    if (accountButton) {
        accountButton.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('open-account-modal', { bubbles: true, composed: true }));
        });
    }
  }
}

customElements.define('site-header', SiteHeader);
