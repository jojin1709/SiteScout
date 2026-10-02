# SiteScout

SiteScout is a stateless, screenshot-first directory of publicly discoverable websites hosted on free/test domains such as `vercel.app`, `netlify.app`, `pages.dev`, `workers.dev`, `github.io`, `onrender.com`, `web.app`, `firebaseapp.com`, `herokuapp.com`, `fly.dev`, `railway.app`, and `surge.sh`.

## Scope

- No accounts, login, ratings, comments, leaderboard, removal workflow, or user profiles.
- No application database. The collector keeps only an in-process short cache and responses are edge-cacheable for about five minutes.
- Discovery adapters: urlscan.io, Common Crawl, and GitHub public search.
- Candidate sites are deduplicated by hostname.
- A collection pass checks `robots.txt`, performs at most one homepage GET per candidate, validates HTTPS/allowed hosting suffixes, follows no external redirect, and computes a 0–100 technical score.
- Screenshots come from urlscan.io when available; candidates from other sources may display a no-screenshot fallback.

## Important API notes

urlscan.io's current API documentation says its Search API requires an API key. Put `URLSCAN_API_KEY` in the deployment environment if you want the urlscan adapter enabled. GitHub can be used unauthenticated for public data, but GitHub documents a 60-request/hour unauthenticated REST limit; `GITHUB_TOKEN` is optional and increases the available limit.

## Local

```bash
npm run check
npm run smoke
npm run dev
```

The static UI can be viewed at `http://localhost:4173`. API functions require their target platform runtime, so local browser-only development is intentionally lightweight.

## Vercel

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Add environment variables from `.env.example` under Project Settings → Environment Variables.
4. Set `CRON_SECRET` to a random secret. Add `URLSCAN_API_KEY` and optionally `GITHUB_TOKEN`.
5. Deploy. `vercel.json` registers the collector cron at `03:15 UTC` daily.
6. The API is available under `/api/*`.

## Cloudflare Pages + Cron Worker

Pages Functions live under `functions/`. Deploy the project as a Pages project with the repository root as the project directory and no build command; the static output is `public/` and Pages Functions are discovered from `functions/`.

For the hourly scheduled collector, deploy the separate Worker defined by `wrangler.jsonc`:

```bash
npx wrangler login
npx wrangler deploy
```

Set `PUBLIC_ORIGIN` to the deployed Pages URL and set the Worker secret:

```bash
npx wrangler secret put CRON_SECRET
```

The Worker uses an hourly Cron Trigger. Cloudflare documents Cron Triggers through the Worker `scheduled()` handler; Pages HTTP functions remain the public API layer.

## Security model

SiteScout only accepts HTTPS URLs whose hostnames end in the configured public hosting suffixes. Redirects are rejected rather than followed to unrelated domains. `robots.txt` is checked before the homepage request. A clear User-Agent identifies the collector. Common malicious/phishing/adult indicators returned by source metadata are filtered before inspection.

This is intentionally conservative rather than a general-purpose web crawler.

## Project layout

```text
public/                  static frontend
api/                     Vercel Functions
functions/               Cloudflare Pages Functions
src/core/                shared application, scoring and safety logic
src/sources/             pluggable discovery adapters
cloudflare/              scheduled Worker
.github/workflows/       CI and security checks
```
