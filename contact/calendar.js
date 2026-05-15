/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-15
  *  Version: 0.0.0
  ****************************************************
*/

/* =========================== SMART 60-DAY CALENDAR ============================ */

(function () {
    /* :::::::::::::::::::::::::: CONFIGURATION & CONSTANTS :::::::::::::::::::::::::: */

    // Manually blocked dates in YYYY-MM-DD format
    const MANUAL_UNAVAILABLE_DATES = new Set([
        // '2026-05-20',
    ]);

    // Nowruz extended mode: false = 1-4 Farvardin, true = 1-13 Farvardin
    const NOWRUZ_EXTENDED = false;

    // Drag scroll physics
    const DRAG_SPEED = 2.2;
    const FRICTION = 0.92;
    const MIN_VELOCITY = 0.3;
    const MOMENTUM_STOP_THRESHOLD = 0.5;

    let isAvailable = true; // global availability state

    /* ------------------------- LANGUAGE DETECTION ------------------------- */
    function detectLanguage() {
        const lang = (document.documentElement.lang || navigator.language || '').toLowerCase();
        if (lang.startsWith('fa')) return 'fa';
        if (lang.startsWith('ar')) return 'ar';
        if (lang.startsWith('de')) return 'de';
        if (lang.startsWith('it')) return 'it';
        if (lang.startsWith('tr')) return 'tr';
        return 'en';
    }

    const CURRENT_LANG = detectLanguage();

    /* ------------------------- DAY & MONTH NAME MAPS ------------------------- */
    /**
     * Full day names for each supported language.
     * All arrays start with Sunday (index 0) matching JavaScript's getDay().
     */
    const DAY_NAMES = {
        fa: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
        ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        it: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
        tr: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    };

    /**
     * Full month names.
     * - Persian (fa): Jalali (Solar Hijri)
     * - Arabic (ar): Islamic (Hijri) – used as fallback
     * - Others: Gregorian
     */
    const MONTH_NAMES = {
        fa: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
        ar: ['محرم', 'صفر', 'ربیع الأول', 'ربیع الثانی', 'جمادی الأول', 'جمادی الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    };

    /* ------------------------- HELPER: GET LOCALIZED DAY NAME ------------------------- */
    function getDayName(jsDayIndex, lang) {
        const names = DAY_NAMES[lang] || DAY_NAMES['en'];
        return names[jsDayIndex] || '';
    }

    /* ------------------------- DATE CONVERSION: GREGORIAN TO JALALI ------------------------- */
    function gregorianToJalali(year, month, day) {
        const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

        let gy = year - 1600;
        let gm = month - 1;
        let gd = day - 1;

        let gDayNo = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400);
        for (let i = 0; i < gm; i++) gDayNo += gDaysInMonth[i];
        if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) gDayNo++;
        gDayNo += gd;

        let jDayNo = gDayNo - 79;
        let jNp = Math.floor(jDayNo / 12053);
        jDayNo %= 12053;

        let jy = 979 + 33 * jNp + 4 * Math.floor(jDayNo / 1461);
        jDayNo %= 1461;
        if (jDayNo >= 366) {
            jy += Math.floor((jDayNo - 1) / 365);
            jDayNo = (jDayNo - 1) % 365;
        }

        let jm;
        for (jm = 0; jm < 11 && jDayNo >= jDaysInMonth[jm]; jm++) {
            jDayNo -= jDaysInMonth[jm];
        }

        return { year: jy, month: jm + 1, day: jDayNo + 1 };
    }

    /* ------------------------- DATE DISPLAY FORMATTING ------------------------- */
    /**
     * Returns a display object with dayNumber, monthName, monthIndex, year, fullLabel.
     * Uses Jalali for Persian, Hijri (via Intl) for Arabic, Gregorian for others.
     */
    function formatDateForDisplay(gregDate, lang) {
        const y = gregDate.getFullYear();
        const m = gregDate.getMonth() + 1;
        const d = gregDate.getDate();

        // Persian – convert to Jalali
        if (lang === 'fa') {
            const j = gregorianToJalali(y, m, d);
            const monthName = MONTH_NAMES.fa[j.month - 1];
            return {
                dayNumber: j.day,
                monthName: monthName,
                monthIndex: j.month,
                year: j.year,
                fullLabel: `${j.day} ${monthName}`,
            };
        }

        // Arabic – attempt Hijri via Intl, fallback to stored Islamic month names
        if (lang === 'ar') {
            try {
                const fmt = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long' });
                const parts = fmt.formatToParts(gregDate);
                const hijriDay = parts.find(p => p.type === 'day')?.value || d;
                const hijriMonth = parts.find(p => p.type === 'month')?.value || '';
                return {
                    dayNumber: parseInt(hijriDay, 10) || d,
                    monthName: hijriMonth,
                    monthIndex: m,
                    year: y,
                    fullLabel: `${hijriDay} ${hijriMonth}`,
                };
            } catch (e) {
                const monthName = MONTH_NAMES.ar[m - 1] || '';
                return { dayNumber: d, monthName, monthIndex: m, year: y, fullLabel: `${d} ${monthName}` };
            }
        }

        // Gregorian languages (en, de, it, tr)
        const months = MONTH_NAMES[lang] || MONTH_NAMES.en;
        const monthName = months[m - 1];
        return {
            dayNumber: d,
            monthName: monthName,
            monthIndex: m,
            year: y,
            fullLabel: `${d} ${monthName}`,
        };
    }

    /* ------------------------- DAY STATUS LOGIC (HOLIDAYS, WEEKENDS, MANUAL) ------------------------- */
    /**
     * Returns one of: 'available', 'partial', 'busy'
     * - busy  : manually added unavailable dates (red)
     * - partial : holidays (Nowruz 1-4/13, Christmas Dec25–Jan1) and weekends (Sat/Sun)
     * - available : otherwise
     */
    function getDayStatus(gregDate) {
        const y = gregDate.getFullYear();
        const m = gregDate.getMonth() + 1;
        const d = gregDate.getDate();
        const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const jsDay = gregDate.getDay(); // 0=Sun, 6=Sat

        // Manual block (busy)
        if (MANUAL_UNAVAILABLE_DATES.has(dateStr)) return 'busy';

        // Nowruz (all languages) based on Jalali conversion
        const jalali = gregorianToJalali(y, m, d);
        const nowruzEnd = NOWRUZ_EXTENDED ? 13 : 4;
        if (jalali.month === 1 && jalali.day >= 1 && jalali.day <= nowruzEnd) return 'partial';

        // Christmas to New Year (Dec 25 – Jan 1)
        if ((m === 12 && d >= 25) || (m === 1 && d === 1)) return 'partial';

        // Weekend: Saturday (6) and Sunday (0)
        if (jsDay === 0 || jsDay === 6) return 'partial';

        // Default available
        return 'available';
    }

    /* ------------------------- CALENDAR DATA GENERATION ------------------------- */
    function generate60Days() {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let lastMonthKey = null;

        for (let i = 0; i < 60; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);

            const status = getDayStatus(date);
            const display = formatDateForDisplay(date, CURRENT_LANG);
            const dayName = getDayName(date.getDay(), CURRENT_LANG);
            const monthKey = `${display.year}-${display.monthIndex}`;

            days.push({
                date,
                status,
                display,
                dayName,
                isNewMonth: (lastMonthKey !== null && monthKey !== lastMonthKey),
                monthKey,
            });

            lastMonthKey = monthKey;
        }

        return days;
    }

    /* ------------------------- RENDER CALENDAR INTO DOM ------------------------- */
    function renderCalendar() {
        const container = document.getElementById('miniWeek');
        if (!container) return;

        const days = generate60Days();
        container.innerHTML = '';

        days.forEach((day) => {
            // Month separator
            if (day.isNewMonth && day.display.monthName) {
                const sep = document.createElement('div');
                sep.className = 'mini-week__month-separator';
                sep.textContent = day.display.monthName;
                container.appendChild(sep);
            }

            // Status classes
            let statusClass = '',
                dotClass = '';
            if (day.status === 'available') {
                statusClass = 'mini-week__day--available';
                dotClass = 'mini-week__day-dot--green';
            } else if (day.status === 'partial') {
                statusClass = 'mini-week__day--partial';
                dotClass = 'mini-week__day-dot--yellow';
            } else if (day.status === 'busy') {
                statusClass = 'mini-week__day--busy';
                dotClass = 'mini-week__day-dot--red';
            }

            const el = document.createElement('div');
            el.className = `mini-week__day ${statusClass}`;
            el.title = `${day.display.fullLabel}`;
            el.innerHTML = `
                <div class="mini-week__day-name">${day.dayName}</div>
                <div class="mini-week__day-date">${day.display.dayNumber}</div>
                <div class="mini-week__day-dot ${dotClass}"></div>
            `;

            container.appendChild(el);
        });

        // Reset scroll to start
        container.scrollLeft = 0;
    }

    /* ------------------------- DRAG SCROLL WITH MOMENTUM & SNAP ------------------------- */
    function enableDragScroll(containerId) {
        const slider = document.getElementById(containerId);
        if (!slider) return;

        let isDown = false,
            startX = 0,
            scrollStart = 0,
            velX = 0,
            lastMoveX = 0,
            momentumID = null;

        slider.style.scrollBehavior = 'auto';

        // --- Mouse Event Handlers ---
        function onMouseDown(e) {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX;
            scrollStart = slider.scrollLeft;
            cancelAnimationFrame(momentumID);
            velX = 0;
            lastMoveX = startX;
            e.preventDefault();
        }

        function onMouseLeave() {
            if (isDown) {
                isDown = false;
                slider.classList.remove('active');
                startMomentum();
            }
        }

        function onMouseUp() {
            if (isDown) {
                isDown = false;
                slider.classList.remove('active');
                startMomentum();
            }
        }

        function onMouseMove(e) {
            if (!isDown) return;
            e.preventDefault();
            const currentX = e.pageX;
            slider.scrollLeft = scrollStart - (currentX - startX) * DRAG_SPEED;
            velX = (currentX - lastMoveX) * DRAG_SPEED;
            lastMoveX = currentX;
        }

        // --- Momentum & Snap ---
        function startMomentum() {
            if (Math.abs(velX) < MIN_VELOCITY) {
                snapToNearestDay();
                return;
            }
            momentumID = requestAnimationFrame(momentumLoop);
        }

        function momentumLoop() {
            velX *= FRICTION;
            slider.scrollLeft -= velX;

            if (Math.abs(velX) < MOMENTUM_STOP_THRESHOLD) {
                snapToNearestDay();
                return;
            }
            momentumID = requestAnimationFrame(momentumLoop);
        }

        function snapToNearestDay() {
            const wrapper = slider.parentElement;
            if (!wrapper) return;

            const wrapperRect = wrapper.getBoundingClientRect();
            const centerX = wrapperRect.left + wrapperRect.width / 2;

            const dayEls = slider.querySelectorAll('.mini-week__day');
            let closest = null,
                minDist = Infinity;

            dayEls.forEach(el => {
                const rect = el.getBoundingClientRect();
                const dist = Math.abs(rect.left + rect.width / 2 - centerX);
                if (dist < minDist) {
                    minDist = dist;
                    closest = el;
                }
            });

            if (closest) {
                const targetLeft = closest.offsetLeft - (wrapper.clientWidth / 2) + (closest.offsetWidth / 2);
                slider.style.scrollBehavior = 'smooth';
                slider.scrollTo({ left: targetLeft });
                setTimeout(() => { slider.style.scrollBehavior = 'auto'; }, 250);
            }
        }

        // --- Mouse Wheel Scrolling ---
        slider.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                slider.scrollBy({ left: e.deltaY, behavior: 'smooth' });
            }
        }, { passive: false });

        // --- Attach Listeners ---
        slider.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        slider.addEventListener('mouseleave', onMouseLeave);
    }

    /* ------------------------- GLOBAL STATUS DOT & TEXT ------------------------- */
    function updateOverallStatus() {
        const dot = document.getElementById('statusDot');
        const text = document.getElementById('statusText');
        if (!dot || !text) return;

        const availableTexts = {
            fa: 'در دسترس برای پروژه‌های جدید',
            en: 'Available for new projects',
            de: 'Verfügbar für neue Projekte',
            it: 'Disponibile per nuovi progetti',
            tr: 'Yeni projeler için müsait',
            ar: 'متاح لمشاريع جديدة'
        };

        const busyTexts = {
            fa: 'در حال حاضر ظرفیت تکمیل است',
            en: 'Currently fully booked',
            de: 'Derzeit ausgebucht',
            it: 'Attualmente al completo',
            tr: 'Şu anda tamamen doluyum',
            ar: 'مكتمل الحجوزات حالياً'
        };

        if (isAvailable) {
            dot.className = 'status-dot';
            text.textContent = availableTexts[CURRENT_LANG] || availableTexts.en;
        } else {
            dot.className = 'status-dot status-dot--busy';
            text.textContent = busyTexts[CURRENT_LANG] || busyTexts.en;
        }
    }

    /* ------------------------- LIVE CLOCK (TEHRAN TIME) ------------------------- */
    function updateLiveClock() {
        const clock = document.getElementById('liveClock');
        if (!clock) return;

        const tehran = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tehran' }));
        clock.textContent = `${String(tehran.getHours()).padStart(2, '0')}:${String(tehran.getMinutes()).padStart(2, '0')}`;
    }

    /* ------------------------- INITIALIZATION & EXPOSED API ------------------------- */
    function init() {
        renderCalendar();
        enableDragScroll('miniWeek');
        updateOverallStatus();
        updateLiveClock();
        setInterval(updateLiveClock, 30000);
    }

    // Public control API
    window.availabilityAPI = {
        setAvailable: (v) => { isAvailable = v; updateOverallStatus(); renderCalendar(); },
        addUnavailableDate: (d) => { MANUAL_UNAVAILABLE_DATES.add(d); renderCalendar(); },
        removeUnavailableDate: (d) => { MANUAL_UNAVAILABLE_DATES.delete(d); renderCalendar(); },
        refresh: () => { renderCalendar(); updateOverallStatus(); },
        getLanguage: () => CURRENT_LANG,
    };

    // Auto‑start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();