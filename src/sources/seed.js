export const SEED_SITES = [
  {
    hostname: 'dub.vercel.app',
    title: 'Dub.co — Modern Open-Source Link Management',
    url: 'https://dub.vercel.app',
    hostType: 'vercel.app',
    framework: 'Next.js',
    score: 96,
    screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Response (<300ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 6, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 142, title: true, description: true, ogImage: true, viewport: true, securityHeaders: true },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  },
  {
    hostname: 'speedometer.pages.dev',
    title: 'Speedometer 3.0 — Browser Benchmark Suite',
    url: 'https://speedometer.pages.dev',
    hostType: 'pages.dev',
    framework: 'Vite',
    score: 94,
    screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Response (<300ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 4, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 98, title: true, description: true, ogImage: true, viewport: true, securityHeaders: true },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 42).toISOString()
  },
  {
    hostname: 'tanstack.netlify.app',
    title: 'TanStack — High Quality Open Source Query & Table Utilities',
    url: 'https://tanstack.netlify.app',
    hostType: 'netlify.app',
    framework: 'React',
    score: 92,
    screenshot: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Response (<300ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 2, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 165, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 95).toISOString()
  },
  {
    hostname: 'threejs.github.io',
    title: 'Three.js — 3D WebGL Graphics Engine Showcase',
    url: 'https://threejs.github.io',
    hostType: 'github.io',
    framework: 'JavaScript',
    score: 91,
    screenshot: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Response (<300ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 1, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 210, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    hostname: 'astro-blog-starter.pages.dev',
    title: 'Astro Minimal Blog & Docs Engine',
    url: 'https://astro-blog-starter.pages.dev',
    hostType: 'pages.dev',
    framework: 'Astro',
    score: 98,
    screenshot: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Response (<300ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 8, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 82, title: true, description: true, ogImage: true, viewport: true, securityHeaders: true },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 140).toISOString()
  },
  {
    hostname: 'excalidraw.web.app',
    title: 'Excalidraw — Virtual Hand-Drawn Collaborative Whiteboard',
    url: 'https://excalidraw.web.app',
    hostType: 'web.app',
    framework: 'React',
    score: 95,
    screenshot: 'https://images.unsplash.com/photo-1542744094-3a31727220c3?auto=format&fit=crop&w=800&q=80',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Response (<300ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 5, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 125, title: true, description: true, ogImage: true, viewport: true, securityHeaders: true },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 200).toISOString()
  },
  {
    hostname: 'uptime-kuma.railway.app',
    title: 'Uptime Monitor — Self-Hosted Status & Health Dashboard',
    url: 'https://uptime-kuma.railway.app',
    hostType: 'railway.app',
    framework: 'Vue',
    score: 90,
    screenshot: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Response (<300ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 0, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 240, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 280).toISOString()
  },
  {
    hostname: 'svelte-repl.fly.dev',
    title: 'Svelte Interactive Compiler & Sandbox Playground',
    url: 'https://svelte-repl.fly.dev',
    hostType: 'fly.dev',
    framework: 'Svelte',
    score: 93,
    screenshot: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Response (<300ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 3, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 180, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 350).toISOString()
  },
  {
    hostname: 'fastapi-docs.onrender.com',
    title: 'FastAPI Cloud API Documentation Explorer',
    url: 'https://fastapi-docs.onrender.com',
    hostType: 'onrender.com',
    framework: 'Swagger',
    score: 89,
    screenshot: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Response (<300ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 14, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 0, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 290, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 400).toISOString()
  },
  {
    hostname: 'nuxt-content.surge.sh',
    title: 'Nuxt Content Markdown Engine Demo',
    url: 'https://nuxt-content.surge.sh',
    hostType: 'surge.sh',
    framework: 'Nuxt',
    score: 91,
    screenshot: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Response (<300ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 1, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 190, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 450).toISOString()
  },
  {
    hostname: 'json-api.workers.dev',
    title: 'Cloudflare Edge JSON Transformation Proxy',
    url: 'https://json-api.workers.dev',
    hostType: 'workers.dev',
    framework: 'JavaScript',
    score: 95,
    screenshot: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Response (<300ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 5, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 65, title: true, description: true, ogImage: true, viewport: true, securityHeaders: true },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 500).toISOString()
  },
  {
    hostname: 'photo-gallery.firebaseapp.com',
    title: 'Cloud Photo Archive & Asset Streamer',
    url: 'https://photo-gallery.firebaseapp.com',
    hostType: 'firebaseapp.com',
    framework: 'React',
    score: 88,
    screenshot: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Response (<300ms)', points: 14, max: 15 },
      { label: 'SEO Metadata', points: 14, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 0, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 310, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 600).toISOString()
  }
];
