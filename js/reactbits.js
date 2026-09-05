/**
 * VANILLA REACTBITS & RETRO CANVAS
 * Zero jarring hover transforms. Solid, clean, high-performance interactions.
 */

// ==========================================================================
// 1. RETRO TEXT SCRAMBLE / DECRYPTOR EFFECT
// ==========================================================================
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#010101XYZ';

export class TextScramble {
  constructor(el) {
    this.el = el;
    this.originalText = el.innerText;
    this.chars = SCRAMBLE_CHARS;
    this.frame = 0;
    this.queue = [];
    this.frameRequest = null;
    this.isScrambling = false;
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 12);
      const end = start + Math.floor(Math.random() * 12);
      this.queue.push({ from, to, start, end, char: '' });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.isScrambling = true;
    this.update();
  }

  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="text-scramble-glyph" style="color: var(--dragon-red-bright);">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.isScrambling = false;
    } else {
      this.frameRequest = requestAnimationFrame(() => {
        this.frame++;
        this.update();
      });
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }

  scrambleOnce() {
    if (!this.isScrambling) {
      this.setText(this.originalText);
    }
  }
}

export function initTextScramble() {
  const elements = document.querySelectorAll('[data-scramble]');
  elements.forEach((el) => {
    const fx = new TextScramble(el);
    el.addEventListener('mouseenter', () => fx.scrambleOnce());
  });
}

// ==========================================================================
// 2. RETRO ELECTRONIC CIRCUIT & PARTICLE CANVAS
// ==========================================================================
let updateCanvasThemeColors = null;

export function initCircuitCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 16000), 70);
  const mouse = { x: -1000, y: -1000, isHovering: false };

  function getThemeColors() {
    const style = getComputedStyle(document.documentElement);
    return [
      style.getPropertyValue('--canvas-p1').trim() || '#c84053',
      style.getPropertyValue('--canvas-p2').trim() || '#e6c384',
      style.getPropertyValue('--canvas-p3').trim() || '#8a9a86'
    ];
  }

  let palette = getThemeColors();

  updateCanvasThemeColors = () => {
    palette = getThemeColors();
    particles.forEach(p => {
      p.color = palette[Math.floor(Math.random() * palette.length)];
    });
  };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() > 0.85 ? 3 : 2;
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse gentle interaction
      if (mouse.isHovering) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x += dx * 0.015 * force;
          this.y += dy * 0.015 * force;
        }
      }
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size);
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isHovering = true;
  });
  window.addEventListener('mouseleave', () => {
    mouse.isHovering = false;
  });

  let lastTime = 0;
  function animate(t) {
    requestAnimationFrame(animate);
    if (t - lastTime < 16) return;
    lastTime = t;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.18;
          ctx.strokeStyle = `rgba(180, 180, 180, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(Math.floor(particles[i].x), Math.floor(particles[i].y));
          ctx.lineTo(Math.floor(particles[j].x), Math.floor(particles[j].y));
          ctx.stroke();
        }
      }
    }
  }

  requestAnimationFrame(animate);
}

export function refreshCanvasTheme() {
  if (updateCanvasThemeColors) updateCanvasThemeColors();
}
