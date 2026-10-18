/* :::::::::::::::::::::::::: FAQ ACCORDION (ACCORDION MODE) :::::::::::::::::::::::::: */

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const isOpen = item.classList.contains('faq-item--open');

        /* بستن همه آیتم‌های دیگه */
        document.querySelectorAll('.faq-item').forEach(other => {
            if (other !== item) {
                other.classList.remove('faq-item--open');
                other.querySelector('.faq-answer-wrapper').style.maxHeight = '0';
                const btn = other.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            }
        });

        /* toggle آیتم فعلی */
        if (isOpen) {
            item.classList.remove('faq-item--open');
            item.querySelector('.faq-answer-wrapper').style.maxHeight = '0';
            button.setAttribute('aria-expanded', 'false');
        } else {
            item.classList.add('faq-item--open');
            const answer = item.querySelector('.faq-answer');
            item.querySelector('.faq-answer-wrapper').style.maxHeight = answer.scrollHeight + 'px';
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

/* :::::::::::::::::::::::::: INIT OPEN ITEM :::::::::::::::::::::::::: */

document.querySelectorAll('.faq-item--open').forEach(item => {
    const wrapper = item.querySelector('.faq-answer-wrapper');
    const answer = wrapper.querySelector('.faq-answer');
    if (wrapper && answer) {
        wrapper.style.maxHeight = answer.scrollHeight + 'px';
    }
});