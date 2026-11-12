/* :::::::::::::::::::::::::: LOTTIE ICONS :::::::::::::::::::::::::: */

function initLottieIcons() {
  if (typeof lottie === 'undefined') {
    console.warn('[lottie-icons] lottie library not loaded');
    return;
  }

  document.querySelectorAll('[data-lottie]').forEach(container => {
    if (container._lottieInstance) return;

    const path = container.dataset.lottie;
    if (!path) return;

    const mode = container.dataset.lottieMode || 'hover';

    const anim = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: mode === 'loop',
      autoplay: mode === 'loop',
      path
    });

    container._lottieInstance = anim;

    anim.addEventListener('DOMLoaded', () => {
      const svg = container.querySelector('svg');
      if (!svg) return;
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.querySelectorAll('path, circle, rect, line, polyline, polygon').forEach(el => {
        if (el.style.fill !== 'none') el.style.fill = 'currentColor';
        if (el.style.stroke && el.style.stroke !== 'none') el.style.stroke = 'currentColor';
      });
    });

    if (mode === 'hover') {
      const parent = container.closest('.editorial-item, .service-box, .card, a, button') || container;
      parent.addEventListener('mouseenter', () => anim.goToAndPlay(0, true));
      parent.addEventListener('mouseleave', () => anim.stop());
    } else if (mode === 'click') {
      container.addEventListener('click', () => anim.goToAndPlay(0, true));
    } else if (mode === 'once') {
      anim.addEventListener('DOMLoaded', () => anim.play());
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLottieIcons);
} else {
  initLottieIcons();
}