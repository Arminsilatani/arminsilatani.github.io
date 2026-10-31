// =========================================
// FINAL OPTIMIZED LOADER LOGIC
// =========================================
(function() {
  
  // تابع مخفی کردن لودر
  function hideLoader() {
    var loader = document.getElementById('initial-loader');
    if (loader) {
      loader.classList.add('hidden');
    }
  }

  // 1. مخفی کردن لودر به محض آماده شدن ساختار HTML (بدون نیاز به منتظر ماندن برای ویدیو و تصاویر)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // یک تاخیر بسیار کوتاه (300 میلی‌ثانیه) فقط برای اینکه چشم کاربر انیمیشن لودر را ببیند
      setTimeout(hideLoader, 300); 
    });
  } else {
    // اگر DOM از قبل آماده است (مثلاً اسکریپت دیر لود شده)
    setTimeout(hideLoader, 300);
  }

  // 2. تایمر اطمینان (Fallback): اگر به هر دلیلی (خطای جاوااسکریپت یا ...) لودر مخفی نشد،
  // بعد از 2.5 ثانیه به زور مخفی می‌شود تا کاربر پشت صفحه گیر نکند.
  setTimeout(hideLoader, 2500);

})();