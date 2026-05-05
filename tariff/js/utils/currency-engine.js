/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-05
  *  Version: 1.0.0
  ****************************************************
*/

/* =========================== CURRENCY DETERMINATION ============================ */

/* :::::::::::::::::::::::::::::::::::::: IMPORTS :::::::::::::::::::::::::::::::::::::: */
import { currencyPolicy } from "../config/currency-policy.js";
import { detectCountry } from "./country-detector.js";
import { countryCurrency } from "../config/country-currency.js";

/* ------------------------- DETERMINE CURRENCY FUNCTION ------------------------- */
export function determineCurrency(locale) {
    // 1. User-selected currency from localStorage
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) return savedCurrency;

    const policy = currencyPolicy[locale];
    if (!policy) return "USD";

    // 2. Fixed currency mode
    if (policy.mode === "fixed") {
        return policy.currency;
    }

    // 3. Detect mode: country-based currency with fallback
    if (policy.mode === "detect") {
        const country = detectCountry();
        const currency = countryCurrency[country];
        return currency || policy.fallback;
    }

    // Default fallback
    return "USD";
}