/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-05
  *  Version: 1.0.0
  ****************************************************
*/

import { currencyPolicy } from "../config/currency-policy.js";

/* =========================== CURRENCY SELECTOR WEB COMPONENT ============================ */

class CurrencySelector extends HTMLElement {
    /* --------------------- CONSTRUCTOR --------------------- */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Optional mapping for Persian display names (to hide currency code)
        this.currencyLabels = {
            "IRR": "تومان",
            "USD": "دلار",
            "EUR": "یورو",
            "AED": "درهم",
            "TRY": "لیر"
        };
    }

    /* --------------------- LIFECYCLE --------------------- */
    connectedCallback() {
        this.render();
    }

    /* --------------------- UTILITIES --------------------- */
    getUniqueCurrencies() {
        const allCurrencies = Object.values(currencyPolicy).map(p => p.currency || p.fallback);
        // Remove duplicates
        return [...new Set(allCurrencies)];
    }

    /* --------------------- RENDER & LOGIC --------------------- */
    render() {
        let currencies = this.getUniqueCurrencies();
        const saved = localStorage.getItem("selectedCurrency") || "TOMAN";

        // Swap IRR and USD positions for visual balance
        const irrIndex = currencies.indexOf("IRR");
        const usdIndex = currencies.indexOf("USD");

        if (irrIndex !== -1 && usdIndex !== -1) {
            [currencies[irrIndex], currencies[usdIndex]] = [currencies[usdIndex], currencies[irrIndex]];
        }

        this.shadowRoot.innerHTML = `
<style>
    :host { display: block; width: 100%; direction: rtl; }
    ul {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0;
        list-style: none;
        padding: 0;
        margin: 0;
        text-align: center;
    }

li {
    cursor: pointer;
    font-size: 1rem;
    transition: color 0.3s ease, opacity 0.3s ease;
    color: #0D0D0D;
    white-space: nowrap;
    text-align: center;
    padding: 0 0 10px;
}

    
    li:hover { 
        color: #F5F5F5; 
        opacity: 1; 
    }
    
    li.active {
        opacity: 1;
        font-weight: 400;
        color: #F5F5F5;
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

                // Fast visual update
                this.shadowRoot.querySelector("li.active")?.classList.remove("active");
                li.classList.add("active");

                // Dispatch event to update prices across the app
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