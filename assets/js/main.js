"use strict";

// ===== init =====
const init = () => {
  console.clear();
  // # app height
  appHeight();
  // # init loading
  initLoading();
  // # init language switch
  initLanguageSwitch();
  // # lazy load
  const ll = new LazyLoad({
    threshold: 0,
  });
};

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
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
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
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const playWithPromise = (player) => {
  return new Promise((resolve) => {
    // When the animation ends, resolve Promise
    player.on("end", () => resolve(), true); // true to add listener at the beginning of the list
    // Start running animation
    player.play();
  });
};
const initLoading = async () => {
  // Block scroll events
  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });
  window.addEventListener("scroll", preventScroll, { passive: false });
  window.addEventListener(
    "keydown",
    (e) => {
      if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
  window.scrollTo(0, 0);
  // # step 1
  await delay(1000);
  const playerJincup = document.getElementById("e7DApHFhQti1").svgatorPlayer;
  await playWithPromise(playerJincup);
  // # step 2
  await delay(600);
  document.querySelector("[data-loading]").classList.add("--done");
  // -- Remove scroll event blocker and re-enable Lenis
  window.removeEventListener("wheel", preventScroll);
  window.removeEventListener("touchmove", preventScroll);
  window.removeEventListener("scroll", preventScroll);
  window.removeEventListener("keydown", preventScroll);
  isLoading = false;
  // # step 3
  await delay(600);
  document.getElementById("ekAYG69cqyn1").svgatorPlayer.play();
  swiperMainvisual.autoplay.start();
};

// ===== mainvisual swiper ======
const swiperMainvisual = new Swiper("[data-mainvisual-swiper]", {
  effect: "fade",
  speed: 2500,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  on: {
    init: function () {
      this.autoplay.stop();
    },
  },
});

// ===== switch language =====
const initLanguageSwitch = function (options = {}) {
  // Default configuration
  const defaults = {
    defaultLang: "ja", // Default language
    switcherSelector: ".c-header_lang", // Container selector
    buttonSelector: ".c-header_lang li", // Button selector
    langAttribute: "data-lang", // Attribute that identifies the language
    activeClass: "--active", // Class that marks the selected button
    rootElement: document.documentElement, // Element to add class to (default is <html>)
  };
  // Combine options with defaults
  const config = { ...defaults, ...options };

  // Restore language from localStorage (if available)
  const savedLang = localStorage.getItem("language") || config.defaultLang;
  config.rootElement.classList.add(`lang-${savedLang}`);
  config.rootElement.lang = savedLang;

  // Find the language switch buttons
  const buttons = document.querySelectorAll(config.buttonSelector);
  if (!buttons.length) {
    console.warn(
      "No language switcher buttons found with selector:",
      config.buttonSelector
    );
    return;
  }

  // Set initial --active state based on savedLang
  buttons.forEach((button) => {
    const lang = button.getAttribute(config.langAttribute);
    if (lang === savedLang) {
      button.classList.add(config.activeClass);
    } else {
      button.classList.remove(config.activeClass);
    }
  });

  // Handle clicks for buttons
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.getAttribute(config.langAttribute);
      if (!lang) return;
      // Remove class --active from all buttons
      buttons.forEach((btn) => btn.classList.remove(config.activeClass));
      // Add class --active to the clicked button
      button.classList.add(config.activeClass);
      // Remove old language classes and add new ones
      config.rootElement.classList.remove("lang-ja", "lang-en");
      config.rootElement.classList.add(`lang-${lang}`);
      config.rootElement.lang = lang;
      // Save language to localStorage
      localStorage.setItem("language", lang);
    });
  });
};

// ===== back to top =====
const handleBacktoTop = function () {
  lenis.scrollTo(0, {
    duration: 1.5,
    easing: (t) => t * t * t * (t * (t * 6 - 15) + 10),
    force: true,
  });
};
document
  .querySelector("[data-footer-backtotop]")
  .addEventListener("click", handleBacktoTop);

// ===== hide header language when scroll to footer =====
const [header, footer] = [
  document.querySelector("header"),
  document.querySelector("footer"),
];
lenis.on("scroll", ({}) => {
  const distInView = footer.getBoundingClientRect().top - 100;
  if (distInView < 0) {
    header.classList.add("--hidden");
  } else {
    header.classList.remove("--hidden");
  }
});

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", init);
