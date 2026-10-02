import { ICONS } from './icons.js';

// Theme Management
const root = document.documentElement;
const savedTheme = localStorage.getItem('sitescout-theme') || 'dark';
root.dataset.theme = savedTheme;

function updateThemeIcon() {
  const iconEl = document.getElementById('themeToggle');
  if (iconEl) {
    iconEl.innerHTML = root.dataset.theme === 'dark' ? ICONS.sun : ICONS.moon;
  }
}
updateThemeIcon();

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('sitescout-theme', next);
  updateThemeIcon();
});

// App State
const state = {
  page: 1,
  sort: 'newest',
  q: '',
  host: '',
  framework: '',
  loading: false,
  done: false,
  view: 'grid',
  allSites: []
};

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const grid = $('#grid');
const loader = $('#loader');
const emptyState = $('#emptyState');
const feedCount = $('#feedCount');
const searchInput = $('#searchInput');
const submitInput = $('#submitInput');
const submitForm = $('#submitForm');
const submitMsg = $('#submitMsg');
const btnScanSubmit = $('#btnScanSubmit');
const toast = $('#toast');
const toastMsg = $('#toastMsg');

// Decode common HTML entities cleanly
function cleanText(str) {
  if (!str) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

// HTML Escape helper
const esc = s => String(cleanText(s) ?? '').replace(/[&<>"']/g, c => ({
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

window.copyUrl = async function (e, url) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  try {
    await navigator.clipboard.writeText(url);
    showToast('Copied website URL to clipboard!');
  } catch {
    showToast('Failed to copy');
  }
};

function getHostBadge(hostType) {
  const map = {
    'vercel.app': { label: 'Vercel', icon: ICONS.vercel },
    'pages.dev': { label: 'Cloudflare Pages', icon: ICONS.cloudflare },
    'workers.dev': { label: 'Cloudflare Workers', icon: ICONS.cloudflare },
    'netlify.app': { label: 'Netlify', icon: ICONS.layers },
    'github.io': { label: 'GitHub Pages', icon: ICONS.github },
    'onrender.com': { label: 'Render', icon: ICONS.zap },
    'fly.dev': { label: 'Fly.io', icon: ICONS.server },
    'railway.app': { label: 'Railway', icon: ICONS.server },
    'web.app': { label: 'Firebase', icon: ICONS.globe },
    'firebaseapp.com': { label: 'Firebase', icon: ICONS.globe },
    'surge.sh': { label: 'Surge', icon: ICONS.globe },
    'herokuapp.com': { label: 'Heroku', icon: ICONS.server },
    'infinityfreeapp.com': { label: 'InfinityFree', icon: ICONS.globe },
    'epizy.com': { label: 'InfinityFree', icon: ICONS.globe },
    'rf.gd': { label: 'InfinityFree', icon: ICONS.globe },
    '42web.io': { label: 'InfinityFree', icon: ICONS.globe },
    'great-site.net': { label: 'InfinityFree', icon: ICONS.globe }
  };
  const item = map[hostType] || { label: hostType, icon: ICONS.globe };
  return `${item.icon}<span>${esc(item.label)}</span>`;
}

// Clean Live Card Renderer
function createCard(s) {
  const cleanTitle = cleanText(s.title || s.hostname);
  const screenshotUrl = s.screenshot || `https://image.thum.io/get/width/600/crop/700/https://${s.hostname}`;

  return `
    <article class="site-card reveal-on-scroll" data-hostname="${esc(s.hostname)}">
      <div class="card-browser-bar">
        <div class="window-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <div class="browser-url-chip">https://${esc(s.hostname)}</div>
      </div>

      <div class="card-thumb">
        <img loading="lazy" src="${esc(screenshotUrl)}" alt="Live snapshot of ${esc(cleanTitle)}" referrerpolicy="no-referrer" />
        <div class="status-pill" title="Live status and response time">
          <span class="live-dot"></span>
          <span>${s.signals?.loadMs ? `${s.signals.loadMs}ms` : 'Live 200'}</span>
        </div>
      </div>

      <div class="card-content">
        <h3 class="card-title" title="${esc(cleanTitle)}">${esc(cleanTitle)}</h3>
        <div class="card-hostname">${esc(s.hostname)}</div>

        <div class="card-tags">
          <span class="tag-badge host">${getHostBadge(s.hostType)}</span>
          ${s.framework ? `<span class="tag-badge fw">${ICONS.code}<span>${esc(s.framework)}</span></span>` : ''}
          <span class="tag-badge">${ICONS.sparkles}<span>${esc(s.discoveredLabel || 'Live')}</span></span>
        </div>

        <div class="signals-mini">
          <span class="signal-item ${s.signals?.https ? 'signal-ok' : ''}">${ICONS.shield} HTTPS</span>
          <span class="signal-item ${s.signals?.status === 200 ? 'signal-ok' : ''}">${ICONS.check} 200 OK</span>
          <span class="signal-item ${s.signals?.securityHeaders ? 'signal-ok' : ''}">${ICONS.zap} Verified</span>
        </div>

        <div class="card-actions">
          <a class="btn-card-visit-main" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">
            <span>Visit Website</span>
            ${ICONS.externalLink}
          </a>
          ${s.repoUrl ? `
            <a class="btn-card-repo" href="${esc(s.repoUrl)}" target="_blank" rel="noopener noreferrer" title="View Source Code Repository">
              ${ICONS.github}
            </a>
          ` : ''}
          <button class="btn-card-inspect" type="button" onclick="window.inspectSite('${esc(s.hostname)}')" title="Inspect Specs & Headers">
            ${ICONS.search}
          </button>
          <button class="btn-card-share" type="button" onclick="window.copyUrl(event, '${esc(s.url)}')" title="Copy URL">
            ${ICONS.copy}
          </button>
        </div>
      </div>
    </article>
  `;
}

// Live Tech Stack Radar Trends
function updateTechTrends(sites) {
  const track = $('#trendsBarTrack');
  const legend = $('#trendsLegend');
  if (!track || !legend || !sites || sites.length === 0) return;

  const counts = {};
  sites.forEach(s => {
    const fw = s.framework || 'JavaScript';
    counts[fw] = (counts[fw] || 0) + 1;
  });

  const total = sites.length;
  const colors = {
    'Next.js': '#38bdf8',
    'React': '#60a5fa',
    'Vue': '#34d399',
    'Astro': '#fb923c',
    'Svelte': '#f87171',
    'Vite': '#a78bfa',
    'Angular': '#f43f5e',
    'JavaScript': '#94a3b8'
  };

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  
  track.innerHTML = sorted.map(([fw, count]) => {
    const pct = ((count / total) * 100).toFixed(1);
    const color = colors[fw] || '#818cf8';
    return `<div class="trends-bar-seg" style="width: ${pct}%; background-color: ${color};" title="${esc(fw)}: ${pct}% (${count})"></div>`;
  }).join('');

  legend.innerHTML = sorted.map(([fw, count]) => {
    const pct = ((count / total) * 100).toFixed(0);
    const color = colors[fw] || '#818cf8';
    return `
      <div class="legend-item" onclick="window.filterByFramework('${esc(fw)}')">
        <span class="legend-dot" style="background-color: ${color};"></span>
        <span><strong>${esc(fw)}</strong> ${pct}%</span>
      </div>
    `;
  }).join('');
}

window.filterByFramework = function(fw) {
  const sel = $('#frameworkFilter');
  if (sel) {
    sel.value = fw;
    state.framework = fw;
    resetAndLoad();
  }
};

// 1-Click JSON and CSV Export
$('#btnExportJson')?.addEventListener('click', () => {
  if (!state.allSites.length) return showToast('No sites loaded to export');
  const blob = new Blob([JSON.stringify(state.allSites, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sitescout-deployments-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Exported JSON dataset!');
});

$('#btnExportCsv')?.addEventListener('click', () => {
  if (!state.allSites.length) return showToast('No sites loaded to export');
  const headers = ['Hostname', 'Title', 'URL', 'Platform', 'Framework', 'Status', 'LatencyMs', 'HTTPS', 'RepoURL', 'DiscoveredAt'];
  const rows = state.allSites.map(s => [
    `"${(s.hostname || '').replace(/"/g, '""')}"`,
    `"${(cleanText(s.title || s.hostname)).replace(/"/g, '""')}"`,
    `"${s.url || ''}"`,
    `"${s.hostType || ''}"`,
    `"${s.framework || ''}"`,
    s.signals?.status || 200,
    s.signals?.loadMs || 120,
    s.signals?.https ? 'TRUE' : 'FALSE',
    `"${s.repoUrl || ''}"`,
    `"${s.discoveredAt || ''}"`
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sitescout-deployments-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Exported CSV dataset!');
});

function populateSelect(selectEl, items, defaultLabel) {
  if (!selectEl) return;
  const curr = selectEl.value;
  selectEl.innerHTML = `<option value="">${defaultLabel}</option>` + 
    [...new Set(items.filter(Boolean))].sort().map(item => 
      `<option value="${esc(item)}" ${curr === item ? 'selected' : ''}>${esc(item)}</option>`
    ).join('');
}

// Fetch Sites Feed
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
    framework: state.framework
  });

  try {
    const res = await fetch(`/api/sites?${params.toString()}`, {
      headers: { accept: 'application/json' }
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (reset) {
      grid.innerHTML = '';
      state.allSites = [];
    }

    if (data.sites && data.sites.length > 0) {
      state.allSites.push(...data.sites);
      grid.insertAdjacentHTML('beforeend', data.sites.map(createCard).join(''));
      emptyState.classList.add('hidden');
      updateTechTrends(state.allSites);
      observeRevealElements();
    } else if (state.page === 1) {
      emptyState.classList.remove('hidden');
    }

    state.done = !data.nextPage;
    state.page++;

    const total = data.totalHint || state.allSites.length;
    feedCount.textContent = `${total} live deployment${total === 1 ? '' : 's'} indexed`;

    if (reset && data.facets) {
      populateSelect($('#frameworkFilter'), data.facets.frameworks || [], 'All Frameworks');
    }
  } catch (err) {
    if (state.page === 1) {
      grid.innerHTML = `
        <div class="state-box" style="grid-column: 1 / -1;">
          <div class="state-icon">${ICONS.radar}</div>
          <div class="state-title">Unable to reach discovery radar</div>
          <div class="state-desc">${esc(err.message)}</div>
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

// Omni-Console Mode Switcher (Search vs Scan)
const modeTabSearch = $('#modeTabSearch');
const modeTabScan = $('#modeTabScan');
const panelSearch = $('#panelSearch');
const panelScan = $('#panelScan');

modeTabSearch?.addEventListener('click', () => {
  modeTabSearch.classList.add('active');
  modeTabScan.classList.remove('active');
  panelSearch?.classList.remove('hidden');
  panelScan?.classList.add('hidden');
  searchInput?.focus();
});

modeTabScan?.addEventListener('click', () => {
  modeTabScan.classList.add('active');
  modeTabSearch.classList.remove('active');
  panelScan?.classList.remove('hidden');
  panelSearch?.classList.add('hidden');
  submitInput?.focus();
});

// Submit / Scan Live URL
submitForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const url = submitInput.value.trim();
  if (!url) return;

  btnScanSubmit.disabled = true;
  btnScanSubmit.innerHTML = `<span>Probing...</span>`;
  submitMsg.className = 'submit-feedback hidden';

  try {
    const res = await fetch(`/api/submit?url=${encodeURIComponent(url)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to scan website');
    }

    const cleanTitle = cleanText(data.site.title || data.site.hostname);
    submitMsg.textContent = `✓ Successfully verified and added "${cleanTitle}"!`;
    submitMsg.className = 'submit-feedback success';
    submitInput.value = '';

    // Prepend to live grid with smooth reveal
    state.allSites.unshift(data.site);
    grid.insertAdjacentHTML('afterbegin', createCard(data.site));
    updateTechTrends(state.allSites);
    showToast('✨ New site scanned and added to Radar!');
  } catch (err) {
    submitMsg.textContent = '✗ ' + err.message;
    submitMsg.className = 'submit-feedback error';
  } finally {
    btnScanSubmit.disabled = false;
    btnScanSubmit.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><span>Scan & Add</span>`;
  }
});

// Search Form
$('#searchForm')?.addEventListener('submit', e => {
  e.preventDefault();
  state.q = searchInput.value.trim();
  resetAndLoad();
});

let debounceTimer;
searchInput?.addEventListener('input', e => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    state.q = e.target.value.trim();
    resetAndLoad();
  }, 350);
});

// Keyboard Shortcuts: '/' to search, 'Esc' to clear
window.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== searchInput && document.activeElement !== submitInput) {
    e.preventDefault();
    modeTabSearch?.click();
    searchInput.focus();
    searchInput.select();
  } else if (e.key === 'Escape') {
    if (document.getElementById('inspectModal')?.classList.contains('hidden') === false) {
      document.getElementById('inspectModal').classList.add('hidden');
    } else if (document.activeElement === searchInput) {
      searchInput.value = '';
      state.q = '';
      searchInput.blur();
      resetAndLoad();
    }
  }
});

// SaaS Live Inspector & Interactive Sandbox Modal
window.inspectSite = function (hostname) {
  const site = state.allSites.find(s => s.hostname === hostname);
  const modal = $('#inspectModal');
  if (!modal) return;

  if (site) {
    const cleanTitle = cleanText(site.title || site.hostname);
    $('#modalTitle').textContent = cleanTitle;
    $('#modalHost').textContent = site.hostname;
    $('#modalUrlChip').textContent = `https://${site.hostname}`;
    $('#modalPlatformVal').textContent = site.hostType;
    $('#modalFrameworkVal').textContent = site.framework || 'JavaScript';
    $('#modalLatencyVal').textContent = site.signals?.loadMs ? `${site.signals.loadMs}ms Latency` : '<120ms Latency';
    
    const screenshotUrl = site.screenshot || `https://image.thum.io/get/width/600/crop/700/https://${site.hostname}`;
    $('#modalImg').src = screenshotUrl;
    $('#modalSandboxFrame').src = site.url || `https://${site.hostname}`;
    $('#modalVisitLink').href = site.url || `https://${site.hostname}`;

    // Repo Link
    const repoBtn = $('#modalRepoLink');
    if (repoBtn) {
      if (site.repoUrl) {
        repoBtn.href = site.repoUrl;
        repoBtn.classList.remove('hidden');
      } else {
        repoBtn.classList.add('hidden');
      }
    }

    // Default to snapshot view
    $('#btnModalModeSnapshot')?.click();

    $('#btnModalCopy').onclick = () => window.copyUrl(null, site.url || `https://${site.hostname}`);

    const signalsList = $('#modalSignalsList');
    if (signalsList) {
      signalsList.innerHTML = `
        <span class="tag-badge ${site.signals?.https ? 'host' : ''}">${ICONS.shield} HTTPS Enforced</span>
        <span class="tag-badge ${site.signals?.status === 200 ? 'host' : ''}">${ICONS.check} HTTP 200 OK</span>
        <span class="tag-badge ${site.signals?.viewport ? 'host' : ''}">${ICONS.code} Mobile Responsive</span>
        <span class="tag-badge ${site.signals?.securityHeaders ? 'host' : ''}">${ICONS.zap} Security Headers</span>
      `;
    }

    modal.classList.remove('hidden');
  } else {
    window.location.href = `/site.html?host=${encodeURIComponent(hostname)}`;
  }
};

// Modal View Switcher (Snapshot vs Interactive Sandbox)
$('#btnModalModeSnapshot')?.addEventListener('click', () => {
  $('#btnModalModeSnapshot').classList.add('active');
  $('#btnModalModeSandbox').classList.remove('active');
  $('#modalSnapshotWrap')?.classList.remove('hidden');
  $('#modalSandboxWrap')?.classList.add('hidden');
});

$('#btnModalModeSandbox')?.addEventListener('click', () => {
  $('#btnModalModeSandbox').classList.add('active');
  $('#btnModalModeSnapshot').classList.remove('active');
  $('#modalSandboxWrap')?.classList.remove('hidden');
  $('#modalSnapshotWrap')?.classList.add('hidden');
});

$('#modalClose')?.addEventListener('click', () => {
  $('#inspectModal')?.classList.add('hidden');
  $('#modalSandboxFrame').src = ''; // unload iframe
});

$('#inspectModal')?.addEventListener('click', e => {
  if (e.target === $('#inspectModal')) {
    $('#inspectModal').classList.add('hidden');
    $('#modalSandboxFrame').src = '';
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

// Framework Filter
$('#frameworkFilter')?.addEventListener('change', e => {
  state.framework = e.target.value;
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

// Infinite Scroll
const sentinel = $('#sentinel');
if (sentinel) {
  new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      fetchSites();
    }
  }, { rootMargin: '600px' }).observe(sentinel);
}

// Mouse Parallax on Ambient Glow Orbs
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 40;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 40;
  const orbs = document.querySelectorAll('.glow-orb');
  if (orbs[0]) orbs[0].style.transform = `translate(${mouseX * 0.8}px, ${mouseY * 0.8}px)`;
  if (orbs[1]) orbs[1].style.transform = `translate(${-mouseX * 0.6}px, ${-mouseY * 0.6}px)`;
  if (orbs[2]) orbs[2].style.transform = `translate(${mouseX * 0.5}px, ${-mouseY * 0.5}px)`;
});

// Interactive 3D Card Hover Tilt
document.addEventListener('mousemove', e => {
  const card = e.target.closest('.site-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const rotateX = (-y / (rect.height / 2)) * 6;
  const rotateY = (x / (rect.width / 2)) * 6;
  card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px) scale(1.015)`;
});

document.addEventListener('mouseout', e => {
  const card = e.target.closest('.site-card');
  if (card && !card.contains(e.relatedTarget)) {
    card.style.transform = '';
  }
});

// Scroll Reveal Observer
let revealObserver;
function initScrollReveal() {
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });
  }
  observeRevealElements();
}

function observeRevealElements() {
  if (!revealObserver) return;
  const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
  elements.forEach((el, index) => {
    // Add micro stagger delay
    el.style.transitionDelay = `${(index % 6) * 0.06}s`;
    revealObserver.observe(el);
  });
}

// Scroll Progress & Header Dynamic Blur
const progressBar = $('#scrollProgressBar');
const btnBackToTop = $('#btnBackToTop');
const siteHeader = $('.site-header');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${scrollPercent}%`;
  }

  if (siteHeader) {
    if (scrollTop > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  if (btnBackToTop) {
    if (scrollTop > 400) {
      btnBackToTop.classList.remove('hidden');
    } else {
      btnBackToTop.classList.add('hidden');
    }
  }
}, { passive: true });

btnBackToTop?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Initial Run
initScrollReveal();
resetAndLoad();

