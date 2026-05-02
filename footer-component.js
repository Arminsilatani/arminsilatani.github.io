/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-02
  *  Version: 1.1.0
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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

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
          color: inherit;
          text-decoration: none;
          transition: color .25s;
        }

        .contact i {
          margin-left: 8px;
          width: 20px;
        }

        .social {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }

        .social a {
          font-size: 1.5rem;
          color: inherit;
          transition: color .25s;
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
          padding: 20px 10px;
          font-size: .75rem;
          font-weight: 400;
          box-sizing: border-box;
          border-top: 1px solid rgba(0,0,0,0.06);
        }

        /* MOBILE */
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

          /* Contact column */
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

          .contact-column .contact i {
            margin-left: -15px;
            margin-right: 0;
          }

          /* Social icons */
          .contact-column .social {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        #currency-section {
          display: none;
        }
      </style>

      <div class="footer-wrapper">

        <div class="footer-divider">${svg}</div>

        <footer class="footer-extra">
          <div class="footer-inner" id="footer-inner">

            <div class="column" id="currency-section">
              <h2>انتخاب ارز</h2>
              <div id="currency-container"></div>
            </div>

            <div class="column">
              <h2>لینک‌های مفید</h2>
              <ul class="menu">
                <li><a href="/#/">ورود</a></li>
                <li><a href="/#/">وبلاگ</a></li>
                <li><a href="/#/">ابزارها</a></li>
                <li><a href="/sitemap/">نقشه سایت</a></li>
                <li><a href="/#/">دانلود رزومه</a></li>
              </ul>
            </div>

            <div class="column contact-column">
              <h2>ارتباط با من</h2>
              <div class="contact">
                <a href="tel:+989125759466"><i class="fa-solid fa-phone"></i>09125759466</a>
                <a href="mailto:contact@arminsilatani.com"><i class="fa-solid fa-envelope"></i>contact[at]arminsilatani.com</a>
              </div>
              <div class="social">
                <a href="https://www.linkedin.com/in/arminsilatani/" target="_blank"><i class="fa-brands fa-linkedin"></i></a>
                <a href="https://github.com/Arminsilatani" target="_blank"><i class="fa-brands fa-github"></i></a>
                <a href="https://www.instagram.com/arminsilatani" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://t.me/ArminSilatani" target="_blank"><i class="fa-brands fa-telegram"></i></a>
              </div>
            </div>

          </div>
        </footer>

        <div class="copyright">
          تمام حقوق محفوظ است.. ولی حال پیگیری ندارم، لطفاً خودتون رعایت کنید.
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