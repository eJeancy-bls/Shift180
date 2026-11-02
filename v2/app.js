// v2/app.js — Tableau de bord v2 · pills mois + grille ultra-tactile + stats + badge réseau
/* $ et $$ sont fournis par core.js */
const QS = $$;

function haptic(ms = 12) { if (navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) {} } }

function fmtDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

/* badge réseau : vert synchro / orange hors ligne avec file d'attente */
function netBadge() {
  const b = $('#netBadge'), t = $('#netTxt');
  const online = navigator.onLine;
  const pend = Object.keys(Store.pending).length;
  b.classList.toggle('off', !online);
  t.textContent = online
    ? (pend ? `Sync · ${pend} en attente` : 'En ligne · synchro')
    : `Hors ligne · ${pend || 0} en attente`;
  b.title = online ? 'Ta progression est synchronisée' : 'Travail sauvegardé localement, renvoyé au retour du réseau';
}

/* pills des 6 mois (scroll-snap, sélection = grille) */
let curMonth = null;
function renderPills() {
  $('#monthPills').innerHTML = MONTHS.map(m => {
    const sel = curMonth === m.n;
    return `<button role="tab" aria-selected="${sel}" data-m="${m.n}">Mois ${m.n} · ${m.title}</button>`;
  }).join('');
  $('#monthPills').querySelectorAll('button').forEach(b => b.onclick = () => {
    curMonth = +b.dataset.m; haptic(); renderPills(); renderGrid();
  });
}

/* grille du mois : 1 carte par jour, états ultra-visuels */
const LABEL = { done: 'posée ✓', open: 'ouvrir', wait: 'pause', locked: '🔒' };
function renderGrid() {
  const m = MONTHS.find(x => x.n === curMonth);
  $('#monthGrid').innerHTML = Array.from(
    { length: m.range[1] - m.range[0] + 1 }, (_, i) => {
      const n = m.range[0] + i, st = Store.status(n);
      const sub = st === 'done' ? LABEL.done : st === 'open' ? LABEL.open : st === 'wait' ? '⏳' : LABEL.locked;
      const href = st === 'open' || st === 'done' ? `day.html?d=${n}` : 'javascript:void(0)';
      return `<a class="mday ${st}" href="${href}" data-n="${n}" aria-label="Jour ${n} : ${st === 'locked' ? 'verrouillé' : sub}">
        <span>${st === 'done' ? '✓' : n}</span><small>${st === 'done' ? 'Jour ' + n : sub}</small></a>`;
    }).join('');
  $('#monthGrid').querySelectorAll('.mday[data-n]').forEach(a => {
    const n = +a.dataset.n, st = Store.status(n);
    if (st === 'open' && LESSONS[n]) a.onclick = e => { e.preventDefault(); haptic(18); location.href = a.href; };
    else if (st === 'locked' || st === 'wait') a.onclick = e => { e.preventDefault(); openLockSheet(n, st); };
  });
}

/* bottom sheet pour un jour verrouillé : date de déblocage claire */
function openLockSheet(n, st) {
  haptic(24);
  openSheet(`
    <h2 style="margin-top:0">${st === 'wait' ? '⏳ Jour de pause — Jour ' + n : '🔒 Verrouillé — Jour ' + n}</h2>
    ${st === 'wait'
      ? `<p>Ce jour est une pause planifiée dans la roadmap. Il s'ouvre automatiquement à sa date.</p>`
      : `<p>Le silo tient la cadence&nbsp;: la leçon <b>Jour ${n}</b> s'ouvrira après la validation du Jour ${n - 1}${Store.progress[n - 1] ? ' le <b>' + fmtDate(Store.progress[n - 1]) + '</b> + attente d\'un jour.' : ''}.</p>`}
    <button class="btn btn-primary" style="width:100%" onclick="closeSheet()">Compris</button>`);
}

function openSheet(html) {
  let s = document.querySelector('.sheet');
  if (!s) {
    s = document.createElement('div'); s.className = 'sheet';
    s.innerHTML = `<div class="sheet-inner" role="dialog" aria-modal="true"><div class="sheet-grab"></div><div class="sheet-body"></div></div>`;
    document.body.appendChild(s);
    s.addEventListener('click', e => { if (e.target === s) s.classList.remove('open'); });
    const g = s.querySelector('.sheet-grab');
    let sy = null;
    g.addEventListener('touchstart', e => { sy = e.touches[0].clientY; });
    g.addEventListener('touchmove', e => { if (sy != null && e.touches[0].clientY - sy > 46) { s.classList.remove('open'); sy = null; } });
  }
  s.querySelector('.sheet-body').innerHTML = html;
  s.classList.add('open');
}

function closeSheet() { const s = document.querySelector('.sheet'); if (s) s.classList.remove('open'); }

function renderStats() {
  const done = Object.keys(Store.progress).length;
  const pct = Math.round(done / 1.8);
  $('#stDone').textContent = done;
  $('#stPct').textContent = pct + ' %';
  $('#stStreak').textContent = Store.streak();
  curMonth = MONTHS.find(m => nInRange(m, done + 1))?.n || 6;
  $('#streakLine').textContent = done
    ? `Dernier aimant posé : Jour ${Math.max(...Object.keys(Store.progress).map(Number))} — continue la série !`
    : 'Commence par le Jour 1 — pose ton premier aimant aujourd\u2019hui.';
}
function nInRange(m, n) { return n >= m.range[0] && n <= m.range[1]; }

/* le tab « Leçon » de la bottom-nav pointe vers le prochain jour ouvert */
function setDayTab() {
  const link = document.querySelector('.bnav a[href="day.html"]');
  let target = null;
  for (let n = 1; n <= 180; n++) { if (Store.status(n) === 'open') { target = n; break; } }
  if (target) link.href = `day.html?d=${target}`;
}

function confettiBurst() {
  const c = document.createElement('div'); c.className = 'confetti';
  for (let i = 0; i < 26; i++) {
    const p = document.createElement('i');
    p.style.cssText = `left:${Math.random() * 100}%;background:${['var(--lilac)', 'var(--mint)', 'var(--rose)', 'var(--sun)'][i % 4]};animation-delay:${Math.random() * 0.5}s`;
    c.appendChild(p);
  }
  document.body.appendChild(c); setTimeout(() => c.remove(), 1900);
}

/* boot */
awaitlessBoot();
function awaitlessBoot() {
  bootCommon();
  renderPills(); renderStats(); renderGrid(); setDayTab(); netBadge();
  window.addEventListener('online', netBadge); window.addEventListener('offline', netBadge);
  /* retour matériel/swipe : toujours ramener au tableau */
  history.replaceState({ v2board: 1 }, '');
  window.addEventListener('popstate', e => { if (!(e.state && e.state.v2board)) history.pushState({ v2board: 1 }, ''); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
}
