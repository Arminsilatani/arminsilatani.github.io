class LatestPostsSlider {
  constructor(root) {
    this.root = root;
    this.track = root.querySelector('.latest-posts-slider__track');
    this.viewport = root.querySelector('.latest-posts-slider__viewport');
    this.slides = Array.from(root.querySelectorAll('.latest-posts-slide'));
    this.prevBtn = root.querySelector('.latest-posts-slider__btn--prev');
    this.nextBtn = root.querySelector('.latest-posts-slider__btn--next');
    this.dotsContainer = root.querySelector('.latest-posts-slider__dots');

    if (!this.track || this.slides.length === 0) return;

    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.dots = [];

    this.initDots();
    this.bindEvents();
    this.update();
  }

  initDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'latest-posts-slider__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `رفتن به صفحه ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
      this.dots.push(dot);
    }
  }

  bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.goTo(this.currentIndex - 1));
    this.nextBtn?.addEventListener('click', () => this.goTo(this.currentIndex + 1));

    this.root.addEventListener('keydown', (e) => {
      const isRTL = document.documentElement.dir === 'rtl';
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.goTo(this.currentIndex + (isRTL ? -1 : 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.goTo(this.currentIndex + (isRTL ? 1 : -1));
      }
    });

    let startX = 0;
    let startY = 0;
    this.viewport.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    this.viewport.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;

      const isRTL = document.documentElement.dir === 'rtl';
      if (isRTL) {
        if (dx > 0) this.goTo(this.currentIndex + 1);
        else this.goTo(this.currentIndex - 1);
      } else {
        if (dx < 0) this.goTo(this.currentIndex + 1);
        else this.goTo(this.currentIndex - 1);
      }
    }, { passive: true });
  }

  goTo(index) {
    if (index < 0 || index >= this.totalSlides) return;
    this.currentIndex = index;
    this.update();
  }

  update() {
    const isRTL = document.documentElement.dir === 'rtl';
    const offset = isRTL
      ? this.currentIndex * 100
      : -this.currentIndex * 100;

    this.track.style.transform = `translateX(${offset}%)`;

    if (this.prevBtn) {
      const disabled = this.currentIndex === 0;
      this.prevBtn.disabled = disabled;
      this.prevBtn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    }

    if (this.nextBtn) {
      const disabled = this.currentIndex >= this.totalSlides - 1;
      this.nextBtn.disabled = disabled;
      this.nextBtn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    }

    this.dots.forEach((dot, i) => {
      const active = i === this.currentIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    this.slides.forEach((slide, i) => {
      const visible = i === this.currentIndex;
      slide.setAttribute('aria-hidden', visible ? 'false' : 'true');
      if (!visible) {
        slide.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '-1'));
      } else {
        slide.querySelectorAll('a, button').forEach(el => {
          if (el.closest('.is-placeholder') || el.getAttribute('aria-disabled') === 'true') return;
          el.removeAttribute('tabindex');
        });
      }
    });
  }
}

window.initLatestPostsSliders = function () {
  document.querySelectorAll('.latest-posts-slider').forEach(el => {
    if (!el._latestPostsSliderInitialized) {
      new LatestPostsSlider(el);
      el._latestPostsSliderInitialized = true;
    }
  });
};

window.initLatestPostsSliders();