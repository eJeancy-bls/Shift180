// login.js — page Compte dédiée : connexion / inscription email + OAuth Google & GitHub
const root = $('#authRoot');
const nextURL = () => {
  const p = new URLSearchParams(location.search);
  return p.get('next') || 'app.html';
};

async function main() {
  await bootCommon();
  render();
}

function oauthBtns() {
  return `
    <div class="oauth-row">
      <button class="btn lilac" id="btnGoogle">🌐 Google</button>
      <button class="btn lilac" id="btnGithub">🐙 GitHub</button>
    </div>
    <p class="auth-note" id="oauthNote">🔒 Connexion en 1 clic via ton compte Google ou GitHub (si activés côté Supabase — voir README).</p>`;
}

function render() {
  if (Store.user) return renderConnected();
  const noCfg = !CONFIG.url || !CONFIG.key;
  root.innerHTML = `
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
      <hr style="border:none;border-top:1.5px solid var(--line);margin:16px 0">
      <b>Déjà un compte ?</b>
      <form id="fSignIn">
        <label class="field"><span>Email</span><input type="email" required autocomplete="email" placeholder="toi@exemple.com"></label>
        <label class="field"><span>Mot de passe</span><input type="password" required autocomplete="current-password" placeholder="6 caractères minimum"></label>
        <div class="auth-row"><button class="btn lilac" type="submit">Se connecter</button></div>
      </form>
      <hr style="border:none;border-top:1.5px solid var(--line);margin:16px 0">
      <b>Première fois ?</b>
      <form id="fSignUp">
        <label class="field"><span>Email</span><input type="email" required autocomplete="email" placeholder="toi@exemple.com"></label>
        <label class="field"><span>Mot de passe</span><input type="password" required minlength="6" autocomplete="new-password" placeholder="6 caractères minimum"></label>
        <div class="auth-row"><button class="btn multi" type="submit">Créer mon compte</button></div>
      </form>
    <p class="form-msg" id="fMsg"></p>
      <p class="auth-note">💡 Mot de passe : 6 caractères minimum · ta progression hors ligne (file d'attente) partira au compte dès la reconnexion réseau.</p>
    </div>
    <p style="text-align:center;margin-top:18px"><a class="btn btn-ghost" href="app.html">← Revenir au tableau (mode local, sans compte)</a></p>`;
  wire();
  bindOAuth();
  Sync.refreshBadge();  // (bug corrigé : appel bare « refreshBadge() » → ReferenceError, la fonction vit dans Sync)
}

function renderConnected() {
  root.innerHTML = `
    <div class="auth-card">
      <h2 class="auth-title">Compte connecté ✓</h2>
      <p class="muted-line"><b>${Store.user.email}</b> — ta progression est synchronisée sur tous tes appareils.</p>
      <div class="auth-row">
        <button class="btn btn-ghost" id="signOut">Se déconnecter</button>
        <button class="btn mint" id="forceSync">Synchroniser maintenant</button>
      </div>
      <p class="muted-line" id="offlineStat" style="margin-top:12px"></p>
      <p class="auth-note">Sans réseau, tout est enregistré localement, puis renvoyé au compte automatiquement au retour de la connexion.</p>
    </div>
    <p style="text-align:center;margin-top:18px"><a class="btn" href="${nextURL()}">← Retour à la plateforme</a></p>`;
  $('#signOut').onclick = async () => { await Sync.signOut(); render(); };
  $('#forceSync').onclick = async () => {
    await Sync.pull(); await Sync.pushSoon(true); toast('Progression synchronisée ✓'); render();
  };
  const p = Object.keys(Store.pending).length;
  $('#offlineStat').innerHTML = p
    ? `⏳ ${p} jour${p > 1 ? 's' : ''} en file d'attente pour le compte (hors ligne récemment).`
    : '✓ Rien en attente : tout est déjà en ligne.';
}

function wire() {
  const msg = $('#fMsg'); const setMsg = (cls, t) => { msg.className = 'form-msg ' + cls; msg.textContent = t; };
  const fIn = $('#fSignIn'), fUp = $('#fSignUp');
  if (!fIn) return;
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
}

/* Landing/Start pages utilisent ces helpers aussi : pas dupliqués par chance */
main();
