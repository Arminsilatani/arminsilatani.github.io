/* :::::::::::::::::::::::::: IMPORTS :::::::::::::::::::::::::: */
import { notifyTelegram } from './telegram-notify.js';

/* :::::::::::::::::::::::::: FORM INITIALIZATION :::::::::::::::::::::::::: */
function init() {
    const forms = document.querySelectorAll('[data-notify-form]');

    /* :::::::::::::::::::::::::: FORM EVENT LISTENERS :::::::::::::::::::::::::: */
    forms.forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const sendingText = form.dataset.notifySending || 'در حال ارسال...';
            const successText = form.dataset.notifySuccess || '✓ پیام شما ارسال شد';
            const errorText = form.dataset.notifyError || 'لطفاً فیلدهای ضروری رو پر کن';

            const submitBtn = form.querySelector('button[type="submit"]');

            /* :::::::::::::::::::::::::: REQUIRED FIELDS VALIDATION :::::::::::::::::::::::::: */
            const requiredFields = form.querySelectorAll('[required]');
            let hasError = false;

            requiredFields.forEach((field) => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#F87171';
                    hasError = true;
                } else {
                    field.style.borderColor = '';
                }
            });

            if (hasError) {
                if (submitBtn) {
                    const original = submitBtn.dataset.originalHtml || submitBtn.innerHTML;
                    submitBtn.dataset.originalHtml = original;
                    submitBtn.style.animation = 'none';
                    void submitBtn.offsetHeight;
                    submitBtn.style.animation = 'shake 0.5s ease';
                    submitBtn.textContent = errorText;
                    setTimeout(() => {
                        submitBtn.textContent = original;
                        submitBtn.style.animation = '';
                    }, 2000);
                }
                return;
            }

            const formName = form.dataset.notifyForm || 'فرم';

            /* :::::::::::::::::::::::::: FIELD COLLECTION :::::::::::::::::::::::::: */
            const fields = {};
            const inputs = form.querySelectorAll('input, textarea, select');

            inputs.forEach((input) => {
                const type = (input.type || '').toLowerCase();
                if (type === 'hidden' || type === 'submit' || type === 'button') return;
                if (type === 'checkbox' || type === 'radio') {
                    if (!input.checked) return;
                }

                const value = (input.value || '').trim();
                if (!value) return;

                let label = '';
                if (input.id) {
                    const labelEl = form.querySelector('label[for="' + input.id + '"]');
                    if (labelEl) label = labelEl.textContent.replace(/\*/g, '').trim();
                }
                if (!label && input.placeholder) label = input.placeholder;
                if (!label && input.name) label = input.name;
                if (!label) label = input.id || 'فیلد';

                fields[label] = value;
            });

            fields['📄 صفحه'] = window.location.pathname;

            /* :::::::::::::::::::::::::: SUBMIT BUTTON LOADING STATE :::::::::::::::::::::::::: */
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.8';
                submitBtn.textContent = sendingText;
            }

            /* :::::::::::::::::::::::::: TELEGRAM NOTIFICATION :::::::::::::::::::::::::: */
            notifyTelegram(formName, fields);

            /* :::::::::::::::::::::::::: SUCCESS STATE :::::::::::::::::::::::::: */
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.textContent = successText;
                    submitBtn.classList.add('submit-btn--sent');
                    submitBtn.style.opacity = '1';
                }
                form.reset();

                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.textContent = 'ارسال';
                        submitBtn.classList.remove('submit-btn--sent');
                        submitBtn.disabled = false;
                    }
                }, 3000);
            }, 400);
        });
    });
}

/* :::::::::::::::::::::::::: DOM READY INITIALIZATION :::::::::::::::::::::::::: */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}