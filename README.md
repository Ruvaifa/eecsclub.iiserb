# EECS Club IISER Bhopal — Official Website

> **Zero-Dependency Vanilla Web Stack** featuring **Kanagawa Dragon × Neubrutalism × 8-Bit Pixel Art** design aesthetics, GSAP micro-interactions, and vanilla ReactBits components.

---

## ⚡ Tech Stack & Architecture

- **Core Engine:** Pure Vanilla HTML5, CSS3, ES6+ JavaScript.
- **Animation Framework:** GSAP 3.x (GreenSock Animation Platform) + ScrollTrigger.
- **Interactive UI Components:** Vanilla ReactBits (Magnetic Cursor Pull, Retro Text Scramble/Decryption, 3D Neubrutalist Card Tilt, 60fps Microelectronic Particle Canvas).
- **Theme Palette:** Kanagawa Dragon (`#12120f` Deep Dragon Ink, `#c84053` Kanagawa Crimson, `#e6c384` Carp Gold, `#8a9a86` Sage Green, `#7aa89f` Wave Aqua).
- **Typography:** *Press Start 2P*, *VT323*, *Space Mono*, and *Inter*.
- **Hosting:** Vercel (Zero-build static deployment).

---

## 📁 Repository Structure

```
├── index.html                   # Master semantic HTML5 document
├── CONTENT_BANK.md              # Master content bank (100% audit record)
├── vercel.json                  # Vercel static routing & cache control
├── googlebf876cb1f818072f.html  # Google Search Console verification token
├── robots.txt                   # Search crawler directives
├── css/
│   ├── kanagawa-theme.css       # Kanagawa Dragon color variables & typography
│   ├── neubrutalism.css         # Solid borders, hard unblurred box-shadows, tactile buttons
│   ├── pixel-retro.css          # 8-bit headers, LED blinking status, CRT overlay
│   └── style.css                # Fluid CSS Grid/Flexbox layouts & responsive breakpoints
├── js/
│   ├── data.js                  # Data store (Team, Faculty, Projects, Gallery, Config)
│   ├── reactbits.js             # Vanilla ReactBits components (Magnetic, Scramble, Tilt, Canvas)
│   ├── animations.js            # GSAP staggered entrances, scroll reveals, ScrollSpy
│   └── main.js                  # App bootstrap, project filter, lightbox, mobile drawer
└── assets/                      # Media assets, member photos, and project graphics
```

---

## 🚀 Local Development & Preview

Because the site uses standard ES6 modules and zero heavy build pipelines, you can run it with any local HTTP server:

### Option 1: Python
```bash
python3 -m http.server 3000
```

### Option 2: Node / npx
```bash
npx serve .
```

Navigate to `http://localhost:3000` in your browser.

---

## 🌐 Deployment on Vercel

This repository is ready for instant zero-configuration static deployment on Vercel:
1. Import the repository into your Vercel dashboard.
2. Leave **Build Command** and **Output Directory** blank (or default).
3. Deploy!

---

## 📜 Credits & Attribution

- **Club:** Electrical Engineering and Computer Science Club, IISER Bhopal
- **Developer:** Shafwan Safi
- **License:** MIT
