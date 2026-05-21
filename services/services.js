/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-21
  *  Version: 0.0.0
  ****************************************************
*/

/* =========================== SERVICE CARDS SCROLL MODULE ============================ */
(function() {
  const container = document.getElementById('scrollContainer');
  const dotsNav = document.getElementById('dotsNav');
  const cards = document.querySelectorAll('.service-card');
  let activeIndex = 0;

  /* ------------------------- DOT NAVIGATION ------------------------- */
  function buildDots() {
    dotsNav.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (idx === activeIndex) dot.classList.add('active-dot');
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        scrollToCard(idx);
      });
      dotsNav.appendChild(dot);
    });
  }

  /* ------------------------- CARD SCROLL & ACTIVATION ------------------------- */
  function scrollToCard(index) {
    if (index < 0 || index >= cards.length) return;
    const card = cards[index];
    card.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
    updateActiveCard(index);
  }

  function updateActiveCard(index) {
    if (index === activeIndex) return;
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active-dot');
      } else {
        dot.classList.remove('active-dot');
      }
    });
    activeIndex = index;
  }

  // Detect the card closest to the container center during scroll
  function onScroll() {
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(centerX - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });
    if (closestIndex !== activeIndex) {
      updateActiveCard(closestIndex);
    }
  }

  /* ------------------------- DRAG DETECTION & CLICK HANDLING ------------------------- */
  let dragStartX = 0,
      dragStartY = 0;
  let isDrag = false;
  const DRAG_THRESHOLD = 5;

  function onMouseDown(e) {
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    isDrag = false;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    const dx = Math.abs(e.clientX - dragStartX);
    const dy = Math.abs(e.clientY - dragStartY);
    if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
      isDrag = true;
    }
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  function handleCardClick(event) {
    const card = event.currentTarget;
    // Only active card triggers navigation
    if (!card.classList.contains('active')) return;
    if (isDrag) return;
    const link = card.getAttribute('data-link');
    if (link && link !== '#') {
      window.location.href = link;
    } else {
      console.warn('لینکی برای این کارت تعریف نشده است', card);
    }
  }

  cards.forEach(card => {
    card.addEventListener('click', handleCardClick);
    card.addEventListener('mousedown', onMouseDown);
  });

  /* ------------------------- INITIALIZATION ------------------------- */
  buildDots();
  setTimeout(() => {
    onScroll();
  }, 100);
  container.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
})();