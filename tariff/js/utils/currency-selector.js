// js/utils/currency-selector.js
import { currencyPolicy } from "../config/currency-policy.js";

class CurrencySelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        
        // نقشه‌ راهنمای نام‌های فارسی (اختیاری - اگه دوست داشتی کد ارز نمایش داده نشه)
        this.currencyLabels = {
            "IRR": "تومان",
            "USD": "دلار",
            "EUR": "یورو",
            "TRY": "لیر"
        };
    }

    connectedCallback() {
        this.render();
    }

    // منطق استخراج ارزهای یکتا از پالیسی
    getUniqueCurrencies() {
        const allCurrencies = Object.values(currencyPolicy).map(p => p.currency || p.fallback);
        // حذف تکراری‌ها با Set
        return [...new Set(allCurrencies)];
    }

        render() {
        const currencies = this.getUniqueCurrencies();
        const saved = localStorage.getItem("selectedCurrency") || "TOMAN";

        this.shadowRoot.innerHTML = `
<style>
    :host { display: block; width: 100%; direction: rtl; }
    ul {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 0px;
        list-style: none;
        padding: 0;
        margin: 0px 0 0 0;
    }
    li {
        cursor: pointer;
        font-size: 1rem;
        transition: color 0.3s ease, opacity 0.3s ease;
        color: #0D0D0D; /* رنگ آیتم‌های غیرفعال */
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    /* هنگام هاور، رنگ به F5F5F5 تغییر می‌کند */
    li:hover { 
        color: #F5F5F5; 
        opacity: 1; 
    }
    
    /* استایل آیتم انتخاب شده */
    li.active {
        opacity: 1;
        font-weight: 400; /* کمی ضخیم‌تر برای تشخیص بهتر */
        color: #F5F5F5; /* رنگ ارز انتخاب شده */
        text-decoration: none;
    }
    
    .code {
        font-size: 0.75rem;
        opacity: 0.6;
    }
</style>

            <ul>
                ${currencies.map(code => `
                    <li class="${code === saved ? 'active' : ''}" data-code="${code}">
                        ${this.currencyLabels[code] || code} <span class="code">(${code})</span>
                    </li>
                `).join("")}
            </ul>
        `;

        this.setupListeners();
    }


    setupListeners() {
        this.shadowRoot.querySelectorAll("li").forEach(li => {
            li.addEventListener("click", () => {
                const currency = li.getAttribute("data-code");
                localStorage.setItem("selectedCurrency", currency);

                // آپدیت ظاهری سریع
                this.shadowRoot.querySelector("li.active")?.classList.remove("active");
                li.classList.add("active");

                // انتشار رویداد برای تغییر قیمت‌ها
                window.dispatchEvent(
                    new CustomEvent("currency-change", {
                        detail: { currency },
                        bubbles: true,
                        composed: true
                    })
                );
            });
        });
    }
}

customElements.define("currency-selector", CurrencySelector);
