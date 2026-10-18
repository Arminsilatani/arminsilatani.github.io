class SectionDivider extends HTMLElement {
    connectedCallback() {
        if (this.dataset.ready) return;
        this.dataset.ready = "true";

        this.setAttribute("role", "presentation");
        this.setAttribute("aria-hidden", "true");
    }
}

if (!customElements.get("section-divider")) {
    customElements.define("section-divider", SectionDivider);
}