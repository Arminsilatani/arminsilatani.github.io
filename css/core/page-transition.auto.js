(() => {
  // تزریق استایل یک‌بار
  const STYLE_ID = 'pt-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* حالت اولیه قبل از آماده شدن */
      html.pt-preload body {
        opacity: 0;
        filter: blur(14px);
        transform: translateY(8px);
      }

      /* ترنزیشن اصلی */
      body.pt-page {
        transition: opacity 500ms ease, filter 500ms ease, transform 500ms ease;
      }

      /* حالت ورود */
      body.pt-page.pt-loaded {
        opacity: 1;
        filter: blur(0);
        transform: translateY(0);
      }

      /* حالت خروج */
      body.pt-page.pt-leaving {
        opacity: 0;
        filter: blur(12px);
        transform: translateY(-6px);
      }

      @media (prefers-reduced-motion: reduce) {
        html.pt-preload body,
        body.pt-page,
        body.pt-page.pt-loaded,
        body.pt-page.pt-leaving {
          opacity: 1 !important;
          filter: none !important;
          transform: none !important;
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // آماده‌سازی کلاس‌های body
  const setupBody = () => {
    document.body.classList.add('pt-page');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupBody, { once: true });
  } else {
    setupBody();
  }

  // پایان preload + ورود نرم
  window.addEventListener('load', () => {
    document.documentElement.classList.remove('pt-preload');
    requestAnimationFrame(() => {
      document.body.classList.add('pt-loaded');
    });
  });

  // خروج روی لینک‌های داخلی
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // رد کردن لینک‌های غیرناوبری
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    ) return;

    // فقط لینک داخلی
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;

    e.preventDefault();
    document.body.classList.add('pt-leaving');

    setTimeout(() => {
      window.location.href = url.href;
    }, 500);
  });
})();
