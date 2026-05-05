/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-05
  *  Version: 1.0.0
  ****************************************************
*/

/* =========================== EXCHANGE RATES MODULE =========================== */

// ---------- Configuration ----------
const CACHE_KEY       = "exchangeRates";
const CACHE_TIMESTAMP = "ratesTimestamp";
const CACHE_TIME      = 0; // seconds (0 = always fetch fresh data)

// ---------- Mock Data Fetch ----------
export async function fetchExchangeRatesMock() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        USD: 1,
        EUR: 0.8547,
        IRR: 90000,
        TRY: 45.21,
        AED: 3.638
      });
    }, 500);
  });
}

// ---------- Cache‑Aware Exchange Rates ----------
export async function getExchangeRates() {
  // Attempt to read from localStorage
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
    // If reading fails, clear potentially corrupted cache
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP);
  }

  // Fetch fresh data and update cache
  const rates = await fetchExchangeRatesMock();

  localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
  localStorage.setItem(CACHE_TIMESTAMP, Date.now().toString());

  return rates;
}