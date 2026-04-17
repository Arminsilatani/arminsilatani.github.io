export const currencyPolicy = {
    tr: { mode: "fixed", currency: "TRY" },
    de: { mode: "fixed", currency: "EUR" },
    it: { mode: "fixed", currency: "EUR" },
    fa: { mode: "fixed", currency: "IRR" },

    en: { mode: "detect", fallback: "USD" },
    ar: { mode: "detect", fallback: "AED" }
};
