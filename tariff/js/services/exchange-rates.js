const CACHE_KEY = "exchangeRates";
const CACHE_TIME = 0;

export async function fetchExchangeRatesMock() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        USD: 1,
        EUR: 0.92,
        IRR: 80000,
        TRY: 32,
        AED: 3.67
      });
    }, 500);
  });
}

export async function getExchangeRates() {

  try {

    const cachedRates = localStorage.getItem(CACHE_KEY);
    const cacheTimestamp = localStorage.getItem("ratesTimestamp");

    if (cachedRates && cacheTimestamp) {

      const age = Date.now() - parseInt(cacheTimestamp);

      if (age < CACHE_TIME) {
        return JSON.parse(cachedRates);
      }

    }

  } catch (e) {

    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem("ratesTimestamp");

  }

  const rates = await fetchExchangeRatesMock();

  localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
  localStorage.setItem("ratesTimestamp", Date.now());

  return rates;

}
