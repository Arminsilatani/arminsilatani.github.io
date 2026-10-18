/* :::::::::::::::::::::::::: CATALOGUE SLIDESHOW :::::::::::::::::::::::::: */

(() => {
    'use strict';




    /* :::::::::::::::::::::::::: CARD INITIALIZATION :::::::::::::::::::::::::: */

    const initCard = (card) => {
        const media = card.querySelector('.catalogue-media');
        const info = card.querySelector('.catalogue-info');

        if (!media || !info) return;
        if (info.querySelector('.catalogue-dots')) return;

        const images = Array.from(media.querySelectorAll('img'));

        if (!images.length) return;




        /* :::::::::::::::::::::::::: IMAGE EAGER LOADING :::::::::::::::::::::::::: */

        images.forEach((img) => {
            img.loading = 'eager';
            img.decoding = 'async';

            if (!img.complete && img.getAttribute('src')) {
                const src = img.src;
                img.src = '';
                img.src = src;
            }
        });




        /* :::::::::::::::::::::::::: SLIDE WRAPPERS :::::::::::::::::::::::::: */

        images.forEach((img) => {
            const slide = document.createElement('div');
            slide.className = 'catalogue-slide';
            img.parentNode.insertBefore(slide, img);
            slide.appendChild(img);
        });

        const slides = Array.from(media.querySelectorAll('.catalogue-slide'));




        /* :::::::::::::::::::::::::: STAGE HEIGHT :::::::::::::::::::::::::: */

        const updateStageHeight = () => {
            let maxH = 0;

            slides.forEach((slide) => {
                const img = slide.querySelector('img');

                if (!img) return;
                if (!img.complete || img.naturalWidth === 0) return;

                const h = img.offsetHeight;

                if (h > maxH) maxH = h;
            });

            if (maxH === 0) return;

            media.style.height = `${maxH * 1.07 + 8}px`;
        };

        requestAnimationFrame(updateStageHeight);

        images.forEach((img) => {
            const refresh = () => requestAnimationFrame(updateStageHeight);

            if (img.complete && img.naturalWidth > 0) return;

            img.addEventListener('load', refresh, { once: true });
            img.addEventListener('error', refresh, { once: true });
        });

        window.addEventListener('load', () => {
            requestAnimationFrame(updateStageHeight);
        });

        requestAnimationFrame(updateStageHeight);

        images.forEach((img) => {
            if (img.complete && img.naturalWidth > 0) return;

            img.addEventListener('load', () => requestAnimationFrame(updateStageHeight), { once: true });
            img.addEventListener('error', () => requestAnimationFrame(updateStageHeight), { once: true });
        });

        let current = 0;




        /* :::::::::::::::::::::::::: DOTS :::::::::::::::::::::::::: */

        const dotsWrap = document.createElement('div');
        dotsWrap.className = 'catalogue-dots';
        dotsWrap.setAttribute('role', 'tablist');

        const dots = images.map((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'catalogue-dot';
            dot.dataset.index = String(i);
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `صفحه ${i + 1}`);
            dotsWrap.appendChild(dot);
            return dot;
        });

        const ps = info.querySelectorAll('p');

        if (ps.length >= 2) info.insertBefore(dotsWrap, ps[ps.length - 1]);
        else info.appendChild(dotsWrap);




        /* :::::::::::::::::::::::::: RTL :::::::::::::::::::::::::: */

        const isRTL = () => getComputedStyle(media).direction === 'rtl';




        /* :::::::::::::::::::::::::: RENDER :::::::::::::::::::::::::: */

        const update = () => {
            const sign = isRTL() ? -1 : 1;
            const isNarrow = window.matchMedia('(max-width: 768px)').matches;
            const isLandscape = window.matchMedia('(orientation: landscape) and (max-height: 600px)').matches;

            const peek = 24;

            const baseW = slides.map((slide) => {
                const img = slide.querySelector('img');
                return img ? img.offsetWidth : 0;
            });

            const scaleAt = (abs) => abs === 0 ? 1.07 : abs === 1 ? 0.82 : abs === 2 ? 0.68 : 0.6;

            const positions = new Array(slides.length).fill(0);

            for (let i = current + 1; i < slides.length; i++) {
                const prev = i - 1;
                const prevHalf = baseW[prev] * scaleAt(Math.abs(prev - current)) / 2;
                const curHalf = baseW[i] * scaleAt(Math.abs(i - current)) / 2;
                positions[i] = positions[prev] + prevHalf + curHalf - peek;
            }

            for (let i = current - 1; i >= 0; i--) {
                const next = i + 1;
                const nextHalf = baseW[next] * scaleAt(Math.abs(next - current)) / 2;
                const curHalf = baseW[i] * scaleAt(Math.abs(i - current)) / 2;
                positions[i] = positions[next] - nextHalf - curHalf + peek;
            }

            slides.forEach((slide, i) => {
                const abs = Math.abs(i - current);

                slide.style.setProperty('--dx', `${positions[i] * sign}px`);

                if (abs === 0) {
                    slide.classList.add('is-current');
                    slide.style.removeProperty('--scale');
                    slide.style.removeProperty('--op');
                    slide.style.removeProperty('--blur');
                    slide.style.removeProperty('--bright');
                    slide.style.removeProperty('--z');
                } else {
                    slide.classList.remove('is-current');

                    let scale, op, blur, bright, z;

                    if (abs === 1) {
                        scale = 0.82;
                        op = 0.50;
                        blur = 4;
                        bright = 0.55;
                        z = 3;
                    } else if (abs === 2) {
                        scale = 0.68;
                        op = 0.22;
                        blur = 7;
                        bright = 0.40;
                        z = 2;
                    } else {
                        scale = 0.60;
                        op = 0;
                        blur = 10;
                        bright = 0.30;
                        z = 1;
                    }

                    slide.style.setProperty('--scale', String(scale));
                    slide.style.setProperty('--op', String(op));
                    slide.style.setProperty('--blur', `${blur}px`);
                    slide.style.setProperty('--bright', String(bright));
                    slide.style.setProperty('--z', String(z));
                }
            });

            dots.forEach((dot, i) => {
                const active = i === current;
                dot.classList.toggle('is-current', active);
                dot.setAttribute('aria-selected', active ? 'true' : 'false');
            });
        };




        /* :::::::::::::::::::::::::: NAVIGATION :::::::::::::::::::::::::: */

        const goTo = (index) => {
            if (index < 0 || index >= images.length) return;

            current = index;
            update();
        };




        /* :::::::::::::::::::::::::: DOTS EVENTS :::::::::::::::::::::::::: */

        dotsWrap.addEventListener('click', (e) => {
            const dot = e.target.closest('.catalogue-dot');

            if (!dot) return;

            goTo(Number(dot.dataset.index));
        });




        /* :::::::::::::::::::::::::: KEYBOARD EVENTS :::::::::::::::::::::::::: */

        dotsWrap.addEventListener('keydown', (e) => {
            const rtl = isRTL();
            let next = current;

            if (e.key === 'ArrowLeft') next = rtl ? current + 1 : current - 1;
            else if (e.key === 'ArrowRight') next = rtl ? current - 1 : current + 1;
            else if (e.key === 'Home') next = 0;
            else if (e.key === 'End') next = images.length - 1;
            else return;

            e.preventDefault();
            next = Math.max(0, Math.min(images.length - 1, next));
            goTo(next);
            dots[next].focus();
        });




        /* :::::::::::::::::::::::::: DRAG PREVENTION :::::::::::::::::::::::::: */

        images.forEach((img) => img.addEventListener('dragstart', (e) => e.preventDefault()));




        /* :::::::::::::::::::::::::: POINTER DRAG :::::::::::::::::::::::::: */

        let pointerId = null;
        let startX = 0;
        let startY = 0;
        let startT = 0;
        let dragging = false;
        let axisLock = null;
        let justDragged = false;

        const clearDragVisual = () => {
            media.classList.remove('is-dragging');
            slides.forEach((s) => s.style.removeProperty('--drag'));
        };

        media.addEventListener('pointerdown', (e) => {
            if (pointerId !== null) return;
            if (e.pointerType === 'mouse' && e.button !== 0) return;

            pointerId = e.pointerId;
            startX = e.clientX;
            startY = e.clientY;
            startT = Date.now();
            dragging = false;
            axisLock = null;

            try {
                media.setPointerCapture(e.pointerId);
            } catch (_) {}
        });

        media.addEventListener('pointermove', (e) => {
            if (e.pointerId !== pointerId) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (!axisLock) {
                const threshold = (e.pointerType === 'mouse') ? 3 : 8;

                if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
                    if (e.pointerType === 'mouse') {
                        axisLock = 'h';
                    } else {
                        axisLock = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
                    }

                    if (axisLock === 'h') {
                        dragging = true;
                        media.classList.add('is-dragging');
                    }
                }
            }

            if (axisLock !== 'h') return;

            if (e.cancelable) e.preventDefault();

            const rtl = isRTL();
            const dir = rtl ? -1 : 1;
            const towardsNext = (dx * dir) < 0;

            const atStart = current === 0;
            const atEnd = current === images.length - 1;

            let drag = dx;

            if ((atStart && !towardsNext) || (atEnd && towardsNext)) {
                drag = dx * 0.35;
            }

            slides.forEach((s) => s.style.setProperty('--drag', `${drag}px`));
        });

        const endPointer = (e) => {
            if (e.pointerId !== pointerId) return;

            const wasDragging = dragging;
            pointerId = null;

            if (!wasDragging) {
                axisLock = null;
                return;
            }

            dragging = false;

            const dt = Date.now() - startT;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            clearDragVisual();

            if (Math.abs(dy) > Math.abs(dx)) {
                axisLock = null;
                return;
            }

            const distance = Math.abs(dx);
            const velocity = distance / Math.max(dt, 1);
            const minDist = Math.min(media.clientWidth * 0.15, 120);

            const shouldNavigate =
                distance > minDist ||
                (velocity > 0.5 && distance > 30);

            if (shouldNavigate) {
                const rtl = isRTL();
                let next;

                if (dx < 0) next = rtl ? current - 1 : current + 1;
                else next = rtl ? current + 1 : current - 1;

                next = Math.max(0, Math.min(images.length - 1, next));

                if (next !== current) goTo(next);
            }

            if (distance > 5) {
                justDragged = true;
                setTimeout(() => {
                    justDragged = false;
                }, 50);
            }

            axisLock = null;
        };

        media.addEventListener('pointerup', endPointer);
        media.addEventListener('pointercancel', endPointer);




        /* :::::::::::::::::::::::::: CLICK SUPPRESSION :::::::::::::::::::::::::: */

        media.addEventListener('click', (e) => {
            if (justDragged) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);




        /* :::::::::::::::::::::::::: RESIZE HANDLING :::::::::::::::::::::::::: */

        let rafId = null;

        const scheduleLayout = () => {
            if (rafId) return;

            rafId = requestAnimationFrame(() => {
                rafId = null;
                updateStageHeight();
                update();
            });
        };

        window.addEventListener('resize', scheduleLayout);
        window.addEventListener('orientationchange', scheduleLayout);

        if ('ResizeObserver' in window) {
            const ro = new ResizeObserver(scheduleLayout);
            ro.observe(media);
        }

        update();
    };




    /* :::::::::::::::::::::::::: GLOBAL INITIALIZATION :::::::::::::::::::::::::: */

    const init = () => {
        document.querySelectorAll('.catalogue-card').forEach(initCard);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();