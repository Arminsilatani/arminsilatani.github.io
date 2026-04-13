import { currencyPolicy } from "../config/currency-policy.js";
import { detectCountry } from "./country-detector.js";
import { countryCurrency } from "../config/country-currency.js";

export function determineCurrency(locale) {

    // 1 user selected currency
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) return savedCurrency;

    const policy = currencyPolicy[locale];

    if (!policy) return "USD";

    // 2 fixed currencies
    if (policy.mode === "fixed") {
        return policy.currency;
    }

    // 3 detect mode
    if (policy.mode === "detect") {

        const country = detectCountry();
        const currency = countryCurrency[country];

        return currency || policy.fallback;
    }

    return "USD";
}
