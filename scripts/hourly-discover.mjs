import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);

const SEED_FILE = path.join(rootDir, 'src', 'sources', 'seed.js');

const TARGET_HOSTS = [
  'vercel.app',
  'pages.dev',
  'netlify.app',
  'github.io',
  'onrender.com',
  'fly.dev',
  'railway.app',
  'web.app',
  'epizy.com',
  'rf.gd',
  '42web.io',
  'infinityfreeapp.com'
];

// Discover fresh public candidate URLs via GitHub Search API & curated radar
async function discoverCandidates() {
  const candidates = new Set();
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    'User-Agent': 'SiteScout-Hourly-Radar/1.0',
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  for (const host of TARGET_HOSTS) {
    try {
      const q = encodeURIComponent(`"${host}" in:readme`);
      const res = await fetch(`https://api.github.com/search/repositories?q=${q}&sort=updated&order=desc&per_page=15`, {
        headers,
        signal: AbortSignal.timeout(6000)
      });

      if (!res.ok) continue;
      const data = await res.json();
      for (const item of data.items || []) {
        const text = [item.homepage, item.description, item.html_url].filter(Boolean).join(' ');
        const matches = text.matchAll(/https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]+/g);
        for (const match of matches) {
          try {
            const u = new URL(match[0]);
            if (u.protocol === 'https:' && u.hostname.endsWith(`.${host}`)) {
              candidates.add(`https://${u.hostname.toLowerCase()}`);
            }
          } catch {}
        }
      }
    } catch (e) {
      console.warn(`Discovery probe for ${host} notice:`, e.message);
    }
  }

  return [...candidates];
}

// Live verification probe
async function verifySite(url) {
  try {
    const start = Date.now();
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'SiteScoutBot/1.0 (+https://sitescout-app.vercel.app/about)',
        Accept: 'text/html,application/xhtml+xml'
      },
      signal: AbortSignal.timeout(5000),
      redirect: 'manual'
    });

    if (res.status !== 200) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return null;

    const loadMs = Date.now() - start;
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]{2,120})<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : new URL(url).hostname;

    let framework = 'JavaScript';
    if (html.includes('__next') || html.includes('/_next/')) framework = 'Next.js';
    else if (html.includes('react-dom') || html.includes('data-reactroot')) framework = 'React';
    else if (html.includes('__VUE__') || html.includes('/_nuxt/')) framework = 'Vue';
    else if (html.includes('svelte')) framework = 'Svelte';
    else if (html.includes('astro-island')) framework = 'Astro';
    else if (html.includes('@vite/client')) framework = 'Vite';

    const u = new URL(url);
    const m = u.hostname.match(/(?:^|\.)(vercel\.app|netlify\.app|pages\.dev|workers\.dev|github\.io|onrender\.com|web\.app|firebaseapp\.com|herokuapp\.com|fly\.dev|railway\.app|surge\.sh|infinityfreeapp\.com|epizy\.com|rf\.gd|42web\.io|great-site\.net)$/i);
    const hostType = m?.[1] || 'other';

    return {
      hostname: u.hostname,
      title,
      url,
      hostType,
      framework,
      screenshot: `https://image.thum.io/get/width/600/crop/700/${url}`,
      signals: {
        https: true,
        status: 200,
        loadMs,
        title: Boolean(titleMatch),
        description: html.includes('name="description"'),
        ogImage: html.includes('property="og:image"'),
        viewport: html.includes('name="viewport"'),
        securityHeaders: Boolean(res.headers.get('content-security-policy') || res.headers.get('strict-transport-security'))
      },
      discoveredAt: new Date().toISOString()
    };
  } catch {
    return null;
  }
}

async function run() {
  console.log('🛰️ Starting SiteScout hourly radar discovery pass...');
  
  // Read existing seed sites
  let existingSites = [];
  try {
    if (fs.existsSync(SEED_FILE)) {
      const fileContent = fs.readFileSync(SEED_FILE, 'utf-8');
      const jsonMatch = fileContent.match(/export const SEED_SITES = (\[[\s\S]*\]);/);
      if (jsonMatch) {
        existingSites = JSON.parse(jsonMatch[1]);
      }
    }
  } catch (e) {
    console.log('Notice reading seed file:', e.message);
  }

  const existingHostnames = new Set(existingSites.map(s => s.hostname.toLowerCase()));
  const candidates = await discoverCandidates();
  console.log(`Discovered ${candidates.length} potential target URLs to inspect.`);

  const newVerified = [];
  for (const url of candidates) {
    const hostname = new URL(url).hostname.toLowerCase();
    if (existingHostnames.has(hostname)) continue;

    console.log(`Probing: ${url}...`);
    const verified = await verifySite(url);
    if (verified) {
      console.log(`✓ VERIFIED LIVE: ${verified.hostname} (${verified.title})`);
      newVerified.push(verified);
      existingHostnames.add(hostname);
    }
  }

  console.log(`\nVerified ${newVerified.length} brand new live deployments.`);

  if (newVerified.length > 0) {
    const combined = [...newVerified, ...existingSites];
    const newContent = `export const SEED_SITES = ${JSON.stringify(combined, null, 2)};\n`;
    fs.writeFileSync(SEED_FILE, newContent, 'utf-8');
    console.log('Updated src/sources/seed.js with new live websites!');
  }

  // Ping live deployed Vercel cron endpoint if secret available
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    try {
      console.log('Pinging live Vercel collector endpoint...');
      await fetch('https://sitescout-app.vercel.app/api/cron/collect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cronSecret}`,
          'User-Agent': 'SiteScout-Workflow/1.0'
        }
      });
      console.log('Live Vercel edge cache refreshed.');
    } catch (e) {
      console.log('Live ping notice:', e.message);
    }
  }

  console.log('Hourly radar discovery pass completed successfully.');
}

run().catch(err => {
  console.error('Hourly discovery error:', err);
  process.exit(1);
});
