document.addEventListener("DOMContentLoaded", () => {
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

  // Initialize Recent Work Blog Slider
  const workBlogSlider = new Swiper(".blog-slider", {
    spaceBetween: 30,
    effect: "fade",
    loop: true,
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
    // Enable touch/swipe on mobile
    touchRatio: 1,
    touchAngle: 45,
    grabCursor: true,
    // Responsive breakpoints
    breakpoints: {
      // Mobile devices
      0: {
        effect: "slide",
        spaceBetween: 20,
        fadeEffect: false,
      },
      // Tablet and up
      768: {
        effect: "fade",
        spaceBetween: 30,
        fadeEffect: {
          crossFade: true,
        },
      },
    },
    on: {
      init: function () {
        // Ensure first slide is active on init
        this.slides[this.activeIndex].classList.add("swiper-slide-active");
        
        // Mobile visibility fix - Force all elements to be visible
        if (window.innerWidth <= 768) {
          this.slides.forEach((slide) => {
            // Make slide visible
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
            slide.style.display = 'block';
            
            // Make all child elements visible
            const allElements = slide.querySelectorAll('*');
            allElements.forEach(el => {
              el.style.opacity = '1';
              el.style.visibility = 'visible';
              el.style.transform = 'none';
              el.style.transition = 'none';
            });
          });
        }
      },
      slideChange: function () {
        // Remove active class from all slides
        this.slides.forEach((slide) => {
          slide.classList.remove("swiper-slide-active");
        });
        // Add active class to current slide
        this.slides[this.activeIndex].classList.add("swiper-slide-active");
        
        // Mobile visibility fix on slide change - Force all elements to be visible
        if (window.innerWidth <= 768) {
          this.slides.forEach((slide) => {
            // Make slide visible
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
            slide.style.display = 'block';
            
            // Make all child elements visible
            const allElements = slide.querySelectorAll('*');
            allElements.forEach(el => {
              el.style.opacity = '1';
              el.style.visibility = 'visible';
              el.style.transform = 'none';
              el.style.transition = 'none';
            });
          });
        }
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

  // Premium Split Screen Menu with Advanced Effects
  const hamburger = document.getElementById("hamburger");
  const fullpageMenu = document.getElementById("fullpage-menu");
  const menuCursor = document.getElementById("menu-cursor");
  const cursorCore = document.querySelector(".cursor-core");
  const cursorTrail = document.querySelector(".cursor-trail");

  // Check if hamburger menu elements exist
  if (!hamburger || !fullpageMenu) {
    console.error("Hamburger menu elements not found:", {
      hamburger,
      fullpageMenu,
    });
    // Don't return, continue with other functionality
  }

  let mouseX = 0,
    mouseY = 0;
  let cursorX = 0,
    cursorY = 0;

  // Smooth cursor following
  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    if (menuCursor) {
      menuCursor.style.left = cursorX + "px";
      menuCursor.style.top = cursorY + "px";
    }

    requestAnimationFrame(updateCursor);
  }

  // Mouse tracking
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Cursor interaction with elements
  document
    .querySelectorAll(".nav-link, .contact-btn, .social-link, .menu-logo")
    .forEach((element) => {
      element.addEventListener("mouseenter", () => {
        if (cursorTrail) {
          cursorTrail.style.transform = "translate(-50%, -50%) scale(1.2)";
          cursorTrail.style.borderColor = "rgba(255, 94, 26, 0.6)";
          cursorTrail.style.borderWidth = "2px";
        }
        if (cursorCore) {
          cursorCore.style.transform = "translate(-50%, -50%) scale(1.2)";
        }
      });

      element.addEventListener("mouseleave", () => {
        if (cursorTrail) {
          cursorTrail.style.transform = "translate(-50%, -50%) scale(1)";
          cursorTrail.style.borderColor = "rgba(255, 94, 26, 0.2)";
          cursorTrail.style.borderWidth = "1px";
        }
        if (cursorCore) {
          cursorCore.style.transform = "translate(-50%, -50%) scale(1)";
        }
      });
    });

  updateCursor();

  if (hamburger && fullpageMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      fullpageMenu.classList.toggle("active");
      document.body.style.overflow = fullpageMenu.classList.contains("active")
        ? "hidden"
        : "";

      // Add entrance sound effect simulation
      if (fullpageMenu.classList.contains("active")) {
        setTimeout(() => {
          document.querySelectorAll(".nav-item").forEach((item, index) => {
            setTimeout(() => {
              item.style.transform = "translateY(0) rotateX(0deg) scale(1.02)";
              setTimeout(() => {
                item.style.transform = "translateY(0) rotateX(0deg) scale(1)";
              }, 100);
            }, index * 100);
          });
        }, 800);
      }
    });
  }

  // Close menu when clicking navigation links and handle smooth scrolling
  if (hamburger && fullpageMenu) {
    document.querySelectorAll(".fullpage-menu .nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Close menu
        hamburger.classList.remove("active");
        fullpageMenu.classList.remove("active");
        document.body.style.overflow = "";

        // Get target section
        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          // Wait for menu to close, then scroll
          setTimeout(() => {
            scroll.scrollTo(targetSection, {
              offset: 0,
              duration: 1000,
              easing: [0.25, 0.0, 0.35, 1.0],
            });
          }, 300);
        }
      });
    });
  }

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
