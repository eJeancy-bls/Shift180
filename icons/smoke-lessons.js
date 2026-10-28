// smoke-lessons.js — QA ciblée des jours aux leçons actualisées
const { chromium } = require('playwright');
const DAYS = [2, 4, 12, 25, 30, 34, 41, 42, 45];
const BASE = 'http://localhost:8642';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 844 } });
  const page = await ctx.newPage();
  const errors = [];

  for (const d of DAYS) {
    const progress = {};
    for (let i = 1; i < d; i++) progress[i] = '2020-01-01';
    await page.goto(BASE + '/index.html');
    await page.evaluate(p => { localStorage.setItem('pbd.state.v2', JSON.stringify({ progress: p, pending: {} })); }, progress);

    const errs = [];
    page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });

    await page.goto(`${BASE}/day.html?d=${d}`, { waitUntil: 'networkidle' });

    const title = await page.textContent('#title').catch(() => '(pas de #title)');
    const theoryTxt = await page.evaluate(() => (document.querySelector('#theory') || {}).innerText || '');
    const hasKeepnote = await page.evaluate(() => !!document.querySelector('#theory .keepnote'));
    const termCount = await page.evaluate(() => document.querySelectorAll('#theory button.term').length);
    const figCount = await page.evaluate(() => document.querySelectorAll('#theory figure.fig').length);
    const editor = await page.evaluate(() => !!document.querySelector('#code'));
    const tpCount = await page.evaluate(() => ({
      x: document.querySelectorAll('#tpList li').length || document.querySelectorAll('.tp input').length
    }));
    let tp = tpCount.x;
    const pcP = await page.evaluate(() => !!document.querySelector('#pcNote, .pcblock, [data-pc]'));

    console.log(`J${String(d).padStart(3)} · ${title} | keepnote:${hasKeepnote} · termes:${termCount} · figs:${figCount} · éditeur:${editor} · TP:${tp} ${pcP ? '· PC ✓' : ''}`);
    imgsBroken = await page.evaluate(() => [...document.querySelectorAll('#theory img')].filter(i => !i.complete || i.naturalWidth === 0).length);
    if (imgsBroken) errs.push(`IMGS CASSÉES: ${imgsBroken}`);

    if (errs.length) errors.push(`J${d}: ` + errs.join(' | '));
    await page.screenshot({ path: `.impeccable/review/smoke-j${d}.png`, fullPage: true });
  }

  console.log(errors.length ? '\n❌ Erreurs:\n' + errors.join('\n') : '\n✅ Zéro erreur JS sur tous les jours testés.');
  await browser.close();
})();
