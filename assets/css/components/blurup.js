/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-19
  *  Version: 0.0.0
  ****************************************************
*/

/* ====================== BLUR-UP IMAGE LOADING SCRIPT ====================== */

(function () {
  /* ---------------------- CONSTANTS ---------------------- */
  const BLUR_PIXELS = 12;
  const DURATION_MS = 500;
  const OBSERVER_OPTIONS = {
    root: null,
    rootMargin: '200px 0px',
    threshold: 0
  };

  /* ---------------------- INITIALIZE ALL IMAGES ---------------------- */
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    // Apply blur and transition duration via custom properties
    img.style.setProperty('--blurup-blur', `${BLUR_PIXELS}px`);
    img.style.setProperty('--blurup-dur', `${DURATION_MS}ms`);

    // Assign loading strategy and observation flag
    if (img.closest('.hero-section')) {
      img.setAttribute('loading', 'eager');
    } else if (!img.hasAttribute('data-no-blurup')) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('data-blurup-observe', 'true');
    }

    // Mark image as blur-up enabled
    img.setAttribute('data-blurup', 'true');
  });

  /* ---------------------- INTERSECTION OBSERVER FOR LAZY IMAGES ---------------------- */
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;

      const finish = () => {
        img.classList.add('blurup-loaded');
        obs.unobserve(img);
      };

      // If image already loaded, apply effect immediately; otherwise wait for load/error
      if (img.complete && img.naturalWidth > 0) {
        finish();
      } else {
        img.addEventListener('load', finish, { once: true });
        img.addEventListener('error', finish, { once: true });
      }
    });
  }, OBSERVER_OPTIONS);

  // Start observing all lazy images
  document.querySelectorAll('[data-blurup-observe="true"]').forEach(img => observer.observe(img));

  /* ---------------------- HANDLE EAGER (HERO) IMAGES ---------------------- */
  document.querySelectorAll('[data-blurup="true"][loading="eager"]').forEach(img => {
    const addLoaded = () => img.classList.add('blurup-loaded');

    if (img.complete) {
      addLoaded();
    } else {
      img.addEventListener('load', addLoaded, { once: true });
      img.addEventListener('error', addLoaded, { once: true });
    }
  });
})();