export const SEED_SITES = [
  {
    hostname: 'cmdk.vercel.app',
    title: 'CMDK — Fast, Unstyled Command Menu for React',
    url: 'https://cmdk.vercel.app',
    hostType: 'vercel.app',
    framework: 'React',
    score: 96,
    screenshot: 'https://image.thum.io/get/width/600/crop/700/https://cmdk.vercel.app',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Latency (<200ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 6, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 120, title: true, description: true, ogImage: true, viewport: true, securityHeaders: true },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    hostname: 'speedometer.pages.dev',
    title: 'Speedometer 3.0 — Browser Benchmark Suite',
    url: 'https://speedometer.pages.dev',
    hostType: 'pages.dev',
    framework: 'JavaScript',
    score: 95,
    screenshot: 'https://image.thum.io/get/width/600/crop/700/https://speedometer.pages.dev',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Latency (<200ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 5, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 95, title: true, description: true, ogImage: true, viewport: true, securityHeaders: true },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    hostname: 'tabler.github.io',
    title: 'Tabler Admin Template — Responsive HTML Dashboard',
    url: 'https://tabler.github.io',
    hostType: 'github.io',
    framework: 'Bootstrap',
    score: 94,
    screenshot: 'https://image.thum.io/get/width/600/crop/700/https://tabler.github.io',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Latency (<200ms)', points: 14, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 5, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 140, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    hostname: 'react-tweet.vercel.app',
    title: 'React Tweet — Static & Dynamic Embedded Tweet Renderer',
    url: 'https://react-tweet.vercel.app',
    hostType: 'vercel.app',
    framework: 'Next.js',
    score: 97,
    screenshot: 'https://image.thum.io/get/width/600/crop/700/https://react-tweet.vercel.app',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Latency (<200ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 7, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 110, title: true, description: true, ogImage: true, viewport: true, securityHeaders: true },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 80).toISOString()
  },
  {
    hostname: 'squoosh.web.app',
    title: 'Squoosh — High Performance Image Compression App',
    url: 'https://squoosh.web.app',
    hostType: 'web.app',
    framework: 'Preact',
    score: 98,
    screenshot: 'https://image.thum.io/get/width/600/crop/700/https://squoosh.web.app',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Latency (<200ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 8, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 85, title: true, description: true, ogImage: true, viewport: true, securityHeaders: true },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 110).toISOString()
  },
  {
    hostname: 'chartjs.github.io',
    title: 'Chart.js — Open Source Canvas Charts for Modern Web',
    url: 'https://chartjs.github.io',
    hostType: 'github.io',
    framework: 'JavaScript',
    score: 93,
    screenshot: 'https://image.thum.io/get/width/600/crop/700/https://chartjs.github.io',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Latency (<200ms)', points: 14, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 4, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 135, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 140).toISOString()
  },
  {
    hostname: 'miniflare.pages.dev',
    title: 'Miniflare — Cloudflare Workers Local Development Environment',
    url: 'https://miniflare.pages.dev',
    hostType: 'pages.dev',
    framework: 'Vite',
    score: 94,
    screenshot: 'https://image.thum.io/get/width/600/crop/700/https://miniflare.pages.dev',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Latency (<200ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 4, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 105, title: true, description: true, ogImage: true, viewport: true, securityHeaders: true },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 170).toISOString()
  },
  {
    hostname: 'sweetalert2.github.io',
    title: 'SweetAlert2 — Beautiful, Accessible JavaScript Modal Popup Engine',
    url: 'https://sweetalert2.github.io',
    hostType: 'github.io',
    framework: 'JavaScript',
    score: 95,
    screenshot: 'https://image.thum.io/get/width/600/crop/700/https://sweetalert2.github.io',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Latency (<200ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 5, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 115, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 200).toISOString()
  },
  {
    hostname: 'jamstack.netlify.app',
    title: 'Jamstack E-Commerce Architecture Showcase',
    url: 'https://jamstack.netlify.app',
    hostType: 'netlify.app',
    framework: 'React',
    score: 91,
    screenshot: 'https://image.thum.io/get/width/600/crop/700/https://jamstack.netlify.app',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Latency (<200ms)', points: 14, max: 15 },
      { label: 'SEO Metadata', points: 14, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 3, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 160, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  },
  {
    hostname: 'gridsome.netlify.app',
    title: 'Gridsome Static Site & Vue.js Blog Engine',
    url: 'https://gridsome.netlify.app',
    hostType: 'netlify.app',
    framework: 'Vue',
    score: 92,
    screenshot: 'https://image.thum.io/get/width/600/crop/700/https://gridsome.netlify.app',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Latency (<200ms)', points: 14, max: 15 },
      { label: 'SEO Metadata', points: 15, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 3, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 175, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 280).toISOString()
  },
  {
    hostname: 'zustand.netlify.app',
    title: 'Zustand — Lightweight Modern React State Manager',
    url: 'https://zustand.netlify.app',
    hostType: 'netlify.app',
    framework: 'React',
    score: 93,
    screenshot: 'https://image.thum.io/get/width/600/crop/700/https://zustand.netlify.app',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Latency (<200ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 14, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 4, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 130, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 320).toISOString()
  },
  {
    hostname: 'mrdoob.github.io',
    title: 'Mr.doob Experiments & WebGL 3D Showcase',
    url: 'https://mrdoob.github.io',
    hostType: 'github.io',
    framework: 'JavaScript',
    score: 90,
    screenshot: 'https://image.thum.io/get/width/600/crop/700/https://mrdoob.github.io',
    breakdown: [
      { label: 'HTTPS Security', points: 20, max: 20 },
      { label: 'HTTP 200 OK', points: 20, max: 20 },
      { label: 'Fast Latency (<200ms)', points: 15, max: 15 },
      { label: 'SEO Metadata', points: 13, max: 15 },
      { label: 'OpenGraph Rich Card', points: 10, max: 10 },
      { label: 'Responsive Viewport', points: 10, max: 10 },
      { label: 'Security Headers', points: 2, max: 10 }
    ],
    signals: { https: true, status: 200, loadMs: 90, title: true, description: true, ogImage: true, viewport: true, securityHeaders: false },
    discoveredAt: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  }
];
