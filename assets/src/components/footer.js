/* :::::::::::::::::::::::::: FOOTER :::::::::::::::::::::::::: */

class FooterComponent extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });
        const color = this.getAttribute("color") || "#4ECDC4";
        const shadowColor = this.getAttribute("shadow-color") || "rgba(0,0,0,0.75)";

        const i18n = window.i18n;
        const langCode = i18n.detectLang();
        const dict = i18n.TRANSLATIONS[langCode];
        const isRTL = dict.dir === "rtl";
        const ft = dict.footer;

        const langBase = i18n.getLangUrl(langCode);
        const phone = isRTL ? "09125759466" : "+989125759466";
        const sitemapUrl = langBase + "sitemap/";
        const meetUrl = "https://meet.google.com/ttc-nybt-grr";
        const blogUrl = langBase + "blog/";

        this.style.setProperty("--footer-color", color);
        this.style.setProperty("--footer-shadow-color", shadowColor);
        this.style.setProperty("--footer-dir", isRTL ? "rtl" : "ltr");

        this.style.setProperty("--lottie-color", "#0D0D0D");
        this.style.setProperty("--lottie-hover-color", "#F5F5F5");

        shadow.innerHTML = `
            <link rel="stylesheet" href="/assets/src/core/lottie-icons.css">
            <link rel="stylesheet" href="/assets/src/components/footer.css">

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
                                <li><a href="https://dashboard.arminsilatani.com/" target="_blank">${ft.links.login}</a></li>
                                <li><a href="${blogUrl}" target="_blank">${ft.links.blog}</a></li>
                                <li><a href="https://tools.arminsilatani.com/" target="_blank" rel="noopener noreferrer">${ft.links.tools}</a></li>
                                <li><a href="${sitemapUrl}" target="_blank">${ft.links.sitemap}</a></li>
                                <li><a href="/#/" target="_blank">${ft.links.downloadCV}</a></li>
                            </ul>
                        </div>

                        <div class="column contact-column">
                            <h2>${ft.contactTitle}</h2>

                            <div class="contact">
                                ${langCode === "fa" ? `
<a href="tel:+989125759466">
                            <div class="lottie-icon footer-contact-icon"
                                data-lottie="/assets/lottie/phone-forwarded.json"
                                data-lottie-mode="hover"></div>
                            ${phone}
                        </a>` : `
                        <a href="${meetUrl}" target="_blank" rel="noopener">
                            <div class="lottie-icon footer-contact-icon"
                                data-lottie="/assets/lottie/google-meet.json"
                                data-lottie-mode="hover"></div>
                            +989125759466
                        </a>`}

                                <a href="mailto:contact@arminsilatani.com">
                                    <div class="lottie-icon footer-contact-icon"
                                         data-lottie="/assets/lottie/mail.json"
                                         data-lottie-mode="hover"></div>
                                    contact[at]arminsilatani.com
                                </a>
                            </div>

                            <div class="social">
                                <a href="https://www.linkedin.com/in/arminsilatani/" target="_blank" rel="noopener" aria-label="LinkedIn">
                                    <div class="lottie-icon footer-social-icon"
                                         data-lottie="/assets/lottie/linkedin.json"
                                         data-lottie-mode="hover"></div>
                                </a>

                                <a href="https://github.com/Arminsilatani" target="_blank" rel="noopener" aria-label="GitHub">
                                    <div class="lottie-icon footer-social-icon"
                                         data-lottie="/assets/lottie/github.json"
                                         data-lottie-mode="hover"></div>
                                </a>

                                <a href="https://www.instagram.com/arminsilatani" target="_blank" rel="noopener" aria-label="Instagram">
                                    <div class="lottie-icon footer-social-icon"
                                         data-lottie="/assets/lottie/instagram.json"
                                         data-lottie-mode="hover"></div>
                                </a>

                                <a href="https://wa.me/989125759466" target="_blank" rel="noopener" aria-label="WhatsApp">
                                    <div class="lottie-icon footer-social-icon"
                                         data-lottie="/assets/lottie/whatsapp.json"
                                         data-lottie-mode="hover"></div>
                                </a>

                                <a href="https://t.me/ArminSilatani" target="_blank" rel="noopener" aria-label="Telegram">
                                    <div class="lottie-icon footer-social-icon"
                                         data-lottie="/assets/lottie/telegram.json"
                                         data-lottie-mode="hover"></div>
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

        this._initFooterLottie();
    }

    _initFooterLottie() {
        const self = this;

        function tryInit(attempt = 0) {
            if (typeof lottie === "undefined") {
                if (attempt < 20) setTimeout(() => tryInit(attempt + 1), 150);
                return;
            }

            const icons = self.shadowRoot.querySelectorAll("[data-lottie]");
            icons.forEach(container => {
                if (container._lottieInstance) return;
                const path = container.dataset.lottie;
                if (!path) return;

                const anim = lottie.loadAnimation({
                    container,
                    renderer: "svg",
                    loop: false,
                    autoplay: false,
                    path
                });

                container._lottieInstance = anim;

                anim.addEventListener("DOMLoaded", () => {
                    const svg = container.querySelector("svg");
                    if (!svg) return;
                    svg.style.width = "100%";
                    svg.style.height = "100%";
                });

                const parent = container.closest("a") || container;
                parent.addEventListener("mouseenter", () => anim.goToAndPlay(0, true));
                parent.addEventListener("mouseleave", () => anim.stop());
            });
        }

        requestAnimationFrame(() => tryInit());

        setTimeout(() => tryInit(), 500);
    }
}

if (!customElements.get("footer-component")) {
    customElements.define("footer-component", FooterComponent);
}