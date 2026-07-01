import "./styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";
import { initPreloaderIntro } from "./sections/preloader.js";
import { initLocationScroll } from "./sections/locationScroll.js";
import { initSplitCards } from "./sections/splitCards.js";
import { initSmoothScroll, resetScrollPosition } from "./shared/scroll.js";
import { initLanguageSystem } from "./shared/i18n.js";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");
CustomEase.create("glide", "0.8, 0, 0.2, 1");

window.addEventListener("load", () => {
    window.history.scrollRestoration = "manual";

    const lenis = initSmoothScroll();
    resetScrollPosition(lenis);
    initLanguageSystem();
    initPreloaderIntro(lenis);
    initLocationScroll();
    initSplitCards();
    ScrollTrigger.refresh();
});
