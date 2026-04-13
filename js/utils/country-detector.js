export function detectCountry() {

    const locale = navigator.language || "";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    // language based detection
    if (locale.includes("tr")) return "TR";
    if (locale.includes("de")) return "DE";
    if (locale.includes("it")) return "IT";
    if (locale.includes("fa")) return "IR";

    if (locale.includes("ar")) {

        if (timezone.includes("Dubai")) return "AE";
        if (timezone.includes("Riyadh")) return "SA";
        if (timezone.includes("Qatar")) return "QA";
        if (timezone.includes("Kuwait")) return "KW";

        return "AE";
    }

    if (locale.includes("en")) {

        if (timezone.includes("London")) return "GB";
        if (timezone.includes("New_York")) return "US";
        if (timezone.includes("Chicago")) return "US";
        if (timezone.includes("Toronto")) return "CA";
        if (timezone.includes("Sydney")) return "AU";

        return "US";
    }

    return "US";
}
