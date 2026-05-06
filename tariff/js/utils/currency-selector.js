/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-05
  *  Version: 2.0.0 (Locale-aware)
  ****************************************************
*/

import { currencyPolicy } from "../config/currency-policy.js";
import { currencyLabels } from "../config/currency-labels.js";

/* =========================== CURRENCY SELECTOR WEB COMPONENT ============================ */

class CurrencySelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    /* --------------------- GET UNIQUE CURRENCIES --------------------- */
    getUniqueCurrencies() {
        const all = Object.values(currencyPolicy).map(p => p.currency || p.fallback);
        return [...new Set(all)];
    }

    /* --------------------------- RENDER --------------------------- */
    render() {
        let currencies = this.getUniqueCurrencies();

        /* saved currency from localStorage */
        const saved = localStorage.getItem("selectedCurrency") || "TOMAN";

        /* detect page language */
        const lang = document.documentElement.lang?.split("-")[0] || "fa";

        /* choose correct translation list */
        const labels = currencyLabels[lang] || currencyLabels["fa"];

        /* your existing IRR/USD swap logic */
        const irrIndex = currencies.indexOf("IRR");
        const usdIndex = currencies.indexOf("USD");

        if (irrIndex !== -1 && usdIndex !== -1) {
            [currencies[irrIndex], currencies[usdIndex]] =
            [currencies[usdIndex], currencies[irrIndex]];
        }

        /* ---------------- HTML + STYLE ---------------- */
        this.shadowRoot.innerHTML = `
<style>
    :host { display: block; width: 100%; direction: rtl; }
    ul {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        list-style: none;
        padding: 0;
        margin: 0;
        text-align: center;
    }

    li {
        cursor: pointer;
        font-size: 1rem;
        color: #0D0D0D;
        padding: 0 0 10px;
        transition: .25s;
        white-space: nowrap;
    }

    li:hover {
        color: #F5F5F5;
    }

    li.active {
        font-weight: 400;
        color: #F5F5F5;
    }

    .code {
        font-size: .75rem;
        opacity: .6;
    }
</style>

<ul>
    ${currencies.map(code => `
        <li class="${code === saved ? "active" : ""}" data-code="${code}">
            ${labels[code] || code}
            <span class="code">(${code})</span>
        </li>
    `).join("")}
</ul>
        `;

        this.setupListeners();
    }

    /* ------------------------- CLICK HANDLERS ------------------------- */
    setupListeners() {
        this.shadowRoot.querySelectorAll("li").forEach(li => {
            li.addEventListener("click", () => {
                const currency = li.dataset.code;

                localStorage.setItem("selectedCurrency", currency);

                this.shadowRoot.querySelector("li.active")?.classList.remove("active");
                li.classList.add("active");

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
