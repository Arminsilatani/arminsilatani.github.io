(() => {
  // 1) استایل‌ها
  const STYLE_ID = 'pt-style';
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      html.pt-preload body { opacity: 0; filter: blur(14px); transform: translateY(8px); }
      body.pt-page { transition: opacity 500ms ease, filter 500ms ease, transform 500ms ease; }
      body.pt-page.pt-loaded { opacity: 1; filter: blur(0); transform: translateY(0); }
      body.pt-page.pt-leaving { opacity: 0; filter: blur(12px); transform: translateY(-6px); }
      @media (prefers-reduced-motion: reduce) {
        html.pt-preload body, body.pt-page, body.pt-page.pt-loaded, body.pt-page.pt-leaving {
          opacity: 1 !important; filter: none !important; transform: none !important; transition: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 2) آماده‌سازی کلاس‌ها
  const setup = () => document.body.classList.add('pt-page');
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  } else { setup(); }

  window.addEventListener('load', () => {
    document.documentElement.classList.remove('pt-preload');
    requestAnimationFrame(() => document.body.classList.add('pt-loaded'));
  });

  // 3) کمک‌تابع: پیدا کردن <a> حتی در Shadow DOM
  const getAnchorFromEvent = (e) => {
    if (e.composedPath) {
      for (const node of e.composedPath()) {
        if (node && node.tagName === 'A') return node;
      }
    }
    return e.target.closest ? e.target.closest('a') : null;
  };

  // 4) رهگیری کلیک (زودتر از هندلرهای منو)
  document.addEventListener('click', (e) => {
    const a = getAnchorFromEvent(e);
    if (!a) return;

    // پرهیز از تداخل: فعلاً لینک‌های داخل هدر را دخالت نده
    const inHeader = a.closest('header-component,[data-pt-skip]');
if (inHeader && !a.hasAttribute('data-pt-allow')) return;


    const href = a.getAttribute('href') || '';
    if (!href) return;

    // لینک‌هایی که نباید دخالت کنیم
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      a.hasAttribute('download') ||
      (a.target && a.target.toLowerCase() !== '_self') ||
      e.defaultPrevented ||
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    ) return;

    // فقط لینک داخلی
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;

    e.preventDefault();

    // خروج با اطمینان از ناوبری
    document.body.classList.add('pt-leaving');
    let done = false;
    const navigate = () => {
      if (done) return; done = true;
      window.location.assign(url.href);
    };
    const onEnd = (evt) => {
      if (evt.target === document.body) {
        document.body.removeEventListener('transitionend', onEnd);
        navigate();
      }
    };
    document.body.addEventListener('transitionend', onEnd, { once: true });
    setTimeout(navigate, 600);
  }, { capture: true });
})();
