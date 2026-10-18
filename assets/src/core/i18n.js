/* :::::::::::::::::::::::::: I18N — LANGUAGE UTILITIES :::::::::::::::::::::::::: */

const SUPPORTED_LANGS = ["fa", "en", "ar", "tr", "de", "it"];
const DEFAULT_LANG = "fa";
const LANG_FOLDERS = ["/en/", "/ar/", "/tr/", "/de/", "/it/"];

/* :::::::::::::::::::::::::: DETECT CURRENT LANGUAGE :::::::::::::::::::::::::: */
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

/* :::::::::::::::::::::::::: GET PAGE PATH (بدون پیشوند زبان) :::::::::::::::::::::::::: */
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

/* :::::::::::::::::::::::::: GET LANG BASE URL :::::::::::::::::::::::::: */
function getLangUrl(langCode) {
    if (langCode === "fa") return "/";
    return "/" + langCode + "/";
}

/* :::::::::::::::::::::::::: TRANSLATIONS :::::::::::::::::::::::::: */
const TRANSLATIONS = {

    /* :::::::::::::::::::::::::: PERSIAN :::::::::::::::::::::::::: */
    fa: {
        code: "fa",
        dir: "rtl",
        name: "فارسی",
        langDisplay: "| فارسی",

        menu: {
            home:      "صفحه اصلی",
            services:  "خدمات",
            about:     "درباره من",
            contact:   "تماس با من",
            tariff:    "تعرفه‌ها",
            portfolio: "نمونه کارها",
        },

        footer: {
            currencyTitle: "انتخاب ارز",
            usefulLinks:   "لینک‌های مفید",
            links: {
                login:      "ورود",
                blog:       "وبلاگ",
                tools:      "ابزارها",
                sitemap:    "نقشه سایت",
                downloadCV: "دانلود رزومه",
            },
            contactTitle: "ارتباط با من",
            copyright:    "© تمام حقوق محفوظ است.. ولی حال پیگیری ندارم، لطفاً خودتون رعایت کنید.",
            backToTop:    "بازگشت به بالا",
        },

        partners: {
            centerImg:    "/assets/images/logo-component/LogoComponentSlogan.webp",
            centerImgAlt: "نوشته گرافیکی «آن‌ها که انتخابم کردند» با طراحی دست‌نویس",
        },
    },

    /* :::::::::::::::::::::::::: ENGLISH :::::::::::::::::::::::::: */
    en: {
        code: "en",
        dir: "ltr",
        name: "English",
        langDisplay: "| English",

        menu: {
            home:      "Home",
            services:  "Services",
            about:     "About Me",
            contact:   "Contact Me",
            tariff:    "Pricing",
            portfolio: "Portfolio",
        },

        footer: {
            currencyTitle: "Select Currency",
            usefulLinks:   "Useful Links",
            links: {
                login:      "Login",
                blog:       "Blog",
                tools:      "Tools",
                sitemap:    "Sitemap",
                downloadCV: "Download CV",
            },
            contactTitle: "Contact Me",
            copyright:    "© All rights reserved... though honestly, I won't chase you. Kindly respect it.",
            backToTop:    "Back to top",
        },

        partners: {
            centerImg:    "/assets/images/logo-component/LogoComponentSloganEN.webp",
            centerImgAlt: "Those who chose me",
        },
    },

    /* :::::::::::::::::::::::::: ARABIC :::::::::::::::::::::::::: */
    ar: {
        code: "ar",
        dir: "rtl",
        name: "العربية",
        langDisplay: "| العربية",

        menu: {
            home:      "الرئيسية",
            services:  "الخدمات",
            about:     "من أنا",
            contact:   "تواصل معي",
            tariff:    "الأسعار",
            portfolio: "أعمالي",
        },

        footer: {
            currencyTitle: "اختيار العملة",
            usefulLinks:   "روابط مفيدة",
            links: {
                login:      "تسجيل الدخول",
                blog:       "المدونة",
                tools:      "الأدوات",
                sitemap:    "خريطة الموقع",
                downloadCV: "تحميل السيرة الذاتية",
            },
            contactTitle: "اتصل بي",
            copyright:    "© الحقوق كلها لي... بس أنا كسول وما بطارد، لو سمحتوا خليكم بأخلاقكم.",
            backToTop:    "العودة إلى الأعلى",
        },

        partners: {
            centerImg:    "/assets/images/logo-component/LogoComponentSloganAR.webp",
            centerImgAlt: "نص جرافيكي عملاء وثقوا بي بتصميم بخط اليد",
        },
    },

    /* :::::::::::::::::::::::::: TURKISH :::::::::::::::::::::::::: */
    tr: {
        code: "tr",
        dir: "ltr",
        name: "Türkçe",
        langDisplay: "| Türkçe",

        menu: {
            home:      "Ana Sayfa",
            services:  "Hizmetler",
            about:     "Hakkımda",
            contact:   "İletişim",
            tariff:    "Fiyatlar",
            portfolio: "Portfolyo",
        },

        footer: {
            currencyTitle: "Para Birimi Seç",
            usefulLinks:   "Faydalı Linkler",
            links: {
                login:      "Giriş",
                blog:       "Blog",
                tools:      "Araçlar",
                sitemap:    "Site Haritası",
                downloadCV: "CV İndir",
            },
            contactTitle: "İletişim",
            copyright:    "© Tüm hakları saklıdır... peşine düşecek hal bırakmadılar, rica etsem siz riayet edin.",
            backToTop:    "Başa dön",
        },

        partners: {
            centerImg:    "/assets/images/logo-component/LogoComponentSloganTR.webp",
            centerImgAlt: "El yazısı ile Beni seçenler",
        },
    },

    /* :::::::::::::::::::::::::: GERMAN :::::::::::::::::::::::::: */
    de: {
        code: "de",
        dir: "ltr",
        name: "Deutsch",
        langDisplay: "| Deutsch",

        menu: {
            home:      "Startseite",
            services:  "Leistungen",
            about:     "Über Mich",
            contact:   "Kontakt",
            tariff:    "Preise",
            portfolio: "Referenzen",
        },

        footer: {
            currencyTitle: "Währung wählen",
            usefulLinks:   "Nützliche Links",
            links: {
                login:      "Anmelden",
                blog:       "Blog",
                tools:      "Tools",
                sitemap:    "Sitemap",
                downloadCV: "Lebenslauf herunterladen",
            },
            contactTitle: "Kontakt",
            copyright:    "© Alle Rechte vorbehalten … aber ich habe ehrlich gesagt keine Lust, das zu verfolgen. Bitte seid einfach fair.",
            backToTop:    "Nach oben",
        },

        partners: {
            centerImg:    "/assets/images/logo-component/LogoComponentSloganDE.webp",
            centerImgAlt: "Handgezeichneter Text: Die mich gewählt haben",
        },
    },

    /* :::::::::::::::::::::::::: ITALIAN :::::::::::::::::::::::::: */
    it: {
        code: "it",
        dir: "ltr",
        name: "Italiano",
        langDisplay: "| Italiano",

        menu: {
            home:      "Home",
            services:  "Servizi",
            about:     "Chi Sono",
            contact:   "Contattami",
            tariff:    "Prezzi",
            portfolio: "Portfolio",
        },

        footer: {
            currencyTitle: "Scegli Valuta",
            usefulLinks:   "Link utili",
            links: {
                login:      "Accedi",
                blog:       "Blog",
                tools:      "Strumenti",
                sitemap:    "Mappa del sito",
                downloadCV: "Scarica il CV",
            },
            contactTitle: "Contattami",
            copyright:    "© Tutti i diritti riservati... ma non ho sbatta di far causa, quindi fate i bravi.",
            backToTop:    "Torna su",
        },

        partners: {
            centerImg:    "/assets/images/logo-component/LogoComponentSloganIT.webp",
            centerImgAlt: "Scritta grafica Si sono fidati di me con calligrafia manuale",
        },
    },

};

/* :::::::::::::::::::::::::: MENU LINK PATHS :::::::::::::::::::::::::: */
const MENU_PATHS = {
    home:      "",
    services:  "services/",
    about:     "about/",
    contact:   "contact/",
    tariff:    "tariff/",
    portfolio: "portfolio/",
};

/* :::::::::::::::::::::::::: HELPER — ترجمه :::::::::::::::::::::::::: */
function t(path) {
    const lang = detectLang();
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

    return path.split(".").reduce((acc, key) => acc?.[key], dict) ?? path;
}

/* :::::::::::::::::::::::::: GET MENU ITEMS برای زبان فعلی :::::::::::::::::::::::::: */
function getMenuItems() {
    const lang = detectLang();
    const baseUrl = getLangUrl(lang);
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

    return Object.keys(MENU_PATHS).map((key) => ({
        key:   key,
        label: dict.menu[key],
        href:  baseUrl + MENU_PATHS[key],
    }));
}

/* :::::::::::::::::::::::::: SET DOCUMENT DIR/LANG :::::::::::::::::::::::::: */
function applyDocumentLang() {
    const lang = detectLang();
    const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG];

    document.documentElement.setAttribute("dir", dict.dir);
    document.documentElement.setAttribute("lang", lang);
}

/* اجرای خودکار هنگام لود */
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