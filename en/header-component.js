/*
Author: Armin Silatani
Date: 2026-03-29
Version: 1.0.0
*/

class HeaderComponent extends HTMLElement {constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    /* ::::::::::::::::::::::::::::::::::::::::: STYLES ::::::::::::::::::::::::::::::::::::::::: */
    const style = document.createElement("style");
    style.textContent = `.container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        z-index: 4;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        margin: 0 auto;
        max-width: 1300px;
        direction: ltr;
        box-sizing: border-box;
      }

      /* ::::::::::::::::::::::::::::::::::::::: TOGGLE TRACK ::::::::::::::::::::::::::::::::::::::: */

      .toggle-track {
        position: absolute;
        top: 50%;
        left: 20px;
        width: 80px;
        height: 40px;
        transform: translateY(-50%);
        border-radius: 50px;
        background: rgba(78, 205, 196, .6);
        overflow: hidden;
        z-index: 3;
        direction: ltr;
        transition: background .4s ease;
      }

      .toggle-track.active {
        background: rgba(255, 107, 107, .3);
      }

      /* ::::::::::::::::::::::::::::::::::::::: TOGGLE BUTTON ::::::::::::::::::::::::::::::::::::::: */

      .button {
        position: absolute;
        top: 50%;
        left: 0;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        background: #4ECDC4;
        transform: translate(0, -50%);
        transition: .4s;
        z-index: 4;
        box-shadow: 0 0 12px rgba(78, 205, 196, .6);
      }

      .button:hover {
        box-shadow: 0 0 20px rgba(78, 205, 196, .8),
        0 0 30px rgba(78, 205, 196, .8);
      }

      .button.active {
        background: #ff6b6b;
        box-shadow: 0 0 12px rgba(255, 107, 107, .8);
        transform: translate(40px, -50%);
      }

      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        color: #f5f5f5;
        pointer-events: none;
        transition: .4s;
      }

      .icon.rotated {
        transform: translate(-50%, -50%) rotate(180deg);
      }

      /* ::::::::::::::::::::::::::::::::::::::: OVERLAYS ::::::::::::::::::::::::::::::::::::::: */

      .overlay,
      .overlay-dark {
        position: fixed;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100vh;
        z-index: 3;
        transition: left .4s cubic-bezier(.19, .22, .59, .9);
      }

      .overlay {
        background: #4ECDC4;
      }
      .overlay.active {
        left: 0;
        transition: left .3s cubic-bezier(.19, .22, .59, .9);
      }

      .overlay-dark {
        background: #0d0d0d;
        width: 99%;
      }

      .overlay-dark.active {
        left: 0;
        transition: left .3s cubic-bezier(.19, .22, .59, .9);
      }

      /* ::::::::::::::::::::::::::::::::::::::: MENU WRAPPER ::::::::::::::::::::::::::::::::::::::: */

      .menu-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        gap: 40px;
        direction: ltr;
      }

      .line-box {
        position: relative;
        width: 40px;
        height: 384px;
      }

      svg {
        position: absolute;
        top: 0;
        left: 0;
        overflow: visible;
      }

      .elastic {
        fill: none;
        stroke-width: 2.2;
        filter: drop-shadow(0 0 14px rgba(255, 255, 255, 1));
      }

      /* ::::::::::::::::::::::::::::::::::::::: SIDEBAR ::::::::::::::::::::::::::::::::::::::: */

      .sidebar {
        display: flex;
        flex-direction: column;
        gap: 22px;
        direction: ltr;
        text-align: left;
        align-items: flex-start;
      }

      .sidebar a {
        font-family: var(--main-font, sans-serif);
        font-weight: 900; font-size: 1.4rem;
        color: #f5f5f5;
        text-decoration: none;
        padding: 12px 0;
        margin: -12px 0;
        backface-visibility: hidden;
        transform-style: preserve-3d;
        transform: translateZ(0);
        transform-origin: left center;
        transition: opacity .25s;
      }
        .sidebar a.active {
  color: #4ECDC4 !important;
  opacity: 1;
}


      /* ::::::::::::::::::::::::::::::::::::::: MOBILE ::::::::::::::::::::::::::::::::::::::: */

      @media (max-width: 768px) {
        .menu-wrapper {
          gap: 28px;
          left: 43%;
          top: 45%;
          transform: translate(-50%, -50%);
        }

        .sidebar {
          min-width: 220px;
          text-align: left;
        }

        .sidebar a {
          white-space: nowrap;
          font-size: 1.3rem;
        }
      }
    `;

    /* ::::::::::::::::::::::::::::::::::::::::: DOM STRUCTURE ::::::::::::::::::::::::::::::::::::::::: */
    const container = document.createElement("div");
    container.className = "container";

    const toggleTrack = document.createElement("div");
    toggleTrack.className = "toggle-track";

    const button = document.createElement("button");
    button.className = "button";

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = ">";

    button.appendChild(icon);
    toggleTrack.appendChild(button);
    container.appendChild(toggleTrack);

    const overlay = document.createElement("div");
    overlay.className = "overlay";

    const overlayDark = document.createElement("div");
    overlayDark.className = "overlay-dark";

    const wrapper = document.createElement("div");
    wrapper.className = "menu-wrapper";

    const lineBox = document.createElement("div");
    lineBox.className = "line-box";
    lineBox.innerHTML = `
      <svg width="40" height="384" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0)" />
            <stop offset="50%" stop-color="rgba(255,255,255,1)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <path class="elastic" stroke="url(#lineGradient)" d="M 20 0 Q 20 192 20 384"></path>
      </svg>
    `;

    const path = lineBox.querySelector(".elastic");

    const menu = document.createElement("nav");
    menu.className = "sidebar";
    menu.innerHTML = `
      <a href="/en/">Home</a>
      <a href="/en/#">Services/</a>
      <a href="/en/about/">About Me</a>
      <a href="/en/#/">Contact Me/</a>
      <a href="/en/#/">Pricing/</a>
      <a href="/en/#/">Portfolio/</a>
    `;

    wrapper.appendChild(lineBox);
    wrapper.appendChild(menu);
    overlayDark.appendChild(wrapper);

    /* ::::::::::::::::::::::::::::::::::::::::: TOGGLE LOGIC ::::::::::::::::::::::::::::::::::::::::: */
    let animating = false;

    button.addEventListener("click", () => {
      const isActive = button.classList.contains("active");

      icon.classList.toggle("rotated");
      document.body.style.overflow = isActive ? "" : "hidden";

      if (isActive) {
        animating = false;
        overlayDark.classList.remove("active");
        setTimeout(() => overlay.classList.remove("active"), 200);
      } else {
        overlay.classList.add("active");
        setTimeout(() => overlayDark.classList.add("active"), 200);
        animating = true;
        requestAnimationFrame(animate);
      }

      button.classList.toggle("active");
      toggleTrack.classList.toggle("active");
    });

    /* ::::::::::::::::::::::::::::::::::::::::: ANIMATION ENGINE ::::::::::::::::::::::::::::::::::::::::: */
    const links = [...menu.querySelectorAll("a")];
    const currentUrl = window.location.pathname;

links.forEach(link => {
  const linkPath = new URL(link.href).pathname;

  if (linkPath === currentUrl) {
    link.classList.add("active");
  }
});

    let targets = new Array(links.length).fill(0);
    let currents = new Array(links.length).fill(0);
    let targetY = 192;
    let currentY = 192;

    const lerp = (a, b, t) => a + (b - a) * t;

    function animate() {
      if (!animating) return;

      currents = currents.map((v, i) => lerp(v, targets[i], 0.15));

      links.forEach((link, i) => {
        const scale = 1 + currents[i] * 0.55;
        const translateX = currents[i] * 18;
        link.style.transform = `translateZ(0) scale(${scale}) translateX(${translateX}px)`;
      });

      currentY = lerp(currentY, targetY, 0.12);
      const x = 20;
      path.setAttribute("d", `M ${x} 0 Q ${x + 18} ${currentY} ${x} 384`);

      requestAnimationFrame(animate);
    }

    /* ::::::::::::::::::::::::::::::::::::::::: HOVER INTERACTIONS ::::::::::::::::::::::::::::::::::::::::: */
    links.forEach((link, i) => {
      link.addEventListener("mouseenter", () => {
        targets.fill(0);
        targets[i] = 1;

        if (targets[i - 1] !== undefined) targets[i - 1] = 0.45;
        if (targets[i + 1] !== undefined) targets[i + 1] = 0.45;

        const rect = link.getBoundingClientRect();
        const parentRect = menu.getBoundingClientRect();
        targetY = rect.top - parentRect.top + rect.height / 2;
      });
    });

    menu.addEventListener("mouseleave", () => {
      targets.fill(0);
      targetY = 192;
    });

    /* ::::::::::::::::::::::::::::::::::::::::: MOUNT TO SHADOW DOM ::::::::::::::::::::::::::::::::::::::::: */
    shadow.append(style, container, overlay, overlayDark);
  }
}

customElements.define("header-component", HeaderComponent);
