/* :::::::::::::::::::::::::: LANGUAGE COMPONENT :::::::::::::::::::::::::: */

class LanguageComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    /* :::::::::::::::::::::::::: STYLES :::::::::::::::::::::::::: */
    const style = document.createElement("style");
    style.textContent = `
            .language-container {
                position: absolute;
                top: 14px;
                right: 0;
                z-index: 10;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                cursor: pointer;
                user-select: none;
                touch-action: manipulation;
                direction: rtl;
                padding-right: 10px;
                -webkit-tap-highlight-color: transparent;
            }

            .language {
                color: #0D0D0D;
                font-size: 16px;
                padding: 1px 10px;
                font-weight: 500;
            }

            .language-dropdown {
                /* Customizable feather edge blur amounts */
                --fade-l: 65px;  /* Left edge blur */
                --fade-r: 30px;  /* Right edge blur */
                --fade-b: 30px;  /* Bottom edge blur */

                display: none;
                position: absolute;
                top: 100%;

                /* Shift menu to the right to compensate padding so texts stay aligned with 'Italiano |' */
                right: calc(10px - var(--fade-r));

                flex-direction: column;
                background: linear-gradient(to bottom, rgba(245, 245, 245, 0.04) 0%, rgba(245, 245, 245, 0) 100%);

                opacity: 0;
                backdrop-filter: blur(0px);
                -webkit-backdrop-filter: blur(0px);

                /*
                  Create horizontal and vertical masks and combine them.
                  - First layer (horizontal): blurs left and right.
                  - Second layer (vertical): blurs only bottom (top stays solid).
                */
                -webkit-mask-image:
                    linear-gradient(to right, transparent 0%, black var(--fade-l), black calc(100% - var(--fade-r)), transparent 100%),
                    linear-gradient(to bottom, black 0%, black calc(100% - var(--fade-b)), transparent 100%);
                -webkit-mask-composite: source-in; /* Mask composition for Chrome and Safari */

                mask-image:
                    linear-gradient(to right, transparent 0%, black var(--fade-l), black calc(100% - var(--fade-r)), transparent 100%),
                    linear-gradient(to bottom, black 0%, black calc(100% - var(--fade-b)), transparent 100%);
                mask-composite: intersect; /* Mask composition for standard browsers */

                /* Safe area with padding so link text stays clear and doesn't enter the blur area */
                padding-left: 10px;
                padding-right: var(--fade-r);
                padding-bottom: var(--fade-b);

                box-shadow: none;
                border: none;
                border-radius: 8px;
                z-index: 20;
                direction: rtl;

                /* Ensure enough width to display text in the middle of the clear area */
                min-width: 140px;
                overflow: hidden;

                transition: opacity 0.4s ease, backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease;
            }

            .language-dropdown.open {
                opacity: 1;
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
            }

            .language-dropdown-item {
                display: block;
                padding: 12px 15px;
                margin: 0;
                color: #54595F;
                text-decoration: none;
                cursor: pointer;
                transition: color 0.25s ease;
                font-size: 15px;
                opacity: 0;
            }

            .language-dropdown-item:hover,
            .language-dropdown-item:active {
                color: #0D0D0D;
            }

            @keyframes fadeInDown {
                from {
                    opacity: 0;
                    transform: translateY(5px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .language-dropdown.open .language-dropdown-item {
                animation: fadeInDown 0.3s ease-out forwards;
                animation-delay: calc(var(--i) * 0.05s);
            }

            @media (max-width: 768px) {
                .language-container {
                    top: 15px;
                }
            }
        `;
    shadow.appendChild(style);

    /* :::::::::::::::::::::::::: DOM STRUCTURE :::::::::::::::::::::::::: */
    const container = document.createElement("div");
    container.className = "language-container";

    const langDisplay = document.createElement("div");
    langDisplay.className = "language";
    langDisplay.textContent = "| Italiano";
    langDisplay.setAttribute("aria-label", "Language Selector");
    langDisplay.setAttribute("role", "button");

    const dropdown = document.createElement("div");
    dropdown.className = "language-dropdown";
    dropdown.setAttribute("role", "menu");

    /* :::::::::::::::::::::::::: LANGUAGE CONFIGURATION :::::::::::::::::::::::::: */
    const languages = [
      { name: "فارسی", url: "/", hreflang: "fa" },
      { name: "English", url: "/en/", hreflang: "en" },
      { name: "العربية", url: "/ar/", hreflang: "ar" },
      { name: "Türkçe", url: "/tr/", hreflang: "tr" },
      { name: "Deutsch", url: "/de/", hreflang: "de" },
    ];

    /* :::::::::::::::::::::::::: EXTRACT CURRENT PATH :::::::::::::::::::::::::: */
    let currentPath = window.location.pathname;

    const localRepoName = "/arminsilatani.github.io";
    if (currentPath.startsWith(localRepoName)) {
      currentPath = currentPath.slice(localRepoName.length);
    }

    const langFolders = ["/en/", "/ar/", "/tr/", "/de/", "/it/"];
    for (let folder of langFolders) {
      if (currentPath.startsWith(folder)) {
        currentPath = currentPath.slice(folder.length - 1);
        break;
      }
    }

    if (currentPath.startsWith("/")) {
      currentPath = currentPath.slice(1);
    }

    const pageName = currentPath;
    const searchAndHash = window.location.search + window.location.hash;

    /* :::::::::::::::::::::::::: GENERATE LANGUAGE LINKS :::::::::::::::::::::::::: */
    languages.forEach((lang, index) => {
      const link = document.createElement("a");
      link.className = "language-dropdown-item";
      link.textContent = lang.name;

      let baseUrl = lang.url;
      if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
      }

      link.href = baseUrl + pageName + searchAndHash;

      link.setAttribute("hreflang", lang.hreflang);
      link.setAttribute("role", "menuitem");
      link.setAttribute("aria-label", `Switch to ${lang.name}`);
      link.style.setProperty("--i", index);

      link.addEventListener("click", () => hideDropdown());

      dropdown.appendChild(link);
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
      if (!container.contains(e.relatedTarget)) hideDropdown();
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

if (!customElements.get("language-component")) {
  customElements.define("language-component", LanguageComponent);
}
