/**
 * EECS Club IISER Bhopal — Main Application Script
 * Clean UI interactions, Project Filtering, Gallery Lightbox, and 5-Theme Switcher.
 */

import { initTextScramble, initCircuitCanvas, refreshCanvasTheme } from './reactbits.js';
import { initAnimations } from './animations.js';

const THEME_LABELS = {
  'kanagawa': { icon: '🐲', name: 'KANAGAWA' },
  'tokyo-night': { icon: '🌃', name: 'TOKYO NIGHT' },
  'gruvbox': { icon: '📻', name: 'GRUVBOX' },
  'nord': { icon: '❄️', name: 'NORD' },
  'acid': { icon: '⚡', name: 'ACID BRUTAL' }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Visual Effects & Background Canvas
  initCircuitCanvas();
  initTextScramble();
  initAnimations();

  // 2. Multi-Theme Switcher System (5 Themes)
  const themeBtn = document.getElementById('theme-btn');
  const themeMenu = document.getElementById('theme-menu');
  const themeBtnIcon = document.getElementById('theme-btn-icon');
  const themeBtnLabel = document.getElementById('theme-btn-label');
  const themeOptions = document.querySelectorAll('[data-set-theme]');

  function applyTheme(themeId) {
    if (!THEME_LABELS[themeId]) themeId = 'kanagawa';
    
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('eecs_theme', themeId);

    // Update Button Label & Icon
    if (themeBtnIcon) themeBtnIcon.innerText = THEME_LABELS[themeId].icon;
    if (themeBtnLabel) themeBtnLabel.innerText = THEME_LABELS[themeId].name;

    // Update active dropdown items
    themeOptions.forEach((opt) => {
      if (opt.getAttribute('data-set-theme') === themeId) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    // Refresh canvas particle colors to match current theme
    setTimeout(() => {
      refreshCanvasTheme();
    }, 50);
  }

  // Load saved theme or default to kanagawa
  const savedTheme = localStorage.getItem('eecs_theme') || 'kanagawa';
  applyTheme(savedTheme);

  if (themeBtn && themeMenu) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = themeMenu.classList.toggle('open');
      themeBtn.setAttribute('aria-expanded', isOpen);
    });

    themeOptions.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const themeId = opt.getAttribute('data-set-theme');
        applyTheme(themeId);
        themeMenu.classList.remove('open');
        themeBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!themeBtn.contains(e.target) && !themeMenu.contains(e.target)) {
        themeMenu.classList.remove('open');
        themeBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerText = isOpen ? '[✕] CLOSE' : '[☰] MENU';
    });

    mobileDrawer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.innerText = '[☰] MENU';
      });
    });
  }

  // 4. Project Filter System
  const filterBtns = document.querySelectorAll('.nb-filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // 5. Gallery Lightbox Modal
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption') || img.getAttribute('alt');
        
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption) lightboxCaption.innerText = caption;
        
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  // 6. Back to Top Button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
