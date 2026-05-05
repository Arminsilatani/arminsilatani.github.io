/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-05
  *  Version: 1.0.0
  ****************************************************
*/

/* =========================== CURRENCY POLICY CONFIGURATION ============================ */

/* ------------------------- FIXED CURRENCY POLICIES ------------------------- */
export const currencyPolicy = {
    tr: { mode: "fixed", currency: "TRY" },
    de: { mode: "fixed", currency: "EUR" },
    it: { mode: "fixed", currency: "EUR" },
    fa: { mode: "fixed", currency: "IRR" },

    /* ------------------------- DETECT CURRENCY POLICIES ------------------------- */
    en: { mode: "detect", fallback: "USD" },
    ar: { mode: "detect", fallback: "AED" }
};