import { getFeed } from '../sources/collector.js';

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
    'access-control-allow-methods': 'GET, OPTIONS, HEAD',
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
  if (p.minScore && s.score < Number(p.minScore)) return false;
  return true;
}

function sortSites(sites, sort) {
  const a = [...sites];
  if (sort === 'score') return a.sort((x, y) => y.score - x.score);
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
          framework: search.get('framework') || '',
          minScore: search.get('minScore') || ''
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

function publicSite(s) {
  return {
    hostname: s.hostname,
    title: s.title || s.hostname,
    url: s.url,
    screenshot: s.screenshot || null,
    hostType: s.hostType,
    framework: s.framework || 'Other',
    score: s.score,
    breakdown: s.breakdown || [],
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
