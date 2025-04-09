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
lenis.on("scroll", () => { });
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ===== init loading =====
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
    lenis.stop();
    // # step 1
    await delay(1000);
    const playerJincup = document.getElementById("e7DApHFhQti1").svgatorPlayer;
    await playWithPromise(playerJincup);
    // # step 2
    await delay(800);
    document.querySelector("[data-loading]").classList.add("--done");
    await delay(600);
    lenis.start();
}

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", init);