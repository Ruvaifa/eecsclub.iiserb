/**
 * GSAP & SCROLL ANIMATION ENGINE
 * Handles smooth staggered entrances, scroll reveals, and active section tracking.
 */

export function initAnimations() {
  // Check if GSAP is available
  const hasGSAP = typeof window.gsap !== 'undefined';

  if (hasGSAP) {
    // 1. Hero Stagger Entrance
    gsap.from('.hero-tag-badge', {
      opacity: 0,
      y: -20,
      duration: 0.7,
      ease: 'power3.out'
    });

    gsap.from('.hero-title', {
      opacity: 0,
      y: 30,
      duration: 0.9,
      delay: 0.15,
      ease: 'power3.out'
    });

    gsap.from('.hero-tagline', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.3,
      ease: 'power3.out'
    });

    gsap.from('.hero-cta-group', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.45,
      ease: 'power3.out'
    });

    gsap.from('.hero-event-card', {
      opacity: 0,
      scale: 0.95,
      duration: 1,
      delay: 0.35,
      ease: 'back.out(1.4)'
    });

    // 2. Scroll Trigger Reveals for Section Cards
    if (typeof window.ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      document.querySelectorAll('.section').forEach((section) => {
        const header = section.querySelector('.section-header');
        if (header) {
          gsap.from(header, {
            scrollTrigger: {
              trigger: header,
              start: 'top 85%',
              toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.7,
            ease: 'power2.out'
          });
        }

        const cards = section.querySelectorAll('.nb-card');
        if (cards.length > 0) {
          gsap.from(cards, {
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 35,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power2.out'
          });
        }
      });
    }
  } else {
    // Fallback using native IntersectionObserver if GSAP CDN is blocked
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.section-header, .nb-card').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });
  }

  // Active section scroll spy
  initScrollSpy();
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}
