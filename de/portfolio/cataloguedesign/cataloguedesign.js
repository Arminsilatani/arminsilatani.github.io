/* :::::::::::::::::::::::::: PROCESS GRID INTERACTION :::::::::::::::::::::::::: */
(function () {
  const grid = document.getElementById("processGrid");

  if (!grid) {
    return;
  }

  const boxes = grid.querySelectorAll(".process-box");

  boxes.forEach((box) => {
    box.addEventListener("mouseenter", function () {
      if (this.classList.contains("is-open")) {
        return;
      }

      boxes.forEach((b) => b.classList.remove("is-open"));

      this.classList.add("is-open");
    });
  });
})();

/* :::::::::::::::::::::::::: CATALOGUE MEDIA SCROLL INTERACTION :::::::::::::::::::::::::: */
document.addEventListener("DOMContentLoaded", () => {
  const mediaContainers = document.querySelectorAll(".catalogue-media");

  mediaContainers.forEach((container) => {
    // Prevent the images themselves from being dragged.
    container.querySelectorAll("img").forEach((img) => {
      img.draggable = false;
    });

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let smoothScrollListener = null;

    /* :::::::::::::::::::::::::: UPDATE SCROLL STATE :::::::::::::::::::::::::: */
    const updateScrollState = () => {
      const scrollDiff = container.scrollWidth - container.clientWidth;
      const canScroll = scrollDiff > 10;

      const atStart = container.scrollLeft <= 0;
      const atEnd =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 1;

      let state;

      if (!canScroll) {
        state = "no-scroll";
      } else if (atStart) {
        state = "start";
      } else if (atEnd) {
        state = "end";
      } else {
        state = "middle";
      }

      container.setAttribute("data-scroll-state", state);
    };

    /* :::::::::::::::::::::::::: SMOOTH SCROLL :::::::::::::::::::::::::: */
    const smoothScrollTo = (targetLeft) => {
      // Clear any previous completion listener.
      if (smoothScrollListener) {
        container.removeEventListener("scrollend", smoothScrollListener);
      }

      // Disable scroll-snap for the precise animation.
      container.style.scrollSnapType = "none";

      container.scrollTo({
        left: targetLeft,
        behavior: "smooth",
      });

      // Restore scroll-snap after the smooth scroll finishes.
      smoothScrollListener = () => {
        container.style.scrollSnapType = "x mandatory";
        smoothScrollListener = null;
        updateScrollState();
      };

      if ("onscrollend" in container) {
        container.addEventListener("scrollend", smoothScrollListener, {
          once: true,
        });
      } else {
        // Fallback: restore scroll-snap after 500 ms.
        setTimeout(() => {
          if (smoothScrollListener) {
            container.style.scrollSnapType = "x mandatory";
            smoothScrollListener = null;
            updateScrollState();
          }
        }, 500);
      }
    };

    /* :::::::::::::::::::::::::: BRING IMAGE INTO VIEW :::::::::::::::::::::::::: */
    const bringImageIntoView = (img) => {
      // Do not interfere while the user is dragging.
      if (isDown) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft);
      const paddingRight = parseFloat(getComputedStyle(container).paddingRight);

      const visibleLeft = containerRect.left + paddingLeft;
      const visibleRight = containerRect.right - paddingRight;

      let targetScrollLeft = container.scrollLeft;

      // If the image overflows the visible area on the right.
      if (imgRect.right > visibleRight) {
        targetScrollLeft += imgRect.right - visibleRight;
      }

      // If the image overflows the visible area on the left.
      if (imgRect.left < visibleLeft) {
        targetScrollLeft -= visibleLeft - imgRect.left;
      }

      if (Math.abs(targetScrollLeft - container.scrollLeft) > 1) {
        smoothScrollTo(targetScrollLeft);
      }
    };

    /* :::::::::::::::::::::::::: IMAGE HOVER :::::::::::::::::::::::::: */
    container.querySelectorAll("img").forEach((img) => {
      img.addEventListener("mouseenter", () => bringImageIntoView(img));
    });

    /* :::::::::::::::::::::::::: POINTER DRAG :::::::::::::::::::::::::: */
    container.addEventListener("pointerdown", (e) => {
      isDown = true;
      startX = e.clientX;
      startScrollLeft = container.scrollLeft;
      container.style.cursor = "grabbing";
      container.style.scrollSnapType = "none";
      container.setPointerCapture(e.pointerId);
    });

    container.addEventListener("pointermove", (e) => {
      if (!isDown) {
        return;
      }

      e.preventDefault();

      const dx = e.clientX - startX;

      container.scrollLeft = startScrollLeft - dx;
    });

    const endDrag = () => {
      if (!isDown) {
        return;
      }

      isDown = false;
      container.style.cursor = "grab";
      container.style.scrollSnapType = "x mandatory";
      updateScrollState();
    };

    container.addEventListener("pointerup", endDrag);
    container.addEventListener("pointercancel", endDrag);

    /* :::::::::::::::::::::::::: SCROLL AND RESIZE STATE :::::::::::::::::::::::::: */
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    updateScrollState();
  });
});
