// price-calculator.js

console.log("PRICE CALCULATOR LOADED - V3 (Integrated Colors & Fixes)");

import { basePricesUSD } from './data/prices.js';
import { getExchangeRates } from './services/exchange-rates.js';
import { determineCurrency } from "./utils/currency-engine.js";

// --- State Management ---
const locale = document.documentElement.lang || "en";
let selectedServices = [];
let currentDisplayedTotal = 0;
let currentCurrencyCode = '';
let groupUpdating = false;

// ---------- Formatter & Animation ----------
function formatCurrency(amount, currencyCode) {
    const formatConfig = {
        'TOMAN': { locale: 'fa-IR', options: { style: 'decimal' }, suffix: ' تومان' },
        'USD':   { locale: 'en-US', options: { style: 'currency', currency: 'USD' } },
        'EUR':   { locale: 'de-DE', options: { style: 'currency', currency: 'EUR' } },
        'AED':   { locale: 'ar-AE', options: { style: 'decimal' }, suffix: ' درهم' }
    };
    const config = formatConfig[currencyCode];
    if (!config) return `${new Intl.NumberFormat().format(amount)} ${currencyCode}`;

    if (config.suffix) return `${new Intl.NumberFormat(config.locale).format(amount)}${config.suffix}`;
    return new Intl.NumberFormat(config.locale, config.options).format(amount);
}

function animateValue(element, start, end, duration, currencyCode) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    const currentVal = Math.floor(easeProgress * (end - start) + start);
    
    element.textContent = formatCurrency(currentVal, currencyCode);
    if (progress < 1) window.requestAnimationFrame(step);
    else element.textContent = formatCurrency(end, currencyCode);
  };
  window.requestAnimationFrame(step);
}

// ---------- UI Update Functions ----------
function updateBoxPrices(selectedCurrency, rates) {
  const rate = rates[selectedCurrency] || 1;
  document.querySelectorAll('.price-display').forEach(el => {
    const category = el.parentElement.querySelector('.service-checkbox')?.getAttribute('data-category');
    const plan = el.parentElement.querySelector('.service-checkbox')?.getAttribute('data-plan');
    const basePrice = basePricesUSD?.[category]?.[plan];

    if (typeof basePrice === 'number') {
        el.textContent = formatCurrency(Math.round(basePrice * rate), selectedCurrency);
    }
  });
}

function updateExistingInvoiceItemsPrices(selectedCurrency, rates) {
  const rate = rates[selectedCurrency] || 1;
  selectedServices.forEach(service => {
    const safeId = `invoice-item-${service.category}-${service.plan}`.replace(/\s+/g, '-');
    const row = document.getElementById(safeId);
    if (!row) return;
    row.querySelector('.item-price').textContent = formatCurrency(Math.round(service.basePrice * rate), selectedCurrency);
  });
}

function recalculateInvoiceTotal(selectedCurrency, rates) {
  const rate = rates[selectedCurrency] || 1;
  const totalBaseUsd = selectedServices.reduce((total, service) => total + service.basePrice, 0);
  const convertedTotal = Math.round(totalBaseUsd * rate);
  const mainTotal = document.getElementById('invoice-total-amount');

  if (mainTotal) {
    if (currentCurrencyCode !== selectedCurrency) {
      currentDisplayedTotal = 0;
      currentCurrencyCode = selectedCurrency;
    }
    animateValue(mainTotal, currentDisplayedTotal, convertedTotal, 800, selectedCurrency);
    currentDisplayedTotal = convertedTotal;
  }

  const invoiceSection = document.getElementById('final-invoice-section');
  if (invoiceSection) invoiceSection.classList.toggle('show-invoice', selectedServices.length > 0);
}

// ---------- Initialization ----------
document.addEventListener("DOMContentLoaded", async () => {
  const currencySelect = document.getElementById('currency-select');
  const checkboxes = document.querySelectorAll('.service-checkbox');
  const listContainer = document.getElementById('invoice-items-list');

  let exchangeRates;
  try {
    exchangeRates = await getExchangeRates();
  } catch (error) {
    console.error("FATAL: Could not fetch initial exchange rates.", error);
    return;
  }

  // Set Default Currency
  if (currencySelect) {
      const initialCurrency = determineCurrency(locale);
      currencySelect.value = initialCurrency;
      currentCurrencyCode = initialCurrency;
      updateBoxPrices(initialCurrency, exchangeRates);

      currencySelect.addEventListener('change', async (e) => {
        const newCurrency = e.target.value;
        localStorage.setItem("selectedCurrency", newCurrency);
        try {
          const currentRates = await getExchangeRates();
          updateBoxPrices(newCurrency, currentRates);
          updateExistingInvoiceItemsPrices(newCurrency, currentRates);
          recalculateInvoiceTotal(newCurrency, currentRates);
        } catch (error) {
          console.error("Failed to update prices:", error);
        }
      });
  }

  // Checkbox Event Listeners
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      
      const box = e.target;
      const subItem = box.closest(".sub-item");

      // جلوگیری از شلیک رویداد برای چک‌باکس‌های مخفی
      if (subItem && subItem.offsetWidth === 0 && subItem.offsetHeight === 0) return;

      // ----- GROUP CHECKBOX LOGIC -----
      if (!groupUpdating && box.dataset.group) {
        const group = box.dataset.group;
        const groupItems = document.querySelectorAll(`.service-checkbox[data-group="${group}"]`);

        groupUpdating = true;
        groupItems.forEach(cb => {
          if (cb !== box) {
            cb.checked = box.checked;
            cb.dispatchEvent(new Event("change", { bubbles: true }));
          }
        });
        groupUpdating = false;
      }

      const { category, plan } = box.dataset;

      // استخراج نام سرویس
      let name = "نامشخص";
      const labelEl = box.closest('label');
      if (labelEl) {
          const nameSpan = labelEl.querySelector('span[class*="-label"], .item-name');
          name = nameSpan ? nameSpan.textContent.trim() : labelEl.textContent.trim();
      }

      const basePrice = basePricesUSD?.[category]?.[plan];
      if (typeof basePrice !== 'number') return;

      const currency = currencySelect.value;
      const rate = exchangeRates[currency] || 1;
      const safeId = `invoice-item-${category}-${plan}`.replace(/\s+/g, '-');
      let existingRow = document.getElementById(safeId);

      if (box.checked) {
        if (existingRow) existingRow.remove();

        selectedServices = selectedServices.filter(s => !(s.category === category && s.plan === plan));
        selectedServices.push({ category, plan, name, basePrice });

        recalculateInvoiceTotal(currency, exchangeRates);

        // -------------------------------
        // *** تشخیص رنگ صحیح و کامل ***
        // -------------------------------
        const checkboxContainer = subItem.querySelector("label");
        let colorClass = "bullet-green";

        if (checkboxContainer.classList.contains("yellow-checkbox-checked-container")) {
            colorClass = "bullet-yellow";
        } 
        else if (checkboxContainer.classList.contains("white-checkbox-container")) {
            colorClass = "bullet-white";
        }
        // سبز نیازی به شرط ندارد

        const row = document.createElement('li');
        row.className = `invoice-item entering ${colorClass}`;
        row.id = safeId;
        row.innerHTML =
          `<span class="item-name">${name}</span>
           <span class="item-price">${formatCurrency(Math.round(basePrice * rate), currency)}</span>`;

        if (listContainer) {
          listContainer.appendChild(row);
          row.addEventListener('animationend', (event) => {
            if (event.animationName === 'slideDownItem') {
                row.classList.remove('entering');
                row.classList.add('visible');
            }
          }, { once: true });
        }
      } else {
        selectedServices = selectedServices.filter(s => !(s.category === category && s.plan === plan));
        recalculateInvoiceTotal(currency, exchangeRates);

        if (existingRow) {
          existingRow.classList.remove('visible', 'entering');
          existingRow.classList.add('leaving');
          existingRow.addEventListener('animationend', (event) => {
            if (event.animationName === 'slideUpItem') existingRow.remove();
          }, { once: true });
        }
      }
    });
  });

  // Hover & Pin Effects
  document.querySelectorAll(".service-section:not(.final-cart-section)").forEach(section => {
    const header = section.querySelector(".service-header h3");
    const pinBtn = section.querySelector(".pin-btn");

    if (header) {
      header.addEventListener("mouseenter", () => {
        document.querySelectorAll(".service-section:not(.final-cart-section)").forEach(s => {
          if (!s.classList.contains("pinned") && s !== section) s.classList.remove("active");
        });
        section.classList.add("active");
      });
    }

    section.addEventListener("mouseleave", () => {
      if (!section.classList.contains("pinned")) section.classList.remove("active");
    });

    if (pinBtn) {
      pinBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        section.classList.toggle("pinned");
      });
    }
  });
});
