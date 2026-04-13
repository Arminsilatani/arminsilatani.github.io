/*
  Author: Armin Silatani
  Date: 2026-03-29 (Updated: 2026-04-02)
  Version: 1.3.3 (Custom Domain, Smooth Glass & Multi-directional Feathered Edges)
*/

/* ::::::::::::::::::::::::::::::::::::::: LANGUAGE COMPONENT ::::::::::::::::::::::::::::::::::::::: */

class LanguageComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    /* Styles */
    const style = document.createElement('style');
    style.textContent = `
      .language-container {
        position: absolute;
        top: 14px;
        right: 0;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        cursor: pointer;
        user-select: none;
        touch-action: manipulation;
        direction: rtl;
        padding-right: 10px;
        -webkit-tap-highlight-color: transparent; 
      }

      .language {
        color: #0d0d0d;
        font-size: 16px;
        padding: 1px 10px;
        font-weight: 500;
      }

      .language-dropdown {
        /* ============================================================== */
        /* تنظیمات میزان محوشدگی لبه‌های شیشه (میتوانید مقادیر را تغییر دهید) */
        --fade-l: 65px;  /* مقدار محوشدگی سمت چپ */
        --fade-r: 30px;  /* مقدار محوشدگی سمت راست */
        --fade-b: 30px;  /* مقدار محوشدگی پایین */
        /* ============================================================== */

        display: none;
        position: absolute;
        top: 100%;
        
        /* شیفت دادن منو به سمت راست برای خنثی کردن پدینگ، تا متن‌ها با کلمه 'فارسی |' تراز بمانند */
        right: calc(10px - var(--fade-r));
        
        flex-direction: column;
        background: linear-gradient(to bottom, rgba(245, 245, 245, 0.04) 0%, rgba(245, 245, 245, 0) 100%);
        
        opacity: 0;
        backdrop-filter: blur(0px); 
        -webkit-backdrop-filter: blur(0px);
        
        /* 
          ایجاد ماسک‌های افقی و عمودی و ترکیب آن‌ها
          - لایه اول (افقی): چپ و راست را محو می‌کند
          - لایه دوم (عمودی): فقط پایین را محو می‌کند (بالا ثابت می‌ماند)
        */
        -webkit-mask-image: 
          linear-gradient(to right, transparent 0%, black var(--fade-l), black calc(100% - var(--fade-r)), transparent 100%),
          linear-gradient(to bottom, black 0%, black calc(100% - var(--fade-b)), transparent 100%);
        -webkit-mask-composite: source-in; /* ادغام ماسک‌ها در کروم و سافاری */
        
        mask-image: 
          linear-gradient(to right, transparent 0%, black var(--fade-l), black calc(100% - var(--fade-r)), transparent 100%),
          linear-gradient(to bottom, black 0%, black calc(100% - var(--fade-b)), transparent 100%);
        mask-composite: intersect; /* ادغام ماسک‌ها در مرورگرهای استاندارد */
        
        /* ایجاد فضای امن با Padding تا متن لینک‌ها وارد ناحیه محوشدگی نشوند و واضح بمانند */
        padding-left: 10px;
        padding-right: var(--fade-r);
        padding-bottom: var(--fade-b);

        box-shadow: none; 
        border: none;
        border-radius: 8px; 
        z-index: 20;
        direction: rtl;
        
        /* اطمینان از عرض کافی برای نمایش متن‌ها در وسط ناحیه شفاف */
        min-width: 140px; 
        overflow: hidden;
        
        transition: opacity 0.4s ease, backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease;
      }

      .language-dropdown.open {
        opacity: 1;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
      }

      .language-dropdown-item {
        display: block;
        padding: 12px 15px; 
        margin: 0;
        color: #54595f;
        text-decoration: none;
        cursor: pointer;
        transition: color 0.25s ease;
        font-size: 15px;
        opacity: 0;
      }

      .language-dropdown-item:hover, 
      .language-dropdown-item:active {
        color: #0d0d0d;
      }

      @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .language-dropdown.open .language-dropdown-item {
        animation: fadeInDown 0.3s ease-out forwards;
        animation-delay: calc(var(--i) * 0.05s);
      }

      @media (max-width: 768px) {
        .language-container {
          top: 15px;
        }
      }
    `;
    shadow.appendChild(style);


    /* DOM Structure */
    const container = document.createElement('div');
    container.className = 'language-container';

    const langDisplay = document.createElement('div');
    langDisplay.className = 'language';
    langDisplay.textContent = '| فارسی';
    langDisplay.setAttribute('aria-label', 'Language Selector');
    langDisplay.setAttribute('role', 'button');

    const dropdown = document.createElement('div');
    dropdown.className = 'language-dropdown';
    dropdown.setAttribute('role', 'menu');

    /* Language Configuration */
    const languages = [
      { name: 'English', url: 'https://arminsilatani.github.io/en/', hreflang: 'en' },
      { name: 'العربية', url: 'https://arminsilatani.github.io/ar/', hreflang: 'ar' },
      { name: 'Türkçe', url: 'https://arminsilatani.github.io/tr/', hreflang: 'tr' },
      { name: 'Deutsch', url: 'https://arminsilatani.github.io/de/', hreflang: 'de' },
      { name: 'Italiano', url: 'https://arminsilatani.github.io/it/', hreflang: 'it' },
    ];

    /* Extract Current Path */
    let currentPath = window.location.pathname;

    const localRepoName = '/arminsilatani.github.io';
    if (currentPath.startsWith(localRepoName)) {
      currentPath = currentPath.slice(localRepoName.length);
    }

    const langFolders = ['/en/', '/ar/', '/tr/', '/de/', '/it/'];
    for (let folder of langFolders) {
      if (currentPath.startsWith(folder)) {
        currentPath = currentPath.slice(folder.length - 1);
        break;
      }
    }

    if (currentPath.startsWith('/')) {
      currentPath = currentPath.slice(1);
    }

    const pageName = currentPath;
    const searchAndHash = window.location.search + window.location.hash;

    /* Generate Language Links */
    languages.forEach((lang, index) => {
      const link = document.createElement('a');
      link.className = 'language-dropdown-item';
      link.textContent = lang.name;

      let baseUrl = lang.url;
      if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
      }

      link.href = baseUrl + pageName + searchAndHash;
      console.log(`[Language Component] URL for ${lang.name}:`, link.href);

      link.setAttribute('hreflang', lang.hreflang);
      link.setAttribute('role', 'menuitem');
      link.setAttribute('aria-label', `Switch to ${lang.name}`);
      link.style.setProperty('--i', index);

      link.addEventListener('click', () => hideDropdown());

      dropdown.appendChild(link);
    });

    container.appendChild(langDisplay);
    container.appendChild(dropdown);
    shadow.appendChild(container);

    /* Dropdown Controls */
    const showDropdown = () => {
      dropdown.style.display = 'flex';
      requestAnimationFrame(() => dropdown.classList.add('open'));
    };

    const hideDropdown = () => {
      dropdown.classList.remove('open');
      setTimeout(() => {
        if (!dropdown.classList.contains('open')) {
          dropdown.style.display = 'none';
        }
      }, 300);
    };

    const toggleDropdown = () => {
      dropdown.classList.contains('open') ? hideDropdown() : showDropdown();
    };

    container.addEventListener('mouseenter', showDropdown);
    container.addEventListener('mouseleave', e => {
      if (!container.contains(e.relatedTarget)) hideDropdown();
    });
    langDisplay.addEventListener('click', e => {
      e.preventDefault();
      toggleDropdown();
    });
    langDisplay.addEventListener('keydown', e => {
      if (e.key === 'Enter') toggleDropdown();
      if (e.key === 'Escape') hideDropdown();
    });
  }
}

if (!customElements.get('language-component')) {
  customElements.define('language-component', LanguageComponent);
}
