// login.js — page Compte dédiée : slider connexion/inscription + OAuth Google & GitHub (logos officiels)
const root = $('#authRoot');
const nextURL = () => {
  const p = new URLSearchParams(location.search);
  return p.get('next') || 'app.html';
};

const LOGO_GOOGLE = `<svg class="btn-logo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>`;
const LOGO_GITHUB = `<svg class="btn-logo" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`;

async function main() {
  await bootCommon();
  render();
}

const LOGO_FACEBOOK = `<svg class="btn-logo" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
const LOGO_DISCORD = `<svg class="btn-logo" viewBox="0 0 24 24" fill="#5865F2" aria-hidden="true"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.245.198.372.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`;
const LOGO_SPOTIFY = `<svg class="btn-logo" viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`;

function oauthBtns() {
  return `
    <div class="oauth-row">
      <button class="btn lilac has-logo" id="btnGoogle">${LOGO_GOOGLE}Google</button>
      <button class="btn lilac has-logo" id="btnGithub">${LOGO_GITHUB}GitHub</button>
      <button class="btn lilac has-logo" id="btnFacebook">${LOGO_FACEBOOK}Facebook</button>
      <button class="btn lilac has-logo" id="btnDiscord">${LOGO_DISCORD}Discord</button>
      <button class="btn lilac has-logo" id="btnSpotify">${LOGO_SPOTIFY}Spotify</button>
    </div>
    <p class="auth-note" id="oauthNote">🔒 Connexion en 1 clic via Google, GitHub, Facebook, Discord ou Spotify.</p>`;
}

function render() {
  if (Store.user) return renderConnected();
  const noCfg = !CONFIG.url || !CONFIG.key;
  root.innerHTML = iconify(`
    <h1 class="auth-title">Ton compte Shift180</h1>
    <p class="auth-sub">Ta progression locale actuelle sera automatiquement envoyée à ce compte après connexion.</p>
    ${
      noCfg
        ? `<div class="auth-card">
            <h2 style="margin-top:0">🔧 Synchronisation à brancher</h2>
            <p class="muted-line">La sauvegarde par compte a besoin de Supabase : remplis le fichier <code>config.js</code> (URL + clé) — procédure de 5 minutes dans le README. En attendant, les formulaires ci-dessous afficheront une erreur et <b>la plateforme marche 100 % en local</b>.</p>
          </div>`
        : ''
    }
    <div class="auth-card">
      ${oauthBtns()}
      <div class="auth-tabs" data-mode="in" role="tablist" aria-label="Connexion ou inscription">
        <span class="auth-thumb" aria-hidden="true"></span>
        <button class="auth-tab" id="tabIn"  role="tab" aria-selected="true"  aria-controls="panelIn">Se connecter</button>
        <button class="auth-tab" id="tabUp"  role="tab" aria-selected="false" aria-controls="panelUp">Créer un compte</button>
      </div>
      <form id="fSignIn" class="auth-panel" role="tabpanel" aria-label="Connexion">
        <label class="field"><span>Email</span><input type="email" required autocomplete="email" placeholder="toi@exemple.com"></label>
        <label class="field"><span>Mot de passe</span><input type="password" required autocomplete="current-password" placeholder="ton mot de passe"></label>
        <div class="auth-row"><button class="btn lilac" type="submit">Se connecter</button></div>
      </form>
      <form id="fSignUp" class="auth-panel" role="tabpanel" aria-label="Inscription" hidden>
        <label class="field"><span>Email</span><input type="email" required autocomplete="email" placeholder="toi@exemple.com"></label>
        <label class="field"><span>Choisis un mot de passe</span><input type="password" required minlength="6" autocomplete="new-password" placeholder="6 caractères minimum"></label>
        <div class="auth-row"><button class="btn multi" type="submit">Créer mon compte</button></div>
      </form>
      <p class="form-msg" id="fMsg"></p>
      <p class="auth-note">💡 Mot de passe : 6 caractères minimum · ta progression hors ligne (file d'attente) partira au compte dès la reconnexion réseau.</p>
    </div>
    <p style="text-align:center;margin-top:18px"><a class="btn btn-ghost" href="app.html">← Revenir au tableau (mode local, sans compte)</a></p>`);
  wire();
  bindOAuth();
  setMode(location.hash === '#signup' ? 'up' : 'in');  // lien direct possible : login.html#signup
  Sync.refreshBadge();
}

/* slider connexion ↔ inscription : un seul formulaire visible à la fois */
function setMode(mode) {
  const tabs = $('.auth-tabs');
  if (tabs) tabs.dataset.mode = mode;
  const isIn = mode === 'in';
  $('#tabIn').setAttribute('aria-selected', String(isIn));
  $('#tabUp').setAttribute('aria-selected', String(!isIn));
  const pin = $('#fSignIn'), pup = $('#fSignUp');
  pin.hidden = !isIn; pup.hidden = isIn;
  const shown = isIn ? pin : pup;
  shown.classList.remove('entering'); void shown.offsetWidth; shown.classList.add('entering');
  const msg = $('#fMsg'); msg.className = 'form-msg'; msg.textContent = '';
}

function renderConnected() {
  /* retour OAuth (Google/GitHub) : session échangée par supabase-js → on repart vers la plateforme */
  if (new URLSearchParams(location.search).get('code')) {
    root.innerHTML = iconify(`
      <div class="auth-card">
        <h2 class="auth-title">Connecté ✓</h2>
        <p class="muted-line">Bienvenue ${firstNameOf(Store.user)} — on te ramène à ton tableau…</p>
      </div>`);
    setTimeout(() => location.replace(nextURL()), 700);
    return;
  }
  root.innerHTML = iconify(`
    <div class="auth-card">
      <h2 class="auth-title">Compte connecté ✓</h2>
      <p class="muted-line" style="display:flex;align-items:center;gap:10px;justify-content:center">
        ${avatarOf(Store.user) ? `<img class="ava" src="${avatarOf(Store.user)}" width="34" height="34" alt="" referrerpolicy="no-referrer" style="border-radius:50%;object-fit:cover">` : ''}
        <span style="text-align:left"><b>${firstNameOf(Store.user)}</b> · ${Store.user.email}<br>ta progression est synchronisée sur tous tes appareils.</span>
      </p>
      <div class="auth-row">
        <button class="btn btn-ghost" id="signOut">Se déconnecter</button>
        <button class="btn mint" id="forceSync">Synchroniser maintenant</button>
      </div>
      <p class="muted-line" id="offlineStat" style="margin-top:12px"></p>
      <p class="auth-note">Sans réseau, tout est enregistré localement, puis renvoyé au compte automatiquement au retour de la connexion.</p>
    </div>
    <p style="text-align:center;margin-top:18px"><a class="btn" href="${nextURL()}">Tableau de bord →</a></p>`);
  $('#signOut').onclick = async () => { await Sync.signOut(); render(); };
  $('#forceSync').onclick = async () => {
    await Sync.pull(); await Sync.pushSoon(true); toast('Progression synchronisée ✓'); render();
  };
  const p = Object.keys(Store.pending).length;
  $('#offlineStat').innerHTML = p
    ? iconify(`⏳ ${p} jour${p > 1 ? 's' : ''} en file d'attente pour le compte (hors ligne récemment).`)
    : iconify('✓ Rien en attente : tout est déjà en ligne.');
}

function wire() {
  const msg = $('#fMsg'); const setMsg = (cls, t) => { msg.className = 'form-msg ' + cls; msg.textContent = t; };
  const fIn = $('#fSignIn'), fUp = $('#fSignUp');
  if (!fIn) return;
  $('#tabIn').onclick = () => setMode('in');
  $('#tabUp').onclick = () => setMode('up');
  fIn.onsubmit = async e => {
    e.preventDefault(); setMsg('', 'Connexion…');
    if (!Store.sb) { setMsg('err', 'Backend non configuré — vois le README.'); return; }
    try {
      await Sync.signIn(e.target[0].value.trim(), e.target[1].value);
      setMsg('ok', 'Connecté ✓');
      toast('Progression récupérée depuis ton compte ✓');
      setTimeout(() => location.href = nextURL(), 600);
    } catch (err) { setMsg('err', cleanErr(err)); }
  };
  fUp.onsubmit = async e => {
    e.preventDefault(); setMsg('', 'Création…');
    if (!Store.sb) { setMsg('err', 'Backend non configuré — vois le README.'); return; }
    try {
      const r = await Sync.signUp(e.target[0].value.trim(), e.target[1].value);
      if (r.session) { setMsg('ok', 'Compte créé ✓'); setTimeout(() => location.href = nextURL(), 600); }
      else { setMsg('ok', 'Compte créé ! Confirme ton email puis connecte-toi ci-dessus.'); }
    } catch (err) { setMsg('err', cleanErr(err)); }
  };
}

function bindOAuth() {
  const google = $('#btnGoogle'); if (!google) return;
  const msg = $('#fMsg');
  const go = async provider => {
    msg.className = 'form-msg'; msg.textContent = 'Connexion ' + provider + '…';
    try { await Sync.signInOAuth(provider); /* redirection gérée par Supabase */ }
    catch (err) { msg.className = 'form-msg err'; msg.textContent = 'Connexion ' + provider + ' indisponible : ' + (err.message || err); }
  };
  google.onclick = () => go('google');
  $('#btnGithub').onclick = () => go('github');
  $('#btnFacebook').onclick = () => go('facebook');
  $('#btnDiscord').onclick = () => go('discord');
  $('#btnSpotify').onclick = () => go('spotify');
}

/* Landing/Start pages utilisent ces helpers aussi : pas dupliqués par chance */
main();
