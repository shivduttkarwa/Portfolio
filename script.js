document.addEventListener("DOMContentLoaded", () => {
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

  // Initialize Projects Swiper
  const projectsSwiper = new Swiper(".projects-swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
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

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  // Smooth cursor following
  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    if (menuCursor) {
      menuCursor.style.left = cursorX + 'px';
      menuCursor.style.top = cursorY + 'px';
    }
    
    requestAnimationFrame(updateCursor);
  }

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Cursor interaction with elements
  document.querySelectorAll('.nav-link, .contact-btn, .social-link, .menu-logo').forEach(element => {
    element.addEventListener('mouseenter', () => {
      if (cursorTrail) {
        cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.2)';
        cursorTrail.style.borderColor = 'rgba(255, 94, 26, 0.6)';
        cursorTrail.style.borderWidth = '2px';
      }
      if (cursorCore) {
        cursorCore.style.transform = 'translate(-50%, -50%) scale(1.2)';
      }
    });

    element.addEventListener('mouseleave', () => {
      if (cursorTrail) {
        cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorTrail.style.borderColor = 'rgba(255, 94, 26, 0.2)';
        cursorTrail.style.borderWidth = '1px';
      }
      if (cursorCore) {
        cursorCore.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    });
  });

  updateCursor();

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    fullpageMenu.classList.toggle("active");
    document.body.style.overflow = fullpageMenu.classList.contains("active") ? "hidden" : "";
    
    // Add entrance sound effect simulation
    if (fullpageMenu.classList.contains("active")) {
      setTimeout(() => {
        document.querySelectorAll('.nav-item').forEach((item, index) => {
          setTimeout(() => {
            item.style.transform = 'translateY(0) rotateX(0deg) scale(1.02)';
            setTimeout(() => {
              item.style.transform = 'translateY(0) rotateX(0deg) scale(1)';
            }, 100);
          }, index * 100);
        });
      }, 800);
    }
  });

  // Close menu when clicking navigation links and handle smooth scrolling
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
            easing: [0.25, 0.0, 0.35, 1.0]
          });
        }, 300);
      }
    });
  });

  // Initialize Particles.js (only if particles-js element exists)
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: ['#03dac6', '#ff0266', '#ff5e1a']
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: 0.5,
        random: false
      },
      size: {
        value: 3,
        random: true
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#03dac6',
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'repulse'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
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
