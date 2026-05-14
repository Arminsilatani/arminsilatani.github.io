/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-14
  *  Version: 1.0.1
  ****************************************************
*/

/* =========================== PRICE CALCULATOR ============================ */

import { basePricesUSD } from './data/prices.js';
import { getExchangeRates } from './services/exchange-rates.js';
import { determineCurrency } from "./utils/currency-engine.js";

/* :::::::::::::::::::::::::: GLOBAL STATE :::::::::::::::::::::::::: */

let exchangeRates = {};
let selectedServices = [];
let currentDisplayedTotal = 0;
let currentCurrencyCode = localStorage.getItem("selectedCurrency") || determineCurrency(document.documentElement.lang || "en");
let groupUpdating = false;

/* ------------------------- UTILITY FUNCTIONS ------------------------- */

function formatCurrency(amount, currencyCode) {
  const formatConfig = {
    'IRR': { locale: 'fa-IR', options: { style: 'decimal' }, suffix: ' تومان' },
    'USD': { locale: 'en-US', options: { style: 'currency', currency: 'USD' } },
    'EUR': { locale: 'de-DE', options: { style: 'currency', currency: 'EUR' } },
    'AED': { locale: 'ar-AE', options: { style: 'decimal' }, suffix: ' درهم' }
  };

  const config = formatConfig[currencyCode];
  if (!config) return `${new Intl.NumberFormat().format(amount)} ${currencyCode}`;

  if (config.suffix)
    return `${new Intl.NumberFormat(config.locale).format(amount)}${config.suffix}`;

  return new Intl.NumberFormat(config.locale, config.options).format(amount);
}

function animateValue(element, start, end, duration, currencyCode) {
  if (element.animationFrameId) {
    cancelAnimationFrame(element.animationFrameId);
  }

  let startTimestamp = null;
  const step = (ts) => {
    if (!startTimestamp) startTimestamp = ts;
    const progress = Math.min((ts - startTimestamp) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(ease * (end - start) + start);

    element.textContent = formatCurrency(current, currencyCode);

    if (progress < 1) {
      element.animationFrameId = requestAnimationFrame(step);
    } else {
      element.textContent = formatCurrency(end, currencyCode);
      element.animationFrameId = null;
    }
  };
  element.animationFrameId = requestAnimationFrame(step);
}

/* ------------------------- PRICE UPDATE HELPERS ------------------------- */

function updateBoxPrices(currency, rates) {
  const rate = rates[currency] || 1;
  document.querySelectorAll('.sub-item').forEach(item => {
    const display = item.querySelector('.price-display');
    const cb = item.querySelector('.service-checkbox');
    if (!display || !cb) return;

    const base = basePricesUSD?.[cb.dataset.category]?.[cb.dataset.plan];
    if (typeof base !== 'number') return;

    const qty = parseInt(item.dataset.qty || "1", 10);
    display.textContent = formatCurrency(Math.round(base * qty * rate), currency);
  });
}

function updateExistingInvoiceItemsPrices(currency, rates) {
  const rate = rates[currency] || 1;
  selectedServices.forEach(service => {
    const id = `invoice-item-${service.category}-${service.plan}`.replace(/\s+/g, '-');
    const row = document.getElementById(id);
    if (!row) return;

    row.querySelector('.item-price').textContent =
      formatCurrency(Math.round(service.basePrice * rate), currency);
  });
}

function recalculateInvoiceTotal(currency, rates) {
  const rate = rates[currency] || 1;
  const totalUSD = selectedServices.reduce((a, s) => a + s.basePrice, 0);
  const converted = Math.round(totalUSD * rate);

  const totalEl = document.getElementById('invoice-total-amount');
  if (totalEl) {
    animateValue(totalEl, currentDisplayedTotal, converted, 800, currency);
    currentDisplayedTotal = converted;
  }

  const invoice = document.getElementById('final-invoice-section');
  if (invoice) invoice.classList.toggle('show-invoice', selectedServices.length > 0);
}

function buildInvoiceRow(name, basePrice, colorClass, rate, currency, category, plan) {
  const safeId = `invoice-item-${category}-${plan}`.replace(/\s+/g, '-');
  const li = document.createElement('li');
  li.className = `invoice-item entering ${colorClass}`;
  li.id = safeId;

  li.innerHTML = `
    <div class="item-name">
      <div class="scrolling-text-container">
        <div class="scrolling-text-inner">${name}</div>
      </div>
    </div>
    <span class="item-price">
      ${formatCurrency(Math.round(basePrice * rate), currency)}
    </span>
  `;

  // Trigger scrolling animation if text overflows
  setTimeout(() => {
    const textInner = li.querySelector('.scrolling-text-inner');
    const container = li.querySelector('.scrolling-text-container');
    if (textInner && container && textInner.scrollWidth > container.clientWidth) {
      const overflowWidth = textInner.scrollWidth - container.clientWidth;
      textInner.style.setProperty('--overflow-amount', `${overflowWidth}px`);
      textInner.classList.add('sliding-text');
    }
  }, 50);

  return li;
}

/**
 * Determines the color class for an invoice item based on label container classes.
 * Falls back to 'bullet-green' if no specific color class is detected.
 */
function getColorClassFromLabel(label) {
  if (
    label.classList.contains("yellow-checkbox-container") ||
    label.classList.contains("yellow-checkbox-checked-container")
  ) {
    return "bullet-yellow";
  }
  if (
    label.classList.contains("white-checkbox-container") ||
    label.classList.contains("white-checkbox-checked-container")
  ) {
    return "bullet-white";
  }
  return "bullet-green";
}

/* ------------------------- EVENT HANDLERS & INITIALIZATION ------------------------- */

window.addEventListener("currency-change", async (event) => {
  const newCurrency = event.detail.currency;
  currentCurrencyCode = newCurrency;

  try {
    exchangeRates = await getExchangeRates();
    updateBoxPrices(newCurrency, exchangeRates);
    updateExistingInvoiceItemsPrices(newCurrency, exchangeRates);
    recalculateInvoiceTotal(newCurrency, exchangeRates);
  } catch (error) {
    console.error("Failed to update prices after currency change:", error);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const checkboxes = document.querySelectorAll('.service-checkbox');
  const listContainer = document.getElementById('invoice-items-list');

  // Fetch initial exchange rates
  try {
    exchangeRates = await getExchangeRates();
    updateBoxPrices(currentCurrencyCode, exchangeRates);
  } catch (e) {
    console.error("Fatal: cannot fetch exchange rates.", e);
    return;
  }

  // ---------- Checkbox handling ----------
  checkboxes.forEach(box => {
    box.addEventListener("change", () => {
      const subItem = box.closest(".sub-item");
      if (subItem && subItem.offsetWidth === 0 && subItem.offsetHeight === 0) return;

      // Group synchronization (multiple checkboxes with the same data-group)
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
      let name = "نامشخص";
      const label = box.closest("label");
      if (label) {
        const span = label.querySelector('span[class*="-label"], .item-name');
        name = span ? span.textContent.trim() : label.textContent.trim();
        name = name.replace(/\s+/g, ' ').replace(/^(\d+)(?=[^\s])/, '$1 ');
      }

      const unitPrice = basePricesUSD?.[category]?.[plan];
      if (typeof unitPrice !== "number") return;

      const qty = parseInt(subItem.dataset.qty || "1", 10);
      const basePrice = unitPrice * qty;

      const rate = exchangeRates[currentCurrencyCode] || 1;
      const safeId = `invoice-item-${category}-${plan}`.replace(/\s+/g, '-');
      const existing = document.getElementById(safeId);

      if (box.checked) {
        // Remove existing item with same id and update selectedServices
        if (existing) existing.remove();
        selectedServices = selectedServices.filter(s => !(s.category === category && s.plan === plan));
        selectedServices.push({ category, plan, name, basePrice });

        const colorClass = getColorClassFromLabel(label);
        const row = buildInvoiceRow(name, basePrice, colorClass, rate, currentCurrencyCode, category, plan);
        if (listContainer) listContainer.appendChild(row);
      } else {
        selectedServices = selectedServices.filter(s => !(s.category === category && s.plan === plan));
        if (existing) {
          existing.classList.add("leaving");
          existing.addEventListener("animationend", () => existing.remove(), { once: true });
        }
      }
      recalculateInvoiceTotal(currentCurrencyCode, exchangeRates);
    });
  });

  // ---------- Quantity buttons ----------
  document.querySelectorAll('.sub-item').forEach(item => {
    const minusBtn = item.querySelector('.qty-minus');
    const plusBtn = item.querySelector('.qty-plus');
    const qtyText = item.querySelector('.qty-text');
    const checkbox = item.querySelector('.service-checkbox');
    const priceDisplay = item.querySelector('.price-display');

    if (!minusBtn || !plusBtn) return;

    // Shared quantity update logic for both plus and minus buttons
    function updateItemQty(newQty) {
      const oldQty = parseInt(item.dataset.qty || "1", 10);
      item.dataset.qty = newQty;
      if (qtyText) qtyText.textContent = newQty;

      if (checkbox && priceDisplay) {
        const unitPrice = basePricesUSD?.[checkbox.dataset.category]?.[checkbox.dataset.plan];
        if (typeof unitPrice === 'number') {
          const rate = exchangeRates[currentCurrencyCode] || 1;
          const oldPrice = Math.round(unitPrice * oldQty * rate);
          const newPrice = Math.round(unitPrice * newQty * rate);
          animateValue(priceDisplay, oldPrice, newPrice, 400, currentCurrencyCode);
        }
      }

      // If the checkbox is checked, trigger change to update invoice totals
      if (checkbox && checkbox.checked) {
        checkbox.dispatchEvent(new Event("change"));
      }
    }

    minusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let qty = parseInt(item.dataset.qty || "1", 10);
      if (qty > 1) {
        updateItemQty(qty - 1);
      }
    });

    plusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      let qty = parseInt(item.dataset.qty || "1", 10);
      updateItemQty(qty + 1);
    });
  });

  // ---------- Hover effect for service sections ----------
  document.querySelectorAll(".service-section:not(.final-cart-section)").forEach(section => {
    const header = section.querySelector(".service-header h3");
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
  });
});