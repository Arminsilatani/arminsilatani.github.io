/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-14
  *  Version: 1.2.2
  ****************************************************
*/

/* =========================== FOOTER COMPONENT ============================ */

class FooterComponent extends HTMLElement {
  /* ------------------------- CONSTRUCTOR ------------------------- */
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const color = this.getAttribute("color") || "#4ECDC4";
    const shadowColor = this.getAttribute("shadow-color") || "rgba(0,0,0,0.75)";

    const svg = `
      <svg viewBox="0 0 1440 160" preserveAspectRatio="none" class="divider-svg">
        <defs>
          <filter id="dividerShadowFilter">
            <feDropShadow dx="0" dy="-8" stdDeviation="12" flood-color="${shadowColor}" />
          </filter>
        </defs>
        <path
          filter="url(#dividerShadowFilter)"
          fill="${color}"
          d="M0,0 L0,70 L100,70 L200,110 L1440,110 L1440,160 L0,160 Z"
        />
      </svg>
    `;

    shadow.innerHTML = `
      <style>
        /* :::::::::::::::::::::::::: FOOTER STYLES :::::::::::::::::::::::::: */

        :host {
          display: block;
          width: 100%;
          background: #0d0d0d;
          box-sizing: border-box;
          overflow: visible;
        }

        .footer-wrapper {
          width: 100%;
          background: #0d0d0d;
          overflow: visible;
          position: relative;
        }

        .footer-divider {
          position: absolute;
          top: -160px;
          left: 0;
          width: 100%;
          height: 160px;
          z-index: 2;
          pointer-events: none;
        }

        .divider-svg {
          width: 100%;
          height: 100%;
          display: block;
          overflow-x: hidden !important;
          max-width: 100%;
        }

        .footer-extra {
          width: 100%;
          background: ${color};
          color: #0d0d0d;
          padding: 90px 0px 90px;
          display: flex;
          justify-content: center;
        }

        .footer-inner {
          width: 100%;
          max-width: 1100px;
          display: grid;
          gap: 60px;
          align-items: start;
          direction: rtl;
        }

        /* Three columns when currency is active */
        .footer-inner.three-col {
          grid-template-columns: repeat(3, 1fr);
        }

        /* Two centered columns when currency is disabled */
        .footer-inner.two-col {
          grid-template-columns: repeat(2, 1fr);
          justify-items: center;
        }

        .column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 900;
          margin-bottom: 5px;
        }

        .menu {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 30px;
          row-gap: 10px;
          flex-wrap: wrap;
        }

        .menu a {
          color: inherit;
          text-decoration: none;
          font-weight: 400;
          transition: color .25s;
        }

        .menu a:hover {
          color: #f5f5f5;
        }

        .contact {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .contact a {
          color: #0d0d0d;
          text-decoration: none;
          transition: color .25s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .contact a:hover,
        .social a:hover {
          color: #f5f5f5;
        }

        .contact .icon svg {
          width: 18px;
          height: 18px;
          fill: currentColor;
          display: block;
        }

        .social {
          display: flex;
          gap: 35px;
          margin-top: 10px;
        }

        .social a {
          color: #0d0d0d;
          transition: color .25s;
          display: inline-flex;
        }

        .social svg {
          width: 22px;
          height: 22px;
          fill: currentColor;
          display: block;
        }

        /* COPYRIGHT */
        .copyright {
          width: 100%;
          background: ${color};
          color: #0d0d0d;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 10px;
          font-size: .75rem;
          font-weight: 400;
          box-sizing: border-box;
          border-top: 1px solid rgba(0,0,0,0.06);
        }

        #currency-section {
          display: none;
        }

        /* ------------------------- MOBILE STYLES ------------------------- */
        @media (max-width: 768px) {
          .footer-divider {
            top: -100px;
            height: 100px;
          }

          .footer-inner {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 40px;
          }

          .column {
            align-items: center;
          }

          .menu {
            justify-content: center;
          }

          .copyright {
            display: block;
            text-align: center;
            width: 100%;
            padding: 10px;
            box-sizing: border-box;
          }

          .copyright p.copyright-text {
            display: block;
            margin: 0 auto;
            text-align: center;
            text-align-last: center;
            max-width: 100%;
            box-sizing: border-box;
          }

          .contact-column {
            text-align: center;
            align-items: center;
          }

          .contact-column .contact {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
          }

          .contact-column .contact a {
            display: inline-flex;
            justify-content: center;
            align-items: center;
          }

          .contact-column .social {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      </style>

      <div class="footer-wrapper">
        <div class="footer-divider">${svg}</div>


        <footer class="footer-extra">
          <div class="footer-inner" id="footer-inner">

            <div class="column" id="currency-section">
              <h2>اختيار العملة</h2>
              <div id="currency-container"></div>
            </div>

            <div class="column">
              <h2>روابط مفيدة</h2>
              <ul class="menu">
                <li><a href="/#/">تسجيل الدخول</a></li>
                <li><a href="/#/">المدونة</a></li>
                <li><a href="https://tools.arminsilatani.com/" target="_blank" rel="noopener noreferrer">الأدوات</a></li>
                <li><a href="/ar/sitemap/">خريطة الموقع</a></li>
                <li><a href="/#/">تحميل السيرة الذاتية</a></li>
              </ul>
            </div>

            <div class="column contact-column">
              <h2>اتصل بي</h2>
              <div class="contact">
                <a href="tel:+989125759466">
                  <span class="icon">
                    <!-- Phone -->
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6.6 10.8c1.6 3.2 4.3 5.9 7.5 7.5l2.5-2.5c.3-.3.7-.4 1.1-.3 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1v3.6c0 .6-.4 1-1 1C10.5 22.7 1.3 13.5 1.3 2.9c0-.6.4-1 1-1H6c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1.1Z"/>
                    </svg>
                  </span>
                  09125759466
                </a>

                <a href="mailto:contact@arminsilatani.com">
                  <span class="icon">
                    <!-- Mail -->
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm9 7L3.8 7.5A1 1 0 0 0 3 8.4V17h18V8.4a1 1 0 0 0-.8-.9Z"/>
                    </svg>
                  </span>
                  contact[at]arminsilatani.com
                </a>
              </div>

              <div class="social">
                <a href="https://www.linkedin.com/in/arminsilatani/" target="_blank" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3zM10 9h3.8v1.7h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6V21h-4v-5c0-1.2 0-2.8-1.7-2.8-1.7 0-2 1.3-2 2.7V21h-4z"/>
                  </svg>
                </a>

                <a href="https://github.com/Arminsilatani" target="_blank" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-3.16 19.48c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.36-1.34-3.36-1.34-.45-1.13-1.1-1.43-1.1-1.43-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.84.09-.66.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.9-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.68 0 3.85-2.35 4.7-4.58 4.95.36.31.68.92.68 1.85v2.74c0 .26.18.57.69.48A10 10 0 0 0 12 2z"/>
                  </svg>
                </a>

                <a href="https://www.instagram.com/arminsilatani" target="_blank" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.25-1.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z"/>
                  </svg>
                </a>

                <a href="https://wa.me/989125759466" target="_blank" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.52 3.48A11.82 11.82 0 0 0 12.07.2C5.5.2.2 5.5.2 12.06a11.8 11.8 0 0 0 1.73 6.14L0 24l5.98-1.88a11.86 11.86 0 0 0 6.1 1.57h.01c6.56 0 11.86-5.3 11.86-11.86 0-3.17-1.23-6.16-3.43-8.35ZM12.09 21.3h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.55 1.12 1.15-3.46-.24-.35a9.83 9.83 0 1 1 8.03 4.27Zm5.68-7.37c-.31-.16-1.86-.92-2.15-1.02-.29-.1-.5-.16-.71.16-.21.31-.82 1.02-1 1.23-.18.21-.36.24-.67.08-.31-.16-1.32-.49-2.51-1.56-.93-.83-1.56-1.86-1.74-2.17-.18-.31-.02-.48.14-.64.14-.14.31-.36.46-.54.15-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.7-.98-2.33-.26-.62-.53-.53-.71-.54h-.61c-.21 0-.55.08-.83.39-.29.31-1.1 1.08-1.1 2.64 0 1.56 1.13 3.07 1.29 3.28.16.21 2.23 3.41 5.4 4.78.75.32 1.33.52 1.79.66.75.24 1.43.2 1.97.12.6-.09 1.86-.76 2.12-1.5.26-.75.26-1.39.18-1.5-.08-.11-.29-.18-.6-.34Z"/>
                  </svg>
                </a>

                <a href="https://t.me/ArminSilatani" target="_blank" aria-label="Telegram">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9.04 15.64 8.9 19.5c.62 0 .9-.27 1.25-.6l3-2.8 6.2 4.55c1.14.63 1.96.3 2.25-1.05L24 4.3c.38-1.7-.62-2.37-1.72-1.96L2 10.4c-1.63.63-1.6 1.52-.3 1.92l5.2 1.62L20.1 6.6c.6-.4 1.14-.18.7.22Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>

        <div class="copyright">
          <p class="copyright-text">تمام حقوق محفوظ است.. ولی حال پیگیری ندارم، لطفاً خودتون رعایت کنید.</p>
        </div>
      </div>
    `;
  }

  /* ------------------------- CONNECTED CALLBACK ------------------------- */
  connectedCallback() {
    const inner = this.shadowRoot.querySelector("#footer-inner");

    if (this.hasAttribute("currency")) {
      const section = this.shadowRoot.querySelector("#currency-section");
      const container = this.shadowRoot.querySelector("#currency-container");
      section.style.display = "flex";
      inner.classList.add("three-col");

      const selector = document.createElement("currency-selector");
      container.appendChild(selector);
    } else {
      inner.classList.add("two-col");
    }
  }
}

customElements.define("footer-component", FooterComponent);
