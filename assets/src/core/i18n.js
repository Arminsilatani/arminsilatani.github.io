/* :::::::::::::::::::::::::: I18N CORE :::::::::::::::::::::::::: */

const SUPPORTED_LANGS = ["fa", "en", "ar", "tr", "de", "it"];
const DEFAULT_LANG = "fa";
const LANG_FOLDERS = ["/en/", "/ar/", "/tr/", "/de/", "/it/"];


/* :::::::::::::::::::::::::: LANGUAGE DETECTION :::::::::::::::::::::::::: */

function detectLang() {
    let path = window.location.pathname;

    const localRepoName = "/arminsilatani.github.io";
    if (path.startsWith(localRepoName)) {
        path = path.slice(localRepoName.length);
    }

    for (const folder of LANG_FOLDERS) {
        if (path.startsWith(folder)) {
            return folder.replace(/\//g, "");
        }
    }

    return DEFAULT_LANG;
}

function getPagePath() {
    let path = window.location.pathname;

    const localRepoName = "/arminsilatani.github.io";
    if (path.startsWith(localRepoName)) {
        path = path.slice(localRepoName.length);
    }

    for (const folder of LANG_FOLDERS) {
        if (path.startsWith(folder)) {
            path = path.slice(folder.length - 1);
            break;
        }
    }

    if (path.startsWith("/")) {
        path = path.slice(1);
    }

    return path;
}

function getLangUrl(langCode) {
    if (langCode === "fa") return "/";
    return "/" + langCode + "/";
}


/* :::::::::::::::::::::::::: TRANSLATIONS :::::::::::::::::::::::::: */

const TRANSLATIONS = {

    /* ------------------------------ FA ------------------------------ */
    fa: {
        code: "fa",
        dir: "rtl",
        name: "فارسی",
        langDisplay: "| فارسی",

        menu: {
            home: "صفحه اصلی",
            services: "خدمات",
            about: "درباره من",
            contact: "تماس با من",
            tariff: "تعرفه‌ها",
            portfolio: "نمونه کارها",
        },

        footer: {
            currencyTitle: "انتخاب ارز",
            usefulLinks: "لینک‌های مفید",
            links: {
                login: "ورود",
                blog: "وبلاگ",
                tools: "ابزارها",
                sitemap: "نقشه سایت",
                downloadCV: "دانلود رزومه",
            },
            contactTitle: "ارتباط با من",
            copyright: "© تمام حقوق محفوظ است.. ولی حال پیگیری ندارم، لطفاً خودتون رعایت کنید.",
            backToTop: "بازگشت به بالا",
        },

        partners: {
            centerImg: "/assets/images/logo-component/LogoComponentSlogan.webp",
            centerImgAlt: "نوشته گرافیکی «آن‌ها که انتخابم کردند» با طراحی دست‌نویس",
        },

        blog: {
            popularHeading: "پربازدیدترین مطالب {category}",
            latestHeading: "آخرین مطالب منتشر شده — {category}",
            comingSoon: "این مطلب در حال آماده‌سازی است",
            comingSoonExcerpt: "محتوای این مقاله در حال نگارش است.",
            comingSoonLabel: "در حال آماده‌سازی",
            prevPage: "صفحه قبل",
            nextPage: "صفحه بعد",
            pagesLabel: "صفحه‌های اسلایدر",
        },
    },

    /* ------------------------------ EN ------------------------------ */
    en: {
        code: "en",
        dir: "ltr",
        name: "English",
        langDisplay: "| English",

        menu: {
            home: "Home",
            services: "Services",
            about: "About Me",
            contact: "Contact Me",
            tariff: "Pricing",
            portfolio: "Portfolio",
        },

        footer: {
            currencyTitle: "Select Currency",
            usefulLinks: "Useful Links",
            links: {
                login: "Login",
                blog: "Blog",
                tools: "Tools",
                sitemap: "Sitemap",
                downloadCV: "Download CV",
            },
            contactTitle: "Contact Me",
            copyright: "© All rights reserved... though honestly, I won't chase you. Kindly respect it.",
            backToTop: "Back to top",
        },

        partners: {
            centerImg: "/assets/images/logo-component/LogoComponentSloganEN.webp",
            centerImgAlt: "Those who chose me",
        },

        blog: {
            popularHeading: "Most viewed {category} articles",
            latestHeading: "Latest published articles — {category}",
            comingSoon: "This article is being prepared",
            comingSoonExcerpt: "Content for this article is being written.",
            comingSoonLabel: "Coming soon",
            prevPage: "Previous page",
            nextPage: "Next page",
            pagesLabel: "Slider pages",
        },
    },

    /* ------------------------------ AR ------------------------------ */
    ar: {
        code: "ar",
        dir: "rtl",
        name: "العربية",
        langDisplay: "| العربية",

        menu: {
            home: "الرئيسية",
            services: "الخدمات",
            about: "من أنا",
            contact: "تواصل معي",
            tariff: "الأسعار",
            portfolio: "أعمالي",
        },

        footer: {
            currencyTitle: "اختيار العملة",
            usefulLinks: "روابط مفيدة",
            links: {
                login: "تسجيل الدخول",
                blog: "المدونة",
                tools: "الأدوات",
                sitemap: "خريطة الموقع",
                downloadCV: "تحميل السيرة الذاتية",
            },
            contactTitle: "اتصل بي",
            copyright: "© الحقوق كلها لي... بس أنا كسول وما بطارد، لو سمحتوا خليكم بأخلاقكم.",
            backToTop: "العودة إلى الأعلى",
        },

        partners: {
            centerImg: "/assets/images/logo-component/LogoComponentSloganAR.webp",
            centerImgAlt: "نص جرافيكي عملاء وثقوا بي بتصميم بخط اليد",
        },

        blog: {
            popularHeading: "أكثر مقالات {category} قراءةً",
            latestHeading: "أحدث المقالات المنشورة — {category}",
            comingSoon: "هذا المقال قيد الإعداد",
            comingSoonExcerpt: "محتوى هذا المقال قيد الكتابة.",
            comingSoonLabel: "قيد الإعداد",
            prevPage: "الصفحة السابقة",
            nextPage: "الصفحة التالية",
            pagesLabel: "صفحات العرض",
        },
    },

    /* ------------------------------ TR ------------------------------ */
    tr: {
        code: "tr",
        dir: "ltr",
        name: "Türkçe",
        langDisplay: "| Türkçe",

        menu: {
            home: "Ana Sayfa",
            services: "Hizmetler",
            about: "Hakkımda",
            contact: "İletişim",
            tariff: "Fiyatlar",
            portfolio: "Portfolyo",
        },

        footer: {
            currencyTitle: "Para Birimi Seç",
            usefulLinks: "Faydalı Linkler",
            links: {
                login: "Giriş",
                blog: "Blog",
                tools: "Araçlar",
                sitemap: "Site Haritası",
                downloadCV: "CV İndir",
            },
            contactTitle: "İletişim",
            copyright: "© Tüm hakları saklıdır... peşine düşecek hal bırakmadılar, rica etsem siz riayet edin.",
            backToTop: "Başa dön",
        },

        partners: {
            centerImg: "/assets/images/logo-component/LogoComponentSloganTR.webp",
            centerImgAlt: "El yazısı ile Beni seçenler",
        },

        blog: {
            popularHeading: "En çok okunan {category} yazıları",
            latestHeading: "Son yayınlanan yazılar — {category}",
            comingSoon: "Bu makale hazırlanıyor",
            comingSoonExcerpt: "Bu makalenin içeriği yazılıyor.",
            comingSoonLabel: "Hazırlanıyor",
            prevPage: "Önceki sayfa",
            nextPage: "Sonraki sayfa",
            pagesLabel: "Slayt sayfaları",
        },
    },

    /* ------------------------------ DE ------------------------------ */
    de: {
        code: "de",
        dir: "ltr",
        name: "Deutsch",
        langDisplay: "| Deutsch",

        menu: {
            home: "Startseite",
            services: "Leistungen",
            about: "Über Mich",
            contact: "Kontakt",
            tariff: "Preise",
            portfolio: "Referenzen",
        },

        footer: {
            currencyTitle: "Währung wählen",
            usefulLinks: "Nützliche Links",
            links: {
                login: "Anmelden",
                blog: "Blog",
                tools: "Tools",
                sitemap: "Sitemap",
                downloadCV: "Lebenslauf herunterladen",
            },
            contactTitle: "Kontakt",
            copyright: "© Alle Rechte vorbehalten … aber ich habe ehrlich gesagt keine Lust, das zu verfolgen. Bitte seid einfach fair.",
            backToTop: "Nach oben",
        },

        partners: {
            centerImg: "/assets/images/logo-component/LogoComponentSloganDE.webp",
            centerImgAlt: "Handgezeichneter Text: Die mich gewählt haben",
        },

        blog: {
            popularHeading: "Meistgelesene {category}-Artikel",
            latestHeading: "Zuletzt veröffentlichte Artikel — {category}",
            comingSoon: "Dieser Artikel wird vorbereitet",
            comingSoonExcerpt: "Der Inhalt dieses Artikels wird gerade geschrieben.",
            comingSoonLabel: "In Vorbereitung",
            prevPage: "Vorherige Seite",
            nextPage: "Nächste Seite",
            pagesLabel: "Slider-Seiten",
        },
    },

    /* ------------------------------ IT ------------------------------ */
    it: {
        code: "it",
        dir: "ltr",
        name: "Italiano",
        langDisplay: "| Italiano",

        menu: {
            home: "Home",
            services: "Servizi",
            about: "Chi Sono",
            contact: "Contattami",
            tariff: "Prezzi",
            portfolio: "Portfolio",
        },

        footer: {
            currencyTitle: "Scegli Valuta",
            usefulLinks: "Link utili",
            links: {
                login: "Accedi",
                blog: "Blog",
                tools: "Strumenti",
                sitemap: "Mappa del sito",
                downloadCV: "Scarica il CV",
            },
            contactTitle: "Contattami",
            copyright: "© Tutti i diritti riservati... ma non ho sbatta di far causa, quindi fate i bravi.",
            backToTop: "Torna su",
        },

        partners: {
            centerImg: "/assets/images/logo-component/LogoComponentSloganIT.webp",
            centerImgAlt: "Scritta grafica Si sono fidati di me con calligrafia manuale",
        },

        blog: {
            popularHeading: "Articoli {category} più letti",
            latestHeading: "Ultimi articoli pubblicati — {category}",
            comingSoon: "Questo articolo è in preparazione",
            comingSoonExcerpt: "Il contenuto di questo articolo è in fase di scrittura.",
            comingSoonLabel: "In preparazione",
            prevPage: "Pagina precedente",
            nextPage: "Pagina successiva",
            pagesLabel: "Pagine dello slider",
        },
    },
};


/* :::::::::::::::::::::::::: MENU :::::::::::::::::::::::::: */

const MENU_PATHS = {
    home: "",
    services: "services/",
    about: "about/",
    contact: "contact/",
    tariff: "tariff/",
    portfolio: "portfolio/",
};


/* :::::::::::::::::::::::::: TRANSLATE FUNCTION :::::::::::::::::::::::::: */

function t(path, vars = {}) {
    const lang = detectLang();
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

    let str = path.split(".").reduce((acc, key) => acc?.[key], dict) ?? path;

    if (typeof str === "string") {
        str = str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
    }
    return str;
}


/* :::::::::::::::::::::::::: MENU ITEMS :::::::::::::::::::::::::: */

function getMenuItems() {
    const lang = detectLang();
    const baseUrl = getLangUrl(lang);
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

    return Object.keys(MENU_PATHS).map((key) => ({
        key: key,
        label: dict.menu[key],
        href: baseUrl + MENU_PATHS[key],
    }));
}


/* :::::::::::::::::::::::::: DOCUMENT LANG :::::::::::::::::::::::::: */

function applyDocumentLang() {
    const lang = detectLang();
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

    document.documentElement.setAttribute("dir", dict.dir);
    document.documentElement.setAttribute("lang", lang);
}

applyDocumentLang();


/* :::::::::::::::::::::::::: EXPORT :::::::::::::::::::::::::: */

window.i18n = {
    detectLang,
    getPagePath,
    getLangUrl,
    getMenuItems,
    applyDocumentLang,
    t,
    TRANSLATIONS,
    SUPPORTED_LANGS,
    DEFAULT_LANG,
    LANG_FOLDERS,
};