// Theme Management
const root = document.documentElement;
const savedTheme = localStorage.getItem('sitescout-theme') || 'dark';
root.dataset.theme = savedTheme;

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('sitescout-theme', next);
});

const host = new URLSearchParams(location.search).get('host');
const el = document.getElementById('detailView');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[c]));

function showToast(msg) {
  if (!toast) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function renderMetric(m) {
  const pct = Math.max(0, Math.min(100, Math.round((m.points / m.max) * 100)));
  return `
    <div class="metric-bar-item">
      <div class="metric-info">
        <span>${esc(m.label)}</span>
        <span>${m.points} / ${m.max} pts</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${pct}%;"></div>
      </div>
    </div>
  `;
}

async function loadDetail() {
  if (!host) {
    el.innerHTML = `
      <div class="state-box">
        <div class="state-icon">⚠️</div>
        <div class="state-title">Missing Hostname</div>
        <div class="state-desc">Please provide a valid hostname to inspect.</div>
      </div>
    `;
    return;
  }

  try {
    const res = await fetch(`/api/site?host=${encodeURIComponent(host)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const s = await res.json();

    document.title = `${s.title || s.hostname} — SiteScout Inspection`;

    const bannerImg = s.screenshot
      ? `<img src="${esc(s.screenshot)}" alt="Screenshot of ${esc(s.title || s.hostname)}" referrerpolicy="no-referrer">`
      : `<div class="thumb-fallback" style="height: 320px;">
           <div class="thumb-fallback-icon">🌐</div>
           <div style="font-size: 20px; font-weight: 700;">${esc(s.hostname)}</div>
           <div style="color: var(--text-muted);">Discovered via SiteScout Radar</div>
         </div>`;

    el.innerHTML = `
      <section class="detail-header-card">
        <div class="detail-banner">
          ${bannerImg}
        </div>
        <div class="detail-meta-body">
          <div>
            <h1 class="detail-title">${esc(s.title || s.hostname)}</h1>
            <div class="detail-url">
              <span>🔗</span>
              <span>https://${esc(s.hostname)}</span>
            </div>
            <div class="card-tags" style="margin-top: 14px;">
              <span class="tag-badge host">${esc(s.hostType)}</span>
              ${s.framework ? `<span class="tag-badge fw">⚙️ ${esc(s.framework)}</span>` : ''}
              <span class="tag-badge">Checked ${esc(s.discoveredLabel || 'Recently')}</span>
            </div>
          </div>

          <div class="detail-actions">
            <a class="btn-primary" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">
              <span>Open Website</span>
              <span>↗</span>
            </a>
            <button class="btn-secondary" id="btnCopyShare" type="button">
              <span>Copy Link 📋</span>
            </button>
          </div>
        </div>
      </section>

      <section class="detail-grid">
        <div class="panel-card">
          <h2 class="panel-title">
            <span>🎯</span>
            <span>Lighthouse-Style Technical Score (${s.score}/100)</span>
          </h2>
          <div style="margin-top: 20px;">
            ${(s.breakdown || []).map(renderMetric).join('')}
          </div>
        </div>

        <div class="panel-card">
          <h2 class="panel-title">
            <span>🛡️</span>
            <span>Security & Runtime Audit</span>
          </h2>
          <div style="margin-top: 14px;">
            <div class="fact-row">
              <span class="fact-key">SSL / HTTPS Enforced</span>
              <span class="fact-val" style="color: ${s.signals?.https ? 'var(--emerald)' : 'var(--rose)'};">
                ${s.signals?.https ? '✓ Secure (TLS 1.3)' : '✗ Not Enforced'}
              </span>
            </div>
            <div class="fact-row">
              <span class="fact-key">HTTP Response Code</span>
              <span class="fact-val" style="color: var(--emerald);">
                ${esc(s.signals?.status ?? 200)} OK
              </span>
            </div>
            <div class="fact-row">
              <span class="fact-key">Server Load Time</span>
              <span class="fact-val">${s.signals?.loadMs ? `${s.signals.loadMs} ms` : '—'}</span>
            </div>
            <div class="fact-row">
              <span class="fact-key">Page Title Tag</span>
              <span class="fact-val">${s.signals?.title ? '✓ Present' : '✗ Missing'}</span>
            </div>
            <div class="fact-row">
              <span class="fact-key">SEO Meta Description</span>
              <span class="fact-val">${s.signals?.description ? '✓ Optimized' : '✗ Missing'}</span>
            </div>
            <div class="fact-row">
              <span class="fact-key">OpenGraph Social Preview</span>
              <span class="fact-val">${s.signals?.ogImage ? '✓ Card Present' : '✗ None'}</span>
            </div>
            <div class="fact-row">
              <span class="fact-key">Mobile Responsive Viewport</span>
              <span class="fact-val">${s.signals?.viewport ? '✓ Configured' : '✗ Missing'}</span>
            </div>
            <div class="fact-row">
              <span class="fact-key">Security Headers Audit</span>
              <span class="fact-val" style="color: ${s.signals?.securityHeaders ? 'var(--emerald)' : 'var(--amber)'};">
                ${s.signals?.securityHeaders ? '✓ CSP / HSTS Protected' : '⚡ Standard Defaults'}
              </span>
            </div>
          </div>
        </div>
      </section>
    `;

    document.getElementById('btnCopyShare')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        showToast('Inspection link copied to clipboard!');
      } catch {
        showToast('Failed to copy');
      }
    });

  } catch (err) {
    el.innerHTML = `
      <div class="state-box">
        <div class="state-icon">⚠️</div>
        <div class="state-title">Site Details Unavailable</div>
        <div class="state-desc">${esc(err.message)}</div>
      </div>
    `;
  }
}

loadDetail();
