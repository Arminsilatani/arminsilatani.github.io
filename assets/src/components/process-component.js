/* :::::::::::::::::::::::::: PROCESS COMPONENT :::::::::::::::::::::::::: */

class ProcessComponent extends HTMLElement {

    /* :::::::::::::::::::::::::: CONNECTED CALLBACK :::::::::::::::::::::::::: */
    connectedCallback() {
        if (this._wired) return;
        this._init();
        this._wired = true;
    }

    /* :::::::::::::::::::::::::: INIT :::::::::::::::::::::::::: */
    _init() {
        const boxes = this.querySelectorAll(".process-box");
        if (!boxes.length) return;

        const hasOpen = [...boxes].some((b) => b.classList.contains("is-open"));
        if (!hasOpen) {
            boxes[0].classList.add("is-open");
        }

        /* ---------- HOVER → پیش‌نمایش ۱۵٪ + تصویر بلر ---------- */
        this._onMouseOver = (e) => {
            const box = e.target.closest(".process-box");
            if (!box || !this.contains(box)) return;
            if (box.classList.contains("is-open")) return;
            if (box.classList.contains("is-hover")) return;

            boxes.forEach((b) => b.classList.remove("is-hover"));
            box.classList.add("is-hover");
        };

        this._onMouseOut = (e) => {
            const box = e.target.closest(".process-box");
            if (!box || !this.contains(box)) return;

            /* اگر هنوز داخل همون باکس هستیم، کاری نکن */
            const related = e.relatedTarget;
            if (related && box.contains(related)) return;

            box.classList.remove("is-hover");
        };

        /* ---------- CLICK → باز کردن کامل ---------- */
        this._onClick = (e) => {
            const box = e.target.closest(".process-box");
            if (!box || !this.contains(box)) return;
            if (box.classList.contains("is-open")) return;

            boxes.forEach((b) => {
                b.classList.remove("is-open");
                b.classList.remove("is-hover");
            });
            box.classList.add("is-open");
        };

        this.addEventListener("mouseover", this._onMouseOver);
        this.addEventListener("mouseout",  this._onMouseOut);
        this.addEventListener("click",     this._onClick);
    }

    /* :::::::::::::::::::::::::: DISCONNECTED CALLBACK :::::::::::::::::::::::::: */
    disconnectedCallback() {
        if (this._onMouseOver) {
            this.removeEventListener("mouseover", this._onMouseOver);
            this._onMouseOver = null;
        }
        if (this._onMouseOut) {
            this.removeEventListener("mouseout", this._onMouseOut);
            this._onMouseOut = null;
        }
        if (this._onClick) {
            this.removeEventListener("click", this._onClick);
            this._onClick = null;
        }
        this._wired = false;
    }
}

/* :::::::::::::::::::::::::: REGISTRATION :::::::::::::::::::::::::: */
if (!customElements.get("process-component")) {
    customElements.define("process-component", ProcessComponent);
}