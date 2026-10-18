/* ================================================================
   ::::::::::::::::::::::  COMPONENT CONFIG  ::::::::::::::::::::::
   همه تنظیمات از همین‌جا مدیریت می‌شود. جای دیگر دست نزن.
   ================================================================ */
const BREADCRUMB_CONFIG = {
  symbol:       "✦",       // ← فقط اینجا نماد را عوض کن
  symbolColor:  "#4ECDC4", // رنگ نماد
  typingSpeed:  40,        // ms بین هر کاراکتر
  segmentDelay: 100,       // ms بین هر segment
  showCursor:   true,      // نمایش / مخفی کردن نشانگر چشمک‌زن
  startFrom:    "hostname" // "hostname" یا "/" یا یک مسیر ثابت
};

/* ================================================================
   ::::::::::::::::::::::  WEB COMPONENT  :::::::::::::::::::::::::
   استفاده:  <terminal-breadcrumb></terminal-breadcrumb>
   ================================================================ */
class TerminalBreadcrumb extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.initBreadcrumb();
  }

  render() {
    const { symbol, symbolColor, showCursor } = BREADCRUMB_CONFIG;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 10;
          direction: ltr;
        }
        .wrap {
          background: #0D0D0D;
          padding: 14px 0;
          width: 100%;
        }
        .inner {
          width: 1300px;
          max-width: 90%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          font-size: 17px;
          color: #F5F5F5;
          font-family:
            "Ubuntu Mono", "DejaVu Sans Mono", "Liberation Mono",
            "Consolas", "Menlo", "Courier New", monospace;
        }
        .deco {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.2em;
          margin-right: 8px;
          color: ${symbolColor};
        }
        #terminalPath a {
          color: #F5F5F5;
          text-decoration: none;
        }
        #terminalPath a:hover {
          color: #4ECDC4;
        }
        .cursor {
          width: 10px;
          height: 18px;
          background: #F5F5F5;
          margin-left: 6px;
          animation: blink 0.8s infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }

        @media (max-width: 768px) {
          .inner { font-size: 13px; line-height: 1.6; }
        }
      </style>

      <div class="wrap">
        <div class="inner">
          <span class="deco" aria-hidden="true">${symbol}</span>
          <span id="terminalPath"></span>
          ${showCursor ? '<span class="cursor"></span>' : ""}
        </div>
      </div>
    `;
  }

  initBreadcrumb() {
    const { typingSpeed, segmentDelay, startFrom } = BREADCRUMB_CONFIG;
    const container = this.shadowRoot.getElementById("terminalPath");
    if (!container) return;

    // ساخت مسیرها
    const domain = window.location.hostname;
    const parts = window.location.pathname.split("/").filter(Boolean);
    const paths = [];

    if (startFrom === "hostname") {
      paths.push({ name: domain, url: "/" });
    } else if (startFrom === "/") {
      paths.push({ name: "", url: "/" });
    } else if (typeof startFrom === "string") {
      paths.push({ name: startFrom, url: "/" });
    }

    let fullPath = "";
    parts.forEach((p) => {
      fullPath += "/" + p;
      paths.push({ name: p, url: fullPath });
    });

    let textIndex = 0;
    let charIndex = 0;

    const typeSegment = () => {
      if (textIndex >= paths.length) return;

      const segment = paths[textIndex];
      const link = document.createElement("a");
      link.href = segment.url;
      container.appendChild(link);

      const typeChar = () => {
        if (charIndex < segment.name.length) {
          link.textContent += segment.name.charAt(charIndex++);
          setTimeout(typeChar, typingSpeed);
        } else {
          charIndex = 0;
          textIndex++;
          if (textIndex < paths.length) {
            container.appendChild(document.createTextNode("/"));
          }
          setTimeout(typeSegment, segmentDelay);
        }
      };

      typeChar();
    };

    typeSegment();
  }
}

if (!customElements.get("terminal-breadcrumb")) {
  customElements.define("terminal-breadcrumb", TerminalBreadcrumb);
}