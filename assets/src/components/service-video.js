document.addEventListener("DOMContentLoaded", () => {
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
        const src = video.getAttribute("src");
        if (!src) return;

        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.loop = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");

        const setPlaying = (on) => box.classList.toggle("is-playing", on);

        const tryPlay = async () => {
            try {
                await video.play();
                setPlaying(true);
            } catch (err) {
                setPlaying(false);
                console.warn("[service-video] play failed:", src, "→", err.name, err.message);
            }
        };

        const stop = () => {
            try { video.pause(); } catch (e) {}
            setPlaying(false);
        };

        video.addEventListener("error", () => {
            console.error(
                "[service-video] load error:",
                src,
                "→ کد:",
                video.error && video.error.code,
                video.error && video.error.message,
            );
        });

        if (isTouch) {
            const io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((e) => {
                        if (e.isIntersecting) tryPlay();
                        else stop();
                    });
                },
                {
                    threshold: 0.25,
                    rootMargin: "0px 0px -10% 0px",
                },
            );
            io.observe(box);

            if (video.readyState === 0) video.load();
            return;
        }

        let videoOk = false;
        video.addEventListener("loadeddata", () => { videoOk = true; });
        video.addEventListener("error", () => { videoOk = false; });
        if (video.readyState === 0) video.load();

        box.addEventListener("mouseenter", () => {
            if (!videoOk) return;
            setPlaying(true);
            video.play().catch((err) =>
                console.warn("[service-video] hover play failed:", src, err.name),
            );
        });
        box.addEventListener("mouseleave", () => {
            video.pause();
            try { video.currentTime = 0; } catch (e) {}
            setPlaying(false);
        });
    });
});