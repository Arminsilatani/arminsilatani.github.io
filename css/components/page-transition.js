// ورود صفحه
window.addEventListener('load', () => {
  document.body.classList.add('is-loaded');
});

// خروج صفحه هنگام کلیک روی لینک
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;

  const url = link.getAttribute('href');

  // لینک‌های داخلی/خارجی خاص را رد کن
  if (!url || url.startsWith('#') || link.hasAttribute('target')) return;

  e.preventDefault();
  document.body.classList.add('is-leaving');

  setTimeout(() => {
    window.location.href = url;
  }, 500);
});
