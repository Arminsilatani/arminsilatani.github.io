/* :::::::::::::::::::::::::: CONSTANTS / CONFIG :::::::::::::::::::::::::: */
const CACHE_KEY       = "exchangeRates";
const CACHE_TIMESTAMP = "ratesTimestamp";
const CACHE_TIME      = 0;

/* :::::::::::::::::::::::::: MOCK DATA FETCH :::::::::::::::::::::::::: */
export async function fetchExchangeRatesMock() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                USD: 1,
                EUR: 0.88,
                IRR: 115000,
                TRY: 48.83,
                AED: 3.638
            });
        }, 500);
    });
}

/* :::::::::::::::::::::::::: CACHE-AWARE EXCHANGE RATES :::::::::::::::::::::::::: */
export async function getExchangeRates() {
    try {
        const cachedRates = localStorage.getItem(CACHE_KEY);
        const timestamp    = localStorage.getItem(CACHE_TIMESTAMP);

        if (cachedRates && timestamp) {
            const age = Date.now() - parseInt(timestamp, 10);
            if (age < CACHE_TIME) {
                return JSON.parse(cachedRates);
            }
        }
    } catch (e) {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP);
    }

    const rates = await fetchExchangeRatesMock();

    localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
    localStorage.setItem(CACHE_TIMESTAMP, Date.now().toString());

    return rates;
}