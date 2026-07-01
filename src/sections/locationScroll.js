import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ease, lerp } from "../shared/math.js";

export function initLocationScroll() {
    const heroContent = document.querySelector(".hero-content");
    const heroImg = document.querySelector(".hero-img");
    const heroImgElement = document.querySelector(".hero-img img");
    const heroMask = document.querySelector(".hero-mask");
    const heroGridOverlay = document.querySelector(".hero-grid-overlay");
    const anchorMarker = document.querySelector(".marker-1");
    const progressBar = document.querySelector(".hero-scroll-progress-bar");

    function setupHeroScroll() {
        const viewportHeight = window.innerHeight;
        const heroContentMoveDistance = heroContent.offsetHeight - viewportHeight;
        const heroImgMoveDistance = heroImg.offsetHeight - viewportHeight;
        const maskOutsideSize = window.innerWidth <= 800 ? 280 : 240;
        const maskGridSize = window.innerWidth <= 800 ? 116 : 68;

        ScrollTrigger.getById("location-scroll")?.kill();

        ScrollTrigger.create({
            id: "location-scroll",
            trigger: ".location-hero",
            start: "top top",
            end: `+=${viewportHeight * 4}px`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: (self) => {
                gsap.set(progressBar, {
                    "--progress": self.progress,
                });

                gsap.set(heroContent, {
                    y: -self.progress * heroContentMoveDistance,
                });

                let heroImgProgress;
                if (self.progress <= 0.45) {
                    heroImgProgress = ease(self.progress / 0.45) * 0.65;
                } else if (self.progress <= 0.75) {
                    heroImgProgress = 0.65;
                } else {
                    heroImgProgress = 0.65 + ease((self.progress - 0.75) / 0.25) * 0.35;
                }

                gsap.set(heroImg, {
                    y: heroImgProgress * heroImgMoveDistance,
                });

                let heroMaskSize;
                let heroImgSaturation;
                let heroImgOverlayOpacity;

                if (self.progress <= 0.42) {
                    heroMaskSize = maskOutsideSize;
                    heroImgSaturation = 1;
                    heroImgOverlayOpacity = 0.35;
                } else if (self.progress <= 0.56) {
                    const phaseProgress = ease((self.progress - 0.42) / 0.14);
                    heroMaskSize = lerp(maskOutsideSize, maskGridSize, phaseProgress);
                    heroImgSaturation = 1 - phaseProgress;
                    heroImgOverlayOpacity = 0.35 + phaseProgress * 0.35;
                } else if (self.progress <= 0.72) {
                    heroMaskSize = maskGridSize;
                    heroImgSaturation = 0;
                    heroImgOverlayOpacity = 0.7;
                } else if (self.progress <= 0.88) {
                    const phaseProgress = ease((self.progress - 0.72) / 0.16);
                    heroMaskSize = lerp(maskGridSize, maskOutsideSize, phaseProgress);
                    heroImgSaturation = phaseProgress;
                    heroImgOverlayOpacity = 0.7 - phaseProgress * 0.35;
                } else {
                    heroMaskSize = maskOutsideSize;
                    heroImgSaturation = 1;
                    heroImgOverlayOpacity = 0.35;
                }

                gsap.set(heroMask, {
                    "--mask-size": `${heroMaskSize}%`,
                });

                gsap.set(heroImgElement, {
                    filter: `saturate(${heroImgSaturation})`,
                });

                gsap.set(heroImg, {
                    "--overlay-opacity": heroImgOverlayOpacity,
                });

                let heroGridOpacity;
                if (self.progress <= 0.54) {
                    heroGridOpacity = 0;
                } else if (self.progress <= 0.58) {
                    heroGridOpacity = ease((self.progress - 0.54) / 0.04);
                } else if (self.progress <= 0.72) {
                    heroGridOpacity = 1;
                } else if (self.progress <= 0.78) {
                    heroGridOpacity = 1 - ease((self.progress - 0.72) / 0.06);
                } else {
                    heroGridOpacity = 0;
                }

                gsap.set(heroGridOverlay, {
                    opacity: heroGridOpacity,
                });

                gsap.set(anchorMarker, {
                    opacity: heroGridOpacity,
                });
            },
        });
    }

    setupHeroScroll();
    window.addEventListener("resize", () => {
        setupHeroScroll();
        ScrollTrigger.refresh();
    });
}
