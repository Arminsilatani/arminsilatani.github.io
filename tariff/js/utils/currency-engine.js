/* :::::::::::::::::::::::::: SCRIPTS & ANALYTICS :::::::::::::::::::::::::: */

import { currencyPolicy } from "../config/currency-policy.js";
import { detectCountry } from "./country-detector.js";
import { countryCurrency } from "../config/country-currency.js";

export function determineCurrency(locale) {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) return savedCurrency;

    const policy = currencyPolicy[locale];
    if (!policy) return "USD";

    if (policy.mode === "fixed") {
        return policy.currency;
    }

    if (policy.mode === "detect") {
        const country = detectCountry();
        const currency = countryCurrency[country];
        return currency || policy.fallback;
    }

    return "USD";
}