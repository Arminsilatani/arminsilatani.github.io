/* ================================================================
   ::::::::::::::::::::::  COMPONENT CONFIG  ::::::::::::::::::::::
   همه تنظیمات از همین‌جا مدیریت می‌شود. جای دیگر دست نزن.
   ================================================================ */
const BREADCRUMB_CONFIG = {
  symbol:       "✦",
  symbolColor:  "#4ECDC4",
  typingSpeed:  40,
  segmentDelay: 100,
  showCursor:   true,
  startFrom:    "hostname"
};

/* ================================================================
   ::::::::::::::::::::::  WEB COMPONENT  :::::::::::::::::::::::::
   استفاده:  <terminal-breadcrumb></terminal-breadcrumb>
   ================================================================ */
class TerminalBreadcrumb extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initBreadcrumb();
  }

  render() {
    const { symbol, symbolColor, showCursor } = BREADCRUMB_CONFIG;

    /* رنگ نماد به‌صورت CSS Custom Property — نه استایل اینلاین */
    this.style.setProperty("--breadcrumb-symbol-color", symbolColor);

    this.innerHTML = `
      <div class="breadcrumb-wrap">
        <div class="breadcrumb-inner">
          <span class="breadcrumb-deco" aria-hidden="true">${symbol}</span>
          <span class="breadcrumb-path" id="terminalPath"></span>
          ${showCursor ? '<span class="breadcrumb-cursor"></span>' : ""}
        </div>
      </div>
    `;
  }

  initBreadcrumb() {
    const { typingSpeed, segmentDelay, startFrom } = BREADCRUMB_CONFIG;
    const container = this.querySelector("#terminalPath");
    if (!container) return;

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