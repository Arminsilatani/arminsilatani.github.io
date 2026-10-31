document.addEventListener("DOMContentLoaded", () => {
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  
  if (!isTouchDevice) {
    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");
    
    if (!cursor || !follower) return;

    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    const xToFollower = gsap.quickTo(follower, "x", { duration: 0.5, ease: "power3" });
    const yToFollower = gsap.quickTo(follower, "y", { duration: 0.5, ease: "power3" });

    let currentState = "default";
    let isLight = false;
    let lastX = 0, lastY = 0;
    let rafPending = false;

    // ==================================================
    // SCROLL MODE
    // ==================================================
    let scrollModeActive = false;
    let scrollStartY = 0;
    let scrollSpeed = 0;
    let scrollRAF = null;

    const SCROLL_DEAD_ZONE = 25;
    const SCROLL_MULTIPLIER = 0.15;
    const SCROLL_MAX_SPEED = 10;

    function findScrollContainer() {
      const docEl = document.documentElement;
      const body = document.body;
      if (docEl.scrollHeight > docEl.clientHeight) return docEl;
      if (body.scrollHeight > body.clientHeight) return body;
      const candidates = document.querySelectorAll('main, [data-scroll-container], .scroll-container, .page-wrapper');
      for (const el of candidates) {
        const style = getComputedStyle(el);
        if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
          return el;
        }
      }
      return docEl;
    }

    let savedScrollBehaviors = null;
    
    function disableSmoothScroll() {
      savedScrollBehaviors = [];
      const targets = [document.documentElement, document.body];
      const container = findScrollContainer();
      if (container !== document.documentElement && container !== document.body) targets.push(container);
      targets.forEach(el => {
        if (!el || !el.style) return;
        savedScrollBehaviors.push({ el, value: el.style.scrollBehavior || '' });
        el.style.setProperty('scroll-behavior', 'auto', 'important');
      });
    }

    function restoreSmoothScroll() {
      if (!savedScrollBehaviors) return;
      savedScrollBehaviors.forEach(({ el, value }) => {
        if (!el || !el.style) return;
        if (value) el.style.setProperty('scroll-behavior', value);
        else el.style.removeProperty('scroll-behavior');
      });
      savedScrollBehaviors = null;
    }

    function instantScroll(step) {
      const container = findScrollContainer();
      if (container === document.documentElement || container === document.body) {
        try { window.scrollBy({ top: step, left: 0, behavior: 'instant' }); }
        catch(e) {
          const currentY = window.scrollY || window.pageYOffset || 0;
          window.scrollTo(0, currentY + step);
        }
      } else {
        container.scrollTop += step;
      }
    }

    function computeScrollSpeed(delta) {
      const absDelta = Math.abs(delta);
      if (absDelta < SCROLL_DEAD_ZONE) return 0;
      const rawSpeed = (absDelta - SCROLL_DEAD_ZONE) * SCROLL_MULTIPLIER;
      const cappedSpeed = Math.min(rawSpeed, SCROLL_MAX_SPEED);
      return delta > 0 ? cappedSpeed : -cappedSpeed;
    }

    function autoScrollLoop() {
      if (!scrollModeActive) return;
      const step = Math.round(scrollSpeed);
      if (step !== 0) instantScroll(step);
      scrollRAF = requestAnimationFrame(autoScrollLoop);
    }

    const ALL_MODES = ['link-mode', 'text-mode', 'card-mode', 'drag-mode', 'disabled-mode', 
                       'scroll-up-mode', 'scroll-down-mode', 'download-mode', 'tel-mode', 
                       'mail-mode', 'send-mode', 'toggle-closed-mode', 'toggle-open-mode', 'btt-mode'];

    function enterScrollMode(clientY) {
      scrollModeActive = true;
      scrollStartY = clientY;
      scrollSpeed = 0;
      disableSmoothScroll();
      cursor.classList.add('scroll-mode');
      follower.classList.add('scroll-mode');
      cursor.classList.remove(...ALL_MODES);
      follower.classList.remove(...ALL_MODES);
      if (scrollRAF) cancelAnimationFrame(scrollRAF);
      scrollRAF = requestAnimationFrame(autoScrollLoop);
    }

    function exitScrollMode() {
      if (!scrollModeActive) return;
      scrollModeActive = false;
      scrollSpeed = 0;
      if (scrollRAF) { cancelAnimationFrame(scrollRAF); scrollRAF = null; }
      restoreSmoothScroll();
      cursor.classList.remove('scroll-mode');
      follower.classList.remove('scroll-mode');
    }

    // ==================================================
    // تشخیص Back-to-Top
    // ==================================================
    function isOverBackToTop(x, y) {
      const el = document.elementFromPoint(x, y);
      if (!el) return false;
      
      let check = el;
      let safety = 0;
      
      while (check && safety < 10) {
        if (check.tagName === 'BACK-TO-TOP' || (check.matches && check.matches('back-to-top'))) {
          return true;
        }
        if (check.parentElement) {
          check = check.parentElement;
        } else {
          try {
            const root = check.getRootNode && check.getRootNode();
            check = (root && root.host) || null;
          } catch(e) { check = null; }
        }
        safety++;
      }
      return false;
    }

    function forceBttState() {
      if (currentState === 'btt') return;
      currentState = 'btt';
      cursor.classList.remove(...ALL_MODES);
      follower.classList.remove(...ALL_MODES);
      cursor.classList.add('btt-mode');
      follower.classList.add('btt-mode');
      applyLight(isLight);
    }

    function clearBttState() {
      if (currentState !== 'btt') return;
      currentState = 'default';
      cursor.classList.remove(...ALL_MODES);
      follower.classList.remove(...ALL_MODES);
      applyLight(isLight);
    }

    // ==================================================
    // تشخیص حالت toggle
    // ==================================================
    function getToggleState(el) {
      if (!(el instanceof Element)) return null;
      
      const isToggle = 
        el.hasAttribute('aria-expanded') ||
        el.classList.contains('process-box') ||
        el.classList.contains('faq-question') ||
        (el.getAttribute && el.getAttribute('data-cursor') === 'toggle') ||
        el.hasAttribute('data-toggle');
      
      if (!isToggle) return null;
      
      if (el.hasAttribute('aria-expanded')) {
        return el.getAttribute('aria-expanded') === 'true' ? 'open' : 'closed';
      }
      
      if (el.classList.contains('process-box')) {
        if (el.classList.contains('is-open')) return null;
        let parent = el.parentElement;
        let depth = 0;
        while (parent && depth < 3) {
          if (parent.classList.contains('is-open')) return null;
          parent = parent.parentElement;
          depth++;
        }
        return 'closed';
      }
      
      if (el.classList.contains('is-open')) return 'open';
      
      let parent = el.parentElement;
      let depth = 0;
      while (parent && depth < 3) {
        if (parent.classList.contains('is-open')) return 'open';
        parent = parent.parentElement;
        depth++;
      }
      return 'closed';
    }

    function isDownloadElement(el) {
      if (!(el instanceof Element)) return false;
      if (el.hasAttribute && el.hasAttribute('download')) return true;
      if (el.getAttribute && el.getAttribute('data-cursor') === 'download') return true;
      if (el.hasAttribute && (
        el.hasAttribute('data-download') ||
        el.hasAttribute('data-export') ||
        el.hasAttribute('data-print')
      )) return true;
      if (el.attributes) {
        for (let i = 0; i < el.attributes.length; i++) {
          const name = el.attributes[i].name.toLowerCase();
          if (name.includes('download') || name.includes('export') || name.includes('print')) return true;
        }
      }
      return false;
    }

    function isTelElement(el) {
      if (!(el instanceof Element)) return false;
      const href = el.getAttribute && el.getAttribute('href');
      if (href && href.trim().toLowerCase().startsWith('tel:')) return true;
      if (el.getAttribute && el.getAttribute('data-cursor') === 'tel') return true;
      return false;
    }

    function isMailElement(el) {
      if (!(el instanceof Element)) return false;
      const href = el.getAttribute && el.getAttribute('href');
      if (href && href.trim().toLowerCase().startsWith('mailto:')) return true;
      if (el.getAttribute && el.getAttribute('data-cursor') === 'mail') return true;
      return false;
    }

    function isSendElement(el) {
      if (!(el instanceof Element)) return false;
      const manual = el.getAttribute && el.getAttribute('data-cursor');
      if (manual === 'send' || manual === 'upload') return true;
      if (el.hasAttribute && (el.hasAttribute('data-send') || el.hasAttribute('data-upload'))) return true;
      if (el.matches && el.matches('input[type="file"]')) return true;
      if (el.matches && el.matches('input[type="submit"], button[type="submit"]')) return true;
      if (el.tagName === 'BUTTON' && !el.getAttribute('type') && el.closest && el.closest('form')) return true;
      if (el.tagName === 'LABEL' && el.getAttribute && el.getAttribute('for')) {
        try {
          const target = document.getElementById(el.getAttribute('for'));
          if (target && target.matches && target.matches('input[type="file"]')) return true;
        } catch(e) {}
      }
      return false;
    }

    function getAnchorDirection(el) {
      const manual = el.getAttribute && el.getAttribute('data-cursor');
      if (manual === 'up') return 'up';
      if (manual === 'down') return 'down';
      
      const href = el.getAttribute && el.getAttribute('href');
      if (!href || !href.includes('#')) return null;
      
      const hashIndex = href.indexOf('#');
      const path = href.slice(0, hashIndex);
      const hash = href.slice(hashIndex + 1);
      
      let isSamePage = false;
      if (path === '' || path === '#' || path === location.pathname) {
        isSamePage = true;
      } else {
        try {
          const url = new URL(href, location.href);
          if (url.pathname === location.pathname && url.search === location.search) isSamePage = true;
        } catch(e) {}
      }
      if (!isSamePage) return null;
      
      if (!hash) return 'up';
      
      let target = null;
      try { target = document.getElementById(decodeURIComponent(hash)); } catch(e) {}
      if (!target) {
        try { target = document.querySelector(`[name="${CSS.escape(hash)}"]`); } catch(e) {}
      }
      if (!target) return null;
      
      const rect = target.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) return null;
      return rect.top > 0 ? 'down' : 'up';
    }

    // ==================================================
    // تشخیص روشن بودن پس‌زمینه (نسخه اصلاح‌شده)
    // ==================================================
    function parseColor(str) {
      if (!str || str === 'none' || str === 'transparent') return null;
      let m = str.match(/rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)\s*(?:[,/]\s*([\d.]+))?\s*\)/);
      if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? parseFloat(m[4]) : 1 };
      m = str.match(/^#([0-9a-fA-F]{3,8})$/);
      if (m) {
        const h = m[1];
        if (h.length === 3) return { r: parseInt(h[0]+h[0],16), g: parseInt(h[1]+h[1],16), b: parseInt(h[2]+h[2],16), a: 1 };
        if (h.length === 6) return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16), a: 1 };
        if (h.length === 8) return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16), a: parseInt(h.slice(6,8),16)/255 };
      }
      return null;
    }

    function luminance(c) {
      if (!c) return 0;
      return (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
    }

    function getAllElementsAtPoint(x, y) {
      const all = [];
      const seen = new Set();
      try {
        document.elementsFromPoint(x, y).forEach(el => {
          if (el instanceof Element && !seen.has(el)) { seen.add(el); all.push(el); }
        });
      } catch(e) {}
      let i = 0;
      while (i < all.length && i < 100) {
        const el = all[i];
        if (el.shadowRoot) {
          try {
            const inner = el.shadowRoot.elementsFromPoint(x, y);
            if (inner) inner.forEach(e => {
              if (e instanceof Element && !seen.has(e)) { seen.add(e); all.push(e); }
            });
          } catch(e) {}
        }
        i++;
      }
      return all;
    }

    // ✅ تابع اصلاح‌شده: شبه‌المان‌های نامرئی (opacity < 0.5) نادیده گرفته می‌شوند
    function detectLight(x, y) {
      const els = getAllElementsAtPoint(x, y);
      for (const el of els) {
        if (!(el instanceof Element)) continue;
        const tag = el.tagName;
        if (tag === 'IMG' || tag === 'VIDEO' || tag === 'PICTURE' || tag === 'CANVAS' || tag === 'IFRAME') continue;
        
        // ---- بررسی المان اصلی (فقط اگر قابل مشاهده باشد) ----
        try {
          const s = getComputedStyle(el);
          const elOpacity = parseFloat(s.opacity);
          if (elOpacity >= 0.5) {
            const bg = parseColor(s.backgroundColor);
            if (bg && bg.a > 0.5) return luminance(bg) > 0.6;
            
            if (s.backgroundImage && s.backgroundImage.includes('gradient')) {
              const matches = s.backgroundImage.match(/rgba?\([^)]+\)/g);
              if (matches && matches.length > 0) {
                const c = parseColor(matches[matches.length - 1]);
                if (c && c.a > 0.5) return luminance(c) > 0.6;
              }
            }
            
            if (el instanceof SVGElement && s.fill && s.fill !== 'none' && !s.fill.startsWith('url(')) {
              const fill = parseColor(s.fill);
              if (fill && fill.a > 0.5) return luminance(fill) > 0.6;
            }
          }
        } catch(e) {}
        
        // ---- بررسی ::before — فقط اگر واقعاً دیده شود (opacity >= 0.5) ----
        try {
          const b = getComputedStyle(el, '::before');
          const bOpacity = parseFloat(b.opacity);
          if (b.content !== 'none' && b.content !== 'normal' && bOpacity >= 0.5) {
            const bg = parseColor(b.backgroundColor);
            if (bg && bg.a > 0.5) return luminance(bg) > 0.6;
            
            if (b.backgroundImage && b.backgroundImage.includes('gradient')) {
              const matches = b.backgroundImage.match(/rgba?\([^)]+\)/g);
              if (matches && matches.length > 0) {
                const c = parseColor(matches[matches.length - 1]);
                if (c && c.a > 0.5) return luminance(c) > 0.6;
              }
            }
          }
        } catch(e) {}
        
        // ---- بررسی ::after — فقط اگر واقعاً دیده شود ----
        try {
          const a = getComputedStyle(el, '::after');
          const aOpacity = parseFloat(a.opacity);
          if (a.content !== 'none' && a.content !== 'normal' && aOpacity >= 0.5) {
            const bg = parseColor(a.backgroundColor);
            if (bg && bg.a > 0.5) return luminance(bg) > 0.6;
          }
        } catch(e) {}
      }
      return false;
    }

    function applyLight(light) {
      cursor.classList.toggle("on-light", light);
      follower.classList.toggle("on-light", light);
    }

    // ==================================================
    // mousedown — Toggle اسکرول
    // ==================================================
    window.addEventListener('mousedown', (e) => {
      const interactive = e.target.closest && e.target.closest('a[href], button, input, textarea, select, [contenteditable="true"]');
      if (scrollModeActive) {
        if (e.button === 1 && interactive) { exitScrollMode(); return; }
        if (e.button === 1) { e.preventDefault(); exitScrollMode(); return; }
        exitScrollMode();
        return;
      }
      if (e.button !== 1) return;
      if (interactive) return;
      e.preventDefault();
      enterScrollMode(e.clientY);
    });

    // ==================================================
    // mousemove
    // ==================================================
    window.addEventListener('mousemove', (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      
      if (scrollModeActive) scrollSpeed = computeScrollSpeed(e.clientY - scrollStartY);

      gsap.to(cursor, { opacity: 1, duration: 0.3, overwrite: "auto" });
      gsap.to(follower, { opacity: 1, duration: 0.3, overwrite: "auto" });
      xTo(lastX); yTo(lastY);
      xToFollower(lastX); yToFollower(lastY);

      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          rafPending = false;
          const nowLight = detectLight(lastX, lastY);
          if (nowLight !== isLight) { isLight = nowLight; applyLight(isLight); }
          
          if (!scrollModeActive) {
            if (isOverBackToTop(lastX, lastY)) {
              if (currentState !== 'btt') forceBttState();
            } else if (currentState === 'btt') {
              clearBttState();
            }
          }
        });
      }
    });

    window.addEventListener('blur', exitScrollMode);
    document.addEventListener('mouseleave', () => {
      gsap.to([cursor, follower], { opacity: 0, duration: 0.3 });
    });

    // ==================================================
    // handleMouseOver
    // ==================================================
    function handleMouseOver(e) {
      if (scrollModeActive) return;
      
      const elements = [];
      if (e.target instanceof Element) elements.push(e.target);
      if (e.composedPath) {
        e.composedPath().forEach(el => {
          if (el instanceof Element && !elements.includes(el)) elements.push(el);
        });
      }

      elements.forEach(el => {
        if (el.style && el.style.cursor !== 'none') {
          el.style.setProperty('cursor', 'none', 'important');
        }
      });

      let isDisabled = false, isText = false, isCard = false, isLink = false, isDrag = false;
      let anchorUp = false, anchorDown = false, isDownload = false, isTel = false, isMail = false, isSend = false;
      let isToggleOpen = false, isToggleClosed = false, isBtt = false;
      
      for (const el of elements) {
        if (el.tagName === 'BACK-TO-TOP' || (el.matches && el.matches('back-to-top'))) {
          isBtt = true;
        } else if (el.matches('[disabled], .disabled, button:disabled, input:disabled')) {
          isDisabled = true;
        } else if (el.matches("input[type='text'], input[type='email'], input[type='password'], input[type='search'], input[type='number'], input[type='tel'], input[type='url'], textarea")) {
          isText = true;
        } else if (el.matches("[draggable='true'], .draggable")) {
          isDrag = true;
        } else if (isDownloadElement(el)) {
          isDownload = true;
        } else if (isTelElement(el)) {
          isTel = true;
        } else if (isMailElement(el)) {
          isMail = true;
        } else if (isSendElement(el)) {
          isSend = true;
        } else if (el.matches("[aria-expanded], .process-box, .faq-question, [data-cursor='toggle'], [data-toggle]")) {
          const state = getToggleState(el);
          if (state === 'open') isToggleOpen = true;
          else if (state === 'closed') isToggleClosed = true;
        } else if (el.matches("a[href], button, [data-cursor]")) {
          const dir = getAnchorDirection(el);
          if (dir === 'up') anchorUp = true;
          else if (dir === 'down') anchorDown = true;
          else if (el.matches(".service-card, .blog-card, .portfolio-item")) isCard = true;
          else if (el.matches("a, button, [role='button'], .btn, input[type='submit'], [onclick]")) isLink = true;
        } else if (el.matches(".service-card, .blog-card, .portfolio-item")) {
          isCard = true;
        } else if (el.matches("a, button, [role='button'], .btn, input[type='submit'], [onclick]")) {
          isLink = true;
        }
      }

      let newState = "default";
      if (isDisabled) newState = "disabled";
      else if (isText) newState = "text";
      else if (isDownload) newState = "download";
      else if (isTel) newState = "tel";
      else if (isMail) newState = "mail";
      else if (isSend) newState = "send";
      else if (isToggleOpen) newState = "toggle-open";
      else if (isToggleClosed) newState = "toggle-closed";
      else if (isBtt) newState = "btt";
      else if (anchorUp) newState = "scroll-up";
      else if (anchorDown) newState = "scroll-down";
      else if (isCard) newState = "card";
      else if (isLink) newState = "link";
      else if (isDrag) newState = "drag";

      if (newState !== currentState) {
        currentState = newState;
        cursor.classList.remove(...ALL_MODES);
        follower.classList.remove(...ALL_MODES);
        if (newState !== "default") {
          cursor.classList.add(newState + "-mode");
          follower.classList.add(newState + "-mode");
        }
        applyLight(isLight);
      }
    }

    document.addEventListener("mouseover", handleMouseOver, true);

    document.addEventListener('click', () => {
      requestAnimationFrame(() => {
        const el = document.elementFromPoint(lastX, lastY);
        if (!el) return;
        const path = [];
        let e = el;
        while (e) {
          path.push(e);
          e = e.parentElement;
        }
        handleMouseOver({ target: el, composedPath: () => path });
      });
    }, true);

    function attachToShadowRoots(root = document) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
      let node = walker.currentNode;
      while (node) {
        if (node.shadowRoot) {
          if (!node.shadowRoot._cursorAttached) {
            node.shadowRoot._cursorAttached = true;
            node.shadowRoot.addEventListener("mouseover", handleMouseOver, true);
            if (!node.shadowRoot.querySelector('#global-cursor-none-style')) {
              const style = document.createElement('style');
              style.id = 'global-cursor-none-style';
              style.textContent = '*, *::before, *::after { cursor: none !important; }';
              node.shadowRoot.appendChild(style);
            }
          }
          attachToShadowRoots(node.shadowRoot);
        }
        node = walker.nextNode();
      }
    }

    attachToShadowRoots();
    const observer = new MutationObserver(() => attachToShadowRoots());
    observer.observe(document.body, { childList: true, subtree: true });
  }
});