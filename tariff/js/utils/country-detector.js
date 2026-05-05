/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-05
  *  Version: 1.0.0
  ****************************************************
*/

/* ------------------------- COUNTRY DETECTION ------------------------- */

export function detectCountry() {
    const locale = navigator.language || "";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    // Direct language-to-country mappings
    if (locale.includes("tr")) return "TR";
    if (locale.includes("de")) return "DE";
    if (locale.includes("it")) return "IT";
    if (locale.includes("fa")) return "IR";

    // Arabic language region
    if (locale.includes("ar")) {
        if (timezone.includes("Dubai")) return "AE";
        if (timezone.includes("Riyadh")) return "SA";
        if (timezone.includes("Qatar")) return "QA";
        if (timezone.includes("Kuwait")) return "KW";
        return "AE";
    }

    // English language region
    if (locale.includes("en")) {
        if (timezone.includes("London")) return "GB";
        if (timezone.includes("New_York")) return "US";
        if (timezone.includes("Chicago")) return "US";
        if (timezone.includes("Toronto")) return "CA";
        if (timezone.includes("Sydney")) return "AU";
        return "US";
    }

    // Fallback
    return "US";
}