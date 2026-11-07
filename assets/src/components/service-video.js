document.addEventListener("DOMContentLoaded", () => {
    /* :::::::::::::::::::::::::: TOUCH DETECTION :::::::::::::::::::::::::: */
    const isTouch =
        window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window;

    document.querySelectorAll(".tv-static-container").forEach((box) => {
        const video = box.querySelector("video.service-video");
        if (!video) return;

        if (!video.getAttribute("src") && video.dataset.src) {
            video.setAttribute("src", video.dataset.src);
        }
        if (!video.getAttribute("src")) return;

        /* :::::::::::::::::::::::::: MOBILE: PLAY ON VIEWPORT ENTRY :::::::::::::::::::::::::: */
        if (isTouch) {
            video.muted = true;
            video.defaultMuted = true;
            video.playsInline = true;
            video.loop = true;
            video.setAttribute("muted", "");
            video.setAttribute("playsinline", "");
            video.setAttribute("webkit-playsinline", "");

            const tryPlay = async () => {
                try {
                    await video.play();
                    box.classList.add("is-playing");
                } catch (err) {
                    box.classList.remove("is-playing");
                }
            };

            const stop = () => {
                try { video.pause(); } catch (e) {}
                box.classList.remove("is-playing");
            };

            new IntersectionObserver(
                (entries) => {
                    entries.forEach((e) => {
                        if (e.isIntersecting) tryPlay();
                        else stop();
                    });
                },
                {
                    threshold: 0.25,
                    rootMargin: "0px 0px -10% 0px"
                }
            ).observe(box);

            video.load();
            return;
        }

        /* :::::::::::::::::::::::::: DESKTOP: PLAY ON HOVER :::::::::::::::::::::::::: */
        let videoOk = false;
        video.addEventListener("loadeddata", () => { videoOk = true; });
        video.addEventListener("error", () => { videoOk = false; });
        video.load();

        box.addEventListener("mouseenter", () => {
            if (!videoOk) return;
            box.classList.add("is-playing");
            video.play().catch(() => {});
        });
        box.addEventListener("mouseleave", () => {
            video.pause();
            try { video.currentTime = 0; } catch (e) {}
            box.classList.remove("is-playing");
        });
    });
});