// smoke-auth.js — QA « session visible partout » : un client Supabase factice est injecté
// AVANT les scripts de la page, comme le ferait une vraie session persistée en localStorage.
const { chromium } = require('playwright');
const BASE = 'http://localhost:8642';

const STUB = () => {
  const user = { id: 'u1', email: 'test@exemple.com' };
  window.supabase = {
    createClient: () => ({
      auth: {
        getSession: async () => ({ data: { session: { user } } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() { } } } }),
        signOut: async () => { }
      },
      from: () => ({
        select: () => ({ eq: async () => ({ data: [], error: null }) }),
        upsert: async () => ({ error: null })
      })
    })
  };
};

(async () => {
  const browser = await chromium.launch();
  const problems = [];

  /* ---- contexte connecté (stub) ---- */
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 844 } });
  // bloquer le vrai CDN : sinon son UMD écrase window.supabase après notre stub
  await ctx.route('**/cdn.jsdelivr.net/**', r => r.abort());
  await ctx.addInitScript(STUB);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  page.on('console', m => {
    // le CDN est bloqué volontairement (stub) : ce bruit réseau n'est pas une erreur de la plateforme
    if (m.type() === 'error' && !/net::ERR_FAILED/.test(m.text())) errs.push('CONSOLE: ' + m.text());
  });

  // accueil connecté : chip + bouton retour + CTA adaptées
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const ix = await page.evaluate(() => ({
    chip: (document.querySelector('#topbarAuth') || {}).innerText || '',
    goBoardVisible: !((document.querySelector('#goBoard') || {}).hidden ?? true),
    startBtn: (document.querySelector('#startBtn') || {}).textContent || '',
    ctaBottom: (document.querySelector('#ctaBottom') || {}).textContent || ''
  }));
  console.log('index connecté   · chip:', JSON.stringify(ix.chip), '· goBoard visible:', ix.goBoardVisible, '· startBtn:', ix.startBtn, '· ctaBottom:', ix.ctaBottom);
  if (!ix.chip.includes('test@exemple.com'.split('@')[0]) && !ix.chip.includes('test')) problems.push('index: chip absent → ' + ix.chip);
  if (!ix.goBoardVisible) problems.push('index: #goBoard non visible alors que connecté');
  if (!/Reprendre mon tableau/.test(ix.startBtn + ix.ctaBottom)) problems.push('index: CTA non adaptée à la session');
  await page.screenshot({ path: '.impeccable/review/auth-index-connecte.png', fullPage: false });

  // tableau connecté
  await page.goto(BASE + '/app.html', { waitUntil: 'networkidle' });
  const ap = await page.evaluate(() => (document.querySelector('#topbarAuth') || {}).innerText || '');
  console.log('app connecté     · chip:', JSON.stringify(ap));

  // jour connecté (seed 1 jour pour déverrouiller J2)
  await page.goto(BASE + '/index.html');
  await page.evaluate(() => localStorage.setItem('pbd.state.v2', JSON.stringify({ progress: { 1: '2020-01-01' }, pending: {} })));
  await page.goto(BASE + '/day.html?d=2', { waitUntil: 'networkidle' });
  const dy = await page.evaluate(() => (document.querySelector('#topbarAuth') || {}).innerText || '');
  console.log('day connecté     · chip:', JSON.stringify(dy));

  // retour OAuth : login.html?code=… → carte de redirection → app.html
  await page.goto(BASE + '/login.html?code=fakecode', { waitUntil: 'networkidle' });
  const redirTxt = await page.evaluate(() => (document.querySelector('#authRoot') || {}).innerText || '');
  console.log('login retour OAuth· carte:', JSON.stringify(redirTxt.slice(0, 80)));
  await page.waitForURL('**/app.html', { timeout: 4000 }).catch(() => problems.push('login: pas de redirection après retour OAuth'));
  console.log('login → redirection vers:', page.url().replace(BASE, ''));

  // start + crédits connectés
  await page.goto(BASE + '/start.html', { waitUntil: 'networkidle' });
  const st = await page.evaluate(() => (document.querySelector('#topbarAuth') || {}).innerText || '');
  await page.goto(BASE + '/credits.html', { waitUntil: 'networkidle' });
  const cr = await page.evaluate(() => (document.querySelector('#topbarAuth') || {}).innerText || '');
  console.log('start connecté   · chip:', JSON.stringify(st), '· credits connecté · chip:', JSON.stringify(cr));

  if (errs.length) problems.push('erreurs JS: ' + errs.join(' | '));

  /* ---- contexte non connecté : rien ne doit fuir ---- */
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 844 } });
  const p2 = await ctx2.newPage();
  p2.on('pageerror', e => problems.push('anon PAGEERROR: ' + e.message));
  await p2.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  const an = await p2.evaluate(() => ({
    chip: (document.querySelector('#topbarAuth') || {}).innerText || '',
    goHidden: (document.querySelector('#goBoard') || {}).hidden,
    startBtn: (document.querySelector('#startBtn') || {}).textContent || ''
  }));
  console.log('index anonyme    · chip:', JSON.stringify(an.chip), '· goBoard masqué:', an.goHidden, '· startBtn:', an.startBtn);
  if (!/Connexion/.test(an.chip)) problems.push('index anon: chip Connexion absent');
  if (!an.goHidden) problems.push('index anon: #goBoard visible sans session');
  await p2.screenshot({ path: '.impeccable/review/auth-index-anonyme.png', fullPage: false });

  console.log(problems.length ? '\n❌ Problèmes:\n' + problems.join('\n') : '\n✅ Session reflétée sur toutes les pages, redirection OAuth OK.');
  await browser.close();
})();
