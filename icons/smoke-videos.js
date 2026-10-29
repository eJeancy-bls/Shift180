// QA pastilles vidéo : avec progression pré-remplie pour déverrouiller les jours
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const errs = [];
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });

  // pré-remplir la progression : jours 1..49 terminés (et hier = 49 pour que 50 soit "aujourd'hui")
  const progress = {};
  for (let i = 1; i <= 49; i++) progress[i] = '2020-01-0' + (1 + (i % 9));
  await page.goto('http://localhost:8642/day.html?d=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(p => localStorage.setItem('pbd.state.v2', JSON.stringify({ progress: p })), progress);

  const check = async d => {
    await page.goto('http://localhost:8642/day.html?d=' + d, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);
    return await page.evaluate(() => {
      const pan = document.querySelector('.vidpan');
      if (!pan) return null;
      return [...pan.querySelectorAll('a.yt-pill')].map(a => ({
        t: a.querySelector('.yt-t').textContent,
        ch: a.querySelector('.yt-ch').textContent,
        href: a.getAttribute('href')
      }));
    });
  };

  for (const d of [2, 12, 30, 50, 60]) {
    const r = await check(d);
    console.log('d=' + d, '·', r ? r.length + ' pastille(s)' : 'AUCUNE', r ? '→ ' + r.map(x => x.ch + ' : ' + x.t).join(' | ') : '');
    if (r) {
      const bad = r.filter(x => !/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/.test(x.href));
      if (bad.length) console.log('  !! href invalide:', bad);
    }
  }

  // jour sans vidéo (24)
  const none = await check(24);
  console.log('d=24 · vidpan:', none === null ? 'absent (attendu)' : 'PRÉSENT (!!)');

  // aperçu de la zone (capture texte)
  await page.goto('http://localhost:8642/day.html?d=12', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1500);
  const shot = await page.evaluate(() => {
    const pan = document.querySelector('.vidpan');
    const pill = pan.querySelector('.yt-pill');
    const cs = getComputedStyle(pill);
    return { border: cs.borderRadius, display: cs.display, font: cs.fontSize, title: (pan.querySelector('h2') || {}).textContent };
  });
  console.log('style pastille:', JSON.stringify(shot));
  console.log('erreurs JS:', errs.length ? errs : 'aucune');
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
