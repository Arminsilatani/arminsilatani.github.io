/* :::::::::::::::::::::::::: SCRIPTS & ANALYTICS :::::::::::::::::::::::::: */

(function () {
    'use strict';

    const CONFIG = {
        innerOffset: 12,
        gapAfterPrefix: 8,
        verticalOffset: 2
    };

    function adjustGroup(group) {
        const input = group.querySelector(
            'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]), textarea'
        );
        const prefix = group.querySelector('.field-prefix');
        if (!input || !prefix) return;

        const isRTL = getComputedStyle(group).direction === 'rtl';

        const prefixWidth = prefix.getBoundingClientRect().width;
        const totalPadding =
            CONFIG.innerOffset + prefixWidth + CONFIG.gapAfterPrefix;

        if (isRTL) {
            input.style.paddingRight = totalPadding + 'px';
            input.style.paddingLeft = '';
        } else {
            input.style.paddingLeft = totalPadding + 'px';
            input.style.paddingRight = '';
        }

        const isTextarea = input.matches('textarea');

        if (isTextarea) {
            const styles = getComputedStyle(input);
            const paddingTop = parseFloat(styles.paddingTop) || 0;
            prefix.style.top =
                input.offsetTop + paddingTop + CONFIG.verticalOffset + 'px';
            prefix.style.transform = 'none';
        } else {
            prefix.style.top =
                input.offsetTop + input.clientHeight / 2 + CONFIG.verticalOffset + 'px';
            prefix.style.transform = 'translateY(-50%)';
        }

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

    function adjustFieldPrefixes(root) {
        const scope = root || document;
        const groups = scope.querySelectorAll('.field-group');
        groups.forEach(adjustGroup);
    }

    document.addEventListener('DOMContentLoaded', function () {
        adjustFieldPrefixes();
    });

    window.addEventListener('load', function () {
        adjustFieldPrefixes();
    });

    let resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            adjustFieldPrefixes();
        }, 120);
    });

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

    window.FieldPrefix = {
        refresh: adjustFieldPrefixes
    };
})();