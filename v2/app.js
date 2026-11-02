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
  t.textContent = online ? 'En ligne' : `Hors ligne · ${pend} en file`;
  b.title = online
    ? (pend ? `${pend} validation(s) attendent le retour du réseau pour partir au compte` : 'Ta progression est synchronisée')
    : 'Ton travail est sauvegardé dans le navigateur et repartira à la reconnexion';
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

/* chemin Duolingo : nœuds zigzag reliés, la couleur raconte l'état */
const LOCK_PATH = `<path d="M8 11V7a4 4 0 0 1 8 0v4"/><rect x="5" y="11" width="14" height="10" rx="2"/>`;
function renderGrid() {
  const m = MONTHS.find(x => x.n === curMonth);
  $('#monthGrid').innerHTML = Array.from(
    { length: m.range[1] - m.range[0] + 1 }, (_, i) => {
      const nd = m.range[0] + i;
      const st = Store.status(nd);
      const lock = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${LOCK_PATH}</svg>`;
      const node = st === 'done' ? '✓' : st === 'locked' ? lock : nd;
      const badge = st === 'open' ? `<span class="node-badge">Aujourd'hui</span>` : '';
      const href = st === 'open' || st === 'done' ? `day.html?d=${nd}` : 'javascript:void(0)';
      return `<a class="node ${st}" href="${href}" data-n="${nd}" aria-label="Jour ${nd} : ${st === 'locked' ? 'verrouillé' : st === 'done' ? 'posé' : st === 'wait' ? 'pause' : 'à faire'}">
        ${node}${badge}</a>`;
    }).join('');
  $('#monthGrid').querySelectorAll('.node[data-n]').forEach(a => {
    const nd = +a.dataset.n;
    if (Store.status(nd) === 'locked' || Store.status(nd) === 'wait') a.onclick = e => { e.preventDefault(); openLockSheet(nd, Store.status(nd)); };
  });
}

/* bottom sheet pour un jour verrouillé : date de déblocage claire */
function openLockSheet(n, st) {
  haptic(24);
  openSheet(`
    <h2 style="margin-top:0">${st === 'wait' ? 'Jour de pause — Jour ' + n : 'Encore verrouillé — Jour ' + n}</h2>
    ${st === 'wait'
      ? `<p>Ce jour est une pause planifiée dans la roadmap. Il s'ouvre automatiquement à sa date.</p>`
      : `<p>La roadmap tient la cadence&nbsp;: la leçon <b>Jour ${n}</b> s'ouvre après la validation du Jour ${n - 1}${Store.progress[n - 1] ? ' posée le <b>' + fmtDate(Store.progress[n - 1]) + '</b>, puis un jour d\u2019attente pour laisser la leçon se décanter.' : ''}.</p>`}
    <button class="btn" style="width:100%" onclick="closeSheet()">Compris</button>`);
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

function nInRange(m, n) { return n >= m.range[0] && n <= m.range[1]; }
function renderStats() {
  const done = Object.keys(Store.progress).length;
  const pct = Math.round(done / 1.8);
  const streak = Store.streak();
  $('#stCounters').innerHTML =
    `<b>${done}</b> aimant${done > 1 ? 's' : ''} posé${done > 1 ? 's' : ''} · ` +
    `<b>${streak}</b> de série · ` +
    `<b>${pct}&nbsp;%</b> du parcours`;
  const ringVal = $('#srRingVal');
  ringVal.setAttribute('stroke-dasharray', (pct ? `${(pct / 100 * 113).toFixed(1)} 113` : '0 121'));
  ringVal.style.opacity = pct ? '1' : '0';
  curMonth = (MONTHS.find(m => nInRange(m, done + 1)) || MONTHS[5]).n;
  $('#streakLine').textContent = done
    ? `Posé pour la dernière fois : Jour ${Math.max(...Object.keys(Store.progress).map(Number))} — continue la série, un aimant par jour.`
    : 'Toute la roadmap se joue un aimant à la fois. Pose le premier aujourd\u2019hui.';
}

/* le tab « Leçon » de la bottom-nav pointe vers le prochain jour ouvert */
function setDayTab() {
  const link = document.querySelector('.bnav a[href="day.html"]');
  let target = null;
  for (let n = 1; n <= 180; n++) { if (Store.status(n) === 'open') { target = n; break; } }
  if (target) link.href = `day.html?d=${target}`;
}

/* boot */
awaitlessBoot();
function awaitlessBoot() {
  bootCommon();
  const bb = document.getElementById('backBar'); if (bb) bb.remove(); /* le tableau est la racine du flux */
  renderPills(); renderStats(); renderGrid(); setDayTab(); netBadge();
  window.addEventListener('online', netBadge); window.addEventListener('offline', netBadge);
  /* retour matériel/swipe : toujours ramener au tableau */
  history.replaceState({ v2board: 1 }, '');
  window.addEventListener('popstate', e => { if (!(e.state && e.state.v2board)) history.pushState({ v2board: 1 }, ''); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
}
