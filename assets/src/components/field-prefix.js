/* :::::::::::::::::::::::::: FIELD PREFIX COMPONENT :::::::::::::::::::::::::: */
/*
 * پیشوند برچسب درون فیلد را به‌صورت خودکار مدیریت می‌کند.
 * - عرض پیشوند را اندازه می‌گیرد و padding فیلد را تنظیم می‌کند.
 * - موقعیت عمودی را بر اساس نوع فیلد تعیین می‌کند.
 * - اسکرول textarea را با پیشوند همگام می‌سازد.
 * - فیلدهای اضافه‌شده به DOM (مثل مودال‌ها) را با MutationObserver می‌گیرد.
 */
(function () {
    'use strict';

    /* :::::::::::::::::::::::::: CONFIG :::::::::::::::::::::::::: */
    const CONFIG = {
        innerOffset: 12,        // فاصله از لبهٔ داخل فیلد
        gapAfterPrefix: 8,      // فاصله بعد از دونقطه
        verticalOffset: 2       // تنظیم بصری عمودی
    };

    /* :::::::::::::::::::::::::: ADJUST ONE GROUP :::::::::::::::::::::::::: */
    function adjustGroup(group) {
        const input = group.querySelector(
            'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]), textarea'
        );
        const prefix = group.querySelector('.field-prefix');
        if (!input || !prefix) return;

        const isRTL = getComputedStyle(group).direction === 'rtl';

        /* ::: ۱. عرض واقعی پیشوند ::: */
        const prefixWidth = prefix.getBoundingClientRect().width;
        const totalPadding =
            CONFIG.innerOffset + prefixWidth + CONFIG.gapAfterPrefix;

        /* ::: ۲. padding از سمت شروع تایپ ::: */
        if (isRTL) {
            input.style.paddingRight = totalPadding + 'px';
            input.style.paddingLeft = '';
        } else {
            input.style.paddingLeft = totalPadding + 'px';
            input.style.paddingRight = '';
        }

        /* ::: ۳. تراز عمودی ::: */
        const isTextarea = input.matches('textarea');

        if (isTextarea) {
            const styles = getComputedStyle(input);
            const paddingTop = parseFloat(styles.paddingTop) || 0;
            // پیشوند در بالای textarea
            prefix.style.top =
                input.offsetTop + paddingTop + CONFIG.verticalOffset + 'px';
            prefix.style.transform = 'none';
        } else {
            // پیشوند در وسط input
            prefix.style.top =
                input.offsetTop + input.clientHeight / 2 + CONFIG.verticalOffset + 'px';
            prefix.style.transform = 'translateY(-50%)';
        }

        /* ::: ۴. همگام‌سازی اسکرول textarea (فقط یک‌بار bind) ::: */
        if (isTextarea && !input.dataset.prefixScrollBound) {
            input.dataset.prefixScrollBound = 'true';

            input.addEventListener('scroll', function () {
                prefix.style.transform = 'translateY(-' + input.scrollTop + 'px)';
            });

            input.addEventListener('input', function () {
                if (input.scrollTop > 0) {
                    prefix.style.transform = 'translateY(-' + input.scrollTop + 'px)';
                }
            });
        }
    }

    /* :::::::::::::::::::::::::: ADJUST ALL :::::::::::::::::::::::::: */
    function adjustFieldPrefixes(root) {
        const scope = root || document;
        const groups = scope.querySelectorAll('.field-group');
        groups.forEach(adjustGroup);
    }

    /* :::::::::::::::::::::::::: AUTO INIT :::::::::::::::::::::::::: */
    document.addEventListener('DOMContentLoaded', function () {
        adjustFieldPrefixes();
    });

    window.addEventListener('load', function () {
        adjustFieldPrefixes();
    });

    /* :::::::::::::::::::::::::: RESIZE :::::::::::::::::::::::::: */
    let resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            adjustFieldPrefixes();
        }, 120);
    });

    /* :::::::::::::::::::::::::: MUTATION OBSERVER :::::::::::::::::::::::::: */
    /* فیلدهای اضافه‌شده به‌صورت داینامیک (مودال، AJAX، ...) را می‌گیرد. */
    function startObserver() {
        const observer = new MutationObserver(function (mutations) {
            let shouldAdjust = false;

            mutations.forEach(function (m) {
                m.addedNodes.forEach(function (node) {
                    if (node.nodeType !== 1) return;
                    if (
                        node.classList &&
                        node.classList.contains('field-group')
                    ) {
                        shouldAdjust = true;
                    } else if (
                        node.querySelector &&
                        node.querySelector('.field-group')
                    ) {
                        shouldAdjust = true;
                    }
                });
            });

            if (shouldAdjust) {
                requestAnimationFrame(function () {
                    adjustFieldPrefixes();
                });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.body) {
        startObserver();
    } else {
        document.addEventListener('DOMContentLoaded', startObserver);
    }

    /* :::::::::::::::::::::::::: PUBLIC API :::::::::::::::::::::::::: */
    /*
     * در صورت نیاز به بازمحاسبهٔ دستی (مثلاً بعد از باز کردن یک مودال)،
     * این تابع را صدا بزنید:
     *   window.FieldPrefix.refresh();
     *   window.FieldPrefix.refresh(someElement);
     */
    window.FieldPrefix = {
        refresh: adjustFieldPrefixes
    };
})();