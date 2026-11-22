/* :::::::::::::::::::::::::: SERVICE SECTION INITIALIZATION :::::::::::::::::::::::::: */

document.addEventListener('DOMContentLoaded', () => {

  const POPULAR_TARGET = 3;
  const CARDS_PER_SLIDE = 4;

  const tr = (key, vars) => window.i18n?.t(key, vars) ?? key;

  document.querySelectorAll('.service-block').forEach(section => {

    const sectionTitle = section.querySelector('h2')?.textContent?.trim() || '';


    /* :::::::::::::::::::::::::: POPULAR POSTS :::::::::::::::::::::::::: */

    let popularContainer = section.querySelector('.popular-posts');
    if (!popularContainer) {
      const content = section.querySelector('.service-block__content');
      if (content) {
        popularContainer = document.createElement('div');
        popularContainer.className = 'popular-posts';
        popularContainer.innerHTML = `
          <div class="popular-posts__header">
            <span class="eyebrow">${tr('blog.popularHeading', { category: sectionTitle })}</span>
          </div>
          <ul class="popular-posts__list" role="list"></ul>
        `;
        content.appendChild(popularContainer);
      }
    }

    if (popularContainer) {
      const list = popularContainer.querySelector('.popular-posts__list');
      if (list) {
        const realCount = list.querySelectorAll('.popular-posts__link[href]').length;
        for (let i = realCount; i < POPULAR_TARGET; i++) {
          list.appendChild(createPopularPlaceholder(i + 1));
        }
      }
    }


    /* :::::::::::::::::::::::::: LATEST POSTS SLIDER :::::::::::::::::::::::::: */

    let slider = section.querySelector('.latest-posts-slider');
    if (!slider) {
      const container1080 = section.querySelector('.container-1080');
      if (container1080) {
        const newContainer = document.createElement('div');
        newContainer.className = 'container-1300';
        newContainer.appendChild(createSliderShell(sectionTitle));
        container1080.after(newContainer);
        slider = newContainer.querySelector('.latest-posts-slider');
      }
    }

    if (slider) {
      slider.querySelectorAll('.latest-posts-grid').forEach(grid => {
        const realCount = grid.querySelectorAll('.latest-post-card[href]').length;
        for (let i = realCount; i < CARDS_PER_SLIDE; i++) {
          grid.appendChild(createLatestPlaceholder());
        }
      });

      if (slider.querySelectorAll('.latest-posts-slide').length <= 1) {
        const controls = slider.querySelector('.latest-posts-slider__controls');
        if (controls) controls.style.display = 'none';
      }
    }


    /* :::::::::::::::::::::::::: EMPTY SECTION CHECK :::::::::::::::::::::::::: */

    const realTotal = section.querySelectorAll(
      '.popular-posts__link[href], .latest-post-card[href]'
    ).length;

    if (realTotal === 0) {
      section.classList.add('is-empty');
      const navCard = document.querySelector(`.service-nav-card[href="#${section.id}"]`);
      if (navCard) {
        navCard.setAttribute('aria-disabled', 'true');
        navCard.removeAttribute('href');
        navCard.setAttribute('tabindex', '-1');
        navCard.addEventListener('click', e => e.preventDefault());
      }
    }
  });

  if (typeof window.initLatestPostsSliders === 'function') {
    window.initLatestPostsSliders();
  }
});


/* :::::::::::::::::::::::::: PLACEHOLDER CREATORS :::::::::::::::::::::::::: */

function createPopularPlaceholder(rank) {
  const tr = (key, vars) => window.i18n?.t(key, vars) ?? key;

  const li = document.createElement('li');
  li.className = 'popular-posts__item is-placeholder';
  li.setAttribute('aria-disabled', 'true');
  li.setAttribute('tabindex', '-1');

  const rankFa = String(rank).padStart(2, '0').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);

  li.innerHTML = `
    <div class="popular-posts__link">
      <span class="popular-posts__rank" aria-hidden="true">${rankFa}</span>
      <div class="popular-posts__body">
        <strong class="popular-posts__title">${tr('blog.comingSoon')}</strong>
        <p class="popular-posts__meta"><span>${tr('blog.comingSoonLabel')}</span></p>
      </div>
      <svg class="popular-posts__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
  `;
  li.addEventListener('click', e => e.preventDefault());
  return li;
}

function createLatestPlaceholder() {
  const tr = (key, vars) => window.i18n?.t(key, vars) ?? key;

  const card = document.createElement('div');
  card.className = 'latest-post-card is-placeholder';
  card.setAttribute('aria-disabled', 'true');
  card.setAttribute('tabindex', '-1');

  card.innerHTML = `
    <div class="latest-post-card__meta">
      <span class="latest-post-card__category">${tr('blog.comingSoonLabel')}</span>
    </div>
    <h3 class="latest-post-card__title">${tr('blog.comingSoon')}</h3>
    <p class="latest-post-card__excerpt">${tr('blog.comingSoonExcerpt')}</p>
    <span class="latest-post-card__cta"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  `;
  card.addEventListener('click', e => e.preventDefault());
  return card;
}


/* :::::::::::::::::::::::::: SLIDER SHELL :::::::::::::::::::::::::: */

function createSliderShell(sectionTitle) {
  const tr = (key, vars) => window.i18n?.t(key, vars) ?? key;

  const slider = document.createElement('div');
  slider.className = 'latest-posts-slider';
  slider.setAttribute('aria-roledescription', 'carousel');
  slider.setAttribute('aria-label', tr('blog.latestHeading', { category: sectionTitle }));

  slider.innerHTML = `
    <div class="latest-posts-slider__viewport">
      <div class="latest-posts-slider__track">
        <div class="latest-posts-slide">
          <div class="latest-posts-grid"></div>
        </div>
      </div>
    </div>
    <div class="latest-posts-slider__controls">
      <button type="button" class="latest-posts-slider__btn latest-posts-slider__btn--prev" aria-label="${tr('blog.prevPage')}" disabled>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="latest-posts-slider__dots" role="tablist" aria-label="${tr('blog.pagesLabel')}"></div>
      <button type="button" class="latest-posts-slider__btn latest-posts-slider__btn--next" aria-label="${tr('blog.nextPage')}" disabled>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  `;
  return slider;
}