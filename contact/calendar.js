/* :::::::::::::::::::::::::: SMART 60-DAY CALENDAR :::::::::::::::::::::::::: */
(function () {
  /* :::::::::::::::::::::::::: CONSTANTS :::::::::::::::::::::::::: */

  const RRule =
    window.rrule && window.rrule.RRule
      ? window.rrule.RRule
      : typeof RRule !== "undefined"
        ? RRule
        : null;
  if (!RRule) {
    console.warn(
      "rrule library not available. Recurring events may be skipped.",
    );
  }

  const TRACKED_EVENTS = [
    { title: "Allenamento Parte Superiore A", type: "personal" },
    { title: "Allenamento Parte Inferiore A", type: "personal" },
    { title: "Allenamento Parte Superiore B", type: "personal" },
    { title: "Allenamento Parte Inferiore B", type: "personal" },
  ];

  const MAX_SEO = 2;
  const MAX_DESIGN = 1;

  const WORK_START_HOUR = 9;
  const WORK_END_HOUR = 19;
  const WORK_MINUTES = (WORK_END_HOUR - WORK_START_HOUR) * 60;
  const MIN_FREE_MINUTES_FOR_AVAILABLE = 60;
  const RED_OCCUPIED_MINUTES = 7 * 60;

  const DRAG_SPEED = 2.2;
  const FRICTION = 0.92;
  const MIN_VELOCITY = 0.3;
  const MOMENTUM_STOP_THRESHOLD = 0.5;

  let isAvailable = true;

  /* :::::::::::::::::::::::::: UTILITY FUNCTIONS :::::::::::::::::::::::::: */

  function detectLanguage() {
    const lang = (
      document.documentElement.lang ||
      navigator.language ||
      ""
    ).toLowerCase();
    if (lang.startsWith("fa")) return "fa";
    if (lang.startsWith("ar")) return "ar";
    if (lang.startsWith("de")) return "de";
    if (lang.startsWith("it")) return "it";
    if (lang.startsWith("tr")) return "tr";
    return "en";
  }

  const CURRENT_LANG = detectLanguage();

  const DAY_NAMES = {
    fa: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"],
    ar: [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ],
    en: ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"],
    de: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    it: ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"],
    tr: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
  };

  const MONTH_NAMES = {
    fa: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ],
    ar: [
      "محرم",
      "صفر",
      "ربیع الأول",
      "ربیع الثانی",
      "جمادی الأول",
      "جمادی الثانی",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذو القعدة",
      "ذو الحجة",
    ],
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    de: [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ],
    it: [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ],
    tr: [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ],
  };

  function getDayName(jsDayIndex, lang) {
    const names = DAY_NAMES[lang] || DAY_NAMES["en"];
    return names[jsDayIndex] || "";
  }

  function gregorianToJalali(year, month, day) {
    const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

    let gy = year - 1600;
    let gm = month - 1;
    let gd = day - 1;

    let gDayNo =
      365 * gy +
      Math.floor((gy + 3) / 4) -
      Math.floor((gy + 99) / 100) +
      Math.floor((gy + 399) / 400);
    for (let i = 0; i < gm; i++) gDayNo += gDaysInMonth[i];
    if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0))
      gDayNo++;
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

  function formatDateForDisplay(gregDate, lang) {
    const y = gregDate.getFullYear();
    const m = gregDate.getMonth() + 1;
    const d = gregDate.getDate();

    if (lang === "fa") {
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

    if (lang === "ar") {
      try {
        const fmt = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
          day: "numeric",
          month: "long",
        });
        const parts = fmt.formatToParts(gregDate);
        const hijriDay = parts.find((p) => p.type === "day")?.value || d;
        const hijriMonth = parts.find((p) => p.type === "month")?.value || "";
        return {
          dayNumber: parseInt(hijriDay, 10) || d,
          monthName: hijriMonth,
          monthIndex: m,
          year: y,
          fullLabel: `${hijriDay} ${hijriMonth}`,
        };
      } catch (e) {
        const monthName = MONTH_NAMES.ar[m - 1] || "";
        return {
          dayNumber: d,
          monthName,
          monthIndex: m,
          year: y,
          fullLabel: `${d} ${monthName}`,
        };
      }
    }

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

  function isWeekend(gregDate) {
    return gregDate.getDay() === 0;
  }

  function isHoliday(gregDate) {
    const y = gregDate.getFullYear();
    const m = gregDate.getMonth() + 1;
    const d = gregDate.getDate();
    const jalali = gregorianToJalali(y, m, d);
    if (jalali.month === 1 && jalali.day >= 1 && jalali.day <= 4) return true;
    if ((m === 12 && d >= 25) || (m === 1 && d === 1)) return true;
    return false;
  }

  function getTehranWorkWindow(utcDate) {
    const y = utcDate.getUTCFullYear();
    const m = utcDate.getUTCMonth();
    const d = utcDate.getUTCDate();
    const workStart = new Date(Date.UTC(y, m, d, 5, 30, 0, 0));
    const workEnd = new Date(Date.UTC(y, m, d, 15, 30, 0, 0));
    return { workStart, workEnd };
  }

  function getOverlapMinutes(workStart, workEnd, eventStart, eventEnd) {
    const overlapStart = new Date(
      Math.max(workStart.getTime(), eventStart.getTime()),
    );
    const overlapEnd = new Date(
      Math.min(workEnd.getTime(), eventEnd.getTime()),
    );
    if (overlapEnd <= overlapStart) return 0;
    return (overlapEnd - overlapStart) / 60000;
  }

  function mapRecurrenceType(type) {
    if (!RRule) return 3;
    const map = {
      daily: RRule.DAILY,
      weekly: RRule.WEEKLY,
      monthly: RRule.MONTHLY,
      yearly: RRule.YEARLY,
    };
    return map[type] || RRule.DAILY;
  }

  function isAllDayEvent(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (
      start.getUTCHours() === 0 &&
      start.getUTCMinutes() === 0 &&
      end.getUTCHours() === 0 &&
      end.getUTCMinutes() === 0 &&
      (end - start) % 86400000 === 0
    );
  }

  function expandRecurringEvent(event, rangeStart, rangeEnd) {
    if (isAllDayEvent(event.start_date, event.end_date)) return [];

    if (!event.recurrence_type || event.recurrence_type === "none") {
      const start = new Date(event.start_date);
      const end = new Date(event.end_date);
      if (end >= rangeStart && start <= rangeEnd) return [{ start, end }];
      return [];
    }

    if (!RRule) {
      console.warn(
        "rrule not available, skipping recurring event:",
        event.title,
      );
      return [];
    }

    const duration = new Date(event.end_date) - new Date(event.start_date);
    const options = {
      freq: mapRecurrenceType(event.recurrence_type),
      interval: event.recurrence_interval || 1,
      dtstart: new Date(event.start_date),
      until: event.recurrence_end_date
        ? new Date(event.recurrence_end_date)
        : null,
      count: event.recurrence_count || null,
    };

    if (event.recurrence_days && event.recurrence_type === "weekly") {
      const days = event.recurrence_days.split(",").map(Number);
      const dayMap = [
        RRule.SU,
        RRule.MO,
        RRule.TU,
        RRule.WE,
        RRule.TH,
        RRule.FR,
        RRule.SA,
      ];
      options.byweekday = days.map((d) => dayMap[d]);
    }

    if (event.recurrence_day_of_month && event.recurrence_type === "monthly") {
      options.bymonthday = [event.recurrence_day_of_month];
    }

    if (!options.until && !options.count) options.until = rangeEnd;

    try {
      const rule = new RRule(options);
      const dates = rule.all((date) => date >= rangeStart && date <= rangeEnd);
      return dates.map((date) => {
        const start = new Date(date.getTime());
        const end = new Date(start.getTime() + duration);
        return { start, end };
      });
    } catch (e) {
      console.warn("Error expanding recurring event", event.id, e);
      return [];
    }
  }

  /* :::::::::::::::::::::::::: DATA FETCHING :::::::::::::::::::::::::: */

  async function fetchTrackedEvents() {
    if (TRACKED_EVENTS.length === 0) return [];

    const titles = TRACKED_EVENTS.map((e) => e.title);
    const typeMap = new Map(TRACKED_EVENTS.map((e) => [e.title, e.type]));

    const { data, error } = await supabaseClient
      .from("ravlo")
      .select(
        "id, title, start_date, end_date, recurrence_type, recurrence_interval, recurrence_days, recurrence_day_of_month, recurrence_end_date, recurrence_count",
      )
      .in("title", titles)
      .or("all_day.eq.false,all_day.is.null");

    if (error) {
      console.error("Error fetching events:", error);
      return [];
    }

    const now = new Date();
    const rangeStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const rangeEnd = new Date(rangeStart);
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() + 60);

    const allOccurrences = [];
    for (const event of data || []) {
      const type = typeMap.get(event.title) || "other";
      const occurrences = expandRecurringEvent(event, rangeStart, rangeEnd);
      occurrences.forEach((occ) => {
        occ.type = type;
        allOccurrences.push(occ);
      });
    }
    return allOccurrences;
  }

  /* :::::::::::::::::::::::::: CALENDAR GENERATION :::::::::::::::::::::::::: */

  async function generateDynamicDays() {
    const occurrences = await fetchTrackedEvents();
    const days = [];

    const now = new Date();
    const todayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );

    let lastMonthKey = null;

    for (let i = 0; i < 60; i++) {
      const date = new Date(todayUTC);
      date.setUTCDate(date.getUTCDate() + i);

      const { workStart, workEnd } = getTehranWorkWindow(date);
      const overlapping = occurrences.filter(
        (occ) => occ.start < workEnd && occ.end > workStart,
      );

      const seoCount = overlapping.filter((e) => e.type === "seo").length;
      const designCount = overlapping.filter((e) => e.type === "design").length;

      let occupiedMinutes = 0;
      overlapping.forEach((occ) => {
        occupiedMinutes += getOverlapMinutes(
          workStart,
          workEnd,
          occ.start,
          occ.end,
        );
      });

      const hourlyBusy = new Array(10).fill(false);
      if (overlapping.length > 0) {
        const workStartMs = workStart.getTime();
        for (let h = 0; h < 10; h++) {
          const slotStart = workStartMs + h * 3600000;
          const slotEnd = slotStart + 3600000;
          for (const occ of overlapping) {
            if (
              occ.start.getTime() < slotEnd &&
              occ.end.getTime() > slotStart
            ) {
              hourlyBusy[h] = true;
              break;
            }
          }
        }
      }

      const freeMinutes = Math.max(0, WORK_MINUTES - occupiedMinutes);
      const occupiedPercent = Math.round(
        (occupiedMinutes / WORK_MINUTES) * 100,
      );

      const bothFull = seoCount >= MAX_SEO && designCount >= MAX_DESIGN;
      const anyServiceFull = seoCount >= MAX_SEO || designCount >= MAX_DESIGN;
      const timeExhausted = freeMinutes === 0;
      const tooBusy = occupiedMinutes > RED_OCCUPIED_MINUTES;

      let status;
      if (bothFull || timeExhausted || tooBusy) {
        status = "busy";
      } else if (
        anyServiceFull ||
        freeMinutes < MIN_FREE_MINUTES_FOR_AVAILABLE
      ) {
        status = "partial";
      } else {
        status = "available";
      }

      if (status === "available" && (isWeekend(date) || isHoliday(date))) {
        status = "partial";
      }

      const weekend = isWeekend(date);
      const holiday = isHoliday(date);
      const display = formatDateForDisplay(date, CURRENT_LANG);
      const dayName = getDayName(date.getDay(), CURRENT_LANG);
      const monthKey = `${display.year}-${display.monthIndex}`;

      days.push({
        date,
        status,
        display,
        dayName,
        isNewMonth: lastMonthKey !== null && monthKey !== lastMonthKey,
        monthKey,
        seoCount,
        designCount,
        freeMinutes,
        occupiedPercent,
        weekend,
        holiday,
        hourlyBusy,
      });

      lastMonthKey = monthKey;
    }
    return days;
  }

  /* :::::::::::::::::::::::::: TOOLTIP :::::::::::::::::::::::::: */

  let tooltipEl = null;

  function getTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.id = "dayTooltip";
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  }

  function showTooltip(card, day) {
    const tip = getTooltip();
    tip.innerHTML = "";

    // Always left-to-right – first block 9 to 10
    tip.setAttribute("dir", "ltr");

    for (let i = 0; i < day.hourlyBusy.length; i++) {
      const block = document.createElement("span");
      block.className = "hour-block " + (day.hourlyBusy[i] ? "busy" : "free");
      tip.appendChild(block);
    }

    const rect = card.getBoundingClientRect();
    tip.style.left = rect.left + rect.width / 2 + "px";
    tip.style.top = rect.top + "px";
    tip.style.transform = "translate(-50%, -100%)";
    tip.style.marginTop = "-6px";
    tip.style.display = "flex";
  }

  function hideTooltip() {
    const tip = getTooltip();
    tip.style.display = "none";
  }

  /* :::::::::::::::::::::::::: RENDERING :::::::::::::::::::::::::: */

  async function renderCalendar() {
    const container = document.getElementById("miniWeek");
    if (!container) return;

    const days = await generateDynamicDays();
    container.innerHTML = "";

    days.forEach((day) => {
      if (day.isNewMonth && day.display.monthName) {
        const sep = document.createElement("div");
        sep.className = "mini-week__month-separator";
        sep.textContent = day.display.monthName;
        container.appendChild(sep);
      }

      let statusClass = "",
        dotClass = "";
      if (day.status === "available") {
        statusClass = "mini-week__day--available";
        dotClass = "mini-week__day-dot--green";
      } else if (day.status === "partial") {
        statusClass = "mini-week__day--partial";
        dotClass = "mini-week__day-dot--yellow";
      } else {
        statusClass = "mini-week__day--busy";
        dotClass = "mini-week__day-dot--red";
      }

      const el = document.createElement("div");
      el.className = `mini-week__day ${statusClass}`;
      if (day.weekend) el.classList.add("mini-week__day--weekend");
      if (day.holiday) el.classList.add("mini-week__day--holiday");

      el.innerHTML = `
                <div class="mini-week__day-name">${day.dayName}</div>
                <div class="mini-week__day-date">${day.display.dayNumber}</div>
                <div class="mini-week__day-dot ${dotClass}"></div>
            `;

      const barContainer = document.createElement("div");
      barContainer.className = "mini-week__day-bar";
      const barFill = document.createElement("div");
      barFill.className = "mini-week__day-bar-fill";
      barFill.style.width = day.occupiedPercent + "%";
      barContainer.appendChild(barFill);
      el.appendChild(barContainer);

      el.addEventListener("mouseenter", () => showTooltip(el, day));
      el.addEventListener("mouseleave", hideTooltip);

      container.appendChild(el);
    });

    container.scrollLeft = 0;
    updateCapacityText(days);
    updateOverallStatus(days);
  }

  function updateCapacityText(days) {
    const el = document.getElementById("capacityText");
    if (!el) return;

    const todayIndex = days.findIndex(
      (d) => d.date.toDateString() === new Date().toDateString(),
    );
    const today = days[todayIndex] || days[0];

    const seoRemaining = Math.max(0, MAX_SEO - today.seoCount);
    const designRemaining = Math.max(0, MAX_DESIGN - today.designCount);

    const formatNumber = (num, lang) => {
      if (lang === "fa") {
        return String(num).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
      }
      return new Intl.NumberFormat(lang).format(num);
    };

    const translations = {
      fa: (seo, design) =>
        `ظرفیت: ${formatNumber(seo, "fa")} جای خالی برای پروژه سئو و ${formatNumber(design, "fa")} جای خالی برای طراحی سایت`,
      en: (seo, design) =>
        `Capacity: ${formatNumber(seo, "en")} open slots for SEO projects and ${formatNumber(design, "en")} for web design`,
      de: (seo, design) =>
        `Kapazität: ${formatNumber(seo, "de")} freie Plätze für SEO-Projekte und ${formatNumber(design, "de")} für Webdesign`,
      it: (seo, design) =>
        `Capacità: ${formatNumber(seo, "it")} slot liberi per progetti SEO e ${formatNumber(design, "it")} per web design`,
      tr: (seo, design) =>
        `Kapasite: ${formatNumber(seo, "tr")} SEO projesi için boş yer, ${formatNumber(design, "tr")} web tasarım için`,
      ar: (seo, design) =>
        `السعة: ${formatNumber(seo, "ar")} فتحة متاحة لمشاريع السيو و ${formatNumber(design, "ar")} لتصميم المواقع`,
    };

    const translateFn = translations[CURRENT_LANG] || translations["en"];
    el.textContent = translateFn(seoRemaining, designRemaining);
  }

  function updateOverallStatus(days) {
    const hasAvailable = days.some((day) => day.status === "available");
    isAvailable = hasAvailable;

    const dot = document.getElementById("statusDot");
    const text = document.getElementById("statusText");
    if (!dot || !text) return;

    const availableTexts = {
      fa: "در دسترس برای پروژه‌های جدید",
      en: "Available for new projects",
      de: "Verfügbar für neue Projekte",
      it: "Disponibile per nuovi progetti",
      tr: "Yeni projeler için müsait",
      ar: "متاح لمشاريع جديدة",
    };
    const busyTexts = {
      fa: "در حال حاضر ظرفیت تکمیل است",
      en: "Currently fully booked",
      de: "Derzeit ausgebucht",
      it: "Attualmente al completo",
      tr: "Şu anda tamamen doluyum",
      ar: "مكتمل الحجوزات حالياً",
    };

    if (isAvailable) {
      dot.className = "status-dot";
      text.textContent = availableTexts[CURRENT_LANG] || availableTexts.en;
    } else {
      dot.className = "status-dot status-dot--busy";
      text.textContent = busyTexts[CURRENT_LANG] || busyTexts.en;
    }
  }

  /* :::::::::::::::::::::::::: DRAG SCROLL :::::::::::::::::::::::::: */

  function enableDragScroll(containerId) {
    const slider = document.getElementById(containerId);
    if (!slider) return;

    let isDown = false,
      startX = 0,
      scrollStart = 0,
      velX = 0,
      lastMoveX = 0,
      momentumID = null;
    slider.style.scrollBehavior = "auto";

    function onMouseDown(e) {
      isDown = true;
      slider.classList.add("active");
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
        slider.classList.remove("active");
        startMomentum();
      }
    }

    function onMouseUp() {
      if (isDown) {
        isDown = false;
        slider.classList.remove("active");
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
      const dayEls = slider.querySelectorAll(".mini-week__day");
      let closest = null,
        minDist = Infinity;
      dayEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width / 2 - centerX);
        if (dist < minDist) {
          minDist = dist;
          closest = el;
        }
      });
      if (closest) {
        const targetLeft =
          closest.offsetLeft -
          wrapper.clientWidth / 2 +
          closest.offsetWidth / 2;
        slider.style.scrollBehavior = "smooth";
        slider.scrollTo({ left: targetLeft });
        setTimeout(() => {
          slider.style.scrollBehavior = "auto";
        }, 250);
      }
    }

    slider.addEventListener(
      "wheel",
      (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          slider.scrollBy({ left: e.deltaY, behavior: "smooth" });
        }
      },
      { passive: false },
    );

    slider.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    slider.addEventListener("mouseleave", onMouseLeave);
  }

  /* :::::::::::::::::::::::::: LIVE CLOCK :::::::::::::::::::::::::: */

  function updateLiveClock() {
    const clock = document.getElementById("liveClock");
    if (!clock) return;
    const tehran = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Tehran" }),
    );
    clock.textContent = `${String(tehran.getHours()).padStart(2, "0")}:${String(tehran.getMinutes()).padStart(2, "0")}`;
  }

  /* :::::::::::::::::::::::::: INITIALIZATION :::::::::::::::::::::::::: */

  async function init() {
    await renderCalendar();
    enableDragScroll("miniWeek");
    updateLiveClock();
    setInterval(updateLiveClock, 30000);
  }

  window.availabilityAPI = {
    refresh: () => renderCalendar(),
    getLanguage: () => CURRENT_LANG,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
