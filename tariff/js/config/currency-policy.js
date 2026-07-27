/* :::::::::::::::::::::::::: CURRENCY POLICY CONFIGURATION :::::::::::::::::::::::::: */
export const currencyPolicy = {
    /* :::::::::::::::::::::::::: FIXED CURRENCY POLICIES :::::::::::::::::::::::::: */
    tr: { mode: "fixed", currency: "TRY" },
    de: { mode: "fixed", currency: "EUR" },
    it: { mode: "fixed", currency: "EUR" },
    fa: { mode: "fixed", currency: "IRR" },

    /* :::::::::::::::::::::::::: DETECT CURRENCY POLICIES :::::::::::::::::::::::::: */
    en: { mode: "detect", fallback: "USD" },
    ar: { mode: "detect", fallback: "AED" }
};