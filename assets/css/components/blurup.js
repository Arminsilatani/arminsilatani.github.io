        (function () {
            const BLUR_PIXELS = 12;
            const DURATION_MS = 500;
            const OBSERVER_OPTIONS = {
                root: null,
                rootMargin: '200px 0px',
                threshold: 0
            };

            const imgs = document.querySelectorAll('img');

            imgs.forEach(img => {
                img.style.setProperty('--blurup-blur', `${BLUR_PIXELS}px`);
                img.style.setProperty('--blurup-dur', `${DURATION_MS}ms`);

                if (img.closest('.hero-section')) {
                    img.setAttribute('loading', 'eager');
                } else if (!img.hasAttribute('data-no-blurup')) {
                    img.setAttribute('loading', 'lazy');
                    img.setAttribute('data-blurup-observe', 'true');
                }

                img.setAttribute('data-blurup', 'true');
            });

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const img = entry.target;
                    const finish = () => {
                        img.classList.add('blurup-loaded');
                        obs.unobserve(img);
                    };
                    if (img.complete && img.naturalWidth > 0) {
                        finish();
                        return;
                    }
                    img.addEventListener('load', finish, { once: true });
                    img.addEventListener('error', finish, { once: true });
                });
            }, OBSERVER_OPTIONS);

            document.querySelectorAll('[data-blurup-observe="true"]').forEach(img => observer.observe(img));

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
