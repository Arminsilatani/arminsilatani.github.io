/* :::::::::::::::::::::::::: LANGUAGE SELECTOR :::::::::::::::::::::::::: */

class LanguageComponent extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        /* :::::::::::::::::::::::::: LANGUAGE DETECTION :::::::::::::::::::::::::: */
        const i18n = window.i18n;
        const currentLangCode = i18n.detectLang();
        const currentLang =
            i18n.TRANSLATIONS[currentLangCode] ||
            i18n.TRANSLATIONS[i18n.DEFAULT_LANG];

        const pageName = i18n.getPagePath();
        const searchAndHash = window.location.search + window.location.hash;

        /* :::::::::::::::::::::::::: STYLESHEET :::::::::::::::::::::::::: */
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/assets/src/components/language-selector.css";
        shadow.appendChild(link);

        /* :::::::::::::::::::::::::: DOM STRUCTURE :::::::::::::::::::::::::: */
        const container = document.createElement("div");
        container.className = "language-container";

        const langDisplay = document.createElement("div");
        langDisplay.className = "language";
        langDisplay.textContent = currentLang.langDisplay;
        langDisplay.setAttribute("aria-label", "Language Selector");
        langDisplay.setAttribute("role", "button");

        const dropdown = document.createElement("div");
        dropdown.className = "language-dropdown";
        dropdown.setAttribute("role", "menu");

        /* :::::::::::::::::::::::::: GENERATE LANGUAGE LINKS :::::::::::::::::::::::::: */
        /* ترتیب اولویت‌دار زبان‌ها بر اساس اهمیت در دنیای اینترنت */
        const LANG_PRIORITY = [
            "en", // English
            "de", // German
            "it", // Italian
            "ar", // Arabic
            "tr", // Turkish
            "fa", // Persian
        ];

        /* همه‌ی زبان‌ها به‌جز زبان فعلی، مرتب‌شده بر اساس اولویت */
        const otherLangs = Object.values(i18n.TRANSLATIONS)
            .filter((lang) => lang.code !== currentLangCode)
            .sort((a, b) => {
                const posA = LANG_PRIORITY.indexOf(a.code);
                const posB = LANG_PRIORITY.indexOf(b.code);

                // زبان‌هایی که در لیست اولویت نیستند، به انتهای لیست می‌روند
                const indexA = posA === -1 ? LANG_PRIORITY.length : posA;
                const indexB = posB === -1 ? LANG_PRIORITY.length : posB;

                return indexA - indexB;
            });

        otherLangs.forEach((lang, index) => {
            const a = document.createElement("a");
            a.className = "language-dropdown-item";
            a.textContent = lang.name;

            const baseUrl = i18n.getLangUrl(lang.code);
            a.href = baseUrl + pageName + searchAndHash;
            a.setAttribute("hreflang", lang.code);
            a.setAttribute("role", "menuitem");
            a.setAttribute("aria-label", `Switch to ${lang.name}`);
            a.style.setProperty("--i", index);

            a.addEventListener("click", () => hideDropdown());

            dropdown.appendChild(a);
        });

        container.appendChild(langDisplay);
        container.appendChild(dropdown);
        shadow.appendChild(container);

        /* :::::::::::::::::::::::::: DROPDOWN CONTROLS :::::::::::::::::::::::::: */
        const showDropdown = () => {
            dropdown.style.display = "flex";
            requestAnimationFrame(() => dropdown.classList.add("open"));
        };

        const hideDropdown = () => {
            dropdown.classList.remove("open");
            setTimeout(() => {
                if (!dropdown.classList.contains("open")) {
                    dropdown.style.display = "none";
                }
            }, 300);
        };

        const toggleDropdown = () => {
            dropdown.classList.contains("open") ? hideDropdown() : showDropdown();
        };

        container.addEventListener("mouseenter", showDropdown);
        container.addEventListener("mouseleave", (e) => {
            if (!container.contains(e.relatedTarget)) {
                hideDropdown();
            }
        });

        langDisplay.addEventListener("click", (e) => {
            e.preventDefault();
            toggleDropdown();
        });

        langDisplay.addEventListener("keydown", (e) => {
            if (e.key === "Enter") toggleDropdown();
            if (e.key === "Escape") hideDropdown();
        });
    }
}

/* :::::::::::::::::::::::::: CUSTOM ELEMENT REGISTRATION :::::::::::::::::::::::::: */
if (!customElements.get("language-component")) {
    customElements.define("language-component", LanguageComponent);
}