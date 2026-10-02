import { getFeed, addSiteToFeed } from '../sources/collector.js';
import { normalizeCandidate } from './security.js';
import { fetchWithTimeout } from './http.js';
import { detectFramework } from './framework.js';

export function parseRequest(req) {
  if (typeof req === 'string') {
    return new URL(req, 'https://localhost');
  }
  if (req && typeof req.url === 'string') {
    if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
      return new URL(req.url);
    }
    const host = req.headers?.['x-forwarded-host'] || req.headers?.host || 'localhost';
    const proto = req.headers?.['x-forwarded-proto'] || 'https';
    return new URL(req.url, `${proto}://${host}`);
  }
  return new URL('https://localhost/');
}

function respond(res, data, status = 200, extra = {}) {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'public, s-maxage=300, stale-while-revalidate=600',
    'x-content-type-options': 'nosniff',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS, HEAD',
    'access-control-allow-headers': 'Content-Type, Authorization, x-cron-secret',
    ...extra
  };

  if (res && typeof res.status === 'function') {
    res.status(status);
    for (const [k, v] of Object.entries(headers)) {
      res.setHeader(k, v);
    }
    if (typeof res.json === 'function') {
      return res.json(data);
    }
    res.end(JSON.stringify(data));
    return;
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function matches(s, p) {
  const q = (p.q || '').toLowerCase();
  if (q && !`${s.title || ''} ${s.hostname || ''} ${s.framework || ''} ${s.hostType || ''}`.toLowerCase().includes(q)) return false;
  if (p.host && s.hostType !== p.host && !s.hostname.endsWith(`.${p.host}`)) return false;
  if (p.framework && s.framework !== p.framework) return false;
  return true;
}

function sortSites(sites, sort) {
  const a = [...sites];
  if (sort === 'fast') return a.sort((x, y) => (x.signals?.loadMs || 9999) - (y.signals?.loadMs || 9999));
  if (sort === 'random') return a.sort(() => Math.random() - 0.5);
  return a.sort((x, y) => new Date(y.discoveredAt || y.checkedAt || 0) - new Date(x.discoveredAt || x.checkedAt || 0));
}

export async function handleSites(req, res, runtimeEnv = {}) {
  try {
    const url = parseRequest(req);
    const search = url.searchParams;
    const data = await getFeed({ runtimeEnv });
    const filtered = sortSites(
      data.sites.filter(s =>
        matches(s, {
          q: search.get('q') || '',
          host: search.get('host') || '',
          framework: search.get('framework') || ''
        })
      ),
      search.get('sort') || 'newest'
    );

    const limit = Math.min(48, Math.max(1, Number(search.get('limit') || 24)));
    const page = Math.max(1, Number(search.get('page') || 1));
    const start = (page - 1) * limit;
    const sites = filtered.slice(start, start + limit);

    return respond(
      res,
      {
        sites: sites.map(publicSite),
        nextPage: start + limit < filtered.length,
        totalHint: filtered.length,
        facets: {
          hosts: [...new Set(data.sites.map(s => s.hostType))],
          frameworks: [...new Set(data.sites.map(s => s.framework).filter(Boolean))]
        }
      },
      200
    );
  } catch (err) {
    return respond(res, { error: err.message || 'Internal Server Error', sites: [] }, 500);
  }
}

export async function handleSubmit(req, res) {
  try {
    const urlObj = parseRequest(req);
    let target = urlObj.searchParams.get('url') || '';
    
    // Support JSON body for POST
    if (!target && req.body) {
      target = typeof req.body === 'string' ? JSON.parse(req.body).url : req.body.url;
    }

    if (!target) return respond(res, { error: 'Website URL is required' }, 400);

    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }

    const norm = normalizeCandidate(target);
    if (!norm) {
      return respond(res, { error: 'Please enter a valid HTTPS URL on a supported domain (e.g. vercel.app, pages.dev, netlify.app, github.io).' }, 400);
    }

    const u = new URL(norm);
    const { response, loadMs } = await fetchWithTimeout(norm, {
      timeout: 6000,
      headers: { 'User-Agent': 'SiteScoutBot/1.0', Accept: 'text/html,application/xhtml+xml' }
    });

    if (!response.ok) {
      return respond(res, { error: `Unable to reach website (HTTP ${response.status})` }, 400);
    }

    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([^<]{2,120})<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : u.hostname;
    const framework = detectFramework(html) || 'JavaScript';

    const m = u.hostname.match(/(?:^|\.)(vercel\.app|netlify\.app|pages\.dev|workers\.dev|github\.io|onrender\.com|web\.app|firebaseapp\.com|herokuapp\.com|fly\.dev|railway\.app|surge\.sh)$/i);
    const hostType = m?.[1] || 'other';

    const newSite = {
      hostname: u.hostname,
      title,
      url: norm,
      hostType,
      framework,
      screenshot: `https://image.thum.io/get/width/600/crop/700/${norm}`,
      signals: {
        https: true,
        status: response.status,
        loadMs,
        title: Boolean(titleMatch),
        description: Boolean(html.includes('name="description"')),
        ogImage: Boolean(html.includes('property="og:image"')),
        viewport: Boolean(html.includes('name="viewport"')),
        securityHeaders: Boolean(response.headers.get('content-security-policy') || response.headers.get('strict-transport-security'))
      },
      discoveredAt: new Date().toISOString()
    };

    addSiteToFeed(newSite);
    return respond(res, { success: true, site: publicSite(newSite) }, 200);
  } catch (err) {
    return respond(res, { error: 'Could not connect to this URL: ' + err.message }, 500);
  }
}

export async function handleSite(req, res, runtimeEnv = {}) {
  try {
    const url = parseRequest(req);
    const host = (url.searchParams.get('host') || '').toLowerCase();
    if (!host) return respond(res, { error: 'host is required' }, 400);

    const data = await getFeed({ runtimeEnv });
    const site = data.sites.find(s => s.hostname.toLowerCase() === host);
    if (!site) return respond(res, { error: 'site not found' }, 404);

    return respond(res, publicSite(site), 200);
  } catch (err) {
    return respond(res, { error: err.message || 'Internal Server Error' }, 500);
  }
}

export async function handleRandom(req, res, runtimeEnv = {}) {
  try {
    const data = await getFeed({ runtimeEnv });
    if (!data.sites.length) return respond(res, { error: 'no sites available' }, 404);
    const rand = data.sites[Math.floor(Math.random() * data.sites.length)];
    return respond(res, publicSite(rand), 200);
  } catch (err) {
    return respond(res, { error: err.message || 'Internal Server Error' }, 500);
  }
}

export async function handleCron(req, res, runtimeEnv = {}) {
  try {
    const secret = runtimeEnv.CRON_SECRET ?? (typeof process !== 'undefined' && process.env ? process.env.CRON_SECRET : '');
    const headers = req.headers instanceof Headers ? req.headers : new Headers(req.headers || {});
    const provided = headers.get('authorization')?.replace(/^Bearer\s+/i, '') || headers.get('x-cron-secret');
    if (secret && provided !== secret) return respond(res, { error: 'unauthorized' }, 401);

    const data = await getFeed({ refresh: true, runtimeEnv });
    return respond(
      res,
      {
        ok: true,
        generatedAt: data.generatedAt,
        count: data.sites.length,
        sourceStats: data.sourceStats
      },
      200,
      { 'cache-control': 'no-store' }
    );
  } catch (err) {
    return respond(res, { error: err.message || 'Cron error' }, 500);
  }
}

export async function handleHealth(req, res) {
  return respond(res, { ok: true, name: 'SiteScout', time: new Date().toISOString() }, 200, { 'cache-control': 'no-store' });
}

export async function handleRssFeed(req, res, runtimeEnv = {}) {
  try {
    const data = await getFeed({ runtimeEnv });
    const sites = data.sites.slice(0, 50);

    const itemsXml = sites.map(s => `
    <item>
      <title><![CDATA[${s.title || s.hostname}]]></title>
      <link>${s.url}</link>
      <guid isPermaLink="true">${s.url}</guid>
      <pubDate>${new Date(s.discoveredAt || Date.now()).toUTCString()}</pubDate>
      <description><![CDATA[Live ${s.framework || 'Web'} application deployed on ${s.hostType}. HTTP ${s.signals?.status || 200}, response latency ${s.signals?.loadMs || 120}ms.]]></description>
      <category>${s.hostType}</category>
      <category>${s.framework || 'JavaScript'}</category>
    </item>`).join('');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SiteScout — Live Web Deployment Radar</title>
    <link>https://sitescout-app.vercel.app</link>
    <description>Real-time visual discovery radar for live web applications deployed on edge cloud platforms.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://sitescout-app.vercel.app/api/feed" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

    const headers = {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      'access-control-allow-origin': '*'
    };

    if (res && typeof res.status === 'function') {
      res.status(200);
      for (const [k, v] of Object.entries(headers)) {
        res.setHeader(k, v);
      }
      return res.end(rssXml);
    }
    return new Response(rssXml, { status: 200, headers });
  } catch (err) {
    return respond(res, { error: err.message || 'Error generating RSS feed' }, 500);
  }
}

function publicSite(s) {
  let repoUrl = s.repoUrl || null;
  if (!repoUrl && s.hostname && s.hostname.toLowerCase().endsWith('.github.io')) {
    const user = s.hostname.toLowerCase().replace(/\.github\.io$/i, '');
    repoUrl = `https://github.com/${user}/${user}.github.io`;
  }

  return {
    hostname: s.hostname,
    title: s.title || s.hostname,
    url: s.url,
    repoUrl,
    screenshot: s.screenshot || null,
    hostType: s.hostType,
    framework: s.framework || 'Other',
    signals: {
      https: Boolean(s.signals?.https),
      status: s.signals?.status || 200,
      loadMs: s.signals?.loadMs || 120,
      title: Boolean(s.signals?.title),
      description: Boolean(s.signals?.description),
      ogImage: Boolean(s.signals?.ogImage),
      viewport: Boolean(s.signals?.viewport),
      securityHeaders: Boolean(s.signals?.securityHeaders)
    },
    discoveredAt: s.discoveredAt,
    checkedAt: s.checkedAt || new Date().toISOString(),
    discoveredLabel: relativeTime(s.discoveredAt)
  };
}

function relativeTime(iso) {
  if (!iso) return 'Recently discovered';
  const d = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(d) || d < 0) return 'Recently discovered';
  const m = Math.floor(d / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
