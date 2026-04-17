/* 
  price-calculator.js - Refactored V6 (With Quantity Support, Fixed Spacing & Smooth Animations)
  Full Integration with <currency-selector> and Quantity Controls
*/

console.log("PRICE CALCULATOR LOADED - V6 (Event-Driven & Reactive)");

import { basePricesUSD } from './data/prices.js';
import { getExchangeRates } from './services/exchange-rates.js';
import { determineCurrency } from "./utils/currency-engine.js";

// متغیرهای سراسری برای مدیریت وضعیت
let exchangeRates = {};
let selectedServices = [];
let currentDisplayedTotal = 0;
let currentCurrencyCode = localStorage.getItem("selectedCurrency") || determineCurrency(document.documentElement.lang || "en");
let groupUpdating = false;

/* ---------------------------------------------------------
   فرمت‌کننده ارز (هماهنگ با تومان، دلار، یورو و درهم)
--------------------------------------------------------- */
function formatCurrency(amount, currencyCode) {
    const formatConfig = {
        'IRR': { locale: 'fa-IR', options: { style: 'decimal' }, suffix: ' تومان' },
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
   انیمیشن تغییر اعداد (اصلاح شده برای جلوگیری از پرش در کلیک‌های سریع)
--------------------------------------------------------- */
function animateValue(element, start, end, duration, currencyCode) {
    // لغو انیمیشن قبلی روی همین المان اگر هنوز در حال اجراست
    if (element.animationFrameId) {
        cancelAnimationFrame(element.animationFrameId);
    }

    let startTimestamp = null;
    const step = (ts) => {
        if (!startTimestamp) startTimestamp = ts;
        const progress = Math.min((ts - startTimestamp) / duration, 1);
        
        // تابع Easing نرم‌تر
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

/* ---------------------------------------------------------
   بروزرسانی قیمت در باکس‌های خدمات
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   بروزرسانی قیمت آیتم‌های موجود در فاکتور نهایی
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
   محاسبه مجدد جمع کل فاکتور
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   ساخت ردیف فاکتور (DOM)
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   اصلی: گوش دادن به تغییر ارز از طریق کامپوننت فوتر
--------------------------------------------------------- */
window.addEventListener("currency-change", async (event) => {
    const newCurrency = event.detail.currency;
    console.log("Event Received: Currency changed to", newCurrency);
    
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

/* ---------------------------------------------------------
   اجرا هنگام لود شدن صفحه
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
    const checkboxes = document.querySelectorAll('.service-checkbox');
    const listContainer = document.getElementById('invoice-items-list');

    try {
        exchangeRates = await getExchangeRates();
        updateBoxPrices(currentCurrencyCode, exchangeRates);
    } catch (e) {
        console.error("Fatal: cannot fetch exchange rates.", e);
        return;
    }

    /* مدیریت چک‌باکس‌ها */
    checkboxes.forEach(box => {
        box.addEventListener("change", () => {
            const subItem = box.closest(".sub-item");
            if (subItem && subItem.offsetWidth === 0 && subItem.offsetHeight === 0) return;

            if (!groupUpdating && box.dataset.group) {
                const group = box.dataset.group;
                const groupItems = document.querySelectorAll(`.service-checkbox[data-group="${group}"]`);
                groupUpdating = true;
                groupItems.forEach(cb => { if (cb !== box) { cb.checked = box.checked; cb.dispatchEvent(new Event("change", { bubbles: true })); } });
                groupUpdating = false;
            }

            const { category, plan } = box.dataset;
            let name = "نامشخص";
            const label = box.closest("label");
            if (label) {
                const span = label.querySelector('span[class*="-label"], .item-name');
                name = span ? span.textContent.trim() : label.textContent.trim();
                
                // === بخش اصلاح شده: جلوگیری از چسبیدن عدد به کلمه در فاکتور ===
                name = name.replace(/\s+/g, ' ').replace(/^(\d+)(?=[^\s])/, '$1 ');
            }

            const unitPrice = basePricesUSD?.[category]?.[plan];
            if (typeof unitPrice !== "number") return;

            // دریافت تعداد از استایل یا مقدار 1 و محاسبه قیمت نهایی آیتم
            const qty = parseInt(subItem.dataset.qty || "1", 10);
            const basePrice = unitPrice * qty;

            const rate = exchangeRates[currentCurrencyCode] || 1;
            const safeId = `invoice-item-${category}-${plan}`.replace(/\s+/g, '-');
            const existing = document.getElementById(safeId);

            if (box.checked) {
                if (existing) existing.remove();
                selectedServices = selectedServices.filter(s => !(s.category === category && s.plan === plan));
                selectedServices.push({ category, plan, name, basePrice });

                let colorClass = "bullet-green";
                if (label.classList.contains("yellow-checkbox-checked-container")) colorClass = "bullet-yellow";
                else if (label.classList.contains("white-checkbox-container")) colorClass = "bullet-white";

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

    /* مدیریت دکمه‌های افزایش و کاهش تعداد */
    document.querySelectorAll('.sub-item').forEach(item => {
        const minusBtn = item.querySelector('.qty-minus');
        const plusBtn = item.querySelector('.qty-plus');
        const qtyText = item.querySelector('.qty-text'); 
        const checkbox = item.querySelector('.service-checkbox');
        const priceDisplay = item.querySelector('.price-display');

        if (minusBtn && plusBtn) {
            minusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); 
                let qty = parseInt(item.dataset.qty || "1", 10);
                if (qty > 1) {
                    qty--;
                    updateItemQty(qty);
                }
            });

            plusBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); 
                let qty = parseInt(item.dataset.qty || "1", 10);
                qty++;
                updateItemQty(qty);
            });

            function updateItemQty(newQty) {
                // استخراج مقدار قبلی برای نقطه شروع انیمیشن
                const oldQty = parseInt(item.dataset.qty || "1", 10);
                
                // آپدیت دیتا اتریبیوت و مقدار ظاهری
                item.dataset.qty = newQty;
                if (qtyText) qtyText.textContent = newQty;
                
                // محاسبه قیمت قدیم و جدید و اعمال انیمیشن
                if (checkbox && priceDisplay) {
                    const category = checkbox.dataset.category;
                    const plan = checkbox.dataset.plan;
                    const unitPrice = basePricesUSD?.[category]?.[plan];
                    
                    if (typeof unitPrice === 'number') {
                        const rate = exchangeRates[currentCurrencyCode] || 1;
                        const oldPrice = Math.round(unitPrice * oldQty * rate);
                        const newPrice = Math.round(unitPrice * newQty * rate);
                        
                        // فراخوانی تابع انیمیشن جایگزین تغییر مستقیم متن شد
                        animateValue(priceDisplay, oldPrice, newPrice, 400, currentCurrencyCode);
                    }
                }
                
                // بروزرسانی فاکتور در صورت انتخاب بودن تیک
                if (checkbox && checkbox.checked) {
                    checkbox.dispatchEvent(new Event("change"));
                }
            }
        }
    });

    // مدیریت هاور بخش‌ها
    document.querySelectorAll(".service-section:not(.final-cart-section)").forEach(section => {
        const header = section.querySelector(".service-header h3");
        if (header) {
            header.addEventListener("mouseenter", () => {
                document.querySelectorAll(".service-section:not(.final-cart-section)").forEach(s => { if (!s.classList.contains("pinned") && s !== section) s.classList.remove("active"); });
                section.classList.add("active");
            });
        }
        section.addEventListener("mouseleave", () => { if (!section.classList.contains("pinned")) section.classList.remove("active"); });
    });
});
