document.documentElement.classList.add("js");

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -----------------------------------
   Split Titles - FA friendly
----------------------------------- */
function splitTextTitles() {
  const titles = document.querySelectorAll(".split-title");

  titles.forEach((title) => {
    if (title.dataset.splitted === "true") return;

    const text = title.textContent.replace(/\s+/g, " ").trim();
    const words = text.split(" ");

    title.innerHTML = words
      .map((word, index) => {
        const space =
          index === words.length - 1
            ? ""
            : `<span class="space" aria-hidden="true"></span>`;
        return `<span class="word">${word}</span>${space}`;
      })
      .join("");

    title.dataset.splitted = "true";
  });
}

/* -----------------------------------
   Reveal Animations
----------------------------------- */
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

  document.querySelectorAll(".split-title").forEach((title) => {
    const words = title.querySelectorAll(".word");

    gsap.to(words, {
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

  ups.forEach((el) => {
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

  document.querySelectorAll(".categories-grid, .graphic-grid").forEach((grid) => {
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

  document.querySelectorAll(".portfolio-list").forEach((list) => {
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

/* -----------------------------------
   Premium Project Row Hover
----------------------------------- */
function initProjectRowHover() {
  if (typeof gsap === "undefined") return;

  document.querySelectorAll(".portfolio-row").forEach((row) => {
    const glow = row.querySelector(".portfolio-row__glow");
    const line = row.querySelector(".portfolio-row__line");
    const title = row.querySelector(".portfolio-row__title");
    const hint = row.querySelector(".portfolio-row__hint");
    const year = row.querySelector(".portfolio-row__year");

    row.addEventListener("mouseenter", () => {
      gsap.to(row, {
        y: -4,
        duration: 0.35,
        ease: "power2.out"
      });

      if (glow) {
        gsap.to(glow, {
          opacity: 1,
          right: "8%",
          duration: 0.45,
          ease: "power3.out"
        });
      }

      if (line) {
        gsap.to(line, {
          scaleX: 1,
          transformOrigin: "right",
          duration: 0.4,
          ease: "power2.out"
        });
      }

      if (title) {
        gsap.to(title, {
          x: -8,
          duration: 0.35,
          ease: "power2.out"
        });
      }

      if (hint) {
        gsap.to(hint, {
          x: -8,
          color: "#4ECDC4",
          duration: 0.35,
          ease: "power2.out"
        });
      }

     if (year) {
  gsap.to(year, {
    x: -4,
    duration: 0.3,
    ease: "power2.out"
  });
}


    });

    row.addEventListener("mouseleave", () => {
      gsap.to(row, {
        y: 0,
        duration: 0.35,
        ease: "power2.out"
      });

      if (glow) {
        gsap.to(glow, {
          opacity: 0,
          right: "-140px",
          duration: 0.4,
          ease: "power2.out"
        });
      }

      if (line) {
        gsap.to(line, {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.35,
          ease: "power2.out"
        });
      }

      if (title) {
        gsap.to(title, {
          x: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }

      if (hint) {
        gsap.to(hint, {
          x: 0,
          color: "rgba(255,255,255,0.42)",
          duration: 0.3,
          ease: "power2.out"
        });
      }

      if (year) {
  gsap.to(year, {
    x: 0,
    duration: 0.28,
    ease: "power2.out"
  });
}


    });
  });
}

/* -----------------------------------
   Graphic Card Shine
----------------------------------- */
function initGraphicHover() {
  if (typeof gsap === "undefined") return;

  document.querySelectorAll(".graphic-card").forEach((card) => {
    const shine = card.querySelector(".graphic-card__shine");
    if (!shine) return;

    card.addEventListener("mouseenter", () => {
      gsap.fromTo(
        shine,
        { right: "-60%" },
        {
          right: "130%",
          duration: 1,
          ease: "power2.inOut"
        }
      );
    });
  });
}

/* -----------------------------------
   Expandable Lists
----------------------------------- */
function initExpandableLists() {
  const buttons = document.querySelectorAll("[data-toggle-list]");

  buttons.forEach((button) => {
    const section = button.closest(".portfolio-list-section");
    if (!section) return;

    const list = section.querySelector("[data-expandable-list]");
    if (!list) return;

    const extraItems = list.querySelectorAll(".extra-item");
    const label = button.querySelector("span");

    if (!extraItems.length) {
      button.style.display = "none";
      return;
    }

    let expanded = false;

    button.addEventListener("click", () => {
      expanded = !expanded;

      if (expanded) {
        extraItems.forEach((item, index) => {
          item.classList.add("is-visible");

          if (typeof gsap !== "undefined") {
            gsap.fromTo(
              item,
              { opacity: 0, y: 18 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.04,
                ease: "power2.out"
              }
            );
          }
        });

        if (label) label.textContent = "نمایش کمتر";
      } else {
        if (typeof gsap !== "undefined") {
          gsap.to(extraItems, {
            opacity: 0,
            y: 18,
            duration: 0.28,
            stagger: 0.03,
            ease: "power2.in",
            onComplete: () => {
              extraItems.forEach((item) => {
                item.classList.remove("is-visible");
                item.style.opacity = "";
                item.style.transform = "";
              });
            }
          });
        } else {
          extraItems.forEach((item) => item.classList.remove("is-visible"));
        }

        if (label) label.textContent = "نمایش بیشتر";
      }

      if (typeof ScrollTrigger !== "undefined") {
        setTimeout(() => ScrollTrigger.refresh(), 350);
      }
    });
  });
}

/* -----------------------------------
   Magnetic CTA Buttons
----------------------------------- */
function initMagneticButtons() {
  if (typeof gsap === "undefined") return;

  document.querySelectorAll(".cta-btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
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

/* -----------------------------------
   CTA Glow Pulse
----------------------------------- */
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

/* -----------------------------------
   Init
----------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  splitTextTitles();
  initRevealAnimations();
  initProjectRowHover();
  initGraphicHover();
  initExpandableLists();
  initMagneticButtons();
  initGlowPulse();
});
