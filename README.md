# ÆTHER OS — Neural Web Interface

Æther OS is an editorial, production-grade web application featuring a fullscreen, real-time WebGL fragment shader hero landing page, a merged architecture hypervisor, and a hardened AI terminal console.

Built with pure Vanilla WebGL, Next.js 16.3 (Turbopack), and Google Gemini AI.

---

## 🎨 Color Palette & Design System

* **Primary Background**: `#000000` (Pure Black)
* **Accent Color**: `#ea3a00` (Deep Orange)
* **Text / Highlights**: `#ffffff` (Pure White) & `#a0a0a0` / `#8a8a8a` (High-contrast Muted Text)
* **Typography**: Space Grotesk (Display Headings) & JetBrains Mono (Technical Labels & Console)

---

## 🚀 Key Features

### 1. Interactive WebGL Shader Hero (Assignment 1)
- **Domain Warp Physics**: Coordinates distort continuously via a 4-octave Fractional Brownian Motion (fBm) domain warp matrix: $f(p + 4 \cdot f(p + t))$.
- **Mouse Gravitational Attractor**: User cursor vectors ($u\_mouse$) drive a 2D coordinate rotation matrix with exponential decay ($e^{-d \cdot 4}$), warping the visual field dynamically around the pointer.
- **Cosine Color Gradient**: Custom mathematical cosine palette generating smooth transitions from pure black to charcoal, deep orange, and ember white without neon halos.
- **DPR Clamping**: Restricts canvas calculations to a maximum `devicePixelRatio` of `2.0`, protecting high-DPI (4K/Retina) screens from GPU thermal throttling.
- **Visibility Sleep Loop**: Pauses the `requestAnimationFrame` render loop automatically when the tab is hidden (`visibilitychange` listener), resuming on restore.
- **Accessibility & Motion Limits**: Respects `prefers-reduced-motion: reduce` by halting animation updates and rendering a single static frame.

### 2. Merged Architecture Engine
- **35% / 65% Asymmetric Split**: Combines live GPU rendering parameters (FPS, frame time, dependencies count) and interactive GLSL pass rows.
- **Borderless Visualizer**: Displays an animated SVG vector wave graphic representing real-time coordinate domain sway without boxy frames.

### 3. Hardened Core Console (Assignment 2)
- **Multi-Model Candidate Fallback**: Automatically tries active Gemini models (`gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-pro`) with verified first-chunk stream execution.
- **Internal Log Auto-Scroll**: Manages terminal log scrolling internally (`logRef.current.scrollTop`), preventing viewport jumps or unwanted window scrolling.
- **Sliding-Window IP Rate Limiter**: Server-side token bucket algorithm limiting queries to 5 requests per 30 seconds per IP, with automatic memory garbage collection.
- **Input Character Cap**: Client and server-side safety checks cap prompts at 800 characters.

---

## 🛠 Quickstart

### Running Locally

```bash
# 1. Clone repository
git clone https://github.com/kazwahid/aether-os.git
cd aether-os

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for live AI, demo mode runs without key)
cp .env.local.example .env.local
# Add your GEMINI_API_KEY from Google AI Studio

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Verification

```bash
npm run lint
npm run build
npm run start
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
