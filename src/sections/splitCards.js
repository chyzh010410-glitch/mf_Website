import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const EXIT_CARD_MIN_SCALE = 0.35;
const FLOAT_START_PROGRESS = 0.92;

export function initSplitCards() {
    const sticky = document.querySelector(".sticky");
    const cardContainer = document.querySelector(".card-container");
    const stickyHeader = document.querySelector(".sticky-header h1");
    const progressBar = document.querySelector(".scroll-progress-bar");
    let cardTimeline;
    let exitTimeline;
    let isFloating = false;

    function resetDesktopStyles() {
        sticky.classList.remove("is-floating");
        isFloating = false;
        gsap.set(stickyHeader, { y: 40, opacity: 0 });
        gsap.set(cardContainer, { width: "75%", gap: 0, opacity: 1 });
        gsap.set(".card", { rotationY: 0, x: 0, xPercent: 0, y: 0, yPercent: 0, scale: 1, opacity: 1 });
        gsap.set(".card-float", { rotationY: 0 });
        gsap.set("#card-1", { rotationZ: 0 });
        gsap.set("#card-2", { rotationZ: 0 });
        gsap.set("#card-3", { rotationZ: 0 });
        gsap.set("#card-1", { borderRadius: "20px 0 0 20px" });
        gsap.set("#card-2", { borderRadius: 0 });
        gsap.set("#card-3", { borderRadius: "0 20px 20px 0" });
    }

    function setupCardScroll() {
        ScrollTrigger.getById("split-cards")?.kill();
        ScrollTrigger.getById("split-cards-exit")?.kill();
        cardTimeline?.kill();
        exitTimeline?.kill();

        if (window.innerWidth < 1000) {
            sticky.classList.remove("is-floating");
            isFloating = false;
            document
                .querySelectorAll(".card, .card-float, .card-container, .sticky-header h1")
                .forEach((el) => el.removeAttribute("style"));
            return;
        }

        resetDesktopStyles();

        cardTimeline = gsap.timeline({
            scrollTrigger: {
                id: "split-cards",
                trigger: ".sticky",
                start: "top top",
                end: `+=${window.innerHeight * 2}`,
                scrub: 1,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const shouldFloat = self.progress >= FLOAT_START_PROGRESS;
                    if (shouldFloat !== isFloating) {
                        sticky.classList.toggle("is-floating", shouldFloat);
                        isFloating = shouldFloat;
                    }
                    gsap.set(progressBar, {
                        "--progress": self.progress,
                    });
                },
            },
        });

        cardTimeline.to(stickyHeader, { y: 0, opacity: 1, duration: 0.15, ease: "none" }, 0.1);
        cardTimeline.to(cardContainer, { width: "60%", duration: 0.25, ease: "none" }, 0);
        cardTimeline.to(cardContainer, { gap: 20, duration: 0.2, ease: "power2.out" }, 0.35);
        cardTimeline.to(["#card-1", "#card-2", "#card-3"], {
            borderRadius: 20,
            duration: 0.2,
            ease: "power2.out",
        }, 0.35);

        cardTimeline.to(".card-float", {
            rotationY: 180,
            duration: 0.25,
            ease: "power2.inOut",
            stagger: 0.03,
        }, 0.6);
        cardTimeline.to("#card-1", { y: 30, rotationZ: -15, duration: 0.25, ease: "power2.inOut" }, 0.6);
        cardTimeline.to("#card-3", { y: 30, rotationZ: 15, duration: 0.25, ease: "power2.inOut" }, 0.6);

        exitTimeline = gsap.timeline({
            scrollTrigger: {
                id: "split-cards-exit",
                trigger: ".client-about-panel",
                start: "top 96%",
                end: "top top",
                scrub: 1.2,
                invalidateOnRefresh: true,
            },
        });

        exitTimeline.to(cardContainer, { opacity: 0.5, duration: 1, ease: "none" }, 0);
        exitTimeline.to("#card-1", {
            xPercent: 90,
            yPercent: 250,
            rotationZ: -15,
            scale: EXIT_CARD_MIN_SCALE,
            duration: 1,
            ease: "none",
        }, 0);
        exitTimeline.to("#card-2", {
            xPercent: 0,
            yPercent: 250,
            rotationZ: 0,
            scale: EXIT_CARD_MIN_SCALE,
            duration: 1,
            ease: "none",
        }, 0);
        exitTimeline.to("#card-3", {
            xPercent: -90,
            yPercent: 250,
            rotationZ: 15,
            scale: EXIT_CARD_MIN_SCALE,
            duration: 1,
            ease: "none",
        }, 0);
    }

    setupCardScroll();
    window.addEventListener("resize", () => {
        setupCardScroll();
        ScrollTrigger.refresh();
    });
}
