/* :::::::::::::::::::::::::: HEADER COMPONENT :::::::::::::::::::::::::: */

class HeaderComponent extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        /* :::::::::::::::::::::::::: LANGUAGE DETECTION :::::::::::::::::::::::::: */
        const lang = window.i18n.detectLang();
        const dict = window.i18n.TRANSLATIONS[lang];
        const isRTL = dict.dir === "rtl";

        /* مقادیر وابسته به جهت — به‌عنوان CSS variable پاس داده می‌شوند */
        const textAlign       = isRTL ? "right" : "left";
        const transformOrigin = isRTL ? "right center" : "left center";
        const menuWrapperLeft = isRTL ? "43%" : "57%";
        const translateXSign  = isRTL ? -1 : 1;

        this.style.setProperty("--header-dir", isRTL ? "rtl" : "ltr");
        this.style.setProperty("--header-text-align", textAlign);
        this.style.setProperty("--header-transform-origin", transformOrigin);
        this.style.setProperty("--header-menu-left", menuWrapperLeft);

        /* :::::::::::::::::::::::::: STYLESHEET :::::::::::::::::::::::::: */
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/assets/src/components/header.css";
        shadow.appendChild(link);

        /* :::::::::::::::::::::::::: DOM STRUCTURE :::::::::::::::::::::::::: */

        const container = document.createElement("div");
        container.className = "container";

        const toggleTrack = document.createElement("div");
        toggleTrack.className = "toggle-track";

        const button = document.createElement("button");
        button.className = "button";

        const icon = document.createElement("span");
        icon.className = "icon";
        icon.textContent = ">";

        button.appendChild(icon);
        toggleTrack.appendChild(button);
        container.appendChild(toggleTrack);

        const overlay = document.createElement("div");
        overlay.className = "overlay";

        const overlayDark = document.createElement("div");
        overlayDark.className = "overlay-dark";

        const wrapper = document.createElement("div");
        wrapper.className = "menu-wrapper";

        const lineBox = document.createElement("div");
        lineBox.className = "line-box";

        lineBox.innerHTML = `
            <svg width="40" height="384" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="rgba(255,255,255,0)" />
                        <stop offset="50%" stop-color="rgba(255,255,255,1)" />
                        <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                    </linearGradient>
                </defs>
                <path class="elastic" stroke="url(#lineGradient)" d="M 20 0 Q 20 192 20 384"></path>
            </svg>
        `;

        const path = lineBox.querySelector(".elastic");

        /* :::::::::::::::::::::::::: MENU ITEMS (خودکار از i18n) :::::::::::::::::::::::::: */
        const menuItems = window.i18n.getMenuItems();

        const menu = document.createElement("nav");
        menu.className = "sidebar";

        menuItems.forEach((item) => {
            const a = document.createElement("a");
            a.href = item.href;
            a.textContent = item.label;
            menu.appendChild(a);
        });

        wrapper.append(lineBox, menu);
        overlayDark.appendChild(wrapper);

        /* :::::::::::::::::::::::::: TOGGLE LOGIC :::::::::::::::::::::::::: */
        let animating = false;

        button.addEventListener("click", () => {
            const isActive = button.classList.contains("active");

            icon.classList.toggle("rotated");
            document.body.style.overflow = isActive ? "" : "hidden";

            if (isActive) {
                animating = false;
                overlayDark.classList.remove("active");
                setTimeout(() => overlay.classList.remove("active"), 200);
            } else {
                overlay.classList.add("active");
                setTimeout(() => overlayDark.classList.add("active"), 200);
                animating = true;
                requestAnimationFrame(animate);
            }

            button.classList.toggle("active");
            toggleTrack.classList.toggle("active");
        });

        /* :::::::::::::::::::::::::: ANIMATION ENGINE :::::::::::::::::::::::::: */
        const links = [...menu.querySelectorAll("a")];
        const currentUrl = window.location.pathname;

        links.forEach((a) => {
            const linkPath = new URL(a.href).pathname;
            if (linkPath === currentUrl) {
                a.classList.add("active");
            }
        });

        let targets = new Array(links.length).fill(0);
        let currents = new Array(links.length).fill(0);

        let targetY = 192;
        let currentY = 192;

        const lerp = (a, b, t) => a + (b - a) * t;

        function animate() {
            if (!animating) return;

            currents = currents.map((v, i) => lerp(v, targets[i], 0.15));

            links.forEach((a, i) => {
                const scale = 1 + currents[i] * 0.55;
                const translateX = currents[i] * 18 * translateXSign;
                a.style.transform = `translateZ(0) scale(${scale}) translateX(${translateX}px)`;
            });

            currentY = lerp(currentY, targetY, 0.12);
            path.setAttribute("d", `M 20 0 Q ${isRTL ? 20 - 18 : 20 + 18} ${currentY} 20 384`);

            requestAnimationFrame(animate);
        }

        /* :::::::::::::::::::::::::: HOVER EFFECTS :::::::::::::::::::::::::: */
        links.forEach((a, i) => {
            a.addEventListener("mouseenter", () => {
                targets.fill(0);
                targets[i] = 1;

                if (targets[i - 1] != null) targets[i - 1] = 0.45;
                if (targets[i + 1] != null) targets[i + 1] = 0.45;

                const rect = a.getBoundingClientRect();
                const parent = menu.getBoundingClientRect();
                targetY = rect.top - parent.top + rect.height / 2;
            });
        });

        menu.addEventListener("mouseleave", () => {
            targets.fill(0);
            targetY = 192;
        });

        /* :::::::::::::::::::::::::: MOUNT :::::::::::::::::::::::::: */
        shadow.append(container, overlay, overlayDark);
    }
}

/* :::::::::::::::::::::::::: REGISTER :::::::::::::::::::::::::: */
if (!customElements.get("header-component")) {
    customElements.define("header-component", HeaderComponent);
}