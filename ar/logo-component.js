/*
  Author: Armin Silatani
  Date: 2026-03-29
  Version: 1.0.0
*/

/* ========================================================================================================
   LOGO COMPONENT - Custom Web Component for Animated Partner Logos
   ======================================================================================================== */

class LogoComponent extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    /* Configuration */
    this.logosPerRow = 11;
    this.totalRows = 6;
    this.centerImg = "../images/logo-component/LogoComponentSloganAR.webp";

    /* Logo List */
    this.logoList = [
      "../images/logo-component/AlvandtasisatLogoOld.webp",
      "../images/logo-component/HevaapsLogoOld.webp",
      "../images/logo-component/AlzahravfxLogoOld.webp",
      "../images/logo-component/ApakalaLogo.webp",
      "../images/logo-component/ApasazehLogoOld.webp",
      "../images/logo-component/AplusLogo.webp",
      "../images/logo-component/ArmaghanLogo.webp",
      "../images/logo-component/AvrinLogoOld.webp",
      "../images/logo-component/AyeghbamaLogoOld.webp",
      "../images/logo-component/BitatebLogo.webp",
      "../images/logo-component/CadinuLogoOld.webp",
      "../images/logo-component/DiacoLogoOld.webp",
      "../images/logo-component/DorfaksazehLogo.webp",
      "../images/logo-component/FaratoseeLogo.webp",
      "../images/logo-component/FarhangLogo.webp",
      "../images/logo-component/HampadigitalLogoOld.webp",
      "../images/logo-component/IlsglobalLogoOld.webp",
      "../images/logo-component/KashanestoreLogoOld.webp",
      "../images/logo-component/KralhomeLogoOld.webp",
      "../images/logo-component/LinexLogoOld.webp",
      "../images/logo-component/MegalightLogoOld.webp",
      "../images/logo-component/MehmandarLogoOld.webp",
      "../images/logo-component/MehrnooshLogoOld.webp",
      "../images/logo-component/NabiranLogoOld.webp",
      "../images/logo-component/NiavaranLogo.webp",
      "../images/logo-component/NickdigiLogo.webp",
      "../images/logo-component/PardeoxinLogoOld.webp",
      "../images/logo-component/PartbanLogo.webp",
      "../images/logo-component/PayamavaLogoOld.webp",
      "../images/logo-component/PayetakhtetalaLogo.webp",
      "../images/logo-component/PermonmedLogoOld.webp",
      "../images/logo-component/PtahvieLogo.webp",
      "../images/logo-component/RabiLogoOld.webp",
      "../images/logo-component/RossoLogoOld.webp",
      "../images/logo-component/ShahabmarcoLogo.webp",
      "../images/logo-component/ShahrekhabLogoOld.webp",
      "../images/logo-component/ShahresabtLogo.webp",
      "../images/logo-component/SholepishgamLogoOld.webp",
      "../images/logo-component/SpantawebLogo.webp",
      "../images/logo-component/TarhfaLogo.webp",
      "../images/logo-component/TimartebLogo.webp",
      "../images/logo-component/UromkaracaLogoOld.webp",
      "../images/logo-component/VegimeatLogo.webp",
      "../images/logo-component/ZrmrLogoOld.webp",
      "../images/logo-component/IranpapernetLogo.webp",
      "../images/logo-component/KaniraLogo.webp"
    ];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
      :host {
        display: block;
        font-family: sans-serif;
      }

      .partners-section {
        width: 100%;
        padding: 60px 0;
        position: relative;
        overflow: hidden;
        direction: ltr;
      }

      .marquee-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        position: relative;
        z-index: 0;
      }

      .marquee-row {
        display: flex;
        white-space: nowrap;
        width: 100%;
      }

      .marquee {
        display: flex;
        gap: 35px;
        padding: 4px 0;
        animation-duration: 15s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        will-change: transform;
      }

      .marquee-right {
        animation-name: scrollRight;
      }

      .marquee-left {
        animation-name: scrollLeft;
      }

      .marquee-item {
        flex: 0 0 auto;
        width: 120px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 35px;
        flex-shrink: 0;
        opacity: 0.6;
        transition: opacity 0.3s;
      }

      .marquee-item:nth-child(11n) {
        margin-right: 0;
      }

      .marquee-item img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
        opacity: 0.6;
        filter: blur(18px);
        transform: scale(1.05);
        transition: filter 0.6s ease, transform 0.6s ease, opacity 0.3s;
      }

      .marquee-item img.blurup-loaded {
        filter: blur(0);
        transform: scale(1);
      }

      .marquee-item img:hover {
        opacity: 1;
      }

      .center-image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        width: 50%;
        max-width: 90vw;
        max-height: 36vw;
        overflow: hidden;
        pointer-events: none;
      }

      .center-image img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: blur(18px) drop-shadow(0 3px 4px rgba(0,0,0,0.4));
        transform: scale(1.05);
        transition: filter 0.6s ease, transform 0.6s ease;
      }

      .center-image img.blurup-loaded {
        filter: drop-shadow(0 3px 4px rgba(0,0,0,0.4));
        transform: scale(1);
      }

      @keyframes scrollRight {
        0% { transform: translateX(-50%); }
        100% { transform: translateX(0); }
      }

      @keyframes scrollLeft {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      @media (max-width: 1100px) {
        .partners-section {
          padding: 30px 0;
        }

        .center-image {
          width: 95vw;
          height: calc(95vw * 0.4);
        }

        .marquee-item {
          width: 120px;
          height: 70px;
          margin-right: 25px;
        }

        .marquee-item:nth-child(11n) {
          margin-right: 0;
        }
      }
      </style>

      <section class="partners-section">
        <div class="marquee-container" id="marqueeContainer"></div>
        <div class="center-image">
          <img
            src="${this.centerImg}"
            alt="Those who chose me"
            data-blurup="true"
            loading="eager"
            fetchpriority="high"
          >
        </div>
      </section>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const container = this.shadowRoot.getElementById('marqueeContainer');

    for (let i = 0; i < this.totalRows; i++) {
      const rowLogos = this.shuffleArray([...this.logoList]).slice(0, this.logosPerRow);
      const direction = i % 2 === 0 ? 'right' : 'left';
      const row = this.createMarqueeRow(rowLogos, direction);
      container.appendChild(row);
    }

    this.initBlurEngine();
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  createMarqueeRow(logos, direction) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'marquee-row';

    const marqueeDiv = document.createElement('div');
    marqueeDiv.className = `marquee marquee-${direction}`;

    const repeatedLogos = [...logos, ...logos];

    repeatedLogos.forEach(src => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'marquee-item';

      const img = document.createElement('img');
      img.src = src;
      img.alt = `Logo of ${src.split('/').pop().replace('.webp', '')}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.setAttribute('data-blurup', 'true');

      itemDiv.appendChild(img);
      marqueeDiv.appendChild(itemDiv);
    });

    rowDiv.appendChild(marqueeDiv);
    return rowDiv;
  }

  initBlurEngine() {
    const images = this.shadowRoot.querySelectorAll('img[data-blurup]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const img = entry.target;

        if (img.complete) {
          img.classList.add('blurup-loaded');
        } else {
          img.addEventListener('load', () => {
            img.classList.add('blurup-loaded');
          }, { once: true });
        }

        observer.unobserve(img);
      });
    }, {
      rootMargin: '200px',
      threshold: 0.01
    });

    images.forEach(img => observer.observe(img));
  }
}

if (!customElements.get('logo-component')) {
  customElements.define('logo-component', LogoComponent);
}
