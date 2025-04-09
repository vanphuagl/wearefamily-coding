"use strict";

// ===== init =====
const init = () => {
    console.clear();
    // # app height
    appHeight();
    // # init loading
    initLoading();
    // # lazy load
    const ll = new LazyLoad({
        threshold: 0,
    });
}

// ===== app height =====
const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty(
        "--app-height",
        `${document.documentElement.clientHeight}px`
    );
};
window.addEventListener("resize", appHeight);

// ===== lenis =====
let isLoading = true;
const lenis = new Lenis({
    duration: 0.8,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smooth: true,
    mouseMultiplier: 1.2,
    touchMultiplier: 2.5,
    smoothTouch: true,
    direction: 'vertical'
    // lerp: 0.05,
    // smoothWheel: true,
});
function raf(time) {
    if (!isLoading) {
        lenis.raf(time);
    } else {
        lenis.scrollTo(0, { immediate: true }); // Keep scroll position at 0 while loading
    }
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ===== init loading =====
const preventScroll = (e) => e.preventDefault();
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const playWithPromise = (player) => {
    return new Promise((resolve) => {
        // When the animation ends, resolve Promise
        player.on('end', () => resolve(), true); // true to add listener at the beginning of the list
        // Start running animation
        player.play();
    });
};
const initLoading = async () => {
    // Block scroll events
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('scroll', preventScroll, { passive: false });
    window.addEventListener('keydown', (e) => {
        if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
            e.preventDefault();
        }
    }, { passive: false });
    window.scrollTo(0, 0);
    // # step 1
    await delay(1000);
    const playerJincup = document.getElementById("e7DApHFhQti1").svgatorPlayer;
    await playWithPromise(playerJincup);
    // # step 2
    await delay(600);
    document.querySelector("[data-loading]").classList.add("--done");
    // -- Remove scroll event blocker and re-enable Lenis
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('scroll', preventScroll);
    window.removeEventListener('keydown', preventScroll);
    isLoading = false;
    // # step 3
    await delay(600);
    document.getElementById("ekAYG69cqyn1").svgatorPlayer.play();
    swiperMainvisual.autoplay.start();
}

// ===== mainvisual swiper ======
const swiperMainvisual = new Swiper("[data-mainvisual-swiper]", {
    effect: "fade",
    speed: 2500,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false
    },
    on: {
        init: function () {
            this.autoplay.stop();
        }
    }
});

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", init);