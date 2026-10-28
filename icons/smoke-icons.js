// smoke-icons.js — QA « zéro emoji à l'écran » : chaque page est scannée pour détecter
// tout pictogramme restant dans le texte rendu, + comptage des icônes SVG injectées.
const { chromium } = require('playwright');
const BASE = 'http://localhost:8642';
// ↔ et ↗ sont des flèches typographiques (assumées), pas des emojis colorés
const ALLOW = new Set(['↔', '↗']);

const PAGES = [
  { url: '/index.html', seed: false, minIcons: 1 },
  { url: '/start.html', seed: false, minIcons: 1 },
  { url: '/login.html', seed: false, minIcons: 1, extra: 'signup' },
  { url: '/app.html', seed: true, minIcons: 1 },
  { url: '/day.html?d=2', seed: true, minIcons: 3 },
  { url: '/credits.html', seed: false, minIcons: 5 },
  { url: '/dist/shift180-hors-ligne.html', seed: true, minIcons: 1, extra: 'day2' }
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 844 } });
  const page = await ctx.newPage();
  const problems = [];

  for (const p of PAGES) {
    const errs = [];
    const onErr = e => errs.push('PAGEERROR: ' + e.message);
    const onCon = m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); };
    page.on('pageerror', onErr); page.on('console', onCon);

    if (p.seed) {
      await page.goto(BASE + '/index.html');
      await page.evaluate(() => {
        const progress = {}; for (let i = 1; i < 2; i++) progress[i] = '2020-01-01';
        localStorage.setItem('pbd.state.v2', JSON.stringify({ progress, pending: {} }));
      });
    }
    await page.goto(BASE + p.url, { waitUntil: 'networkidle' });
    if (p.extra === 'day2') { // vue « jour » du fichier unique
      await page.evaluate(() => { try { openDay(2); } catch (e) { errs.push('openDay: ' + e.message); } });
      await page.waitForTimeout(400);
    }
    if (p.extra === 'signup') {
      await page.click('#tabUp').catch(() => errs.push('onglet inscription introuvable'));
      await page.waitForTimeout(250);
    }

    const res = await page.evaluate(allow => {
      const txt = document.body.innerText || '';
      const emojiRe = /\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]{2}/gu;
      const found = [...new Set(txt.match(emojiRe) || [])];
      return {
        found,
        icons: document.querySelectorAll('svg.ico').length,
        logos: document.querySelectorAll('.btn.has-logo svg, .btn svg.ico').length
      };
    }, [...ALLOW]);

    const leftover = res.found.filter(e => !ALLOW.has(e));
    const name = p.url.replace('/dist/', 'dist:').replace('.html', '').replace('/', '');
    if (errs.length) problems.push(`${name} → ${errs.join(' | ')}`);
    if (leftover.length) problems.push(`${name} → emojis restants à l'écran : ${leftover.join(' ')}`);
    if (res.icons < p.minIcons) problems.push(`${name} → seulement ${res.icons} svg.ico (< ${p.minIcons})`);
    console.log(`${name} · svg.ico:${res.icons} · logos:${res.logos} · emojis restants:${leftover.length ? leftover.join(' ') : '0'} ${errs.length ? '· ⚠ ' + errs.length + ' err' : '· OK'}`);

    await page.screenshot({ path: `.impeccable/review/icons-${name.replace(/[/:?=&]/g, '-')}.png`, fullPage: true });
    page.off('pageerror', onErr); page.off('console', onCon);
  }

  /* vue mobile : le jour 2 et la connexion */
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mp = await mob.newPage();
  const merrs = [];
  mp.on('pageerror', e => merrs.push('PAGEERROR: ' + e.message));
  mp.on('console', m => { if (m.type() === 'error') merrs.push('CONSOLE: ' + m.text()); });
  await mp.goto(BASE + '/index.html');
  await mp.evaluate(() => {
    const progress = {}; progress[1] = '2020-01-01';
    localStorage.setItem('pbd.state.v2', JSON.stringify({ progress, pending: {} }));
  });
  await mp.goto(BASE + '/day.html?d=2', { waitUntil: 'networkidle' });
  const mobScan = await mp.evaluate(() => [...new Set(((document.body.innerText || '').match(/\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]{2}/gu) || []))]);
  console.log('mobile day2 · emojis restants:', mobScan.length ? mobScan.join(' ') : '0', merrs.length ? '· ⚠ ' + merrs.join(' | ') : '· OK');
  if (merrs.length) problems.push('mobile → ' + merrs.join(' | '));
  if (mobScan.length) problems.push('mobile → emojis restants : ' + mobScan.join(' '));
  await mp.screenshot({ path: '.impeccable/review/icons-mobile-day2.png', fullPage: true });
  await mp.goto(BASE + '/login.html', { waitUntil: 'networkidle' });
  await mp.screenshot({ path: '.impeccable/review/icons-mobile-login.png', fullPage: true });

  console.log(problems.length ? '\n❌ Problèmes:\n' + problems.join('\n') : '\n✅ Zéro emoji à l\'écran, zéro erreur JS.');
  await browser.close();
})();
