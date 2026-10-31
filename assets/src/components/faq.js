// =========================================
// LOTTIE ICONS + FAQ ACCORDION
// =========================================

/* :::::::::::::::::::::::::: LOTTIE INITIALIZER :::::::::::::::::::::::::: */
function initLottieIcons() {
  if (typeof lottie === 'undefined') {
    console.warn('[lottie-icons] lottie library not loaded');
    return;
  }

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  document.querySelectorAll('[data-lottie]').forEach(container => {
    if (container._lottieInstance) return;

    const path = container.dataset.lottie;
    if (!path) return;

    let mode = container.dataset.lottieMode || 'hover';
    if (isTouchDevice && mode === 'hover') mode = 'once';

    const anim = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: mode === 'loop',
      autoplay: mode === 'loop',
      path
    });

    container._lottieInstance = anim;

    /* ✅ فقط سایز — رنگ کاملاً با CSS مدیریت می‌شه */
    anim.addEventListener('DOMLoaded', () => {
      const svg = container.querySelector('svg');
      if (!svg) return;
      svg.style.width = '100%';
      svg.style.height = '100%';
    });

    /* ✅ رفتار بر اساس mode */
    if (mode === 'hover') {
      const parent = container.closest('.editorial-item, .service-box, .card, a, button') || container;
      parent.addEventListener('mouseenter', () => anim.goToAndPlay(0, true));
      parent.addEventListener('mouseleave', () => anim.stop());
    } else if (mode === 'click') {
      container.addEventListener('click', () => anim.goToAndPlay(0, true));
    } else if (mode === 'once') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            anim.goToAndPlay(0, true);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      observer.observe(container);
    } else if (mode === 'faq') {
      anim.addEventListener('DOMLoaded', () => {
        const faqItem = container.closest('.faq-item');
        const isOpen = faqItem && faqItem.classList.contains('faq-item--open');
        anim.goToAndStop(isOpen ? anim.totalFrames - 1 : 0, true);
      });
    }
  });
}

/* :::::::::::::::::::::::::: FAQ ACCORDION :::::::::::::::::::::::::: */

function setFaqAnimation(btn, direction, attempt = 0) {
  if (!btn) return;
  const icon = btn.querySelector('.faq-icon');
  if (!icon) return;
  const anim = icon._lottieInstance;

  if (!anim) {
    if (attempt >= 5) return;
    setTimeout(() => setFaqAnimation(btn, direction, attempt + 1), 150);
    return;
  }

  const play = () => {
    anim.setDirection(direction);
    anim.play();
  };

  if (anim.isLoaded) play();
  else anim.addEventListener('DOMLoaded', play, { once: true });
}

function refreshOpenFaqs() {
  document.querySelectorAll('.faq-item--open').forEach(item => {
    const wrapper = item.querySelector('.faq-answer-wrapper');
    const answer = wrapper && wrapper.querySelector('.faq-answer');
    if (wrapper && answer) {
      wrapper.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
}

function initFaq() {
  document.querySelectorAll('.faq-question').forEach(button => {
    if (button._faqAttached) return;
    button._faqAttached = true;

    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('faq-item--open');

      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          const wasOpen = other.classList.contains('faq-item--open');
          other.classList.remove('faq-item--open');
          const wrapper = other.querySelector('.faq-answer-wrapper');
          if (wrapper) wrapper.style.maxHeight = '0px';
          const btn = other.querySelector('.faq-question');
          if (btn) {
            btn.setAttribute('aria-expanded', 'false');
            if (wasOpen) setFaqAnimation(btn, -1);
          }
        }
      });

      const wrapper = item.querySelector('.faq-answer-wrapper');
      const answer = item.querySelector('.faq-answer');

      if (isOpen) {
        item.classList.remove('faq-item--open');
        if (wrapper) wrapper.style.maxHeight = '0px';
        button.setAttribute('aria-expanded', 'false');
        setFaqAnimation(button, -1);
      } else {
        item.classList.add('faq-item--open');
        if (wrapper && answer) wrapper.style.maxHeight = answer.scrollHeight + 'px';
        button.setAttribute('aria-expanded', 'true');
        setFaqAnimation(button, 1);
      }
    });
  });

  document.querySelectorAll('.faq-item--open').forEach(item => {
    const wrapper = item.querySelector('.faq-answer-wrapper');
    const answer = wrapper && wrapper.querySelector('.faq-answer');
    if (wrapper && answer) {
      wrapper.style.maxHeight = answer.scrollHeight + 'px';
    }
    const btn = item.querySelector('.faq-question');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  });

  if (!window._faqResizeAttached) {
    window._faqResizeAttached = true;
    let timer;
    window.addEventListener('resize', () => {
      clearTimeout(timer);
      timer = setTimeout(refreshOpenFaqs, 150);
    });
  }
}

/* :::::::::::::::::::::::::: INIT :::::::::::::::::::::::::: */
function initAll() {
  initLottieIcons();
  initFaq();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}