/* :::::::::::::::::::::::::: FOOTER COMPONENT :::::::::::::::::::::::::: */
class FooterComponent extends HTMLElement {
    /* :::::::::::::::::::::::::: CONSTRUCTOR :::::::::::::::::::::::::: */
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });
        const color = this.getAttribute("color") || "#4ECDC4";
        const shadowColor = this.getAttribute("shadow-color") || "rgba(0,0,0,0.75)";

        /* :::::::::::::::::::::::::: LANGUAGE & TRANSLATIONS :::::::::::::::::::::::::: */
        const i18n = window.i18n;
        const langCode = i18n.detectLang();
        const dict = i18n.TRANSLATIONS[langCode];
        const isRTL = dict.dir === "rtl";
        const ft = dict.footer;

        /* لینک‌ها با پیشوند زبان */
        const langBase = i18n.getLangUrl(langCode);
        const sitemapUrl = langBase + "sitemap/";

        /* :::::::::::::::::::::::::: PASS CSS VARS TO HOST :::::::::::::::::::::::::: */
        this.style.setProperty("--footer-color", color);
        this.style.setProperty("--footer-shadow-color", shadowColor);
        this.style.setProperty("--footer-dir", isRTL ? "rtl" : "ltr");

        shadow.innerHTML = `
            <link rel="stylesheet" href="/assets/src/components/footer.css">

            <!-- :::::::::::::::::::::::::: FOOTER :::::::::::::::::::::::::: -->
            <div class="footer-wrapper">
                <div class="footer-divider">
                    <div class="footer-divider__shape"></div>
                </div>

                <footer class="footer-extra">
                    <div class="footer-inner" id="footer-inner">

                        <div class="column" id="currency-section">
                            <h2>${ft.currencyTitle}</h2>
                            <div id="currency-container"></div>
                        </div>

                        <div class="column">
                            <h2>${ft.usefulLinks}</h2>
                            <ul class="menu">
                                <li><a href="/#/">${ft.links.login}</a></li>
                                <li><a href="/#/">${ft.links.blog}</a></li>
                                <li><a href="https://tools.arminsilatani.com/" target="_blank" rel="noopener noreferrer">${ft.links.tools}</a></li>
                                <li><a href="${sitemapUrl}">${ft.links.sitemap}</a></li>
                                <li><a href="/#/">${ft.links.downloadCV}</a></li>
                            </ul>
                        </div>

                        <div class="column contact-column">
                            <h2>${ft.contactTitle}</h2>

                            <div class="contact">
                                <a href="tel:+989125759466">
                                    <span class="icon">
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M6.6 10.8c1.6 3.2 4.3 5.9 7.5 7.5l2.5-2.5c.3-.3.7-.4 1.1-.3 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1v3.6c0 .6-.4 1-1 1C10.5 22.7 1.3 13.5 1.3 2.9c0-.6.4-1 1-1H6c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1.1Z" />
                                        </svg>
                                    </span>
                                    09125759466
                                </a>

                                <a href="mailto:contact@arminsilatani.com">
                                    <span class="icon">
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm9 7L3.8 7.5A1 1 0 0 0 3 8.4V17h18V8.4a1 1 0 0 0-.8-.9Z" />
                                        </svg>
                                    </span>
                                    contact[at]arminsilatani.com
                                </a>
                            </div>

                            <div class="social">
                                <a href="https://www.linkedin.com/in/arminsilatani/" target="_blank" aria-label="LinkedIn">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3zM10 9h3.8v1.7h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6V21h-4v-5c0-1.2 0-2.8-1.7-2.8-1.7 0-2 1.3-2 2.7V21h-4z" />
                                    </svg>
                                </a>

                                <a href="https://github.com/Arminsilatani" target="_blank" aria-label="GitHub">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M12 2a10 10 0 0 0-3.16 19.48c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.36-1.34-3.36-1.34-.45-1.13-1.1-1.43-1.1-1.43-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.84.09-.66.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.9-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.68 0 3.85-2.35 4.7-4.58 4.95.36.31.68.92.68 1.85v2.74c0 .26.18.57.69.48A10 10 0 0 0 12 2z" />
                                    </svg>
                                </a>

                                <a href="https://www.instagram.com/arminsilatani" target="_blank" aria-label="Instagram">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.25-1.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z" />
                                    </svg>
                                </a>

                                <a href="https://wa.me/989125759466" target="_blank" aria-label="WhatsApp">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M20.52 3.48A11.82 11.82 0 0 0 12.07.2C5.5.2.2 5.5.2 12.06a11.8 11.8 0 0 0 1.73 6.14L0 24l5.98-1.88a11.86 11.86 0 0 0 6.1 1.57h.01c6.56 0 11.86-5.3 11.86-11.86 0-3.17-1.23-6.16-3.43-8.35ZM12.09 21.3h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-3.55 1.12 1.15-3.46-.24-.35a9.83 9.83 0 1 1 8.03 4.27Zm5.68-7.37c-.31-.16-1.86-.92-2.15-1.02-.29-.1-.5-.16-.71.16-.21.31-.82 1.02-1 1.23-.18.21-.36.24-.67.08-.31-.16-1.32-.49-2.51-1.56-.93-.83-1.56-1.86-1.74-2.17-.18-.31-.02-.48.14-.64.14-.14.31-.36.46-.54.15-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.7-.98-2.33-.26-.62-.53-.53-.71-.54h-.61c-.21 0-.55.08-.83.39-.29.31-1.1 1.08-1.1 2.64 0 1.56 1.13 3.07 1.29 3.28.16.21 2.23 3.41 5.4 4.78.75.32 1.33.52 1.79.66.75.24 1.43.2 1.97.12.6-.09 1.86-.76 2.12-1.5.26-.75.26-1.39.18-1.5-.08-.11-.29-.18-.6-.34Z" />
                                    </svg>
                                </a>

                                <a href="https://t.me/ArminSilatani" target="_blank" aria-label="Telegram">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M9.04 15.64 8.9 19.5c.62 0 .9-.27 1.25-.6l3-2.8 6.2 4.55c1.14.63 1.96.3 2.25-1.05L24 4.3c.38-1.7-.62-2.37-1.72-1.96L2 10.4c-1.63.63-1.6 1.52-.3 1.92l5.2 1.62L20.1 6.6c.6-.4 1.14-.18.7.22Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>

                <div class="copyright">
                    <p class="copyright-text">${ft.copyright}</p>
                </div>
            </div>
        `;
    }

    /* :::::::::::::::::::::::::: CONNECTED CALLBACK :::::::::::::::::::::::::: */
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

/* :::::::::::::::::::::::::: REGISTRATION :::::::::::::::::::::::::: */
if (!customElements.get("footer-component")) {
    customElements.define("footer-component", FooterComponent);
}