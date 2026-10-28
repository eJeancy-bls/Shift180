// core.js — thème, stockage local, comptes Supabase + synchronisation (local-first, offline-aware)
/* eslint-env browser */

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const today = () => new Date().toLocaleDateString('sv'); // YYYY-MM-DD

const CONFIG = window.PBD_CONFIG || { url: '', key: '' };
const K = 'pbd.state.v2';       // { progress:{n:date}, pending:{n:{date,ts}} }
const KC = 'pbd.code.v2';       // { n: code }
const KOLD = 'fs180';           // ancien format de progression
const KCOLD = 'fs180c';         // ancien code par jour

/* ---------------- thème (clair / sombre / système) ---------------- */
const Theme = {
  set(mode) {
    localStorage.setItem('pbd.theme', mode);
    const h = document.documentElement;
    h.setAttribute('data-theme', mode === 'dark' ? 'dark' : mode === 'light' ? 'light' : 'system');
    $$('.theme-pop button').forEach(b => b.setAttribute('aria-checked', String(b.dataset.t === mode)));
  },
  init() {
    this.set(localStorage.getItem('pbd.theme') || 'system');
    $$('.theme-toggle').forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const pop = btn.parentElement.querySelector('.theme-pop');
        pop.classList.toggle('open');
      };
    });
    document.addEventListener('click', () => $$('.theme-pop').forEach(p => p.classList.remove('open')));
    $$('.theme-pop button').forEach(b => b.onclick = () => Theme.set(b.dataset.t));
  }
};

/* ---------------- iconify : emojis de l'interface → vraies icônes SVG ----------------
   Jeu d'icônes inline (trait 2px, currentColor) : chaque emoji d'interface est remplacé
   par son SVG au moment du rendu. Ne touche pas aux <svg> existants. */
const P = (d, extra) => `<path d="${d}" ${extra || ''}/>`;
const ICONS = {
  '🌗': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/></svg>`,
  '☀️': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  '🌙': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>`,
  '🖥️': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  '🎯': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>`,
  '💡': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>`,
  '🙂': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01" stroke-width="2.6"/></svg>`,
  '🎓': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 9 12 4 2 9l10 5 10-5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/></svg>`,
  '📌': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 17v5"/><path d="M9 3h6l1 7 3 3H5l3-3 1-7z"/></svg>`,
  '⏳': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h14M5 21h14"/><path d="M7 3v3a5 5 0 0 0 5 5 5 5 0 0 0-5 5v5M17 3v3a5 5 0 0 1-5 5 5 5 0 0 1 5 5v5"/></svg>`,
  '🔒': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`,
  '👤': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>`,
  '✅': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5.5"/></svg>`,
  '✓': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4.5 12.5 5 5 10-11"/></svg>`,
  '✖': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>`,
  '▶': `<svg class="ico" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M7 4.8v14.4c0 .8.9 1.3 1.6.9l11-7.2c.6-.4.6-1.4 0-1.8l-11-7.2c-.7-.4-1.6.1-1.6.9z"/></svg>`,
  '🔧': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6L14 13l-3-3 3.7-3.7z"/></svg>`,
  '⚠': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2.5 20h19L12 3z"/><path d="M12 10v4M12 17.5h.01" stroke-width="2.4"/></svg>`,
  '🎉': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14c3 0 7-4 7-11-3 0-7 4-7 11zM20 14c-3 0-7-4-7-11 3 0 7 4 7 11z"/><path d="M12 13v3M12 20h.01M7 20l-1 2M17 20l1 2"/></svg>`,
  '🖼': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L7 20"/></svg>`,
  '🖱': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 6v4"/></svg>`,
  '💾': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>`,
  '🔌': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8zM12 18v4"/></svg>`,
  '☁': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 19a4.5 4.5 0 0 0 .4-9A7 7 0 0 0 4.7 12.9 3.5 3.5 0 0 0 6.5 19h11z"/></svg>`,
  '📱': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></svg>`,
  '💻': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></svg>`,
  '🌐': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/></svg>`,
  '🐙': `<svg class="ico" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`,
  '🔥': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22c4.4 0 7-2.8 7-6.5 0-3-1.8-5.2-3.5-7C14 7 13 5 13 2c-3 2-5.5 5-5.5 8.5 0-1-.5-2-1.5-3-1 1.7-3 4-3 8C3 19.2 7.6 22 12 22z"/></svg>`,
  '🙌': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21v-6"/><path d="M8 15V8.5a1.5 1.5 0 0 1 3 0V14M11 8.5V4a1.5 1.5 0 0 1 3 0v6M14 10V6a1.5 1.5 0 0 1 3 0v8c0 4-2 7-5 7s-5-2-5-4l-2-3c-.8-1.2.6-2.6 1.8-1.7L8 13"/></svg>`,
  '🧲': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15V7a6 6 0 0 1 12 0v8a6 6 0 0 1-12 0z" transform="rotate(90 12 12)"/><path d="M3 9h6M15 9h6" transform="rotate(90 12 12)"/></svg>`,
  '👨🏾‍💻': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.3 2.9-5 6.5-5 1.2 0 2.3.2 3.2.6"/><path d="m15.5 13.5 2 2 4-4.5"/></svg>`,
  '🇨🇬': `<svg class="flag-cg" viewBox="0 0 24 18" role="img" aria-label="Drapeau de la République démocratique du Congo"><defs><clipPath id="flagCgClip"><rect width="24" height="18" rx="2.5"/></clipPath></defs><g clip-path="url(#flagCgClip)"><rect width="24" height="18" fill="#007FFF"/><path d="M0 11.5 24-4.5v3L0 14.5z" fill="#F7D618"/><path d="M0 14.5 24-1.5v6L0 20.5z" fill="#CE1021"/><path d="M0 20.5 24 4.5v3L0 23.5z" fill="#F7D618"/><path d="M4.6 1.2l.76 2.35h2.47L5.83 5l.77 2.35L4.6 5.9 2.6 7.35l.77-2.35L1.37 3.55h2.47z" fill="#F7D618"/></g></svg>`,
  '📗': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>`,
  '📚': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2V4z"/><path d="M22 4h-6a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22V4z"/></svg>`,
  '🗂': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/><path d="M3 11h18"/></svg>`,
  '🧮': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01M16 19h.01"/></svg>`,
  '🛠': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6L14 13l-3-3 3.7-3.7z"/></svg>`,
  '📄': `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>`
};
// clés normalisées (sans sélecteur de variation), triées du plus long au plus court
// (une séquence ZWJ comme 👨🏾‍💻 doit être remplacée AVANT 💻)
const ICONS_N = Object.entries(ICONS)
  .map(([k, v]) => [k.replace(/\uFE0F/g, ''), v])
  .sort((a, b) => [...b[0]].length - [...a[0]].length);
// applique les remplacements emoji → SVG, sans toucher aux <svg> existants
function iconify(html) {
  if (typeof html !== 'string' || !html) return html;
  return html.split(/(<svg[\s\S]*?<\/svg>)/g).map(seg => {
    if (seg.startsWith('<svg')) return seg;
    let out = seg.replace(/\uFE0F/g, '');
    for (const [em, svg] of ICONS_N) {
      if (out.includes(em)) out = out.split(em).join(svg);
    }
    return out;
  }).join('');
}

/* ---------------- helpers UI ---------------- */
let toastTimer;
function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.innerHTML = iconify(msg);
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}
function confetti() {
  const box = document.createElement('div'); box.className = 'confetti';
  const colors = ['var(--mint-strong)', 'var(--peach-strong)', 'var(--brand)', 'var(--butter)', 'var(--sky)'];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('i');
    p.style.left = '50vw'; p.style.top = '30vh';
    p.style.background = colors[i % colors.length];
    p.style.setProperty('--dx', ((Math.random() - .5) * 60) + 'vw');
    p.style.setProperty('--dy', (-(Math.random() * 30) + 30 + 'vh'));
    p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    p.style.animationDelay = (Math.random() * .18) + 's';
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 1200);
}
function countUp(el, goal, suf) {
  const start = performance.now(), dur = 700;
  const from = 0;
  function step(t) {
    const k = Math.min(1, (t - start) / dur), v = Math.round(from + (goal - from) * (1 - Math.pow(1 - k, 3)));
    el.textContent = v + (suf || '');
    if (k < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ---------------- Store : progression + code, local-first ---------------- */
const Store = {
  progress: {}, pending: {}, code: {}, user: null, sb: null,

  load() {
    try {
      const raw = JSON.parse(localStorage.getItem(K) || '{}');
      this.progress = raw.progress || {};
      this.pending = raw.pending || {};
    } catch { this.progress = {}; this.pending = {}; }
    try { this.code = JSON.parse(localStorage.getItem(KC) || '{}'); } catch { this.code = {}; }
    // migration de l'ancien format
    if (!Object.keys(this.progress).length) {
      try {
        const old = JSON.parse(localStorage.getItem(KOLD) || '{}');
        for (const n in old) this.progress[n] = old[n];
      } catch {}
    }
    if (!Object.keys(this.code).length) {
      try {
        for (let i = 0; i < 200; i++) {
          const c = localStorage.getItem(KCOLD + i);
          if (c) this.code[i] = c;
        }
      } catch {}
    }
    this.save();
  },
  save() { try { localStorage.setItem(K, JSON.stringify({ progress: this.progress, pending: this.pending })); } catch { /* navigateur très restreint : progression gardée en mémoire */ } },
  saveCode() { try { localStorage.setItem(KC, JSON.stringify(this.code)); } catch {} },

  maxDone() { return Math.max(0, ...Object.keys(this.progress).map(Number)); },

  status(n) {
    if (this.progress[n]) return 'done';
    const m = this.maxDone();
    if (n > m + 1) return 'locked';
    return this.progress[m] >= today() ? 'wait' : 'open';
  },

  streak() {
    // nombre de jours consécutifs (calendaires) validés, en partant du plus récent
    const dates = Object.values(this.progress);
    if (!dates.length) return 0;
    const set = new Set(dates);
    let s = 0;
    const d = new Date(set.has(today()) ? today() : new Date(Date.now() - 864e5).toLocaleDateString('sv'));
    for (; set.has(d.toLocaleDateString('sv')); ) {
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  },

  setCode(n, code) { this.code[n] = code; this.saveCode(); },

  /* Validation du jour n — locale d'abord, sync si possible */
  validate(n) {
    if (this.progress[n]) return { ok: true };
    this.progress[n] = today();
    this.pending[n] = { date: today(), ts: Date.now() };
    this.save();
    const pushed = Sync.pushSoon(true);
    return { ok: true, pushed };
  }
};

/* ---------------- Sync : Supabase + file d'attente hors ligne ---------------- */
const Sync = {
  online: navigator.onLine,
  state: 'local', // local | syncing | synced | error

  async init() {
    this.online = navigator.onLine;
    window.addEventListener('online', () => { this.online = true; this.refreshBadge(); this.pushSoon(); });
    window.addEventListener('offline', () => { this.online = false; this.refreshBadge(); });
    if (!CONFIG.url || !CONFIG.key) { this.refreshBadge(); return; }
    if (window.supabase) {
      try {
        this.sb = window.supabase.createClient(CONFIG.url, CONFIG.key, {
          auth: { persistSession: true, autoRefreshToken: true }
        });
        const { data } = await this.sb.auth.getSession();
        Store.user = data?.session?.user || null;
        if (Store.user) await this.pull();
      } catch (e) { console.warn('[sync]', e); }
    }
    this.sb?.auth.onAuthStateChange((_ev, session) => {
      const was = Store.user;
      Store.user = session?.user || null;
      if (Store.user && !was) this.pull().then(() => this.pushSoon());
    });
    this.refreshBadge();
  },

  refreshBadge() {
    const els = $$('.sync-badge');
    let mode = 'local', label = 'Local uniquement';
    if (!Store.user) {
      if (!navigator.onLine) { mode = 'offline'; label = 'Hors ligne · local'; }
      else if (!CONFIG.url) { mode = 'nocfg'; label = 'Local · config compte à venir'; }
    } else {
      if (this.state === 'syncing') { mode = 'syncing'; label = 'Synchro…'; }
      else if (!navigator.onLine) { mode = 'offline'; label = 'Hors ligne · file en attente'; }
      else if (Object.keys(Store.pending).length) { mode = 'syncing'; label = 'File en attente…'; }
      else { mode = 'online'; label = 'Compte synchronisé'; }
    }
    els.forEach(el => {
      const dot = el.querySelector('.sync-dot');
      dot.className = 'sync-dot ' + mode;
      el.title = label;
      const txt = el.querySelector('.sync-txt');
      if (txt) txt.textContent = label;
      if (el.dataset.who === 'chip') el.textContent = Store.user ? (Store.user.email.split('@')[0]) : label;
    });
    const a = $('#syncLabel'); if (a) a.textContent = label;
  },

  /* Pusher la file d'attente vers le compte */
  async pushSoon(force) {
    if (!Store.user || !this.sb || !navigator.onLine) { this.refreshBadge(); return false; }
    const ids = Object.keys(Store.pending);
    if (!ids.length) { this.refreshBadge(); return true; }
    this.state = 'syncing'; this.refreshBadge();
    try {
      const rows = ids.map(n => ({
        user_id: Store.user.id,
        day: Number(n),
        completed_date: Store.pending[n].date,
        code: Store.code[n] || null,
        updated_at: new Date(Store.pending[n].ts).toISOString()
      }));
      const { error } = await this.sb
        .from('day_progress')
        .upsert(rows, { onConflict: 'user_id,day' });
      if (error) throw error;
      ids.forEach(n => delete Store.pending[n]);
      Store.save();
      this.state = 'synced'; this.refreshBadge();
      return true;
    } catch (e) {
      this.state = 'error'; this.refreshBadge();
      if (!force) console.warn('[push]', e);
      return false;
    }
  },

  /* Récupérer la progression du compte et fusionner (le serveur gagne, la file locale part ensuite) */
  async pull() {
    if (!Store.user || !this.sb) return;
    try {
      const { data, error } = await this.sb.from('day_progress')
        .select('day,completed_date,code,updated_at')
        .eq('user_id', Store.user.id);
      if (error) throw error;
      let changed = false;
      (data || []).forEach(r => {
        const n = r.day;
        const local = Store.progress[n];
        const isPending = Store.pending[n];
        if (!isPending && (!local || (r.completed_date >= local))) {
          if (r.completed_date !== local) { Store.progress[n] = r.completed_date; changed = true; }
        }
        if (r.code && Store.code[n] === undefined) { Store.code[n] = r.code; }
      });
      if (changed || Object.keys(Store.code).length) Store.saveCode();
      Store.save();
      if (Object.keys(Store.pending).length) await this.pushSoon();
      this.state = 'synced';
    } catch (e) { console.warn('[pull]', e); this.state = 'error'; }
    this.refreshBadge();
  },

  /* Authentification */
  async signIn(email, pass) {
    const { data, error } = await this.sb.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    Store.user = data.user;
    await this.pull();
    await this.pushSoon(); // pousser la progression locale faite hors compte
    this.refreshBadge();
    return data.user;
  },
  async signInOAuth(provider) {
    if (!this.sb) throw new Error('Backend non configuré (config.js).');
    const base = location.href.replace(/[^/]*$/, ''); // dossier de la page
    const { error } = await this.sb.auth.signInWithOAuth({
      provider,
      options: { redirectTo: base + 'login.html' }
    });
    if (error) throw error;
    // la page va être redirigée vers le fournisseur ; le retour passera par redirectTo
  },
  async signUp(email, pass) {
    const { data, error } = await this.sb.auth.signUp({ email, password: pass });
    if (error) throw error;
    // Selon la config du projet Supabase, la session peut être immédiate ou nécessiter une confirmation email
    Store.user = data.user || null;
    if (Store.user) { await this.pull(); await this.pushSoon(); }
    this.refreshBadge();
    return data;
  },
  async signOut() {
    await this.sb?.auth.signOut();
    Store.user = null;
    this.refreshBadge();
  }
};

/* ---------------- Démarrage commun ---------------- */
async function bootCommon() {
  Store.load();
  Theme.init();
  document.documentElement.classList.add('js');
  await Sync.init();
}

// Icônes en ligne (mini-jeux d'emoji SVG inline, légers)
const ICON = {
  done: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  lock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`,
  run: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg>`,
  moon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>`,
  sun: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>`,
  auto: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none"/></svg>`
};

