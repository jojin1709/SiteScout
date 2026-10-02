import { makeEnv } from '../core/config.js';
import { normalizeCandidate } from '../core/security.js';
import { allowedByRobots } from '../core/robots.js';
import { detectFramework } from '../core/framework.js';
import { fetchWithTimeout } from '../core/http.js';
import { collectUrlscan } from './urlscan.js';
import { collectCommonCrawl } from './commoncrawl.js';
import { collectGitHub } from './github.js';
import { SEED_SITES } from './seed.js';

const cache = new Map();
const userSubmittedSites = [];

export function addSiteToFeed(site) {
  userSubmittedSites.unshift(site);
  if (cache.has('feed')) {
    const existing = cache.get('feed').data;
    existing.sites = dedupe([site, ...existing.sites]);
    cache.set('feed', { at: Date.now(), data: existing });
  }
}

function hostType(host) {
  const m = host.match(/(?:^|\.)(vercel\.app|netlify\.app|pages\.dev|workers\.dev|github\.io|onrender\.com|web\.app|firebaseapp\.com|herokuapp\.com|fly\.dev|railway\.app|surge\.sh|infinityfreeapp\.com|epizy\.com|rf\.gd|42web\.io|great-site\.net)$/i);
  return m?.[1] || 'other';
}

function dedupe(items) {
  const map = new Map();
  for (const item of items) {
    if (!item || !item.url) continue;
    const n = normalizeCandidate(item.url);
    if (!n) continue;
    const u = new URL(n);
    const key = u.hostname.toLowerCase();
    if (!map.has(key) || (item.screenshot && !map.get(key).screenshot)) {
      map.set(key, { ...item, url: n, hostname: key, hostType: hostType(key) });
    }
  }
  return [...map.values()];
}

async function inspect(item, cfg) {
  if (!(await allowedByRobots(item.url, cfg.userAgent))) return null;
  const { response, loadMs } = await fetchWithTimeout(item.url, {
    timeout: cfg.timeout,
    redirect: 'manual',
    headers: { 'User-Agent': cfg.userAgent, Accept: 'text/html,application/xhtml+xml' }
  });
  if (response.status >= 300 && response.status < 400) {
    const loc = response.headers.get('location');
    if (!loc) return null;
    const next = normalizeCandidate(new URL(loc, item.url).toString());
    if (!next || new URL(next).hostname !== item.hostname) return null;
    return null;
  }
  if (!response.ok) return null;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return null;
  const html = await response.text();
  if (html.length > 2_000_000) return null;
  return {
    ...item,
    title: item.title || extractTitle(html) || item.hostname,
    framework: detectFramework(html),
    signals: {
      https: new URL(item.url).protocol === 'https:',
      status: response.status,
      loadMs,
      title: Boolean(extractTitle(html)),
      description: html.includes('name="description"'),
      ogImage: html.includes('property="og:image"'),
      viewport: html.includes('name="viewport"'),
      securityHeaders: Boolean(response.headers.get('content-security-policy') || response.headers.get('strict-transport-security'))
    },
    checkedAt: new Date().toISOString()
  };
}

function extractTitle(html) {
  return html.match(/<title[^>]*>([^<]{2,120})<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || '';
}

async function withTimeout(promise, ms, fallback = []) {
  return Promise.race([
    promise,
    new Promise(resolve => setTimeout(() => resolve(fallback), ms))
  ]);
}

export async function buildFeed({ refresh = false, runtimeEnv = {} } = {}) {
  const cfg = makeEnv(runtimeEnv);
  const key = 'feed';
  if (!refresh && cache.has(key) && Date.now() - cache.get(key).at < cfg.cacheSeconds * 1000) {
    return cache.get(key).data;
  }

  // Safe timeout-bounded collectors
  const [a, b, c] = await Promise.allSettled([
    withTimeout(collectUrlscan(runtimeEnv), 2000, []),
    withTimeout(collectCommonCrawl(runtimeEnv), 2000, []),
    withTimeout(collectGitHub(runtimeEnv), 2000, [])
  ]);

  const rawDiscovered = [
    ...(a.status === 'fulfilled' && Array.isArray(a.value) ? a.value : []),
    ...(b.status === 'fulfilled' && Array.isArray(b.value) ? b.value : []),
    ...(c.status === 'fulfilled' && Array.isArray(c.value) ? c.value : [])
  ];

  const results = [...userSubmittedSites, ...SEED_SITES];
  const candidates = dedupe(rawDiscovered).slice(0, 10);

  for (const item of candidates) {
    try {
      const site = await inspect(item, cfg);
      if (site) results.push(site);
    } catch {}
    if (results.length >= cfg.maxTotal) break;
  }

  const finalSites = dedupe(results);
  const data = {
    generatedAt: new Date().toISOString(),
    sites: finalSites,
    sourceStats: {
      urlscan: (a.status === 'fulfilled' && a.value?.length) || 0,
      commoncrawl: (b.status === 'fulfilled' && b.value?.length) || 0,
      github: (c.status === 'fulfilled' && c.value?.length) || 0,
      seed: SEED_SITES.length
    }
  };

  cache.set(key, { at: Date.now(), data });
  return data;
}

export async function getFeed(options = {}) {
  return buildFeed(options);
}
