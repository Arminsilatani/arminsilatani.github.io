/* price-calculator.js - Refactored V5 (Clean, Fixed DOM Structure) */

console.log("PRICE CALCULATOR LOADED - V5 (Refactored & FIXED)");

import { basePricesUSD } from './data/prices.js';
import { getExchangeRates } from './services/exchange-rates.js';
import { determineCurrency } from "./utils/currency-engine.js";

const locale = document.documentElement.lang || "en";
let selectedServices = [];
let currentDisplayedTotal = 0;
let currentCurrencyCode = '';
let groupUpdating = false;

/* ---------------------------------------------------------
   Currency Formatter
--------------------------------------------------------- */
function formatCurrency(amount, currencyCode) {
    const formatConfig = {
        'TOMAN': { locale: 'fa-IR', options: { style: 'decimal' }, suffix: ' تومان' },
        'USD':   { locale: 'en-US', options: { style: 'currency', currency: 'USD' } },
        'EUR':   { locale: 'de-DE', options: { style: 'currency', currency: 'EUR' } },
        'AED':   { locale: 'ar-AE', options: { style: 'decimal' }, suffix: ' درهم' }
    };

    const config = formatConfig[currencyCode];
    if (!config) return `${new Intl.NumberFormat().format(amount)} ${currencyCode}`;

    if (config.suffix)
        return `${new Intl.NumberFormat(config.locale).format(amount)}${config.suffix}`;

    return new Intl.NumberFormat(config.locale, config.options).format(amount);
}

/* ---------------------------------------------------------
   Animated Price Counter
--------------------------------------------------------- */
function animateValue(element, start, end, duration, currencyCode) {
    let startTimestamp = null;

    const step = (ts) => {
        if (!startTimestamp) startTimestamp = ts;
        const progress = Math.min((ts - startTimestamp) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(ease * (end - start) + start);

        element.textContent = formatCurrency(current, currencyCode);
        if (progress < 1) requestAnimationFrame(step);
        else element.textContent = formatCurrency(end, currencyCode);
    };

    requestAnimationFrame(step);
}

/* ---------------------------------------------------------
   Update price on service boxes
--------------------------------------------------------- */
function updateBoxPrices(currency, rates) {
    const rate = rates[currency] || 1;

    document.querySelectorAll('.price-display').forEach(el => {
        const cb = el.parentElement.querySelector('.service-checkbox');
        if (!cb) return;

        const base = basePricesUSD?.[cb.dataset.category]?.[cb.dataset.plan];
        if (typeof base !== 'number') return;

        el.textContent = formatCurrency(Math.round(base * rate), currency);
    });
}

/* ---------------------------------------------------------
   Update existing invoice items price
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   Recalculate Total Invoice
--------------------------------------------------------- */
function recalculateInvoiceTotal(currency, rates) {
    const rate = rates[currency] || 1;

    const totalUSD = selectedServices.reduce((a, s) => a + s.basePrice, 0);
    const converted = Math.round(totalUSD * rate);

    const totalEl = document.getElementById('invoice-total-amount');
    if (totalEl) {
        if (currentCurrencyCode !== currency) {
            currentDisplayedTotal = 0;
            currentCurrencyCode = currency;
        }
        animateValue(totalEl, currentDisplayedTotal, converted, 800, currency);
        currentDisplayedTotal = converted;
    }

    const invoice = document.getElementById('final-invoice-section');
    if (invoice) invoice.classList.toggle('show-invoice', selectedServices.length > 0);
}

/* ---------------------------------------------------------
   Build Invoice Row DOM (FIXED VERSION)
--------------------------------------------------------- */
function buildInvoiceRow(name, basePrice, colorClass, rate, currency, category, plan) {

    const safeId = `invoice-item-${category}-${plan}`.replace(/\s+/g, '-');

    const li = document.createElement('li');
    li.className = `invoice-item entering ${colorClass}`;
    li.id = safeId;

    li.innerHTML = `
        <div class="sliding-text-container">
            <span class="item-name">
                <span class="scrolling-text-inner">${name}</span>
            </span>
        </div>

        <span class="item-price">
            ${formatCurrency(Math.round(basePrice * rate), currency)}
        </span>
    `;

    li.addEventListener("animationend", e => {
        if (e.animationName === "slideDownItem") {
            li.classList.remove("entering");
            li.classList.add("visible");
        }
    }, { once: true });

    return li;
}

/* ---------------------------------------------------------
   DOM Ready
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {

    const currencySelect = document.getElementById('currency-select');
    const checkboxes = document.querySelectorAll('.service-checkbox');
    const listContainer = document.getElementById('invoice-items-list');

    /* Load exchange rates */
    let exchangeRates;
    try {
        exchangeRates = await getExchangeRates();
    } catch (e) {
        console.error("Fatal: cannot fetch exchange rates.", e);
        return;
    }

    /* Init Currency */
    if (currencySelect) {
        const initial = determineCurrency(locale);
        currencySelect.value = initial;
        currentCurrencyCode = initial;

        updateBoxPrices(initial, exchangeRates);

        currencySelect.addEventListener('change', async (e) => {
            const newC = e.target.value;
            localStorage.setItem("selectedCurrency", newC);

            try {
                const freshRates = await getExchangeRates();
                updateBoxPrices(newC, freshRates);
                updateExistingInvoiceItemsPrices(newC, freshRates);
                recalculateInvoiceTotal(newC, freshRates);
            } catch (error) {
                console.error("Currency update failed:", error);
            }
        });
    }

    /* Service Checkboxes */
    checkboxes.forEach(box => {
        box.addEventListener("change", () => {

            const subItem = box.closest(".sub-item");
            if (subItem && subItem.offsetWidth === 0 && subItem.offsetHeight === 0) return;

            /* Group behavior */
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

            /* Name detection */
            let name = "نامشخص";
            const label = box.closest("label");
            if (label) {
                const span = label.querySelector('span[class*="-label"], .item-name');
                name = span ? span.textContent.trim() : label.textContent.trim();
            }

            /* Base price */
            const basePrice = basePricesUSD?.[category]?.[plan];
            if (typeof basePrice !== "number") return;

            const currency = currencySelect.value;
            const rate = exchangeRates[currency] || 1;

            const safeId = `invoice-item-${category}-${plan}`.replace(/\s+/g, '-');
            const existing = document.getElementById(safeId);

            /* ADD ITEM */
            if (box.checked) {

                if (existing) existing.remove();

                selectedServices = selectedServices.filter(s => !(s.category === category && s.plan === plan));
                selectedServices.push({ category, plan, name, basePrice });

                recalculateInvoiceTotal(currency, exchangeRates);

                /* Bullet Color Detection */
                const container = subItem.querySelector("label");
                let colorClass = "bullet-green";
                if (container.classList.contains("yellow-checkbox-checked-container")) colorClass = "bullet-yellow";
                else if (container.classList.contains("white-checkbox-container")) colorClass = "bullet-white";

                const row = buildInvoiceRow(name, basePrice, colorClass, rate, currency, category, plan);

                if (listContainer) listContainer.appendChild(row);
            }

            /* REMOVE ITEM */
            else {
                selectedServices = selectedServices.filter(s => !(s.category === category && s.plan === plan));
                recalculateInvoiceTotal(currency, exchangeRates);

                if (existing) {
                    existing.classList.remove("visible", "entering");
                    existing.classList.add("leaving");

                    existing.addEventListener("animationend", e => {
                        if (e.animationName === "slideUpItem") existing.remove();
                    }, { once: true });
                }
            }
        });
    });

    /* Hover/Pin behavior for sections */
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
            pinBtn.addEventListener("click", e => {
                e.stopPropagation();
                section.classList.toggle("pinned");
            });
        }
    });
});
