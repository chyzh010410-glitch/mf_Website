import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const smoothStep = (progress) => progress * progress * (3 - 2 * progress);
const FLIP_PROGRESS_SPAN = 0.18;
const SPREAD_START_PROGRESS = 0.36;
const SETTLED_CARD_PROGRESS = 0.84;

export function initClientPanels() {
    const servicesPanel = document.querySelector(".client-services-panel");
    const servicesHeader = document.querySelector(".client-services-header");
    const cards = gsap.utils.toArray(".client-panel-card");

    if (!servicesPanel || cards.length === 0) {
        return;
    }

    function setupPanelScroll() {
        ScrollTrigger.getById("client-services-pin")?.kill();
        ScrollTrigger.getById("client-services-cards")?.kill();

        if (servicesHeader) {
            gsap.set(servicesHeader, { y: "360%" });
        }
        cards.forEach((card, index) => {
            gsap.set(card, {
                opacity: 0,
                yPercent: -100,
                xPercent: index === 0 ? 100 : index === 1 ? 0 : -100,
                rotation: index === 0 ? -5 : index === 1 ? 0 : 5,
                scale: 0.25,
                force3D: true,
            });
            gsap.set(card.querySelector(".client-panel-card-inner"), { rotationY: 0 });
        });

        ScrollTrigger.create({
            id: "client-services-pin",
            trigger: servicesPanel,
            start: "top top",
            end: `+=${window.innerHeight * 2}`,
            pin: true,
            pinSpacing: true,
        });

        ScrollTrigger.create({
            id: "client-services-cards",
            trigger: servicesPanel,
            start: "top 45%",
            end: `+=${window.innerHeight * 3}`,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                if (servicesHeader) {
                    const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
                    const headerY = gsap.utils.interpolate("360%", "0%", smoothStep(headerProgress));
                    gsap.set(servicesHeader, { y: headerY });
                }

                cards.forEach((card, index) => {
                    const delay = index * 0.5;
                    const cardProgress = gsap.utils.clamp(
                        0,
                        1,
                        (progress - delay * 0.1) / (0.9 - delay * 0.1)
                    );
                    const innerCard = card.querySelector(".client-panel-card-inner");

                    let yPercent;
                    if (cardProgress < 0.4) {
                        yPercent = gsap.utils.interpolate(-100, 50, smoothStep(cardProgress / 0.4));
                    } else if (cardProgress < 0.6) {
                        yPercent = gsap.utils.interpolate(50, 0, smoothStep((cardProgress - 0.4) / 0.2));
                    } else {
                        yPercent = 0;
                    }

                    let scale;
                    if (cardProgress < 0.4) {
                        scale = gsap.utils.interpolate(0.25, 0.75, smoothStep(cardProgress / 0.4));
                    } else if (cardProgress < 0.6) {
                        scale = gsap.utils.interpolate(0.75, 1, smoothStep((cardProgress - 0.4) / 0.2));
                    } else {
                        scale = 1;
                    }

                    const opacity = cardProgress < 0.2 ? smoothStep(cardProgress / 0.2) : 1;

                    const spreadProgress = smoothStep(gsap.utils.clamp(
                        0,
                        1,
                        (cardProgress - SPREAD_START_PROGRESS) / (SETTLED_CARD_PROGRESS - SPREAD_START_PROGRESS)
                    ));
                    const startXPercent = index === 0 ? 100 : index === 1 ? 0 : -100;
                    const startRotate = index === 0 ? -5 : index === 1 ? 0 : 5;
                    let xPercent = gsap.utils.interpolate(startXPercent, 0, spreadProgress);
                    let rotate = gsap.utils.interpolate(startRotate, 0, spreadProgress);
                    let rotationY;
                    if (cardProgress < 0.6) {
                        rotationY = 0;
                    } else if (cardProgress >= SETTLED_CARD_PROGRESS) {
                        xPercent = 0;
                        rotate = 0;
                        rotationY = 180;
                    } else {
                        const flipProgress = smoothStep(gsap.utils.clamp(
                            0,
                            1,
                            (cardProgress - 0.6) / FLIP_PROGRESS_SPAN
                        ));
                        rotationY = flipProgress * 180;
                    }

                    gsap.set(card, {
                        opacity,
                        yPercent,
                        xPercent,
                        rotation: rotate,
                        scale,
                        force3D: true,
                    });
                    gsap.set(innerCard, { rotationY });
                });
            },
        });
    }

    setupPanelScroll();
    window.addEventListener("resize", () => {
        setupPanelScroll();
        ScrollTrigger.refresh();
    });
}
