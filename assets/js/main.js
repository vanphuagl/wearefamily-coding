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
  // # batch loading 
  batchLoadingTimeline()
  // # lazy load
  const ll = new LazyLoad({
    threshold: 0,
    elements_selector: ".lazy",
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
  duration: 1.0,
  easing: (t) => Math.min(1, 1.001 - Math.pow(1 - t, 2.5)),
  smooth: true,
  mouseMultiplier: 1.0,
  smoothTouch: true,
  touchMultiplier: 1.5,
  infinite: false,
  direction: "vertical",
  gestureDirection: "vertical",
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
  history.scrollRestoration = "manual";
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
  // window.scrollTo(0, 0);
  // # step 1
  await delay(1000);
  const playerJincup = document.getElementById("e7DApHFhQti1").svgatorPlayer;
  await playWithPromise(playerJincup);
  // # step 2
  await delay(600);
  document.querySelector("[data-loading]").classList.add("is-done");
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

// ===== details swiper =====
const swiperDetails = new Swiper("[data-details-swiper]", {
  loop: true,
  speed: 600,
  slidesPerView: 1,
  effect: "fade",
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  on: {
    slideChange: function () {
      let e = this.realIndex + 1;
      document.querySelector("[data-details-pager] .current").innerHTML = e;
    },
    beforeInit: function () {
      let numOfSlides = this.wrapperEl.querySelectorAll(".swiper-slide").length;
      document.querySelector("[data-details-pager] .total").innerHTML =
        numOfSlides;
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
    activeClass: "is-active", // Class that marks the selected button
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

  // Set initial is-active state based on savedLang
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
      // Remove class is-active from all buttons
      buttons.forEach((btn) => btn.classList.remove(config.activeClass));
      // Add class is-active to the clicked button
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
    header.classList.add("is-hidden");
  } else {
    header.classList.remove("is-hidden");
  }
});

// ===== hover table of contents =====

let activeItem = null;
const [tocList, tocItems, tocImage] = [
  document.querySelector("[data-toc-list]"),
  document.querySelectorAll("[data-toc-items]"),
  document.querySelector("[data-toc-image]"),
];
const defaultImageSrc = tocImage.getAttribute("data-src");
const isMobile = 1023;

const changeImageWithFade = function (newSrc) {
  const currentSrc = new URL(tocImage.src, window.location.origin).href;
  const newSrcNormalized = new URL(newSrc, window.location.origin).href;
  if (currentSrc === newSrcNormalized) {
    return;
  }
  tocImage.parentNode.classList.add("is-fade");
  setTimeout(() => {
    tocImage.src = newSrc;
    tocImage.addEventListener(
      "load",
      () => {
        tocImage.parentNode.classList.remove("is-fade");
      },
      { once: true }
    );
    tocImage.addEventListener(
      "error",
      () => {
        console.error(`Failed to load image: ${newSrc}`);
        tocImage.src = defaultImageSrc;
        tocImage.parentNode.classList.remove("is-fade");
      },
      { once: true }
    );
  }, 300); // transiton 0.3s
};

const resetToDefault = function () {
  changeImageWithFade(defaultImageSrc);
  tocItems.forEach((item) => {
    item.style.opacity = "1";
    item.classList.remove("is-active");
  });
  activeItem = null;
};

const handleInteraction = function (item) {
  // if click on li is active on mobile, reset to default
  if (window.innerWidth <= isMobile && activeItem === item) {
    resetToDefault();
    return;
  }
  // change image
  const imageSrc = item.getAttribute("data-toc-img");
  changeImageWithFade(imageSrc);
  // set opacity
  tocItems.forEach((otherItem) => {
    if (otherItem !== item) {
      otherItem.style.opacity = "0.2";
      otherItem.classList.remove("is-active");
    } else {
      otherItem.style.opacity = "1";
      otherItem.classList.add("is-active");
    }
  });
  activeItem = item;
};
// Handling when interacting
tocItems.forEach((item) => {
  if (window.innerWidth <= isMobile) {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      handleInteraction(item);
    });
  } else {
    item.addEventListener("mouseover", () => {
      handleInteraction(item);
    });
  }
});
// Handling when not interacting
// On mobile, click outside of ul to reset
if (window.innerWidth <= isMobile) {
  document.addEventListener("click", (e) => {
    if (!tocList.contains(e.target)) {
      resetToDefault();
    }
  });
} else {
  tocList.addEventListener("mouseout", (e) => {
    if (!tocList.contains(e.relatedTarget)) {
      resetToDefault();
    }
  });
}

// ===== show/hide popup =====
const showPopup = function (popupName) {
  const popup = document.querySelector(`[data-popup="${popupName}"]`);
  if (popup) {
    document.querySelectorAll("[data-popup].is-show").forEach((openPopup) => {
      openPopup.classList.remove("is-show");
      setTimeout(() => {
        openPopup.style.display = "none";
      }, 300);
    });

    popup.style.display = "block";
    requestAnimationFrame(() => {
      popup.classList.add("is-show");
    });

    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
  }
};

const closePopup = function (popup) {
  popup.classList.remove("is-show");
  setTimeout(() => {
    popup.style.display = "none";
    if (!document.querySelector("[data-popup].is-show")) {
      document.body.style.removeProperty("overflow");
      if (lenis) lenis.start();
    }
  }, 300);
};

// handle show popup
document.querySelectorAll("[data-popup-id]").forEach((button) => {
  button.addEventListener("click", () => {
    const popupName = button.getAttribute("data-popup-id");
    showPopup(popupName);
  });
});
// handle close popup
document.querySelectorAll("[data-popup-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest("[data-popup]");
    closePopup(popup);
  });
});

// ===== timeline =====
// document.querySelectorAll(".timeline_items").forEach((column) => {
//   column.addEventListener("click", () => {
//     const content = column.querySelector(".timeline_content");

//     if (column.classList.contains("is-expanded")) {
//       //  close colujmn
//       column.classList.remove("is-expanded");
//       content.classList.remove("is-active");
//     } else {
//       // close all column
//       document.querySelectorAll(".timeline_items").forEach((otherColumn) => {
//         otherColumn.classList.remove("is-expanded");
//         otherColumn
//           .querySelector(".timeline_content")
//           .classList.remove("is-active");
//       });
//       // open column target
//       column.classList.add("is-expanded");
//       setTimeout(() => {
//         content.classList.add("is-active");
//       }, 500);
//     }
//   });
// });

// Improved scrollbar functionality
if (document.querySelector("[data-timeline-list]")) {
  const timelineList = document.querySelector("[data-timeline-list]");
  const scrollbarThumb = document.querySelector("[data-timeline-thumb]");
  const scrollbarTrack = document.querySelector("[data-timeline-track]");
  const thumbWidth = 100;
  const maxScroll = timelineList.scrollWidth - timelineList.clientWidth;

  // Get the track width dynamically
  const trackWidth = scrollbarTrack.clientWidth;
  const maxThumbPosition = trackWidth - thumbWidth;

  timelineList.addEventListener("scroll", () => {
    const scrollPosition = timelineList.scrollLeft;
    const scrollRatio = scrollPosition / maxScroll;
    const thumbPosition = scrollRatio * maxThumbPosition;
    scrollbarThumb.style.left = `${thumbPosition}px`;
  });
}

// batch loading
const batchLoadingTimeline = function () {
  const timelineImages = document.querySelectorAll(".timeline img");

  const loadImage = (img) => {
    const src = img.getAttribute("data-src");
    if (src) {
      img.src = src;
      img.removeAttribute("data-src"); // Delete data-src after loading to avoid reloading
    }
  };

  // Preload images from 2007 to 2015
  timelineImages.forEach((img) => {
    const yearElement = img
      .closest(".timeline_items")
      .querySelector(".timeline_year");
    const year = parseInt(yearElement.textContent, 10);
    if (year >= 2007 && year <= 2015) {
      loadImage(img);
    }
  });

  // Intersection Observer to load images from 2016 to 2025 when scrolling near the excerpt section
  const trigger = document.querySelector(".excerpt");
  if (trigger) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timelineImages.forEach((img) => {
              const yearElement = img
                .closest(".timeline_items")
                .querySelector(".timeline_year");
              const year = parseInt(yearElement.textContent, 10);
              if (year >= 2016 && year <= 2025) {
                loadImage(img);
              }
            });
            // Stop viewing after loading is complete
            observer.unobserve(trigger);
          }
        });
      },
      {
        rootMargin: "200px", // Load before trigger appears in viewport 200px
      }
    );

    observer.observe(trigger);
  }
};

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", init);
