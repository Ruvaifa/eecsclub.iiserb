/**
 * EECS Club IISER Bhopal — Main Application Script
 * Orchestrates Cyber-Deck UI, ASCII Hardware Lab, Lore Console, and Gallery Lightbox.
 */

import { initTextScramble, initCircuitCanvas, refreshCanvasTheme } from './reactbits.js';
import { initAnimations } from './animations.js';
import { terminalEasterEggs, siteConfig, coreTeam, projects } from './data.js';

const THEME_LABELS = {
  'kanagawa': { icon: '🐲', name: 'KANAGAWA' },
  'tokyo-night': { icon: '🌃', name: 'TOKYO NIGHT' },
  'gruvbox': { icon: '📻', name: 'GRUVBOX' },
  'nord': { icon: '❄️', name: 'NORD' },
  'acid': { icon: '⚡', name: 'ACID BRUTAL' }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Visual Effects, Canvas & Animations
  initCircuitCanvas();
  initTextScramble();
  initAnimations();

  // 2. Multi-Theme Core Engine (Locked to Kanagawa Dragon by Default)
  function applyTheme(themeId) {
    if (!THEME_LABELS[themeId]) themeId = 'kanagawa';
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('eecs_theme', themeId);
    setTimeout(() => {
      refreshCanvasTheme();
    }, 50);
  }

  const savedTheme = localStorage.getItem('eecs_theme') || 'kanagawa';
  applyTheme(savedTheme);

  // 3. Interactive Retro Lore Terminal Console
  initTerminalConsole(applyTheme);

  // 4. Mobile Navigation Drawer
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

  // 5. Project Filter System
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

  // 6. Gallery Lightbox Modal
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

  // 7. Back to Top Button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

function initTerminalConsole(applyThemeFn) {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalChips = document.querySelectorAll('.lore-chip');

  if (!terminalInput || !terminalOutput) return;

  function runCommand(cmd) {
    const raw = cmd.trim();
    if (!raw) return;

    const parts = raw.toLowerCase().split(' ');
    const mainCmd = parts[0];
    const arg = parts[1];

    let response = '';

    if (mainCmd === 'clear') {
      terminalOutput.innerHTML = '';
      terminalInput.value = '';
      return;
    } else if (mainCmd === 'help') {
      response = terminalEasterEggs['help'];
    } else if (mainCmd === 'lore') {
      response = terminalEasterEggs['lore'];
    } else if (mainCmd === 'whoami') {
      response = terminalEasterEggs['whoami'];
    } else if (mainCmd === 'contact') {
      response = terminalEasterEggs['contact'];
    } else if (mainCmd === 'team') {
      response = `[EECS CLUB ROSTER SUMMARY // 20 MEMBERS]\n` +
        coreTeam.map((m, i) => `  [#${(i+1).toString().padStart(2, '0')}] ${m.name.padEnd(18)} | ${m.department}`).join('\n');
    } else if (mainCmd === 'projects') {
      response = `[EECS CLUB ACTIVE PROJECTS]\n` +
        projects.map((p) => `  • [${p.category.toUpperCase()}] ${p.title} (Lead: ${p.doneBy})`).join('\n');
    } else if (mainCmd === 'stats') {
      response = `[TELEMETRY STATS]\n` +
        siteConfig.stats.map(s => `  ${s.label}: ${s.value}${s.suffix}`).join('\n');
    } else if (mainCmd === 'theme') {
      if (arg && THEME_LABELS[arg]) {
        applyThemeFn(arg);
        response = `[SUCCESS] Theme switched to "${THEME_LABELS[arg].name}".`;
      } else {
        response = `[ERROR] Invalid theme. Available: kanagawa, tokyo-night, gruvbox, nord, acid`;
      }
    } else {
      response = `Command not found: "${raw}". Type "help" for available commands.`;
    }

    const commandBlock = document.createElement('div');
    commandBlock.className = 'lore-terminal-output';
    commandBlock.innerHTML = `<span style="color: var(--dragon-gold); font-weight: 700;">guest@iiserb:~$</span> ${escapeHtml(raw)}\n<span style="color: var(--text-white);">${escapeHtml(response)}</span>`;
    terminalOutput.appendChild(commandBlock);

    terminalInput.value = '';
    const screen = terminalOutput.parentElement;
    screen.scrollTop = screen.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runCommand(terminalInput.value);
    }
  });

  terminalChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      runCommand(cmd);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
