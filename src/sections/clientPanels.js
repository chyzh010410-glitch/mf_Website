import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const smoothStep = (progress) => progress * progress * (3 - 2 * progress);

export function initClientPanels() {
    const servicesPanel = document.querySelector(".client-services-panel");
    const servicesHeader = document.querySelector(".client-services-header");
    const cards = gsap.utils.toArray(".client-panel-card");

    if (!servicesPanel || !servicesHeader || cards.length === 0) {
        return;
    }

    function setupPanelScroll() {
        ScrollTrigger.getById("client-services-pin")?.kill();
        ScrollTrigger.getById("client-services-cards")?.kill();

        gsap.set(servicesHeader, { y: "360%" });
        cards.forEach((card, index) => {
            gsap.set(card, {
                opacity: 0,
                y: "-100%",
                x: index === 0 ? "100%" : index === 1 ? "0%" : "-100%",
                rotate: index === 0 ? -5 : index === 1 ? 0 : 5,
                scale: 0.25,
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
                const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
                const headerY = gsap.utils.interpolate("360%", "0%", smoothStep(headerProgress));

                gsap.set(servicesHeader, { y: headerY });

                cards.forEach((card, index) => {
                    const delay = index * 0.5;
                    const cardProgress = gsap.utils.clamp(
                        0,
                        1,
                        (progress - delay * 0.1) / (0.9 - delay * 0.1)
                    );
                    const innerCard = card.querySelector(".client-panel-card-inner");

                    let y;
                    if (cardProgress < 0.4) {
                        y = gsap.utils.interpolate("-100%", "50%", smoothStep(cardProgress / 0.4));
                    } else if (cardProgress < 0.6) {
                        y = gsap.utils.interpolate("50%", "0%", smoothStep((cardProgress - 0.4) / 0.2));
                    } else {
                        y = "0%";
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

                    let x;
                    let rotate;
                    let rotationY;
                    if (cardProgress < 0.6) {
                        x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
                        rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
                        rotationY = 0;
                    } else {
                        const normalizedProgress = smoothStep((cardProgress - 0.6) / 0.4);
                        x = gsap.utils.interpolate(index === 0 ? "100%" : index === 1 ? "0%" : "-100%", "0%", normalizedProgress);
                        rotate = gsap.utils.interpolate(index === 0 ? -5 : index === 1 ? 0 : 5, 0, normalizedProgress);
                        rotationY = normalizedProgress * 180;
                    }

                    gsap.set(card, { opacity, y, x, rotate, scale });
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
