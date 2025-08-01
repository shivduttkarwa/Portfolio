document.addEventListener("DOMContentLoaded", () => {
  // Fix page refresh issue - ensure we start at hero section
  if (window.location.hash) {
    window.history.replaceState(null, null, window.location.pathname);
  }
  window.scrollTo(0, 0);

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Locomotive Scroll with better settings
  const scroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    multiplier: 1,
    class: "is-revealed",
    smartphone: {
      smooth: false,
      breakpoint: 768,
    },
    tablet: {
      smooth: false,
      breakpoint: 1024,
    },
  });

  // Update ScrollTrigger when LocomotiveScroll updates
  scroll.on("scroll", () => {
    ScrollTrigger.update();
  });

  // Ensure scroll starts at top after initialization
  setTimeout(() => {
    scroll.scrollTo(0, { duration: 0, disableLerp: true });
  }, 100);

  // Momentum Slider Implementation
  class MomentumSlider {
    constructor(options) {
      this.el = options.el;
      this.cssClass = options.cssClass;
      this.range = options.range;
      this.rangeContent = options.rangeContent;
      this.style = options.style || {};
      this.vertical = options.vertical || false;
      this.reverse = options.reverse || false;
      this.interactive = options.interactive !== false;
      this.sync = options.sync || [];
      this.onChange = options.change;
      this.currentIndex = 0;

      this.init();
    }

    init() {
      this.createSlider();
      this.setupEventListeners();
      this.select(0);
    }

    createSlider() {
      const container = document.createElement("div");
      container.className = `ms-container ${this.cssClass} ms-container--${
        this.vertical ? "vertical" : "horizontal"
      }${this.reverse ? " ms-container--reverse" : ""}`;

      const track = document.createElement("ul");
      track.className = "ms-track";

      for (let i = this.range[0]; i <= this.range[1]; i++) {
        const slide = document.createElement("li");
        slide.className = "ms-slide";
        slide.innerHTML = this.rangeContent(i);
        track.appendChild(slide);
      }

      container.appendChild(track);
      this.el.appendChild(container);

      this.container = container;
      this.track = track;
      this.slides = track.querySelectorAll(".ms-slide");
    }

    setupEventListeners() {
      if (this.interactive) {
        this.container.addEventListener("click", (e) => {
          const slideIndex = Array.from(this.slides).indexOf(
            e.target.closest(".ms-slide")
          );
          if (slideIndex !== -1) {
            this.select(slideIndex);
          }
        });
      }
    }

    select(index) {
      if (index < 0 || index >= this.slides.length) return;

      const oldIndex = this.currentIndex;
      this.currentIndex = index;

      this.updateSlider();
      this.syncSliders();

      if (this.onChange) {
        this.onChange(index, oldIndex);
      }
    }

    updateSlider() {
      const offset =
        -this.currentIndex *
        (this.vertical
          ? this.slides[0].offsetHeight
          : this.slides[0].offsetWidth);
      this.track.style.transform = this.vertical
        ? `translateY(${offset}px)`
        : `translateX(${offset}px)`;

      // Apply styles
      this.slides.forEach((slide, index) => {
        const distance = Math.abs(index - this.currentIndex);
        const isActive = index === this.currentIndex;

        if (this.style) {
          Object.keys(this.style).forEach((selector) => {
            const elements =
              selector === "transform" || selector === "opacity"
                ? [slide]
                : slide.querySelectorAll(selector);
            elements.forEach((el) => {
              Object.keys(this.style[selector]).forEach((property) => {
                const values = this.style[selector][property];
                if (Array.isArray(values)) {
                  let value = isActive ? values[1] : values[0];
                  if (property === "transform" && Array.isArray(value)) {
                    value = value
                      .map((transform) => {
                        const [type, range] = Object.entries(transform)[0];
                        const val = isActive ? range[1] : range[0];
                        return `${type}(${val})`;
                      })
                      .join(" ");
                  }
                  el.style[property] = value;
                }
              });
            });
          });
        }
      });
    }

    syncSliders() {
      this.sync.forEach((slider) => {
        if (slider.currentIndex !== this.currentIndex) {
          slider.select(this.currentIndex);
        }
      });
    }
  }

  // Initialize Recent Work Blog Slider - Exact same for all devices
  const workBlogSlider = new Swiper(".blog-slider", {
    spaceBetween: 30,
    effect: "fade",
    loop: true,
    speed: 600,
    mousewheel: {
      invert: false,
      releaseOnEdges: true,
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: ".blog-slider__pagination",
      clickable: true,
    },
    fadeEffect: {
      crossFade: true,
    },
    // Touch settings - same behavior for all devices
    allowTouchMove: true,
    touchRatio: 1,
    touchAngle: 45,
    grabCursor: true,
    simulateTouch: true,
    on: {
      init: function () {
        this.slides[this.activeIndex].classList.add("swiper-slide-active");
      },
      slideChange: function () {
        this.slides.forEach((slide) => {
          slide.classList.remove("swiper-slide-active");
        });
        this.slides[this.activeIndex].classList.add("swiper-slide-active");
      },
    },
  });

  // Disable locomotive scroll when mouse is over the blog slider
  const blogSliderElement = document.querySelector(".blog-slider");
  if (blogSliderElement && scroll) {
    blogSliderElement.addEventListener("mouseenter", () => {
      scroll.stop();
    });

    blogSliderElement.addEventListener("mouseleave", () => {
      scroll.start();
    });

    // Also handle touch events for mobile
    blogSliderElement.addEventListener("touchstart", () => {
      scroll.stop();
    });

    blogSliderElement.addEventListener("touchend", () => {
      scroll.start();
    });
  }

  // Initialize Testimonials Swiper
  const testimonialsSwiper = new Swiper(".testimonials-swiper", {
    slidesPerView: 1,
    spaceBetween: 50,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1024: {
        slidesPerView: 1.2,
      },
    },
  });

  // Hero Image Animation
  gsap.from(".hero-image-wrapper", {
    x: -50,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
    delay: 0.4,
  });

  // Text Animation
  const heroTitle = document.querySelector(".hero-title");
  const splitTitle = new SplitType(heroTitle, { types: "chars" });

  gsap.from(splitTitle.chars, {
    y: 100,
    opacity: 0,
    stagger: 0.05,
    duration: 0.8,
    ease: "power3.out",
  });

  // ==================== Menu JAVASCRIPT ====================

  const tl = gsap.timeline({
    paused: true,
  });
  let path = document.querySelector("path");
  let spanBefore;

  // CSSRulePlugin for controlling pseudo-element styling
  try {
    spanBefore = CSSRulePlugin.getRule("#hamburger .line-2");
    if (spanBefore) {
      gsap.set(spanBefore, { background: "#000" });
    }
  } catch (e) {
    console.warn("CSSRulePlugin not available:", e);
  }

  // Initial menu state - hidden by default (matching original)
  gsap.set(".menu", { visibility: "hidden" });

  console.log("Menu initialization:", {
    path: path,
    pathExists: !!path,
    pathD: path ? path.getAttribute("d") : "no path",
    spanBefore: spanBefore,
    hamburger: document.getElementById("hamburger"),
    toggleBtn: document.getElementById("toggle-btn"),
  });

  // Main reveal function - sets up menu toggle functionality
  function revealMenu() {
    // Build the GSAP timeline for menu animation
    revealMenuItems();

    const hamburger = document.getElementById("hamburger");
    const toggleBtn = document.getElementById("toggle-btn");

    if (toggleBtn && hamburger) {
      // Toggle handler - EXACT original with mobile responsiveness added
      const handleToggle = (e) => {
        e.preventDefault();
        console.log("Menu button clicked!");
        hamburger.classList.toggle("active");
        const isReversed = !tl.reversed();
        tl.reversed(isReversed);

        // Mobile responsiveness additions (not in original)
        if (isReversed) {
          // Menu closing
          document.body.style.overflow = "";
          document.body.classList.remove("menu-open");
        } else {
          // Menu opening
          document.body.style.overflow = "hidden";
          document.body.classList.add("menu-open");
        }

        console.log("Animation direction:", isReversed ? "reverse" : "forward");
      };

      // Event listeners for both click and touch
      toggleBtn.addEventListener("click", handleToggle);
      toggleBtn.addEventListener("touchend", handleToggle);
      console.log("Click and touch handlers attached successfully");
    } else {
      console.error("Elements not found:", { toggleBtn, hamburger });
    }
  }
  revealMenu();

  // Add menu link functionality to close menu and scroll to sections
  function setupMenuLinks() {
    const menuLinks = document.querySelectorAll(".menu-item a");

    menuLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Get the href attribute to determine the target section
        const href = link.getAttribute("href");

        // Close the menu first
        const hamburger = document.getElementById("hamburger");
        if (hamburger && hamburger.classList.contains("active")) {
          hamburger.classList.remove("active");
          tl.reverse();
          document.body.style.overflow = "";
          document.body.classList.remove("menu-open");

          // Wait for menu animation to complete
          setTimeout(() => {
            // Menu will be hidden by GSAP animation
          }, 1000);
        }

        // Wait for menu animation to complete, then scroll to section
        setTimeout(() => {
          if (href && href.startsWith("#")) {
            const targetSection = document.querySelector(href);
            if (targetSection) {
              // Use locomotive scroll for smooth scrolling
              if (scroll) {
                scroll.scrollTo(targetSection);
              } else {
                // Fallback to native smooth scroll
                targetSection.scrollIntoView({ behavior: "smooth" });
              }
            }
          } else if (href && href !== "#") {
            // For external links or other pages
            window.location.href = href;
          }
        }, 800); // Wait for menu close animation to complete
      });
    });
  }

  // Initialize menu links after menu setup
  setupMenuLinks();

  // EXACT Original CodePen GSAP Timeline Animation
  function revealMenuItems() {
    // Optimized paths for full screen coverage with pronounced curve
    const start = "M0 700S100 100 500 100s400 600 1000 700V0H0Z";
    const end = "M0 1000S100 1000 500 1000s500 1000 1000 1000V0H0Z";

    const power2 = "power2.inout";

    // Animate hamburger button position and styling
    tl.to("#hamburger", 1.25, {
      marginTop: "-5px",
      x: -40,
      y: 40,
      ease: power2,
    });

    // Change hamburger line colors to white
    tl.to(
      "#hamburger .line",
      1,
      {
        background: "#fff",
        ease: power2,
      },
      "<"
    );

    // Change pseudo element color (CSSRulePlugin)
    if (spanBefore) {
      tl.to(
        spanBefore,
        1,
        {
          background: "#fff",
          ease: power2,
        },
        "<"
      );
    }

    // Animate button outline circles
    tl.to(
      ".btn .btn-outline",
      1.25,
      {
        x: -40,
        y: 40,
        width: "140px",
        height: "140px",
        border: "1px solid #e2e2dc",
        ease: power2,
      },
      "<"
    );

    // SVG Background Animation - Completes BEFORE menu items
    tl.to(
      path,
      0.8,
      {
        attr: {
          d: start,
        },
        ease: power2,
      },
      "<"
    ).to(
      path,
      0.8,
      {
        attr: { d: end },
        ease: power2,
      },
      "-=0.5"
    );

    // Menu appears AFTER background completes (minimal delay)
    tl.to(
      ".menu",
      0.5,
      {
        visibility: "visible",
      },
      "-=0.4" // Reduced delay
    );

    // Menu items animate AFTER background is fully expanded - Primary menu first
    tl.to(
      ".primary-menu .menu-item>a",
      0.4,
      {
        top: 0,
        ease: "power3.in",
        stagger: {
          amount: 0.3,
        },
      },
      "-=0.6"
    )
      // First contact button
      .to(
        ".contact-btn",
        0.2,
        {
          top: 0,
          ease: "power3.in",
        },
        "-=0.1"
      )
      // Second contact button
      .to(
        ".email-btn",
        0.2,
        {
          top: 0,
          ease: "power3.in",
        },
        "+=0.02"
      )
      // Social section
      .to(
        ".menu-item .social-content",
        0.2,
        {
          top: 0,
          ease: "power3.in",
        },
        "+=0.02"
      )
      // Footer section
      .to(
        ".menu-item .footer-content",
        0.2,
        {
          top: 0,
          ease: "power3.in",
        },
        "+=0.02"
      )
      .reverse();
  }

  // ==================== END EXACT ORIGINAL CODEPEN JAVASCRIPT ====================

  // Initialize Particles.js (only if particles-js element exists)
  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: ["#03dac6", "#ff0266", "#ff5e1a"],
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.5,
          random: false,
        },
        size: {
          value: 3,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#03dac6",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
        },
      },
      retina_detect: true,
    });
  }

  // Scroll animations
  scroll.on("scroll", (args) => {
    gsap.to(".hero-image-wrapper", {
      y: args.scroll.y * 0.1,
      ease: "none",
    });
  });
});

function initProjectCarousel() {
  console.log("Initializing project carousel...");

  // Check if cards exist
  const cardsCheck = document.querySelectorAll(".cards li");
  console.log("Found cards:", cardsCheck.length);

  if (cardsCheck.length === 0) {
    console.error("No cards found for carousel");
    return;
  }

  gsap.to(".cards li img", { opacity: 1, delay: 0.1 }); // gentle fade in

  let iteration = 0; // gets iterated when we scroll all the way to the end or start and wraps around - allows us to smoothly continue the playhead scrubbing in the correct direction.

  const spacing = 0.1, // spacing of the cards (stagger)
    snap = gsap.utils.snap(spacing), // we'll use this to snap the playhead on the seamlessLoop
    cards = gsap.utils.toArray(".cards li"),
    seamlessLoop = buildSeamlessLoop(cards, spacing),
    scrub = gsap.to(seamlessLoop, {
      // we reuse this tween to smoothly scrub the playhead on the seamlessLoop
      totalTime: 0,
      duration: 0.5,
      ease: "power3",
      paused: true,
    }),
    trigger = ScrollTrigger.create({
      start: 0,
      onUpdate(self) {
        if (self.progress === 1 && self.direction > 0 && !self.wrapping) {
          wrapForward(self);
        } else if (
          self.progress < 1e-5 &&
          self.direction < 0 &&
          !self.wrapping
        ) {
          wrapBackward(self);
        } else {
          scrub.vars.totalTime = snap(
            (iteration + self.progress) * seamlessLoop.duration()
          );
          scrub.invalidate().restart(); // to improve performance, we just invalidate and restart the same tween. No need for overwrites or creating a new tween on each update.
          self.wrapping = false;
        }
      },
      end: "+=3000",
      pin: ".gallery",
    });

  function wrapForward(trigger) {
    // when the ScrollTrigger reaches the end, loop back to the beginning seamlessly
    iteration++;
    trigger.wrapping = true;
    trigger.scroll(trigger.start + 1);
  }

  function wrapBackward(trigger) {
    // when the ScrollTrigger reaches the start again (in reverse), loop back to the end seamlessly
    iteration--;
    if (iteration < 0) {
      // to keep the playhead from stopping at the beginning, we jump ahead 10 iterations
      iteration = 9;
      seamlessLoop.totalTime(
        seamlessLoop.totalTime() + seamlessLoop.duration() * 10
      );
      scrub.pause(); // otherwise it may update the totalTime right before the trigger updates, making the starting value different than what we just set above.
    }
    trigger.wrapping = true;
    trigger.scroll(trigger.end - 1);
  }

  function scrubTo(totalTime) {
    // moves the scroll position to the place that corresponds to the totalTime value of the seamlessLoop, and wraps if necessary.
    let progress =
      (totalTime - seamlessLoop.duration() * iteration) /
      seamlessLoop.duration();
    if (progress > 1) {
      wrapForward(trigger);
    } else if (progress < 0) {
      wrapBackward(trigger);
    } else {
      trigger.scroll(trigger.start + progress * (trigger.end - trigger.start));
    }
  }

  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () =>
      scrubTo(scrub.vars.totalTime + spacing)
    );
    prevBtn.addEventListener("click", () =>
      scrubTo(scrub.vars.totalTime - spacing)
    );
  }

  function buildSeamlessLoop(items, spacing) {
    let overlap = Math.ceil(1 / spacing), // number of EXTRA animations on either side of the start/end to accommodate the seamless looping
      startTime = items.length * spacing + 0.5, // the time on the rawSequence at which we'll start the seamless loop
      loopTime = (items.length + overlap) * spacing + 1, // the spot at the end where we loop back to the startTime
      rawSequence = gsap.timeline({ paused: true }), // this is where all the "real" animations live
      seamlessLoop = gsap.timeline({
        // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
        paused: true,
        repeat: -1, // to accommodate infinite scrolling/looping
        onRepeat() {
          // works around a super rare edge case bug that's fixed GSAP 3.6.1
          this._time === this._dur && (this._tTime += this._dur - 0.01);
        },
      }),
      l = items.length + overlap * 2,
      time = 0,
      i,
      index,
      item;

    // set initial state of items
    gsap.set(items, { xPercent: 400, opacity: 0, scale: 0 });

    // now loop through and create all the animations in a staggered fashion. Remember, we must create EXTRA animations at the end to accommodate the seamless looping.
    for (i = 0; i < l; i++) {
      index = i % items.length;
      item = items[index];
      time = i * spacing;
      rawSequence
        .fromTo(
          item,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            zIndex: 100,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: "power1.in",
            immediateRender: false,
          },
          time
        )
        .fromTo(
          item,
          { xPercent: 400 },
          { xPercent: -400, duration: 1, ease: "none", immediateRender: false },
          time
        );
      i <= items.length && seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
    }

    // here's where we set up the scrubbing of the playhead to make it appear seamless.
    rawSequence.time(startTime);
    seamlessLoop
      .to(rawSequence, {
        time: loopTime,
        duration: loopTime - startTime,
        ease: "none",
      })
      .fromTo(
        rawSequence,
        { time: overlap * spacing + 1 },
        {
          time: startTime,
          duration: startTime - (overlap * spacing + 1),
          immediateRender: false,
          ease: "none",
        }
      );
    return seamlessLoop;
  }
}
