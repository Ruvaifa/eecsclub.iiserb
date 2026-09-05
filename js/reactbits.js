/**
 * VANILLA REACTBITS, RETRO CANVAS & ASCII HARDWARE LAB ENGINE
 * High-performance 60fps circuit canvas, text scramble, and interactive ASCII animation engine.
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

// ==========================================================================
// 3. INTERACTIVE ASCII HARDWARE & SYSTEMS ANIMATION ENGINE
// ==========================================================================

export const ASCII_SYSTEMS = {
  uav: {
    title: "AUTONOMOUS UAV & VTOL FLIGHT SYSTEM",
    desc: "Autonomous aerial robotics leveraging PX4 / ArduPilot flight stacks, optical flow odometry, PID attitude stabilizing loops running at 400Hz, and real-time telemetry downlink.",
    frames: [
`      (===)                     (===)
      \\   /                     \\   /
       \\ /                       \\ /
  +-----[X]---------------------[X]-----+
  |      |                       |      |
  |      +-------\\       /-------+      |
  |               \\ [O] /               |
  |             +---[#]---+             |
  |             | IISERB  |             |
  |             | UAV-SYS |             |
  |             +---[#]---+             |
  |               /     \\               |
  |      +-------/       \\-------+      |
  |      |                       |      |
  +-----[X]---------------------[X]-----+
       / \\                       / \\
      /   \\                     /   \\
      (===)                     (===)`,
`      ( | )                     ( | )
      \\   /                     \\   /
       \\ /                       \\ /
  +-----[X]---------------------[X]-----+
  |      |                       |      |
  |      +-------\\       /-------+      |
  |               \\ [O] /               |
  |             +---[#]---+             |
  |             | IISERB  |             |
  |             | UAV-SYS |             |
  |             +---[#]---+             |
  |               /     \\               |
  |      +-------/       \\-------+      |
  |      |                       |      |
  +-----[X]---------------------[X]-----+
       / \\                       / \\
      /   \\                     /   \\
      ( | )                     ( | )`,
`      ( - )                     ( - )
      \\   /                     \\   /
       \\ /                       \\ /
  +-----[X]---------------------[X]-----+
  |      |                       |      |
  |      +-------\\       /-------+      |
  |               \\ [O] /               |
  |             +---[#]---+             |
  |             | IISERB  |             |
  |             | UAV-SYS |             |
  |             +---[#]---+             |
  |               /     \\               |
  |      +-------/       \\-------+      |
  |      |                       |      |
  +-----[X]---------------------[X]-----+
       / \\                       / \\
      /   \\                     /   \\
      ( - )                     ( - )`,
`      ( / )                     ( / )
      \\   /                     \\   /
       \\ /                       \\ /
  +-----[X]---------------------[X]-----+
  |      |                       |      |
  |      +-------\\       /-------+      |
  |               \\ [O] /               |
  |             +---[#]---+             |
  |             | IISERB  |             |
  |             | UAV-SYS |             |
  |             +---[#]---+             |
  |               /     \\               |
  |      +-------/       \\-------+      |
  |      |                       |      |
  +-----[X]---------------------[X]-----+
       / \\                       / \\
      /   \\                     /   \\
      ( / )                     ( / )`
    ],
    registers: [
      { label: "FLIGHT_MODE", val: "AUTO_NAV" },
      { label: "ALTITUDE", val: "18.4 m" },
      { label: "PID_UPDATE", val: "400 Hz" },
      { label: "IMU_SENSOR", val: "MPU6050_6AXIS" },
      { label: "GPS_LOCK", val: "14 SATS" },
      { label: "BATTERY", val: "15.8V (4S)" }
    ]
  },

  riscv: {
    title: "RISC-V 32-BIT CUSTOM PROCESSOR CORE",
    desc: "Bare-metal 5-stage pipelined RV32I processor architecture featuring hazard mitigation, memory-mapped I/O, UART peripheral drivers, and custom assembly toolchains.",
    frames: [
`+=======================================+
| [CLK: 24.0MHz]   RISC-V RV32I CORE    |
+=======================================+
|  [IF] -> [ID] -> [EX] -> [MEM] -> [WB]|
|                                       |
|  +--[ REGISTERS ]--+  +--[ ALU BUS ]--+
|  | x0 (zero): 0x00 |  | ADD  x1,x2,x3 |
|  | x1 (ra)  : 0x80 |  | AND  x4,x1,x5 |
|  | x2 (sp)  : 0x7F |  | XOR  x6,x7,x8 |
|  +-----------------+  +---------------+
|                                       |
|  +--[ MEMORY-MAPPED I/O INTERFACE ]--+
|  |  0x40000000: [UART0_TX_READY]     |
|  |  0x40000004: [SPI_BUS_MASTER]     |
|  +-----------------------------------+
+=======================================+`,
`+=======================================+
| [CLK: 24.0MHz]   RISC-V RV32I CORE    |
+=======================================+
|  [IF] >> [ID] >> [EX] >> [MEM] >> [WB]|
|                                       |
|  +--[ REGISTERS ]--+  +--[ ALU BUS ]--+
|  | x0 (zero): 0x00 |  | SLL  x2,x1,2  |
|  | x1 (ra)  : 0x84 |  | SUB  x5,x2,x1 |
|  | x2 (sp)  : 0x7C |  | OR   x9,x3,x4 |
|  +-----------------+  +---------------+
|                                       |
|  +--[ MEMORY-MAPPED I/O INTERFACE ]--+
|  |  0x40000000: [UART0_TRANSMIT]     |
|  |  0x40000008: [TIMER_INTERRUPT]    |
|  +-----------------------------------+
+=======================================+`
    ],
    registers: [
      { label: "ARCH", val: "RV32I_PIPELINE" },
      { label: "PROGRAM_CTR", val: "0x004001F8" },
      { label: "PIPELINE_ST", val: "EX_ACTIVE" },
      { label: "INSTR_DEC", val: "ADDI x1, x0, 12" },
      { label: "CACHE_HIT", val: "97.4%" },
      { label: "LOGIC_UTIL", val: "1,420 LUTs" }
    ]
  },

  robotics: {
    title: "PGNTA 17-DOF HUMANOID ROBOTICS",
    desc: "17 Degree of Freedom bipedal humanoid robot powered by ESP32, dual-core gait generation solvers, servo matrices, and custom joint kinematics designed from scratch.",
    frames: [
`             +---+
             |O_O|  <-- HEAD [2 DOF]
             +-|-+
        +------|------+
       /|   +-----+   |\\
      / |   | ESP |   | \\  <-- ARMS [6 DOF]
     [X]|   | 32  |   |[X]
     |  |   +-----+   |  |
     V  +------|------+  V
              / \\
             /   \\
            /     \\
           [=]   [=]       <-- HIPS [4 DOF]
            |     |
            |     |        <-- LEGS [4 DOF]
           [=]   [=]
           _|_   _|_       <-- FEET [1 DOF]`,
`             +---+
             |^_^|  <-- HEAD [2 DOF]
             +-|-+
        +------|------+
       \\|   +-----+   |/
        \\|   | ESP |   |/   <-- ARMS [6 DOF]
        [X] | 32  |  [X]
         |  +-----+   |
         V     |      V
              / \\
            /     \\
          [=]     [=]      <-- HIPS [4 DOF]
           |       |
          [=]     [=]      <-- LEGS [4 DOF]
          _|_     _|_      <-- FEET [1 DOF]`
    ],
    registers: [
      { label: "SERVO_COUNT", val: "17 ACTIVE" },
      { label: "CONTROLLER", val: "ESP32_DUAL_CORE" },
      { label: "KINEMATICS", val: "INVERSE_JACOB" },
      { label: "BUS_RATE", val: "115200 BAUD" },
      { label: "TORQUE_LIMIT", val: "2.4 Nm" },
      { label: "BALANCE_IMU", val: "REALTIME_FEEDBACK" }
    ]
  },

  litho: {
    title: "MICRON ELECTRO-LITHOGRAPHY & PHYSICS",
    desc: "Micron-level precision probe patterning system with real-time Z-axis electrical current feedback, paired with real-time C++ OpenGL cloth & mass-spring physics engines.",
    frames: [
`+--[ XYZ MICRO-PROBE STAGE ]-----------+
|                                      |
|    Z-AXIS PROBE:                     |
|         ||                           |
|         ||  <-- SMU CURRENT SENSOR   |
|         \\/                           |
|      -------- [SAMPLE SURFACE]       |
|                                      |
|    [X-POS: 142.3 µm] [Y-POS: 89.1 µm]|
|    [Z-FEEDBACK: CONTACT DETECTED]    |
|                                      |
+--[ MASS-SPRING PARTICLE MESH ]-------+
|    o---o---o---o---o---o---o         |
|    | X | X | X | X | X | X |  60 FPS |
|    o---o---o---o---o---o---o  PHONG  |
+--------------------------------------+`,
`+--[ XYZ MICRO-PROBE STAGE ]-----------+
|                                      |
|    Z-AXIS PROBE:                     |
|         ||                           |
|         ||  <-- SMU CURRENT SENSOR   |
|         \\/                           |
|      ---**--- [PATTERNING ACTIVE]    |
|                                      |
|    [X-POS: 146.8 µm] [Y-POS: 94.2 µm]|
|    [Z-FEEDBACK: 4.2 µA CURRENT]      |
|                                      |
+--[ MASS-SPRING PARTICLE MESH ]-------+
|    o~~~o~~~o~~~o~~~o~~~o~~~o         |
|    | / | \\ | / | \\ | / | \\ |  60 FPS |
|    o~~~o~~~o~~~o~~~o~~~o~~~o  PHONG  |
+--------------------------------------+`
    ],
    registers: [
      { label: "STAGE_PRECISION", val: "0.1 µm (XYZ)" },
      { label: "SMU_SENSITIVITY", val: "10 pA" },
      { label: "PHYSICS_ENGINE", val: "C++ / OPENGL" },
      { label: "SPRING_COUNT", val: "2,048 NODES" },
      { label: "SHADER_MODEL", val: "PHONG_BATCH" },
      { label: "COLLISION", val: "SPATIAL_GRID" }
    ]
  }
};

export function initAsciiHardwareLab() {
  const displayEl = document.getElementById('ascii-art-display');
  const titleEl = document.getElementById('ascii-model-title');
  const descEl = document.getElementById('ascii-model-desc');
  const registersEl = document.getElementById('ascii-registers-list');
  const tabs = document.querySelectorAll('.ascii-tab-btn');

  if (!displayEl || !titleEl || !descEl || !registersEl) return;

  let currentKey = 'uav';
  let frameIdx = 0;
  let animTimer = null;

  function renderSystem(key) {
    currentKey = key;
    const sys = ASCII_SYSTEMS[key];
    if (!sys) return;

    titleEl.innerText = sys.title;
    descEl.innerText = sys.desc;

    // Render registers
    registersEl.innerHTML = sys.registers.map(r => `
      <div class="ascii-reg-item">
        <span>${r.label}:</span>
        <span class="val">${r.val}</span>
      </div>
    `).join('');

    frameIdx = 0;
    displayEl.textContent = sys.frames[0];
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const sysKey = tab.getAttribute('data-ascii-sys');
      renderSystem(sysKey);
    });
  });

  renderSystem('uav');

  // 4-frame animation loop
  setInterval(() => {
    const sys = ASCII_SYSTEMS[currentKey];
    if (sys && sys.frames.length > 0) {
      frameIdx = (frameIdx + 1) % sys.frames.length;
      displayEl.textContent = sys.frames[frameIdx];
    }
  }, 350);
}
