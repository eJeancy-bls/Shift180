// v2/login.js — Compte v2 · OAuth + email, vue profil avec install PWA
const $ = s => document.querySelector(s);

function go(provider) {
  Sync.signInOAuth(provider).catch(err => {
    toast('Connexion ' + provider + ' indisponible : ' + (err.message || err));
  });
  toast('Connexion ' + provider + '…');
}

const LOGOS = {
  google: { svg: `<svg class="btn-logo" viewBox="0 0 48 48" width="18" height="18" aria-hidden="true"><path fill="#FFC107" d="M43.611 20.083H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/></svg>`, label: 'Google' },
  github: { svg: `<svg class="btn-logo" viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`, label: 'GitHub' },
  facebook: { svg: `<svg class="btn-logo" viewBox="0 0 24 24" width="18" height="18" fill="#1877F2" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`, label: 'Facebook' },
  discord: { svg: `<svg class="btn-logo" viewBox="0 0 24 24" width="18" height="18" fill="#5865F2" aria-hidden="true"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.245.198.372.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`, label: 'Discord' }
};

function oauthRow() {
  return `<div class="install-actions">${Object.entries(LOGOS).map(([p, L]) =>
    `<button class="btn btn-ghost" data-oauth="${p}" style="flex:1">${L.svg}<span class="hide-s" style="font-size:13px">${L.label}</span></button>`).join('')}</div>
    <p style="color:var(--muted);font-size:13px;text-align:center">🔒 Connexion en 1 clic · ta progression locale partira au compte après connexion.</p>`;
}

function render() {
  const root = $('#authRoot');
  if (Store.user) {
    try {
      root.innerHTML = `<div class="panel" style="text-align:center">
        <h2>Connecté ✓</h2>
        <p style="color:var(--muted)">${Store.user.email}</p>
        <div class="install-actions">
          <button class="btn btn-ghost" id="signOut">Se déconnecter</button>
          <button class="btn btn-success" id="forceSync">Synchroniser maintenant</button>
        </div>
        <button class="btn btn-primary" id="instApp" style="width:100%;margin-top:10px">📲 Installer l'app</button>
        <p style="color:var(--muted);font-size:13px;margin-top:10px" id="pendLine"></p>
      </div>`;
      $('#signOut').onclick = async () => { await Sync.signOut(); render(); };
      $('#forceSync').onclick = async () => { await Sync.pull(); await Sync.pushSoon(true); toast('Progression synchronisée ✓'); render(); };
      $('#instApp').onclick = () => window.PWAInstall && window.PWAInstall.open();
      const p = Object.keys(Store.pending).length;
      $('#pendLine').textContent = p ? `⏳ ${p} jour(s) en file d'attente (hors ligne récemment)` : '✓ Tout est en ligne.';
    } catch (e) { console.error(e); }
    return;
  }
  root.innerHTML = `
    <div class="panel">
      ${oauthRow()}
      <form id="fIn" class="task" style="display:block">
        <label><span style="display:block;font-size:13px;color:var(--muted);font-weight:700">Email</span>
        <input type="email" required autocomplete="email" style="width:100%;min-height:48px;border-radius:10px;border:1px solid color-mix(in srgb, var(--muted) 30%, transparent);background:var(--bg);color:var(--text);padding:0 12px;font:inherit"></label>
        <label style="margin-top:8px"><span style="display:block;font-size:13px;color:var(--muted);font-weight:700">Mot de passe</span>
        <input type="password" required autocomplete="current-password" style="width:100%;min-height:48px;border-radius:10px;border:1px solid color-mix(in srgb, var(--muted) 30%, transparent);background:var(--bg);color:var(--text);padding:0 12px;font:inherit"></label>
        <button class="btn btn-primary" style="width:100%;margin-top:12px" type="submit">Se connecter</button>
      </form>
      <form id="fUp" hidden>
        <label style="margin-top:8px;display:block"><span style="display:block;font-size:13px;color:var(--muted);font-weight:700">Email</span>
        <input type="email" required autocomplete="email" style="width:100%;min-height:48px;border-radius:10px;border:1px solid color-mix(in srgb, var(--muted) 30%, transparent);background:var(--bg);color:var(--text);padding:0 12px;font:inherit"></label>
        <label style="margin-top:8px"><span style="display:block;font-size:13px;color:var(--muted);font-weight:700">Mot de passe (6 min.)</span>
        <input type="password" minlength="6" required autocomplete="new-password" style="width:100%;min-height:48px;border-radius:10px;border:1px solid color-mix(in srgb, var(--muted) 30%, transparent);background:var(--bg);color:var(--text);padding:0 12px;font:inherit"></label>
        <button class="btn btn-success" style="width:100%;margin-top:12px" type="submit">Créer mon compte</button>
      </form>
      <div class="install-actions">
        <button class="btn btn-ghost" id="tabIn" type="button">J'ai déjà un compte</button>
        <button class="btn btn-ghost" id="tabUp" type="button">Créer un compte</button>
      </div>
      <button class="btn btn-primary" id="instApp" style="width:100%;margin-top:10px">📲 Installer l'app</button>
    </div>`;
  const tb = x => {
    $('#fIn').hidden = x === 'up'; $('#fUp').hidden = x === 'in';
    $('#tabIn').removeAttribute('disabled'); $('#tabUp').removeAttribute('disabled');
    $('#tab' + (x === 'in' ? 'In' : 'Up')).setAttribute('disabled', '');
  };
  tb('in');
  $('#tabIn').onclick = () => tb('in');
  $('#tabUp').onclick = () => tb('up');
  $('#fIn').onsubmit = async e => {
    e.preventDefault(); toast('Connexion…');
    if (!Store.sb) return toast('Backend non configuré — vois le README.');
    try { await Sync.signIn(e.target[0].value.trim(), e.target[1].value); toast('Connecté ✓'); location.href = 'app.html'; }
    catch (err) { toast(err.message || err); }
  };
  $('#fUp').onsubmit = async e => {
    e.preventDefault(); toast('Création…');
    if (!Store.sb) return toast('Backend non configuré — vois le README.');
    try { await Sync.signUp(e.target[0].value.trim(), e.target[1].value); toast('Compte créé ✓'); location.href = 'app.html'; }
    catch (err) { toast(err.message || err); }
  };
  $('#instApp').onclick = () => window.PWAInstall && window.PWAInstall.open();
  document.querySelectorAll('[data-oauth]').forEach(b => b.onclick = () => go(b.dataset.oauth));
}

function netBadgeW() {
  const t = $('#netTxtW'); if (!t) return;
  t.textContent = navigator.onLine ? 'En ligne' : 'Hors ligne';
  $('#netBadgeW').classList.toggle('off', !navigator.onLine);
}
window.addEventListener('online', netBadgeW); window.addEventListener('offline', netBadgeW);
bootCommon().then(() => { render(); netBadgeW(); }).catch(e => console.error(e));
