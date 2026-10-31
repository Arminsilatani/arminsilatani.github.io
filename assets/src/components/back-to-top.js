/* :::::::::::::::::::::::::: BACK TO TOP COMPONENT :::::::::::::::::::::::::: */
class BackToTop extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });
        const color = this.getAttribute("color") || "#4ECDC4";

        /* رنگ به‌عنوان CSS variable به host پاس داده می‌شود */
        this.style.setProperty("--btt-color", color);

        const i18n = window.i18n;
        const langCode = i18n.detectLang();
        const dict = i18n.TRANSLATIONS[langCode];
        const ft = dict.footer;
        const label = (ft && ft.backToTop) || "Back to top";

        shadow.innerHTML = `
            <link rel="stylesheet" href="/assets/src/components/back-to-top.css">
            <button id="btn" aria-label="${label}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6.343 14.657L12 9l5.657 5.657"/>
                </svg>
            </button>
        `;
    }

    /* :::::::::::::::::::::::::: LIFECYCLE :::::::::::::::::::::::::: */
    connectedCallback() {
        this._init();
    }

    disconnectedCallback() {
        this._cleanup();
    }

    /* :::::::::::::::::::::::::: INIT :::::::::::::::::::::::::: */
    _init() {
        const btn = this.shadowRoot.querySelector("#btn");
        if (!btn) return;

        const MOBILE_BREAKPOINT  = 140;
        const PORTRAIT_MAX_WIDTH = 768;
        const GAP_DESKTOP        = -90;
        const GAP_PORTRAIT       = -50;
        const GAP_MOBILE         = 10;
        const BOTTOM_DESKTOP     = 24;
        const BOTTOM_MOBILE      = 80;
        const SHOW_AFTER         = 500;

        this._scrollHandler = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;

            const isMobile   = w <= MOBILE_BREAKPOINT;
            const isPortrait = h > w && w <= PORTRAIT_MAX_WIDTH;

            const GAP = isMobile
                ? GAP_MOBILE
                : (isPortrait ? GAP_PORTRAIT : GAP_DESKTOP);
            const BOTTOM_OFFSET = isMobile ? BOTTOM_MOBILE : BOTTOM_DESKTOP;

            /* پیدا کردن دیوایدر فوتر داخل shadow DOM فوتر */
            const footer = document.querySelector("footer-component");
            const dividerEl = footer && footer.shadowRoot
                ? footer.shadowRoot.querySelector(".footer-divider")
                : null;

            const viewportH = h;
            const dividerRect = dividerEl ? dividerEl.getBoundingClientRect() : null;

            if (dividerRect && dividerRect.top < viewportH) {
                const distanceFromBottom = viewportH - dividerRect.top + GAP;
                this.style.bottom = distanceFromBottom + "px";
            } else {
                this.style.bottom = BOTTOM_OFFSET + "px";
            }

            if (window.scrollY > SHOW_AFTER) {
                this.classList.add("is-visible");
            } else {
                this.classList.remove("is-visible");
            }
        };

        this._clickHandler = () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        window.addEventListener("scroll", this._scrollHandler, { passive: true });
        window.addEventListener("resize", this._scrollHandler, { passive: true });
        btn.addEventListener("click", this._clickHandler);

        this._scrollHandler();
    }

    /* :::::::::::::::::::::::::: CLEANUP :::::::::::::::::::::::::: */
    _cleanup() {
        if (this._scrollHandler) {
            window.removeEventListener("scroll", this._scrollHandler);
            window.removeEventListener("resize", this._scrollHandler);
        }
        if (this._clickHandler) {
            const btn = this.shadowRoot.querySelector("#btn");
            if (btn) btn.removeEventListener("click", this._clickHandler);
        }
    }
}

/* :::::::::::::::::::::::::: REGISTRATION :::::::::::::::::::::::::: */
if (!customElements.get("back-to-top")) {
    customElements.define("back-to-top", BackToTop);
}