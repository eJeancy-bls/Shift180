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

/* ---------------- helpers UI ---------------- */
let toastTimer;
function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
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

