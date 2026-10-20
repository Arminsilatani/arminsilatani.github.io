/* :::::::::::::::::::::::::: GSAP & SCROLLTRIGGER INITIALIZATION :::::::::::::::::::::::::: */
document.documentElement.classList.add("js");

if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* :::::::::::::::::::::::::: SPLIT TEXT & TITLES ENGINE :::::::::::::::::::::::::: */
function splitTextElements() {
    // پردازش همزمان تیترها (.split-title) و پاراگراف‌ها (.split-text)
    document.querySelectorAll(".split-title, .split-text").forEach(el => {
        if (el.dataset.splitted === "true") return;

        const text = el.textContent.replace(/\s+/g, " ").trim();
        if (!text) return;

        const words = text.split(" ");

        // تفکیک کلمات و تزریق فاصله پایدار جهت حفظ جریان طبیعی متن در RTL/LTR
        el.innerHTML = words
            .map((word, i) =>
                `<span class="word">${word}</span>` +
                (i < words.length - 1 ? `<span class="space" aria-hidden="true"> </span>` : "")
            )
            .join("");

        // برچسب ARIA جهت حفظ دسترسی‌پذیری سئو و صفحه‌خوان‌ها
        el.setAttribute("aria-label", text);
        el.dataset.splitted = "true";
    });
}

/* :::::::::::::::::::::::::: SCROLL-TRIGGERED REVEAL ANIMATIONS :::::::::::::::::::::::::: */
function initRevealAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    const ups = document.querySelectorAll(".reveal-up");
    const cards = document.querySelectorAll(".reveal-card");
    const rows = document.querySelectorAll(".reveal-row");
    const splitTitleWords = document.querySelectorAll(".split-title .word");
    const splitTextWords = document.querySelectorAll(".split-text .word");

    // مقداردهی اولیه حالت نامرئی
    if (ups.length) gsap.set(ups, { y: 30, opacity: 0 });
    if (cards.length) gsap.set(cards, { y: 36, opacity: 0, scale: 0.985 });
    if (rows.length) gsap.set(rows, { y: 18, opacity: 0 });
    if (splitTitleWords.length) gsap.set(splitTitleWords, { y: 40, opacity: 0 });
    if (splitTextWords.length) gsap.set(splitTextWords, { y: 18, opacity: 0 });

    // ۱. انیمیشن کلماتِ تیترها (.split-title) - نمایش پرتابی و بولد
    document.querySelectorAll(".split-title").forEach(title => {
        const words = title.querySelectorAll(".word");
        if (!words.length) return;

        gsap.to(words, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
                trigger: title,
                start: "top 88%",
                once: true
            }
        });
    });

    // ۲. انیمیشن کلماتِ پاراگراف‌ها (.split-text) - نمایش نرم، ابریشمی و موجی
    document.querySelectorAll(".split-text").forEach(p => {
        const words = p.querySelectorAll(".word");
        if (!words.length) return;

        gsap.to(words, {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.018, // ریتم پیوسته بدون معطلی کاربر در خواندن متن
            ease: "power2.out",
            scrollTrigger: {
                trigger: p,
                start: "top 90%",
                once: true
            }
        });
    });

    // ۳. انیمیشن المان‌های منفرد (مستقل از استک عمودی)
    document.querySelectorAll(".reveal-up").forEach(el => {
        if (el.closest(".reveal-stack")) return;

        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true
            }
        });
    });

    // ۴. انیمیشن استک عمودی (.reveal-stack) با افکت پله‌ای (Stagger)
    document.querySelectorAll(".reveal-stack").forEach(stack => {
        const items = stack.querySelectorAll(":scope > .reveal-up");
        if (!items.length) return;

        gsap.to(items, {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
                trigger: stack,
                start: "top 85%",
                once: true
            }
        });
    });

    // ۵. گریدها (کارت‌ها و دسته‌بندی‌ها)
    document.querySelectorAll(".categories-grid, .graphic-grid").forEach(grid => {
        const children = grid.querySelectorAll(".reveal-card");
        if (!children.length) return;

        gsap.to(children, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
                trigger: grid,
                start: "top 88%",
                once: true
            }
        });
    });

    // ۶. لیست سطرهای عمودی پورتفولیو
    document.querySelectorAll(".portfolio-list").forEach(list => {
        const visibleRows = list.querySelectorAll(".portfolio-row:not(.extra-item)");
        if (!visibleRows.length) return;

        gsap.to(visibleRows, {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.045,
            ease: "power2.out",
            scrollTrigger: {
                trigger: list,
                start: "top 90%",
                once: true
            }
        });
    });
}

/* :::::::::::::::::::::::::: PORTFOLIO ROW HOVER EFFECTS :::::::::::::::::::::::::: */
function initProjectRowHover() {
    if (typeof gsap === "undefined") return;

    document.querySelectorAll(".portfolio-row").forEach(row => {
        const line  = row.querySelector(".portfolio-row__line");
        const title = row.querySelector(".portfolio-row__title");
        const hint  = row.querySelector(".portfolio-row__hint");
        const year  = row.querySelector(".portfolio-row__year");

        row.addEventListener("mouseenter", () => {
            if (line)  gsap.to(line,  { scaleX: 1, transformOrigin: "right", duration: 0.4,  ease: "power2.out", overwrite: "auto" });
            if (title) gsap.to(title, { x: -8,                                duration: 0.35, ease: "power2.out", overwrite: "auto" });
            if (hint)  gsap.to(hint,  { x: -8, color: "#4ECDC4",              duration: 0.35, ease: "power2.out", overwrite: "auto" });
            if (year)  gsap.to(year,  { x: -4,                                duration: 0.3,  ease: "power2.out", overwrite: "auto" });
        });

        row.addEventListener("mouseleave", () => {
            if (line)  gsap.to(line,  { scaleX: 0, transformOrigin: "left",  duration: 0.35, ease: "power2.out", overwrite: "auto" });
            if (title) gsap.to(title, { x: 0,                                 duration: 0.3,  ease: "power2.out", overwrite: "auto" });
            if (hint)  gsap.to(hint,  { x: 0, color: "rgba(255,255,255,0.42)", duration: 0.3,  ease: "power2.out", overwrite: "auto" });
            if (year)  gsap.to(year,  { x: 0,                                 duration: 0.28, ease: "power2.out", overwrite: "auto" });
        });
    });
}

/* :::::::::::::::::::::::::: GRAPHIC CARD HOVER SHINE EFFECT :::::::::::::::::::::::::: */
function initGraphicHover() {
    if (typeof gsap === "undefined") return;

    document.querySelectorAll(".graphic-card").forEach(card => {
        const shine = card.querySelector(".graphic-card__shine");
        if (!shine) return;

        card.addEventListener("mouseenter", () => {
            gsap.fromTo(
                shine,
                { right: "-60%" },
                { right: "130%", duration: 1, ease: "power2.inOut" }
            );
        });
    });
}

/* :::::::::::::::::::::::::: EXPANDABLE LISTS :::::::::::::::::::::::::: */
function initExpandableLists() {
    document.querySelectorAll("[data-toggle-list]").forEach(button => {
        const list = button.closest(".portfolio-list-section")?.querySelector("[data-expandable-list]");
        if (!list) return;

        const extraItems = Array.from(list.querySelectorAll(".extra-item"));

        if (!extraItems.length) {
            button.style.display = "none";
            return;
        }

        let visibleCount = 0;
        const batchSize = 5;

        button.addEventListener("click", () => {
            const remaining = extraItems.length - visibleCount;
            if (remaining <= 0) return;

            const itemsToShow = Math.min(batchSize, remaining);
            const batchItems = extraItems.slice(visibleCount, visibleCount + itemsToShow);
            const btnRect = button.getBoundingClientRect();
            const initialTop = btnRect.top + window.pageYOffset;

            batchItems.forEach(item => item.classList.add("is-visible"));
            visibleCount += itemsToShow;

            requestAnimationFrame(() => {
                const newTop = button.getBoundingClientRect().top + window.pageYOffset;
                const deltaY = initialTop - newTop;

                if (Math.abs(deltaY) > 0.5 && typeof gsap !== "undefined") {
                    gsap.set(button, { y: -deltaY });
                    gsap.to(button, { y: 0, duration: 0.55, ease: "power3.out" });
                }

                if (typeof gsap !== "undefined") {
                    batchItems.forEach((item, i) => {
                        gsap.set(item, { opacity: 0, y: 30, scale: 0.96, filter: "blur(4px)" });
                        gsap.to(item, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            filter: "blur(0px)",
                            duration: 0.65,
                            delay: i * 0.06,
                            ease: "power3.out",
                            onComplete: () => {
                                if (i === batchItems.length - 1 && typeof ScrollTrigger !== "undefined") {
                                    ScrollTrigger.refresh();
                                }
                            }
                        });
                    });
                }

                if (visibleCount >= extraItems.length) {
                    if (typeof gsap !== "undefined") {
                        gsap.to(button, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => button.style.display = "none"
                        });
                    } else {
                        button.style.display = "none";
                    }
                }
            });

            if (typeof ScrollTrigger !== "undefined") {
                setTimeout(() => ScrollTrigger.refresh(), 400);
            }
        });
    });
}

/* :::::::::::::::::::::::::: HASH ANCHOR SCROLL :::::::::::::::::::::::::: */
function initHashScroll() {
    const HEADER_OFFSET = 110;

    function smoothScrollTo(hash) {
        const target = document.querySelector(hash);
        if (!target) return;

        const top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;

        window.scrollTo({
            top,
            behavior: "smooth"
        });
    }

    if (window.location.hash) {
        setTimeout(() => {
            if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
            smoothScrollTo(window.location.hash);
        }, 450);
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const href = link.getAttribute("href");
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            history.pushState(null, "", href);

            if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
            smoothScrollTo(href);
        });
    });

    window.addEventListener("hashchange", () => {
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        setTimeout(() => smoothScrollTo(window.location.hash), 60);
    });
}

/* :::::::::::::::::::::::::: PROJECT STATUS FILTER :::::::::::::::::::::::::: */
function initProjectStatus() {
    document.querySelectorAll(".portfolio-list").forEach(list => {
        const rows = Array.from(list.querySelectorAll(".portfolio-row"));
        if (!rows.length) return;

        const hasMixedStatus = rows.some(r => r.dataset.status !== "done");

        // لیست‌های همه done (SEO و Web Design) رو دست نزن
        if (!hasMixedStatus) return;

        // ۱. حذف کامل پروژه‌های not-started از DOM
        list.querySelectorAll('.portfolio-row[data-status="not-started"]').forEach(el => {
            el.remove();
        });

        // ۲. in-progress ها رو قابل مشاهده کن (حذف هر extra-item اضافی)
        list.querySelectorAll('.portfolio-row[data-status="in-progress"]').forEach(el => {
            el.classList.remove("extra-item");
            el.classList.remove("is-visible");
        });

        // ۳. غیرفعال‌سازی لینک in-progress ها
        list.querySelectorAll('.portfolio-row[data-status="in-progress"]').forEach(el => {
            el.removeAttribute("href");
            el.setAttribute("aria-disabled", "true");
            el.setAttribute("tabindex", "-1");
            el.style.cursor = "default";
            el.addEventListener("click", e => e.preventDefault());
        });
    });
}
/* :::::::::::::::::::::::::: GLOW PULSE ANIMATION :::::::::::::::::::::::::: */
function initGlowPulse() {
    if (typeof gsap === "undefined") return;

    const glow = document.querySelector(".cta-glow");
    if (!glow) return;

    gsap.to(glow, {
        x: 28,
        y: 18,
        opacity: 0.8,
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });
}

/* :::::::::::::::::::::::::: INITIALIZATION :::::::::::::::::::::::::: */
document.addEventListener("DOMContentLoaded", () => {
    initProjectStatus(); 
    splitTextElements();
    initRevealAnimations();
    initProjectRowHover();
    initGraphicHover();
    initExpandableLists();
    initGlowPulse();
    initHashScroll(); 
});
