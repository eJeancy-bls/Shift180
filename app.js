// app.js — tableau de bord (index de la plateforme : app.html)
/* gère : hero de progression, rail des 6 mois, filière d'aimants du mois,
   carte de compte (auth Supabase), badge de sync. */

const LAB = {
  done: '✓ Terminé',
  open: 'Poser ton aimant',
  wait: '⏳ Demain',
  locked: 'Verrouillé'
};

function monthDayStats(m) {
  const [a, b] = MONTHS[m - 1].range;
  let done = 0;
  for (let n = a; n <= b; n++) if (Store.progress[n]) done++;
  return { done, total: b - a + 1 };
}

function renderHero() {
  const done = Object.keys(Store.progress).length;
  const pct = Math.round(done / 1.8);
  const ring = $('.ring');
  ring.style.setProperty('--p', pct);
  $('.ring .value').style.strokeDasharray = `${pct * 2.1991} 999`;
  countUp($('#pct'), pct, '%');
  countUp($('#daysDone'), done);
  countUp($('#streak'), Store.streak());
  const next = DAYS.find(d => d && Store.status(d.n) === 'open');
  if (next) {
    $('#continueBtn').onclick = () => location.href = 'day.html?d=' + next.n;
    $('#continueBtn').textContent = 'Poser ton aimant · J' + next.n;
  } else {
    $('#continueBtn').onclick = () => location.href = '#';
    $('#continueBtn').innerHTML = iconify('Tout est validé pour l\'instant 🎉');
    $('#continueBtn').disabled = true;
  }
}

function renderRail(selected) {
  $('#rail').innerHTML = MONTHS.map(m => {
    const { done, total } = monthDayStats(m.n);
    const active = m.n === selected;
    return `<button class="month-tab" role="tab" aria-selected="${active}" data-m="${m.n}">
      <b>Mois ${m.n}</b><small>${m.title}</small>
      <span class="month-mini"><i style="width:${done / total * 100}%"></i></span>
      <small>${done}/${total}</small>
    </button>`;
  }).join('');
  $$('.month-tab').forEach(t => t.onclick = () => renderMonth(+t.dataset.m));
}

function renderMonth(selected) {
  renderRail(selected);
  const m = MONTHS[selected - 1], [a, b] = m.range;
  const { done, total } = monthDayStats(selected);
  $('#boardTitle').textContent = `Mois ${m.n} — ${m.title} (J${a}–${b})`;
  $('#boardSub').textContent = `${done}/${total} jours posés`;
  $('#board').innerHTML = Array.from({ length: b - a + 1 }, (_, i) => {
    const n = a + i, D = DAYS[n], st = Store.status(n);
    const todayFlag = st === 'open';
    return `<a class="magnet ${st}${todayFlag ? ' today' : ''}"
      ${st === 'locked' ? 'aria-disabled="true" tabindex="-1" href="#" onclick="return false"' : 'href="day.html?d=' + n + '"'}
      title="J${n} — ${D.title}">
      <span class="dnum">J${n}</span>
      <span class="dtitle">${D.title}</span>
      <span class="dbadge">${LAB[st]}</span>
    </a>`;
  }).join('');
  $('#board').innerHTML = iconify($('#board').innerHTML);
  localStorage.setItem('pbd.month', selected);
  scheduleBoardCollapse();
}

function renderHint() {
  const done = Object.keys(Store.progress).length;
  $('#hint').textContent = done
    ? 'Continue le mois en cours puis déplace-toi via le rail des mois.'
    : 'Le Jour 1 est disponible : pose ton premier aimant menthe.';
  if (!Store.user) $('#hint').textContent += ' Ta progression est gardée en local — connecte-toi (en haut) pour la sauvegarder sur ton compte.';
}

/* ---------- auth topbar : rendu partagé (core.js renderAuth) ---------- */
function authTopbar() {
  renderAuth();
}

/* ---------- grille repliée : 7 aimants suffisent sur un petit écran ---------- */
let boardCompact = false, compactTimer = null;
function collapseBoard() {
  const board = $('#board'), btn = $('#boardToggle');
  const cards = $$('#board .magnet');
  if (!board || btn.hidden === undefined) return;
  if (cards.length <= 7) { btn.hidden = true; return; }
  cards.slice(7).forEach(c => c.classList.add('minoring'));
  setTimeout(() => {
    cards.slice(7).forEach(c => { c.classList.add('minor'); c.classList.remove('minoring'); });
    btn.textContent = `⌄ Dérouler les ${cards.length} jours du mois`;
    btn.hidden = false;
  }, 270);
  boardCompact = true;
}
function expandBoard() {
  const btn = $('#boardToggle');
  sessionStorage.setItem('pbd.boardFull', '1');
  $$('#board .magnet.minor').forEach(c => c.classList.remove('minor'));
  btn.hidden = true;
  boardCompact = false;
}
function scheduleBoardCollapse() {
  const btn = $('#boardToggle');
  if (!btn) return;
  clearTimeout(compactTimer);
  const small = matchMedia('(max-width: 700px)').matches;
  const full = sessionStorage.getItem('pbd.boardFull') === '1';
  if (!small) { btn.hidden = true; return; }
  if (full) { btn.hidden = true; return; }
  if (boardCompact) { collapseBoard(); btn.hidden = false; return; }
  btn.hidden = true;
  compactTimer = setTimeout(() => { collapseBoard(); }, 3000);
  btn.onclick = expandBoard;
}

function cleanErr(err) {
  const raw = (err && (err.message || err.msg)) || String(err);
  if (/invalid login credentials/i.test(raw)) return 'Email ou mot de passe incorrect.';
  if (/user already registered/i.test(raw)) return 'Ce compte existe déjà — connecte-toi plutôt.';
  if (/at least 6/i.test(raw)) return 'Mot de passe : 6 caractères minimum.';
  if (/email/i.test(raw) && /invalid/i.test(raw)) return 'Adresse email invalide.';
  if (/fetch|network/i.test(raw)) return 'Réseau indisponible — réessaie en ligne.';
  return raw;
}

/* ---------- boot ---------- */
function renderDashboard() {
  const saved = +localStorage.getItem('pbd.month') || 0;
  const openDay = DAYS.find(d => d && Store.status(d.n) !== 'locked');
  const currentMonth = openDay ? MONTHS.findIndex(m => openDay.n >= m.range[0] && openDay.n <= m.range[1]) + 1 : 6;
  renderMonth(saved || currentMonth);
  renderHero();
  renderHint();
}

async function main() {
  await bootCommon();
  confettiLoad(); // petite entrée en scène
  // Apparition en cascade des zones
  $$('.hero, #rail, .board-head, #board, #hint').forEach((el, i) => {
    el.classList.add('rise');
    el.style.animationDelay = (i * 80) + 'ms';
  });
  authTopbar();
  renderDashboard();
}

function confettiLoad() { /* discret : rien au chargement, réservé aux validations */ }

main();
