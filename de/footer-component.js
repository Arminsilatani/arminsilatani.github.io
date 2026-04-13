/*
  Author: Armin Silatani
  Date: 2026-03-29
  Version: 1.0.0
*/

class FooterComponent extends HTMLElement {

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
      <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        media="print"
        onload="this.media='all'">

      <style>
        :host {
          display: block;
          width: 100%;
          margin-top: -115px;
          background: #0d0d0d;
          box-sizing: border-box;
        }

        /* ::::::::::::::::::::::::::::::::::::::: DIVIDER ::::::::::::::::::::::::::::::::::::::: */

        .footer-divider {
          position: relative;
          width: 100%;
          height: 160px;
          z-index: 2;
        }

        .divider-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* ::::::::::::::::::::::::::::::::::::::: FOOTER BODY ::::::::::::::::::::::::::::::::::::::: */

        .footer-extra {
          width: 100%;
          background: ${color};
          color: #0d0d0d;
          padding: 50px 20px 90px;
          display: flex;
          justify-content: center;
          box-sizing: border-box;
        }

        .footer-inner {
          width: 100%;
          max-width: 950px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 160px;
          flex-wrap: wrap;
        }

        .column {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        h2 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 900;
        }

        /* ::::::::::::::::::::::::::::::::::::::: MENU ::::::::::::::::::::::::::::::::::::::: */

        .menu {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 22px;
        }

        .menu a {
          color: inherit;
          text-decoration: none;
          transition: color .25s;
        }

        .menu a:hover {
          color: #f5f5f5;
        }

        .menu a.active {
          color: #f5f5f5;
          font-weight: 700;
        }

        /* ::::::::::::::::::::::::::::::::::::::: CONTACT ::::::::::::::::::::::::::::::::::::::: */

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

        .contact a:hover {
          color: #f5f5f5;
        }

        .contact i {
          margin-right: 8px;
        }

        /* ::::::::::::::::::::::::::::::::::::::: SOCIAL ::::::::::::::::::::::::::::::::::::::: */

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

        .social a:hover {
          color: #f5f5f5;
        }

        /* ::::::::::::::::::::::::::::::::::::::: MOBILE ::::::::::::::::::::::::::::::::::::::: */

        @media (max-width: 768px) {
          .footer-inner {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 50px;
          }

          .column {
            align-items: center;
          }

          .contact {
            align-items: center;
          }

          .social {
            justify-content: center;
          }

          .menu {
            justify-content: center;
            flex-wrap: wrap;
          }
        }
      </style>

      <div class="footer-divider">
        ${svg}
      </div>

      <footer class="footer-extra">
        <div class="footer-inner">

          <div class="column">
            <div class="contact">
              <a href="tel:+989125759466">
                <i class="fa-solid fa-phone"></i>
                +989125759466
              </a>
              <a href="mailto:contact@arminsilatani.com">
                <i class="fa-solid fa-envelope"></i>
                contact[at]arminsilatani.com
              </a>
            </div>

            <div class="social">
              <a href="https://www.linkedin.com/in/arminsilatani/" target="_blank" rel="noopener">
                <i class="fa-brands fa-linkedin"></i>
              </a>
              <a href="https://github.com/Arminsilatani" target="_blank" rel="noopener">
                <i class="fa-brands fa-github"></i>
              </a>
              <a href="https://www.instagram.com/arminsilatani" target="_blank" rel="noopener">
                <i class="fa-brands fa-instagram"></i>
              </a>
              <a href="https://wa.me/+989125759466" target="_blank" rel="noopener">
                <i class="fa-brands fa-whatsapp"></i>
              </a>
              <a href="https://t.me/ArminSilatani" target="_blank" rel="noopener">
                <i class="fa-brands fa-telegram"></i>
              </a>
            </div>
          </div>

          <div class="column">
            <h2>Nützliche Links</h2>
            <ul class="menu">
              <li><a href="/login">Anmelden</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/sitemap">Sitemap</a></li>
              <li><a href="/resume.pdf">Lebenslauf herunterladen</a></li>
            </ul>
          </div>

        </div>
      </footer>
    `;

    this.setActiveLink(shadow);
  }

  setActiveLink(shadow) {
    const links = shadow.querySelectorAll(".menu a");
    const currentPath = window.location.pathname;

    links.forEach(link => {
      const linkPath = new URL(link.href).pathname;

      if (currentPath === linkPath || currentPath.startsWith(linkPath + "/")) {
        link.classList.add("active");
      }
    });
  }

}

customElements.define("footer-component", FooterComponent);
