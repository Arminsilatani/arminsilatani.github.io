/*
Author: Armin Silatani
Date: 2026-07-10
Version: 0.0.0
*/

// ═══════════════════════════════════════════════════════════════════════════════
// GSAP & SCROLLTRIGGER INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

document.documentElement.classList.add("js");

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SPLIT TEXT TITLES
// ═══════════════════════════════════════════════════════════════════════════════

function splitTextTitles() {
  document.querySelectorAll(".split-title").forEach(title => {
    if (title.dataset.splitted === "true") return;

    const text = title.textContent.replace(/\s+/g, " ").trim();
    const words = text.split(" ");

    title.innerHTML = words
      .map((word, i) =>
        `<span class="word">${word}</span>` +
        (i < words.length - 1 ? `<span class="space" aria-hidden="true"></span>` : "")
      )
      .join("");

    title.dataset.splitted = "true";
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. SCROLL-TRIGGERED REVEAL ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function initRevealAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const ups = document.querySelectorAll(".reveal-up");
  const cards = document.querySelectorAll(".reveal-card");
  const rows = document.querySelectorAll(".reveal-row");
  const splitWords = document.querySelectorAll(".split-title .word");

  if (ups.length) gsap.set(ups, { y: 30, opacity: 0 });
  if (cards.length) gsap.set(cards, { y: 36, opacity: 0, scale: 0.985 });
  if (rows.length) gsap.set(rows, { y: 18, opacity: 0 });
  if (splitWords.length) gsap.set(splitWords, { y: 40, opacity: 0 });

  // Animate split-title words
  document.querySelectorAll(".split-title").forEach(title => {
    gsap.to(title.querySelectorAll(".word"), {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.06,
      ease: "power3.out",
      scrollTrigger: {
        trigger: title,
        start: "top 88%",
        once: true
      }
    });
  });

  // Animate individual reveal-up elements
  ups.forEach(el => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true
      }
    });
  });

  // Animate grids of reveal-cards
  document.querySelectorAll(".categories-grid, .graphic-grid").forEach(grid => {
    const children = grid.querySelectorAll(".reveal-card");
    if (!children.length) return;

    gsap.to(children, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.85,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: grid,
        start: "top 88%",
        once: true
      }
    });
  });

  // Animate visible portfolio rows
  document.querySelectorAll(".portfolio-list").forEach(list => {
    const visibleRows = list.querySelectorAll(".portfolio-row:not(.extra-item)");
    if (!visibleRows.length) return;

    gsap.to(visibleRows, {
      y: 0,
      opacity: 1,
      duration: 0.65,
      stagger: 0.045,
      ease: "power2.out",
      scrollTrigger: {
        trigger: list,
        start: "top 90%",
        once: true
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. PORTFOLIO ROW HOVER EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

function initProjectRowHover() {
  if (typeof gsap === "undefined") return;

  document.querySelectorAll(".portfolio-row").forEach(row => {
    const glow = row.querySelector(".portfolio-row__glow");
    const line = row.querySelector(".portfolio-row__line");
    const title = row.querySelector(".portfolio-row__title");
    const hint = row.querySelector(".portfolio-row__hint");
    const year = row.querySelector(".portfolio-row__year");

    row.addEventListener("mouseenter", () => {
      gsap.to(row, { y: -4, duration: 0.35, ease: "power2.out" });
      if (glow) gsap.to(glow, { opacity: 1, right: "8%", duration: 0.45, ease: "power3.out" });
      if (line) gsap.to(line, { scaleX: 1, transformOrigin: "right", duration: 0.4, ease: "power2.out" });
      if (title) gsap.to(title, { x: -8, duration: 0.35, ease: "power2.out" });
      if (hint) gsap.to(hint, { x: -8, color: "#4ECDC4", duration: 0.35, ease: "power2.out" });
      if (year) gsap.to(year, { x: -4, duration: 0.3, ease: "power2.out" });
    });

    row.addEventListener("mouseleave", () => {
      gsap.to(row, { y: 0, duration: 0.35, ease: "power2.out" });
      if (glow) gsap.to(glow, { opacity: 0, right: "-140px", duration: 0.4, ease: "power2.out" });
      if (line) gsap.to(line, { scaleX: 0, transformOrigin: "left", duration: 0.35, ease: "power2.out" });
      if (title) gsap.to(title, { x: 0, duration: 0.3, ease: "power2.out" });
      if (hint) gsap.to(hint, { x: 0, color: "rgba(255,255,255,0.42)", duration: 0.3, ease: "power2.out" });
      if (year) gsap.to(year, { x: 0, duration: 0.28, ease: "power2.out" });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. GRAPHIC CARD HOVER SHINE EFFECT
// ═══════════════════════════════════════════════════════════════════════════════

function initGraphicHover() {
  if (typeof gsap === "undefined") return;

  document.querySelectorAll(".graphic-card").forEach(card => {
    const shine = card.querySelector(".graphic-card__shine");
    if (!shine) return;

    card.addEventListener("mouseenter", () => {
      gsap.fromTo(
        shine,
        { right: "-60%" },
        { right: "130%", duration: 1, ease: "power2.inOut" }
      );
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. EXPANDABLE LISTS (SHOW MORE FUNCTIONALITY)
// ═══════════════════════════════════════════════════════════════════════════════

function initExpandableLists() {
  document.querySelectorAll("[data-toggle-list]").forEach(button => {
    const list = button.closest(".portfolio-list-section")?.querySelector("[data-expandable-list]");
    if (!list) return;

    const extraItems = Array.from(list.querySelectorAll(".extra-item"));
    const label = button.querySelector("span");

    if (!extraItems.length) {
      button.style.display = "none";
      return;
    }

    let visibleCount = 0;
    const batchSize = 5;

    button.addEventListener("click", () => {
      const remaining = extraItems.length - visibleCount;
      if (remaining <= 0) return;

      const itemsToShow = Math.min(batchSize, remaining);
      const batchItems = extraItems.slice(visibleCount, visibleCount + itemsToShow);
      const btnRect = button.getBoundingClientRect();
      const initialTop = btnRect.top + window.pageYOffset;

      batchItems.forEach(item => item.classList.add("is-visible"));
      visibleCount += itemsToShow;

      requestAnimationFrame(() => {
        const newTop = button.getBoundingClientRect().top + window.pageYOffset;
        const deltaY = initialTop - newTop;

        if (Math.abs(deltaY) > 0.5 && typeof gsap !== "undefined") {
          gsap.set(button, { y: -deltaY });
          gsap.to(button, { y: 0, duration: 0.55, ease: "power3.out" });
        }

        if (typeof gsap !== "undefined") {
          batchItems.forEach((item, i) => {
            gsap.set(item, { opacity: 0, y: 30, scale: 0.96, filter: "blur(4px)" });
            gsap.to(item, {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.65,
              delay: i * 0.06,
              ease: "power3.out",
              onComplete: () => {
                if (i === batchItems.length - 1 && typeof ScrollTrigger !== "undefined") {
                  ScrollTrigger.refresh();
                }
              }
            });
          });
        }

        if (label) {
          const left = extraItems.length - visibleCount;
          label.textContent = left > 0 ? `نمایش بیشتر (${left} باقی‌مانده)` : "";

          if (left === 0 && typeof gsap !== "undefined") {
            gsap.to(button, {
              opacity: 0,
              duration: 0.3,
              onComplete: () => button.style.display = "none"
            });
          } else if (left === 0) {
            button.style.display = "none";
          }
        }
      });

      if (typeof ScrollTrigger !== "undefined") {
        setTimeout(() => ScrollTrigger.refresh(), 400);
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. MAGNETIC BUTTONS
// ═══════════════════════════════════════════════════════════════════════════════

function initMagneticButtons() {
  if (typeof gsap === "undefined") return;

  document.querySelectorAll(".cta-btn").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.08,
        y: y * 0.12,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.45,
        ease: "power3.out"
      });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. GLOW PULSE ANIMATION
// ═══════════════════════════════════════════════════════════════════════════════

function initGlowPulse() {
  if (typeof gsap === "undefined") return;

  const glow = document.querySelector(".cta-glow");
  if (!glow) return;

  gsap.to(glow, {
    x: 28,
    y: 18,
    opacity: 0.8,
    duration: 2.2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut"
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION ON DOM READY
// ═══════════════════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  splitTextTitles();
  initRevealAnimations();
  initProjectRowHover();
  initGraphicHover();
  initExpandableLists();
  initMagneticButtons();
  initGlowPulse();
});
