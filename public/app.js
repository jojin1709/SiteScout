// Theme Management
const root = document.documentElement;
const savedTheme = localStorage.getItem('sitescout-theme') || 'dark';
root.dataset.theme = savedTheme;

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('sitescout-theme', next);
});

// App State
const state = {
  page: 1,
  sort: 'newest',
  q: '',
  host: '',
  framework: '',
  minScore: '',
  loading: false,
  done: false,
  view: 'grid'
};

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const grid = $('#grid');
const loader = $('#loader');
const emptyState = $('#emptyState');
const feedCount = $('#feedCount');
const searchInput = $('#searchInput');
const toast = $('#toast');
const toastMsg = $('#toastMsg');

// HTML Escape helper
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[c]));

// Toast helper
function showToast(msg) {
  if (!toast) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Copy URL to clipboard
window.copyUrl = async function (e, url) {
  e.preventDefault();
  e.stopPropagation();
  try {
    await navigator.clipboard.writeText(url);
    showToast('Copied website URL to clipboard!');
  } catch {
    showToast('Failed to copy');
  }
};

// Host platform label mapping
function getHostLabel(hostType) {
  const map = {
    'vercel.app': '▲ Vercel',
    'pages.dev': '⚡ Cloudflare Pages',
    'workers.dev': '⛅ Cloudflare Workers',
    'netlify.app': '💎 Netlify',
    'github.io': '🐙 GitHub Pages',
    'onrender.com': '🚀 Render',
    'fly.dev': '🎈 Fly.io',
    'railway.app': '🚂 Railway',
    'web.app': '🔥 Firebase',
    'firebaseapp.com': '🔥 Firebase',
    'surge.sh': '🌊 Surge',
    'herokuapp.com': '🟣 Heroku'
  };
  return map[hostType] || hostType;
}

// Card Renderer
function createCard(s) {
  const scoreClass = s.score >= 90 ? 'high' : s.score >= 70 ? 'mid' : 'low';
  
  const imgContent = s.screenshot 
    ? `<img loading="lazy" src="${esc(s.screenshot)}" alt="Screenshot of ${esc(s.title || s.hostname)}" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='<div class=\\'thumb-fallback\\'><div class=\\'thumb-fallback-icon\\'>🌐</div><div>${esc(s.hostname)}</div></div>'">`
    : `<div class="thumb-fallback">
         <div class="thumb-fallback-icon">⚡</div>
         <div><strong>${esc(s.hostname)}</strong></div>
         <div style="font-size: 11px; opacity: 0.7;">Stateless Discovery Preview</div>
       </div>`;

  return `
    <article class="site-card">
      <div class="card-browser-bar">
        <div class="window-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <div class="browser-url-chip">https://${esc(s.hostname)}</div>
      </div>

      <div class="card-thumb">
        ${imgContent}
        <div class="score-tag ${scoreClass}" title="Overall Technical Score (0-100)">
          <span>⚡</span>
          <span>${s.score}</span>
        </div>
      </div>

      <div class="card-content">
        <h3 class="card-title" title="${esc(s.title || s.hostname)}">${esc(s.title || s.hostname)}</h3>
        <div class="card-hostname">${esc(s.hostname)}</div>

        <div class="card-tags">
          <span class="tag-badge host">${esc(getHostLabel(s.hostType))}</span>
          ${s.framework ? `<span class="tag-badge fw">⚙️ ${esc(s.framework)}</span>` : ''}
          <span class="tag-badge">${esc(s.discoveredLabel || 'Live')}</span>
        </div>

        <div class="signals-mini">
          <span class="signal-item ${s.signals?.https ? 'signal-ok' : ''}">🔒 HTTPS</span>
          <span class="signal-item ${s.signals?.loadMs < 200 ? 'signal-ok' : ''}">⚡ ${s.signals?.loadMs || 120}ms</span>
          <span class="signal-item ${s.signals?.securityHeaders ? 'signal-ok' : ''}">🛡️ Headers</span>
        </div>

        <div class="card-actions">
          <a class="btn-card-inspect" href="/site.html?host=${encodeURIComponent(s.hostname)}">
            Inspect Radar & Tech
          </a>
          <a class="btn-card-visit" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" title="Visit live site">
            ↗
          </a>
          <button class="btn-card-share" type="button" onclick="window.copyUrl(event, '${esc(s.url)}')" title="Copy URL">
            📋
          </button>
        </div>
      </div>
    </article>
  `;
}

// Populate dropdown options
function populateSelect(selectEl, items, defaultLabel) {
  if (!selectEl) return;
  const curr = selectEl.value;
  selectEl.innerHTML = `<option value="">${defaultLabel}</option>` + 
    [...new Set(items.filter(Boolean))].sort().map(item => 
      `<option value="${esc(item)}" ${curr === item ? 'selected' : ''}>${esc(item)}</option>`
    ).join('');
}

// Fetch Sites API
async function fetchSites(reset = false) {
  if (state.loading || (state.done && !reset)) return;
  state.loading = true;
  loader.classList.remove('hidden');

  const params = new URLSearchParams({
    page: state.page,
    limit: 24,
    sort: state.sort,
    q: state.q,
    host: state.host,
    framework: state.framework,
    minScore: state.minScore
  });

  try {
    const res = await fetch(`/api/sites?${params.toString()}`, {
      headers: { accept: 'application/json' }
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (reset) {
      grid.innerHTML = '';
    }

    if (data.sites && data.sites.length > 0) {
      grid.insertAdjacentHTML('beforeend', data.sites.map(createCard).join(''));
      emptyState.classList.add('hidden');
    } else if (state.page === 1) {
      emptyState.classList.remove('hidden');
    }

    state.done = !data.nextPage;
    state.page++;

    const total = data.totalHint || data.sites.length;
    feedCount.textContent = `${total} deployment${total === 1 ? '' : 's'} indexed`;

    if (reset && data.facets) {
      populateSelect($('#frameworkFilter'), data.facets.frameworks || [], 'All Frameworks');
    }
  } catch (err) {
    if (state.page === 1) {
      grid.innerHTML = `
        <div class="state-box" style="grid-column: 1 / -1;">
          <div class="state-icon">⚠️</div>
          <div class="state-title">Unable to reach discovery radar</div>
          <div class="state-desc">${esc(err.message)} — Please check back in a few seconds.</div>
        </div>
      `;
      feedCount.textContent = 'Radar offline';
    }
  } finally {
    state.loading = false;
    loader.classList.add('hidden');
  }
}

function resetAndLoad() {
  state.page = 1;
  state.done = false;
  fetchSites(true);
}

// Search Form
$('#searchForm')?.addEventListener('submit', e => {
  e.preventDefault();
  state.q = searchInput.value.trim();
  resetAndLoad();
});

// Debounced live typing search
let debounceTimer;
searchInput?.addEventListener('input', e => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    state.q = e.target.value.trim();
    resetAndLoad();
  }, 350);
});

// Keyboard Shortcut: '/' to focus search, 'Escape' to clear
window.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  } else if (e.key === 'Escape' && document.activeElement === searchInput) {
    searchInput.value = '';
    state.q = '';
    searchInput.blur();
    resetAndLoad();
  }
});

// Sort Tabs
$$('.sort-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.sort-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.sort = btn.dataset.sort;
    resetAndLoad();
  });
});

// Platform Chips
$$('.platform-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    $$('.platform-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.host = chip.dataset.host || '';
    resetAndLoad();
  });
});

// Filters
$('#frameworkFilter')?.addEventListener('change', e => {
  state.framework = e.target.value;
  resetAndLoad();
});

$('#scoreFilter')?.addEventListener('change', e => {
  state.minScore = e.target.value;
  resetAndLoad();
});

// Layout Toggle
$('#btnGridView')?.addEventListener('click', () => {
  grid.classList.remove('list-view');
  $('#btnGridView').classList.add('active');
  $('#btnListView').classList.remove('active');
});

$('#btnListView')?.addEventListener('click', () => {
  grid.classList.add('list-view');
  $('#btnListView').classList.add('active');
  $('#btnGridView').classList.remove('active');
});

// Infinite Scroll Observer
const sentinel = $('#sentinel');
if (sentinel) {
  new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      fetchSites();
    }
  }, { rootMargin: '600px' }).observe(sentinel);
}

// Initial Run
resetAndLoad();
