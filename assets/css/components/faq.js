/* :::::::::::::::::::::::::: FAQ ACCORDION :::::::::::::::::::::::::: */

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const wrapper = item.querySelector('.faq-answer-wrapper');
        const isOpen = item.classList.contains('faq-item--open');

        if (isOpen) {
            item.classList.remove('faq-item--open');
            wrapper.style.maxHeight = '0';
        } else {
            item.classList.add('faq-item--open');
            const answer = wrapper.querySelector('.faq-answer');
            wrapper.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});
